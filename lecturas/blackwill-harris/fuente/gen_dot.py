"""Genera los tres esquemas DOT de Blackwill y Harris (2016), caps. 1 y 3.

Uso:  python3 gen_dot.py <carpeta_de_salida>

Cada nodo es una tarjeta de menú: un encabezado y renglones de colores.
El color de cada renglón dice qué es (caso, cita, pregunta, puente…).
"""
import sys
import textwrap
from html import escape
from pathlib import Path

OUT = Path(sys.argv[1])

# ── Paleta «café de chinos, CDMX, años 90» ──────────────────────────────
#  tipo        fondo      borde      título     texto
K = {
    "central":  ("#C8102E", "#6E0B16", "#FFE08A", "#FFFFFF"),
    "foco":     ("#F6C945", "#C8102E", "#6E0B16", "#2B1B12"),
    "punto":    ("#F6C945", "#8A5A00", "#5A1A0A", "#2B1B12"),
    "dotacion": ("#9FD8C0", "#1F6E54", "#0E3B2D", "#11251E"),
    "caso":     ("#EAD3B2", "#8B5E3C", "#4A2C1D", "#2B1B12"),
    "autor":    ("#BFE0EE", "#2C7DA0", "#123F55", "#13303D"),
    "fuera":    ("#DEDAD2", "#8C877D", "#4D4A44", "#3A3833"),
    "pregunta": ("#FFB347", "#C2410C", "#5A1A00", "#2E1300"),
    "puente":   ("#FF8CC6", "#C2006B", "#4A0030", "#3A0026"),
    "cita":     ("#FFFFFF", "#C8102E", "#C8102E", "#3B2418"),
    "nota":     ("#FFFDF6", "#6B675F", "#3A3833", "#3A3833"),
}

F_TIT = "Oswald Bold"
F_SUB = "Oswald Medium"
F_TXT = "Barlow Condensed Medium"
F_CITA = "Barlow Condensed Medium Italic"
F_PAG = "Courier Prime Bold"
F_PUENTE = "Permanent Marker"
CREMA = "#FFF8E7"


def wrap(texto, ancho):
    lineas = []
    for parrafo in texto.split("\n"):
        lineas += textwrap.wrap(parrafo, ancho) or [""]
    return "<BR/>".join(escape(l, quote=False) for l in lineas)


def pagina(p, color, tam=10.5):
    return f'<FONT FACE="{F_PAG}" POINT-SIZE="{tam}" COLOR="{color}">  {escape(p)}</FONT>' if p else ""


def celda(tipo, titulo, texto, pag, ancho, tam=12.5, tam_tit=12.5, port="", fuente_tit=F_SUB):
    fondo, borde, c_tit, c_txt = K[tipo]
    partes = []
    if titulo:
        partes.append(f'<FONT FACE="{fuente_tit}" POINT-SIZE="{tam_tit}" COLOR="{c_tit}">{wrap(titulo, ancho)}</FONT>'
                      + pagina(pag, c_tit))
    if texto:
        fuente = F_CITA if tipo == "cita" else F_TXT
        cuerpo = f'<FONT FACE="{fuente}" POINT-SIZE="{tam}" COLOR="{c_txt}">{wrap(texto, ancho)}</FONT>'
        if not titulo and pag:
            cuerpo += pagina(pag, c_tit)
        partes.append(cuerpo)
    p = f' PORT="{port}"' if port else ""
    if tipo == "foco":                       # el renglón del foco lleva marco rojo
        p += f' BORDER="3" COLOR="{borde}"'
    return f'<TR><TD{p} BGCOLOR="{fondo}" ALIGN="LEFT" BALIGN="LEFT">' + "<BR/>".join(partes) + "</TD></TR>"


def tarjeta(nid, tipo, titulo, pag="", texto="", filas=(), ancho=30, tam_tit=15, tam=12.5, grosor=3):
    """Tarjeta: encabezado del color del tipo + renglones (tipo, título, texto, pág., puerto)."""
    fondo, borde, c_tit, c_txt = K[tipo]
    cab = f'<FONT FACE="{F_PUENTE if tipo == "puente" else F_TIT}" POINT-SIZE="{tam_tit}" COLOR="{c_tit}">{wrap(titulo, max(ancho - 6, 14))}</FONT>'
    cab += pagina(pag, c_tit, 11)
    if texto:
        fuente = F_CITA if tipo == "cita" else F_TXT
        cab += f'<BR/><FONT FACE="{fuente}" POINT-SIZE="{tam}" COLOR="{c_txt}">{wrap(texto, ancho)}</FONT>'
    html = [f'<TR><TD BGCOLOR="{fondo}" ALIGN="LEFT" BALIGN="LEFT">{cab}</TD></TR>']
    for f in filas:
        t, ft, fx, fp = f[:4]
        port = f[4] if len(f) > 4 else ""
        html.append(celda(t, ft, fx, fp, ancho, tam=tam, port=port))
    fondo_tabla = CREMA if filas else fondo
    estilo = "rounded,dashed" if tipo in ("puente", "fuera") else "rounded"
    tabla = (f'<TABLE BORDER="{grosor}" COLOR="{borde}" BGCOLOR="{fondo_tabla}" CELLBORDER="0" '
             f'CELLPADDING="5" CELLSPACING="{3 if filas else 0}" STYLE="{estilo}">' + "".join(html) + "</TABLE>")
    return f"  {nid} [label=<{tabla}>];"


class Grafo:
    def __init__(self, nombre, titulo, encabezado, extra=""):
        self.nombre, self.titulo, self.encabezado, self.extra = nombre, titulo, encabezado, extra
        self.partes = []

    def c(self, texto):
        self.partes.append(f"\n  // ── {texto} " + "─" * max(4, 62 - len(texto)))

    def t(self, *a, **kw):
        self.partes.append(tarjeta(*a, **kw))

    def e(self, a, b, etiqueta="", estilo="", extra=""):
        attrs = []
        if etiqueta:
            attrs.append(f'label=<<FONT FACE="{F_SUB}" POINT-SIZE="12" COLOR="#6E0B16">{escape(etiqueta)}</FONT>>')
        attrs += {
            "puente": ['color="#C2006B"', 'style="dashed"', 'penwidth="2"', 'arrowhead="odot"'],
            "fuera": ['color="#8C877D"', 'style="dotted"', 'penwidth="2"'],
            "tension": ['color="#C2410C"', 'penwidth="2.6"'],
            "invis": ['style="invis"'],
            "fuerte": ['color="#C8102E"', 'penwidth="4"'],
        }.get(estilo, [])
        if extra:
            attrs.append(extra)
        self.partes.append(f"  {a} -> {b}" + (f" [{', '.join(attrs)}]" if attrs else "") + ";")

    def raw(self, linea):
        self.partes.append("  " + linea)

    def fila(self, ids):
        """Mismo rango y en este orden, de izquierda a derecha."""
        self.raw("{ rank=same; " + "; ".join(ids) + "; }")
        for a, b in zip(ids, ids[1:]):
            self.raw(f"{a} -> {b} [style=invis];")

    def texto(self):
        cab = "\n".join("   " + l for l in self.encabezado.strip().splitlines())
        return f"""/* ═══════════════════════════════════════════════════════════════════
{cab}

   Código de color (el mismo en los tres esquemas):
     rojo farol ........ idea central
     amarillo yema ..... los platillos: puntos (cap. 1) e instrumentos (cap. 3)
     verde formica ..... dotaciones geoeconómicas (lo estructural)
     café con leche .... casos y ejemplos, con año y página
     azul azulejo ...... autores con los que discuten
     blanco con rojo ... citas textuales (traducción propia)
     gris .............. lo que queda fuera de la geoeconomía
     naranja ........... preguntas abiertas y tensiones
     rosa cartulina .... PUENTES: conexiones mías con otros temas (no son del libro)

   Se dibuja con:  dot -Tsvg {self.nombre}.dot -o {self.nombre}.svg
   Fuentes: Oswald, Barlow Condensed, Courier Prime, Permanent Marker
   (si no están instaladas, Graphviz usa otras y las cajas se descuadran)
   ═══════════════════════════════════════════════════════════════════ */

digraph {self.nombre} {{
  graph [ bgcolor="#FBF1DC", pad="0.3", nodesep="0.2", ranksep="0.28",
          fontname="{F_TIT}", labelloc="t", label=<{self.titulo}>,
          newrank="true", compound="true"{self.extra} ];
  node  [ shape="plain" ];
  edge  [ color="#4A2C1D", penwidth="1.8", arrowsize="0.8" ];
""" + "\n".join(self.partes) + "\n}\n"


def titulo(t, sub):
    return (f'<FONT FACE="{F_TIT}" POINT-SIZE="28" COLOR="#C8102E">{escape(t)}</FONT><BR/>'
            f'<FONT FACE="{F_TXT}" POINT-SIZE="15" COLOR="#4A2C1D">{escape(sub)}</FONT><BR/> ')


REF = """Blackwill, R. D., y Harris, J. M. (2016). War by other means:
Geoeconomics and statecraft. Belknap Press of Harvard University Press."""

# ═════════════════════════════════════════════════════════════════════
#  CAPÍTULO 1 · ¿QUÉ ES LA GEOECONOMÍA?  (pp. 19–32)
# ═════════════════════════════════════════════════════════════════════
g = Grafo("cap1_que_es_la_geoeconomia",
          titulo("Cap. 1 · ¿Qué es la geoeconomía?",
                 "Blackwill y Harris (2016), War by Other Means, pp. 19–32 · una definición en tres partes y cinco precisiones"),
          f"""CAPÍTULO 1 · ¿QUÉ ES LA GEOECONOMÍA? (pp. 19–32)
{REF}

Arriba: el problema, la definición y sus tres partes.
En medio: los cinco puntos con los que los autores la acotan.
Abajo, en rosa: puentes con otros temas del curso y de mis lecturas.""")

ANCHO_P = 37

g.c("Arriba: problema, definición en tres partes, epígrafe y autores")
g.t("prob", "fuera", "El problema", "pp. 19–20",
    "«Geoeconomía» se usa mucho y casi nunca se define. Usos previos: (a) poder militar para fines económicos; (b) cajón de sastre, «el enredo de economía internacional, geopolítica y estrategia»; (c) comercio y protección de industrias. En EE. UU.: «comercio por el comercio» (Angell: el comercio trae la paz).",
    ancho=32, tam_tit=14)
g.t("def", "central", "GEOECONOMÍA", "p. 20",
    "El uso de instrumentos económicos para promover y defender los intereses nacionales y para producir resultados geopolíticos benéficos; y los efectos de las acciones económicas de otras naciones sobre las metas geopolíticas de un país. Es método de análisis y forma de statecraft (arte de gobernar).",
    filas=[
        ("punto", "① Promover y defender intereses", "Economía interna fuerte → proyección de poder: «importante y bien entendido». Ley casi universal: ningún país, por grande que sea, aguanta mucho tiempo con cargas geopolíticas mayores que su base económica.", "p. 20"),
        ("foco", "② Producir resultados geopolíticos  ★ FOCO DEL LIBRO", "Las técnicas económicas del arte de gobernar: lo que más se practica y menos se piensa, sobre todo en EE. UU. Se precisa con cinco puntos ↓", "p. 21", "dos"),
        ("punto", "③ Efectos de lo que hacen otros", "Terreno de la economía política internacional, mirado desde el sistema. Ej.: bastó anunciar menos compras de bonos de la Fed (taper talk) para encarecer la deuda de Kiev y precipitar la caída de Yanukóvich (Steil). El tema volvió con la crisis de 2008–09 y el ascenso de China.", "pp. 20–21"),
    ], ancho=62, tam_tit=24, tam=13.5, grosor=4)
g.t("epi", "cita", "Epígrafe", "p. 19",
    "«La guerra y el comercio no son sino dos medios distintos de llegar al mismo fin: poseer lo que se desea.» — Benjamin Constant",
    ancho=28, tam_tit=14, tam=13.5)
g.t("autores", "autor", "Autores en la mesa", "", filas=[
    ("autor", "Susan Strange, 1970", "Pedía estudiar lo económico internacional con la política por encima de la economía.", "pp. 21–22"),
    ("autor", "David Baldwin, 1985", "Economic Statecraft: «pensar sobre pensar» las técnicas económicas de gobierno.", "pp. 22–23"),
    ("autor", "Alan Dobson, 2002", "El statecraft económico de EE. UU., 1933–1991.", "p. 22"),
    ("autor", "Robert Zoellick · un «arte perdido»", "150 años de política exterior con lógica económica; hoy economía y seguridad van por separado. ¿Por qué? → cap. 6", "p. 25", "perdido"),
    ("puente", "Puente · sesión 15", "Strange llevada a Apple en China: el poder estructural.", ""),
], ancho=32, tam_tit=14)
g.fila(["prob", "def", "epi", "autores"])

g.c("Los cinco puntos (un solo bloque)")
g.t("p1", "punto", "PUNTO 1 · Geoeconomía ≠ geopolítica", "pp. 23–25", filas=[
    ("caso", "Clasifican los MEDIOS, no los fines", "Usar la fuerza militar para ganar algo económico es geopolítica, no geoeconomía.", "pp. 23–24"),
    ("cita", "Baldwin", "«Bombardear una biblioteca no se llama guerra cultural […] y bombardear fábricas no debería llamarse guerra económica.»", "p. 23"),
    ("caso", "Dos relatos paralelos", "Geopolítica: el poder sobre el territorio explicado por factores geográficos. Geoeconomía: el mismo poder explicado por factores económicos.", "p. 24"),
    ("central", "Lógica de la geopolítica + herramientas de la economía", "Geopolítica = suma cero; economía = suma positiva (Mandelbaum). Con fines geopolíticos, la economía da resultados tan de suma cero como la guerra.", "pp. 24–25", "logica"),
    ("pregunta", "¿?", "¿El auge de la geoeconomía cambia cuándo y cómo se usa la fuerza militar? (vuelve en el cap. 3, p. 52)", "p. 24"),
], ancho=ANCHO_P)
g.t("p2", "punto", "PUNTO 2 · Los medios no dicen nada de los fines", "pp. 26–27", filas=[
    ("fuera", "✘ Otro uso: los fines se vuelven económicos", "Luttwak (1990): «la lógica del conflicto con los métodos del comercio». Airbus contra Boeing: conquista industrial en vez de territorial. Queda fuera del libro.", "p. 26"),
    ("caso", "Fines mezclados", "Basta la presencia —no exclusiva— de un interés geopolítico importante. Ej.: las inversiones chinas en África.", "p. 27"),
    ("caso", "El diseño delata la intención", "Un tratado comercial pensado para la política exterior se ve distinto de uno puramente económico (→ cap. 7).", "p. 27", "diseno"),
    ("autor", "Luttwak sobre China", "La resistencia a su ascenso será geoeconómica: barreras, vetos a inversión y tecnología, materias primas.", "p. 22"),
], ancho=ANCHO_P)
g.t("p3", "punto", "PUNTO 3 · Muchas formas, capacidades desiguales", "pp. 27–28", filas=[
    ("caso", "Cuatro ejes", "positiva ↔ coercitiva · corto ↔ largo plazo · transaccional ↔ general · paz ↔ guerra", "p. 27"),
    ("caso", "Golpes dirigidos", "Embargo de granos de Carter a la URSS por Afganistán (1979–80); préstamos de Truman a los aliados.", "pp. 27–28"),
    ("caso", "Jugadas largas · En medio", "La moneda única que impulsó la RFA y la propia UE. Qatar mete 8 mil mdd en Egipto entre la caída de Mubarak y la de Morsi (2011–13).", "p. 28"),
    ("dotacion", "DOTACIONES GEOECONÓMICAS", "Rasgos estructurales que hacen a un país más o menos eficaz con estas herramientas → cap. 3", "p. 28"),
    ("pregunta", "¿?", "¿Las no democracias están mejor dotadas? ¿Los países pequeños pierden igual que en geopolítica?", "p. 28", "preg"),
], ancho=ANCHO_P)
g.t("p4", "punto", "PUNTO 4 · Hay casos borrosos", "pp. 28–30", filas=[
    ("caso", "✔ ADENTRO", "• Bloqueo económico con apoyo naval: caso híbrido; la variable es la negación económica.\n• Ciberataque a bancos o a infraestructura económica.\n• Falsificar la moneda del enemigo en guerra.\n• Ayuda militar y humanitaria: el dinero es fungible.", "pp. 29–30", "adentro"),
    ("fuera", "✘ AFUERA", "• Bombardear una fábrica: toca a las normas de la guerra, no a la economía.\n• Ciberataques contra blancos militares o de gobierno.", "pp. 28–29"),
    ("nota", "Moraleja", "Que haya casos dudosos habla de circunstancias enredadas, no de una mala definición.", "p. 30"),
], ancho=ANCHO_P)
g.t("p5", "punto", "PUNTO 5 · Ni política económica exterior, ni mercantilismo, ni liberalismo", "pp. 30–32", filas=[
    ("fuera", "Política económica exterior", "Quiere influir en el entorno económico, no en el geopolítico (Cohen y Pastor); S. Cohen la quiere lejos de la política exterior.", "p. 30"),
    ("cita", "Adam Smith", "«La defensa es más importante que la opulencia». La riqueza del vecino es ventajosa en el comercio y «peligrosa en la guerra y la política».", "p. 31"),
    ("cita", "Cobden, según Hinsley", "«Trabajó por el libre comercio porque quería la paz, no por la paz porque quería el libre comercio».", "p. 32"),
    ("central", "Dos sabores de geoeconomía", "Mercantilismo y liberalismo difieren en el CÓMO, no en el SI: los dos ponen la economía al servicio del Estado (Baldwin, Gilpin, Earle).", "pp. 31–32", "sabores"),
], ancho=ANCHO_P)
g.raw("subgraph cluster_puntos {")
g.raw(f'  style="rounded,filled"; fillcolor="#FFF1C2"; color="#C99A1E"; penwidth="2"; margin="12";')
g.raw(f'  label=<<FONT FACE="{F_TIT}" POINT-SIZE="17" COLOR="#6E0B16">Cinco puntos para acotar la definición</FONT>>; labeljust="l";')
g.raw("  p1; p2; p3; p4; p5;")
g.raw("}")
g.fila(["p1", "p2", "p3", "p4", "p5"])
g.e("def:dos", "p3", "precisa", estilo="fuerte", extra='lhead="cluster_puntos"')
g.e("prob", "p1", estilo="invis"); g.e("autores", "p5", estilo="invis")

g.c("PUENTES (rosa): conexiones con otros temas, no son del libro")
puentes = [
    ("b_luh", "Luhmann · sistemas", "Dos códigos: pagar/no pagar (economía) y tener/no tener poder (política). La geoeconomía como acoplamiento: la política observa a la economía como arma.", "p1:logica"),
    ("b_s17", "Sesión 17 · Nord Stream", "Suma cero contra suma positiva en un solo tubo: teoría de juegos.", "p1:logica"),
    ("b_mx", "México · T-MEC", "Si el diseño delata la intención: ¿qué cláusulas del T-MEC son geopolíticas?", "p2:diseno"),
    ("b_s10", "Sesión 10 · Farrell y Newman", "La interdependencia convertida en arma da el cómo de la parte ②: redes, nodos, cuellos de botella.", "p3:preg"),
    ("b_s07", "Sesión 07 · La guerra total", "El bloqueo de 1914–18 y la guerra económica: el caso híbrido del punto 4.", "p4:adentro"),
    ("b_s04", "Sesiones 04–05 · La era del imperio", "El librecambio británico como geoeconomía liberal: la City, Cobden.", "p5:sabores"),
    ("b_s02", "Sesión 02 · Geopolítica crítica", "Leer el libro como geopolítica práctica: un think tank (CFR) que escribe guiones para Washington.", "autores:perdido"),
]
for pid, pt, px, _ in puentes:
    g.t(pid, "puente", pt, "", px, ancho=27, tam_tit=13, tam=12.5, grosor=2)
g.fila([p[0] for p in puentes])
for pid, _, _, origen in puentes:
    g.e(origen, pid, estilo="puente")
CAP1 = g


# ═════════════════════════════════════════════════════════════════════
#  CAPÍTULO 3 (A) · LA CARTA: SIETE INSTRUMENTOS  (pp. 49–87)
# ═════════════════════════════════════════════════════════════════════
g = Grafo("cap3a_siete_instrumentos",
          titulo("Cap. 3 · La carta: siete instrumentos geoeconómicos",
                 "Blackwill y Harris (2016), War by Other Means, pp. 49–87 · cada instrumento con sus casos"),
          f"""CAPÍTULO 3 (primera parte) · LOS SIETE INSTRUMENTOS (pp. 49–87)
{REF}

Cada tarjeta amarilla es un instrumento, con sus casos.
Las dotaciones que deciden si funcionan están en el esquema 3B.""")

g.c("Arriba: epígrafe y centro")
g.t("epi", "cita", "Epígrafe", "p. 49",
    "«La política monetaria es política exterior […] no solo es política interna, sino definitivamente también política exterior.» — Helmut Schmidt",
    ancho=38, tam_tit=14, tam=13.5)
g.t("centro", "central", "SIETE INSTRUMENTOS", "p. 49",
    "No es la primera era geoeconómica (ahí está el Plan Marshall), pero el paisaje cambió: el ciber no existía, la energía es casi nueva, la ayuda tiene jugadores nuevos. De cada herramienta se mide solo lo geopolítico.",
    ancho=56, tam_tit=24, tam=14, grosor=4)
g.t("nota", "nota", "Cómo leer esta carta", "",
    "Amarillo: el instrumento. Café con leche: casos. Blanco: citas. Gris: lo que no cuenta. Naranja: preguntas. Rosa: puentes míos.",
    ancho=34, tam_tit=14, tam=13)
g.fila(["epi", "centro", "nota"])

ins = [
    ("i1", "① Política comercial", "pp. 50–53", "Tradición: el incentivo (las QIZ en Jordania y Egipto, ligadas a Camp David). Hoy, también la coerción.", [
        ("caso", "Los vetos de Rusia", "Vino georgiano y moldavo; chocolates ucranianos y aduanas lentas (2012: ~500 mdd de pérdidas); lácteos de la UE (2014); flores y queso neerlandeses tras el MH17 (2015).", "pp. 50–52"),
        ("caso", "Vilna, nov. 2013", "Ucrania no firma con la UE. No fue geopolítica contra economía: fueron dos geoeconomías, el imán de la UE y el tirón coercitivo de Moscú.", "p. 52"),
        ("cita", "Kirguistán, dic. 2013", "«Ucrania tiene opción; nosotros, por desgracia, no tenemos mucha alternativa.»", "p. 51"),
    ]),
    ("i2", "② Política de inversión", "pp. 53–58", "En 2014, el 90 % de los flujos entre países ya era financiero. Y el Estado es dueño: reservas, empresas estatales, fondos soberanos, bancos.", [
        ("caso", "Comprar reconocimiento", "Costa Rica rompe con Taiwán tras una compra china de 300 mdd en bonos; en África, los que reconocen a Taipéi bajan de 13 a 4.", "p. 56"),
        ("caso", "Rusia y Kiev, dic. 2013", "Un sexto de su fondo soberano, «apolítico», va al rescate de Ucrania.", "p. 55"),
        ("cita", "Gelpern, sobre los fondos soberanos", "«La ganancia los moverá… hasta que no.»", "p. 56"),
        ("caso", "La puerta de entrada", "Filtrar la inversión que llega también es arma; CFIUS: 193 investigaciones (2009–13).", "p. 57", "pb"),
    ]),
    ("i3", "③ Sanciones", "pp. 58–59", "Pesan el tamaño del mercado y la cuota global… y los nodos de nicho con importancia sistémica.", [
        ("caso", "SWIFT y Lloyd's contra Irán", "SWIFT está en Bélgica; Lloyd's deja de asegurar la gasolina iraní (2010–11).", "p. 58"),
        ("caso", "El mayor cuello de botella: el dólar", "«O haces negocios en dólares o con el país sancionado.»", "pp. 58–59", "pb"),
        ("nota", "Lecciones", "Entre adversarios se usan más y rinden menos; funcionan con metas modestas y blancos claros; necesitan aliados (el embargo de granos de 1980 se quedó sin Canadá ni Australia).", "p. 59"),
    ]),
    ("i4", "④ Ciber", "pp. 59–68", "Es geoeconómico si (1) lo patrocina un Estado y (2) busca un efecto económico.", [
        ("caso", "✔ Sí lo son", "Estonia 2007 (bancos); Rio Tinto–Chinalco y Coca-Cola–Huiyuan (2009); Night Dragon; Saudi Aramco 2012 (30 mil computadoras); bancos de EE. UU. (2012) y JPMorgan (2014), justo después de sanciones.", "pp. 61–67", "pb"),
        ("fuera", "✘ No lo son", "Georgia 2008, Stuxnet, el robo de planos del F-35: buscan mover un equilibrio militar.", "p. 60"),
        ("caso", "Asimetría", "Un Estado contra una empresa privada desconcierta la respuesta. Separar el espionaje de seguridad del comercial es «muy estadounidense» (Sanger).", "pp. 65–68"),
    ]),
    ("i5", "⑤ Ayuda económica", "pp. 68–74", "Militar, humanitaria y para el desarrollo; el dinero es fungible. La más interesante: la del desarrollo, con donantes nuevos.", [
        ("caso", "Ayuda militar con doble mensaje", "Arabia Saudita da 3 mil mdd a Líbano para armas francesas: un aviso a Washington. Rusia arma a Azerbaiyán y Armenia entra a la Unión Aduanera.", "pp. 69–70"),
        ("caso", "El Golfo apuesta en Egipto", "Qatar con Morsi; Arabia, EAU y Kuwait tras su caída (más de 20 mil mdd). La ayuda ya es el 10 % del PIB egipcio.", "pp. 71–72"),
        ("caso", "Bancos estatales de desarrollo", "China Development Bank (980 mil mdd; 40 mil mdd a Venezuela), BNDES, Banco BRICS (100 mil mdd), AIIB.", "pp. 73–74", "pb"),
    ]),
    ("i6", "⑥ Finanzas y moneda", "pp. 74–85", "«El poder nacional es fundamentalmente financiero» (Suri). Tres canales: la huella de la moneda, endeudarse barato y mover el costo de la deuda ajena.", [
        ("caso", "Huella de la moneda", "El euro como «manto» geopolítico (Schmidt, 1978; Letonia, 2014). Los privilegios del dólar. Bélgica-Euroclear: 341 mil mdd en bonos de EE. UU. que eran de China.", "pp. 76–80"),
        ("caso", "La deuda ajena", "«Las monedas débiles hacen Estados tímidos» (Kirshner). Suez 1956; garantías a Israel (1991); el préstamo ruso a Ucrania (2013).", "pp. 80–81"),
        ("caso", "México, 1994", "Clinton usa el Fondo de Estabilización Cambiaria: 20 mil mdd sin pasar por el Congreso.", "p. 82", "pb"),
        ("pregunta", "¿?", "¿Por qué sería racional gastar 100 mil mdd en armas e irracional gastarlos en encarecer la deuda de Ucrania?", "p. 84"),
    ]),
    ("i7", "⑦ Energía y materias primas", "pp. 85–87", "Coerción abierta, seguro o efecto colateral.", [
        ("caso", "Rusia", "Cortó o amenazó con cortar el gas más de 50 veces. Gazprom Armenia; Gazprom Kirguistán, comprada en 1 dólar. Carta de Putin a 18 jefes de Estado (2014).", "pp. 85–86", "pb"),
        ("caso", "China", "Veto a las tierras raras (2010); sus plataformas petroleras son «territorio nacional móvil» (2012). El apetito también es palanca.", "p. 86"),
        ("caso", "Sin coerción", "Qatar surte el 85 % del gas del Reino Unido: un seguro. Arabia «presta» un campo petrolero a Baréin.", "p. 87"),
    ]),
]
for iid, tit, pag, txt, casos in ins:
    g.c(tit)
    g.t(iid, "punto", tit, pag, txt, filas=casos, ancho=28, tam_tit=16)
g.fila([i[0] for i in ins])
for iid, *_ in ins:
    g.e("centro", iid, extra='color="#C8102E"')

g.c("PUENTES (rosa): conexiones con otros temas, no son del libro")
puentes = [
    ("b_s15", "Sesión 15 · Apple en China", "Entrar al mercado chino tiene precio político: Rio Tinto, Coca-Cola, Apple.", "i2:pb"),
    ("b_s10", "Sesión 10 · Farrell y Newman", "SWIFT, el dólar y Lloyd's: cuellos de botella (chokepoints) de manual.", "i3:pb"),
    ("b_s13", "Sesión 13 · Los chips", "El ciber y el Proyecto 863: la otra cara de los controles a la tecnología.", "i4:pb"),
    ("b_s18", "Sesión 18 · La Franja y la Ruta", "Bancos estatales y AIIB: la ayuda hecha infraestructura (p. 84).", "i5:pb"),
    ("b_mx", "México · el «tequilazo»", "El rescate de 1994 como geoeconomía: un México estable sirve a la proyección de EE. UU.", "i6:pb"),
    ("b_s17", "Sesión 17 · Nord Stream", "El gas como arma: basta la amenaza implícita para templar a la UE (p. 87).", "i7:pb"),
]
for pid, pt, px, _ in puentes:
    g.t(pid, "puente", pt, "", px, ancho=27, tam_tit=13, tam=12.5, grosor=2)
g.fila([p[0] for p in puentes])
for pid, _, _, origen in puentes:
    g.e(origen, pid, estilo="puente")
CAP3A = g


# ═════════════════════════════════════════════════════════════════════
#  CAPÍTULO 3 (B) · LA COCINA: CUATRO DOTACIONES Y TENSIONES (pp. 87–92)
# ═════════════════════════════════════════════════════════════════════
g = Grafo("cap3b_dotaciones_y_tensiones",
          titulo("Cap. 3 · La cocina: cuatro dotaciones y sus tensiones",
                 "Blackwill y Harris (2016), War by Other Means, pp. 87–92 · lo estructural que decide si los instrumentos funcionan"),
          f"""CAPÍTULO 3 (segunda parte) · DOTACIONES GEOECONÓMICAS (pp. 87–92)
{REF}

Arriba: las cuatro dotaciones (verde) y los instrumentos que alimentan.
Abajo: las tensiones entre instrumentos (naranja) y la regla para evaluarlos.""")

g.c("Centro")
g.t("centro", "central", "DOTACIONES GEOECONÓMICAS", "p. 87",
    "Así como no todos los Estados proyectan igual la fuerza militar, hay rasgos estructurales que deciden qué tan eficaz es un país con los instrumentos económicos.",
    ancho=50, tam_tit=24, tam=14, grosor=4)
g.t("upd", "nota", "Ojo: después de 2016 (no está en el libro)", "",
    "El libro dice que nadie ha invocado la excepción de seguridad nacional de la OMC (p. 89). Después se volvió argumento corriente: aranceles 232 de EE. UU. (2018), el panel Rusia–Tránsito (2019). Y en 2022, bancos rusos fuera de SWIFT y reservas congeladas.",
    ancho=40, tam_tit=13.5, tam=13)
g.t("reg", "pregunta", "¿Y el régimen político?", "pp. 61, 88",
    "Con menos frenos legales y de opinión pública, Rusia, Irán, Corea del Norte y China sacan más del ciber y de sus empresas estatales (el «teléfono rojo» del Partido; en Rusia, «blanco»).",
    ancho=34, tam_tit=14, tam=13)
g.fila(["reg", "centro", "upd"])

ALIM = "dotacion"
g.c("Las cuatro dotaciones")
g.t("d1", "dotacion", "① Controlar la inversión saliente", "pp. 87–89", filas=[
    ("dotacion", "", "Los canales directos —fondos soberanos, bancos estatales, empresas estatales— se pueden reorientar. Los indirectos —TLC, tratados de inversión— no se «apagan».", ""),
    ("caso", "El Golfo en Egipto", "El dinero saudí y emiratí se corta con Mubarak y vuelve, por decenas de miles de millones, días después de la caída de Morsi.", "p. 88", "caso"),
    ("punto", "Alimenta", "inversión · ayuda", ""),
], ancho=31, tam_tit=16)
g.t("d2", "dotacion", "② Rasgos del mercado interno", "pp. 89–90", filas=[
    ("dotacion", "", "Tamaño, control del acceso, capacidad de redirigir importaciones, ser «demasiado grande para ignorarlo», expectativa de crecimiento.", ""),
    ("cita", "Yang Jiechi", "«China es un país grande y los otros son países pequeños.» Pero el tamaño pesa menos que en geopolítica: Singapur (Temasek, GIC) y Qatar.", "p. 89", "caso"),
    ("punto", "Alimenta", "comercio · inversión · sanciones (p. 90)", ""),
], ancho=31, tam_tit=16)
g.t("d3", "dotacion", "③ Influencia sobre energía y materias primas", "p. 90", filas=[
    ("dotacion", "", "Monopolio (la OPEP), monopsonio (EE. UU., China) y centralidad de tránsito (Suez, Panamá, Malaca, Ormuz).", ""),
    ("caso", "Gas Rusia–China, 2014", "Contrato a 30 años: tras una década de negociación, ganó el comprador.", "p. 90", "caso"),
    ("punto", "Alimenta", "energía y materias primas", ""),
], ancho=31, tam_tit=16)
g.t("d4", "dotacion", "④ Centralidad en el sistema financiero", "pp. 90–91", filas=[
    ("dotacion", "", "Moneda de reserva y sanciones financieras: casi todo pasa por el sistema de EE. UU. «Pero esto está cambiando».", ""),
    ("caso", "Corea del Norte", "El aislamiento como escudo: ante las nuevas sanciones, el Tesoro no tenía poder de menos sino «escasez de blancos».", "p. 91", "caso"),
    ("punto", "Alimenta", "sanciones · finanzas y moneda", "", "alim"),
], ancho=31, tam_tit=16)
g.fila(["d1", "d2", "d3", "d4"])
for d in ["d1", "d2", "d3", "d4"]:
    g.e("centro", d, extra='color="#1F6E54"')

g.c("Tensiones entre instrumentos y la regla para evaluar")
g.t("t1", "pregunta", "Tensión 1 · El arma se gasta", "pp. 59, 78",
    "Cada sanción en dólares empuja a buscar alternativas al dólar: Gazprom ya cobra en rublos y yuanes.", ancho=28, tam_tit=14, tam=13)
g.t("t2", "pregunta", "Tensión 2 · Un renminbi internacional", "pp. 78–79",
    "Dificulta las sanciones pero ayuda a otros intereses de EE. UU. Y no hay precedente moderno de una moneda de reserva global que administre un país no democrático.", ancho=28, tam_tit=14, tam=13)
g.t("t3", "pregunta", "Tensión 3 · La deuda en pocas manos", "pp. 83–85",
    "Una venta masiva sería como la destrucción mutua asegurada, pero un acreedor grande puede mover el mercado aun sin querer.", ancho=28, tam_tit=14, tam=13)
g.t("regla", "central", "LA REGLA PARA EVALUAR", "pp. 91–92",
    "No basta el costo-beneficio: hay que medir contra la siguiente mejor alternativa y distinguir metas y blancos primarios, secundarios y terciarios (Baldwin).",
    ancho=34, tam_tit=16, tam=13.5)
g.fila(["t1", "t2", "t3", "regla"])
for t in ["t1", "t2", "t3"]:
    g.e("d4:alim", t, estilo="tension")
g.e("d1", "t1", estilo="invis")

g.c("PUENTES (rosa): conexiones con otros temas, no son del libro")
puentes = [
    ("b_s18", "Sesión 18 · La Franja y la Ruta", "Reservas recicladas a la Nueva Ruta de la Seda y al AIIB (p. 84).", "d1:caso"),
    ("b_hir", "Hirschman, 1945", "Dependencia asimétrica: el poder nace de la estructura del comercio exterior.", "d2:caso"),
    ("b_s15", "Sesión 15 · Strange y McGee", "Consumer Day 2013: el mercado chino como palanca contra Apple.", "d2:caso"),
    ("b_s17", "Sesión 17 · Nord Stream", "Monopolio, monopsonio y tránsito en un solo tubo.", "d3:caso"),
    ("b_s10", "Sesión 10 · Farrell y Newman", "Nodos centrales = cuello de botella y panóptico. Proliferación: usar el arma enseña a esquivarla.", "t1"),
    ("b_s13", "Sesión 13 · Los chips", "¿Una quinta dotación? La centralidad tecnológica (TSMC, ASML) que el libro de 2016 no lista.", "regla"),
    ("b_mx", "México · ¿qué dotaciones tiene?", "Vecino del mercado más grande y socio integrado: ¿más blanco que arma? (sesión 10: palancas sobre México).", "regla"),
]
for pid, pt, px, _ in puentes:
    g.t(pid, "puente", pt, "", px, ancho=24, tam_tit=13, tam=12.5, grosor=2)
g.fila([p[0] for p in puentes])
for pid, _, _, origen in puentes:
    g.e(origen, pid, estilo="puente")
CAP3B = g


for gr in (CAP1, CAP3A, CAP3B):
    (OUT / f"{gr.nombre}.dot").write_text(gr.texto(), encoding="utf-8")
    print("escrito", OUT / f"{gr.nombre}.dot")
