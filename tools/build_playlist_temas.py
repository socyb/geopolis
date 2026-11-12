#!/usr/bin/env python3
"""Genera los datos de recursos/playlist_temas.html a partir de recursos/playlist_geopolitica.json.

Cada video se clasifica por palabras clave de su título y canal:
la primera sección que coincide (en el orden de SECTIONS) es su sección
principal; todas las que coinciden se guardan como etiquetas para la búsqueda.

Uso:  python3 tools/build_playlist_temas.py
Reescribe el bloque entre los marcadores DATA-START / DATA-END del HTML.
"""
import html as htmllib
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "recursos" / "playlist_geopolitica.json"
PAGE = ROOT / "recursos" / "playlist_temas.html"


def fold(s):
    s = unicodedata.normalize("NFD", s.lower())
    return "".join(c for c in s if unicodedata.category(c) != "Mn")


# (id, nombre, descripción, palabras clave), en el orden en que se muestran.
SECTIONS = [
    ("ideas", "Mapas, ideas y poder blando",
     "Cartografía, teoría geopolítica, poder blando, propaganda y las ideas para leer el tablero.",
     ["cartograf", "maps", "mapas", "mapping the world", "dodds", "geopolitics: a very", "thucydides",
      "game theory", "dugin", "soft power", "bremmer", "g-zero", "megatrend", "orientalism", "edward said",
      "propaganda", "desinformacion", "redes sociales", "stereotype", "critical election",
      "multipolar", "what will happen in 2025", "amigos de nuestros enemigos", "swift",
      "listening post", "billionaires"]),
    ("historia", "Imperios, colonialismo e historia",
     "Imperios europeos, colonización, genocidios y los legados que explican el presente.",
     ["coloniz", "colonial", "empire", "imperio", "genocide", "holocaust", "holocausto", "east india",
      "conferencia de berlin", "reparto de africa", "maquina de vapor", "human zoos", "zoos humains",
      "british", "haiti", "global power", "primera potencia", "oppenheimer", "11-s", "union sovietica",
      "split into two", "unmaking of india", "profitable companies in history", "hobsbawm",
      "historia de los colores"]),
    ("comercio", "Comercio, aranceles y globalización",
     "Guerras comerciales, aranceles de Trump, globalización, BRICS y la fragmentación del comercio.",
     ["tariff", "arancel", "trade war", "trade talks", "trade surplus", "comercio", "globaliz", "brics",
      "wto", "g20", "mercosur", "sanction", "sancion", "free trade", "libre comercio", "noticias economicas"]),
    ("canales", "Canales, mares y rutas marítimas",
     "Panamá, Suez, Gibraltar, puertos, el transporte marítimo y los cuellos de botella del comercio.",
     ["panama", "suez", "canal", "chokepoint", "shipping", "ocean", "oceano", "pacific", "pacifico",
      "atlantic", "atlantico", "port", "ports", "puerto", "megapuerto", "chancay", "ship that broke", "gibraltar",
      "sea", "seas", "mar", "maritim", "trade route", "strait"]),
    ("energia", "Energía, recursos y autos eléctricos",
     "Gas, petróleo, nuclear, solar, litio, carbón, granos y la carrera de los vehículos eléctricos.",
     ["gas", "gasoducto", "petrol", "oil", "energ", "solar", "nuclear power", "nuclear plant", "lithium",
      "litio", "coal", "grain", "trigo", "battery", "electric car", "ev", "evs", "byd", "tesla",
      "autos electricos", "auto electrico", "coches electricos", "olinia", "go green", "mining",
      "materias primas", "bmw", "car companies", "gazprom", "perforaciones"]),
    ("tecnologia", "Tecnología, chips e inteligencia artificial",
     "Semiconductores, TSMC, Nvidia, IA, Big Tech, la carrera espacial y los cables submarinos.",
     ["chip", "chips", "microchip", "semiconductor", "tsmc", "smic", "nvidia", "intel$", "ai", "ia",
      "deepseek", "huawei", "xiaomi", "silicon valley", "tech", "technology", "cable", "cables", "internet",
      "musk", "twitter", "spacex", "space", "espacio", "data workers", "robots", "hinton",
      "machine made", "unicorns", "samsung", "amazon"]),
    ("seguridad", "Guerra, defensa y ciberseguridad",
     "Ciberguerra, carreras armamentistas, infraestructura bajo ataque, OTAN y los conflictos del siglo XXI.",
     ["cyber", "cyberwarfare", "hackers", "arms race", "economics of war", "guerras del siglo",
      "autonomous warfare", "nato", "otan", "havana syndrome", "objetivos de guerra", "infrastructure",
      "arms exports", "military alliance"]),
    ("eeuu", "Estados Unidos y Trump",
     "La política estadounidense, Trump y Biden, deportaciones y la política exterior de EE. UU.",
     ["trump", "biden", "harris", "white house", "us foreign", "united states", "estados unidos",
      "eeuu", "ee. uu", "america", "usa", "project 2025", "deport", "deportaciones", "guantanamo",
      "canada", "doug ford", "havana", "sachs", "income inequality", "wolff", "pentagon", "california",
      "los angeles", "fact-checkers", "anti-"]),
    ("latam", "México y América Latina",
     "México y el nearshoring, Venezuela, Colombia, Perú, Brasil, Argentina, Chile y la región.",
     ["mexico", "mexican", "mexicano", "sheinbaum", "ebrard", "unam", "plan mexico", "conalep",
      "venezuela", "colombia", "colombian", "latin america", "america latina", "brazil", "brasil",
      "argentina", "boric", "peru", "monroe", "bermeja", "drogas", "drugs", "informek"]),
    ("asia", "China, India y Asia-Pacífico",
     "China, Taiwán, el mar del Sur de China, India, Vietnam, Corea, Japón, Filipinas y Mongolia.",
     ["china", "chinese", "chine", "chino", "china’s", "pekin", "beijing", "xi", "taiwan", "philippines",
      "filipinas", "vietnam", "korea", "korean", "koreas", "corea", "japan", "japon", "okinawa", "india",
      "indian", "pakistan", "tata", "sco", "ocs", "uigures", "yeonpyeong", "silk road",
      "ruta de la seda", "asiatica", "asian", "mongolia", "singapore"]),
    ("europa", "Europa, Rusia y Ucrania",
     "La guerra en Ucrania, el gas ruso y Nord Stream, la defensa europea y la economía del continente.",
     ["russia", "russian", "rusia", "putin", "ukrain", "ucrania", "nord stream", "crimea", "chechnya",
      "shadow fleet", "europe", "europe's", "european", "germany", "alemania", "baltic", "baltico",
      "spain", "berlin", "sovietico", "merkel", "turkey"]),
    ("medio-oriente", "Medio Oriente",
     "Gaza, Israel y Palestina, Irán, Arabia Saudita y el estrecho de Ormuz.",
     ["gaza", "israel", "palestin", "palestinian", "hamas", "netanyahu", "iran", "hormuz", "ormuz",
      "west bank", "green line", "linea verde", "two-state", "arab states", "abbas", "turkey-armenia"]),
    ("africa", "África",
     "Wagner y el Sahel, el Congo, Etiopía, Sudáfrica y la competencia por el continente.",
     ["africa", "wagner", "niger", "mali", "burkina", "congo", "ethiopia", "kenyans", "neocolonial"]),
    ("polos", "Ártico, Antártida y fronteras raras",
     "El Ártico y la Antártida, Groenlandia y las fronteras más extrañas del mundo.",
     ["arctic", "artico", "antarctic", "antarctica", "antartico", "polos", "greenland", "groenlandia",
      "crazy borders", "fronteras locas", "exclave", "enclave", "bering"]),
    ("empresas", "Empresas y modelos de negocio",
     "Starbucks, McDonald's, IKEA, Costco y las estrategias de las multinacionales.",
     ["starbucks", "mcdonald", "mcdonald's", "mcdonald’s", "ikea", "costco", "chick-fil-a", "target",
      "luckin", "ben & jerry", "olympics", "how big", "business model", "aldi", "beer"]),
]

# Orden en que se decide la sección principal: lo más específico primero.
PRIORITY = ["medio-oriente", "africa", "polos", "seguridad", "canales", "energia", "tecnologia",
            "historia", "latam", "europa", "asia", "comercio", "eeuu", "empresas", "ideas"]

# Correcciones manuales (id de YouTube -> sección) donde las palabras clave engañan.
OVERRIDES = {
    "Xqy5xZ2NIco": "empresas",     # Lidl
    "u7OrESgjkG0": "empresas",     # Flixbus
    "dCVRDcf4i8U": "empresas",     # Siemens
    "uF2VkYenZT8": "empresas",     # Vapiano
    "vT5-cV4oMY8": "empresas",     # Aldi en Estados Unidos
    "UH64nPB-tzE": "empresas",     # Uber contra Tesla
    "DaPnzZi3hoE": "africa",       # Marruecos y el Sahara Occidental
    "zXD3EP7ZmEA": "seguridad",    # Ciberataques a cadenas de suministro
    "jBykDoLPZ4I": "seguridad",    # Terrorismo yihadista
    "P4XYMoSGsBM": "seguridad",    # Armas nucleares
    "0FunCq6R6mo": "europa",       # Extrema derecha en Europa
    "KZEKtT7L9Fk": "europa",       # Macron y los estudiantes
    "nchhbgiloM4": "europa",       # Refugios en Finlandia
    "cK9GwIRIyzo": "europa",       # Reino Unido
    "YCE_Som45hE": "europa",       # Reino Unido, independencias
    "SHN-Qxxm5tk": "europa",       # Polonia y la ultraderecha alemana
    "vHp1zyRUV74": "tecnologia",   # HarmonyOS de Huawei
    "l1ZlB3_-5Vk": "latam",        # Estados Unidos y Cuba
    "ppUSZlntc7M": "eeuu",         # 11-S, DW
    "bcXyq_sE39M": "eeuu",         # Archivos del 11-S
    "QWq5o7X8OLI": "historia",     # Imperio británico
    "P2xvQ41Ifow": "ideas",        # Nuevo mapa de la ONU
    "q5RDI9Lt4QE": "ideas",        # Nuevo mapa de la ONU, DW
    "fVC8EYd_Z_g": "ideas",       # Edward Said, Orientalismo
    "4crvgU0CVn8": "ideas",       # Ian Bremmer, G-Zero
    "zYbCQnTy98k": "ideas",       # Historias deportivas: el fútbol
    "Du7fOoW_euE": "ideas",       # Dugin
    "vvj6_Xb1MzQ": "historia",    # Conferencia de Berlín
    "y091KkVIJ7w": "canales",     # Estrecho de Gibraltar
    "mkVUHMQF3q0": "tecnologia",  # Cables del Báltico
    "y09a2gY4DCo": "tecnologia",  # Robots Optimus
    "-aH6rGs-_Q4": "asia",        # Desfile militar chino
    "0zfUSoWC4Eg": "asia",        # Nueva Ruta de la Seda en Europa
    "PNEZG0hmz_U": "asia",        # Mongolia
    "1oh8mk_PJS0": "asia",        # Professor answers China questions
    "ryxBWPsik_g": "latam",       # Amazon llega a México
    "W0wnPnRd1KI": "latam",       # China is Mexico's future
    "nYmH0AoMsP8": "comercio",    # BRICS en Rusia
    "7XbT-YQVdsE": "comercio",    # BRICS liderado por China
    "SOh2Qidi6KA": "comercio",    # Canadá-EE. UU., socios comerciales
    "uNQUuPG4KOY": "comercio",    # US Steel y Nippon Steel
    "cqDvnmMswXA": "empresas",    # Luckin vs Starbucks
    "79IElk5bfpY": "empresas",    # Luckin en Nueva York
    "19ITrZHrPlg": "empresas",    # Starbucks en China
    "XGZXPJDMrvY": "empresas",    # Cerveza Modelo
    "DSGVlnFtSoo": "empresas",    # Target en Canadá
}

ES_HINTS = re.compile(r"[ñ¿¡áéíóú]|\b(el|la|los|las|del|de|que|y|en|una|cómo|por|qué|para|con)\b", re.I)
EN_HINTS = re.compile(r"\b(the|of|and|how|why|is|what|to|in|for|with|are|does)\b", re.I)


def language(title, channel):
    t = re.sub(r"[|•].*$", "", title)
    if re.search(r"\b(die|der|und|von)\b", t, re.I):
        return "de"
    if re.search(r"\b(les|des|du)\b|^Chine\b", t, re.I):
        return "fr"
    # Los canales en español a veces muestran el título traducido al inglés:
    # el canal indica mejor el idioma del audio.
    if re.search(r"Español|Documentales|Documental$|Mundo|Fórmula|EXCELSIOR|Bully|Cultura|Milenio|UNAM|N\+", channel):
        return "es"
    es = len(ES_HINTS.findall(t))
    en = len(EN_HINTS.findall(t))
    return "es" if es > en else "en"


_RX = {}


def match(kw, hay):
    """Coincide al inicio de una palabra. Las claves de hasta 4 letras, o que
    terminan en «$», deben ser la palabra completa."""
    rx = _RX.get(kw)
    if rx is None:
        k = fold(kw).strip()
        whole = k.endswith("$") or len(k) <= 4
        k = k.rstrip("$")
        rx = _RX[kw] = re.compile(r"(?<![a-z0-9])" + re.escape(k) + (r"(?![a-z0-9])" if whole else ""))
    return bool(rx.search(hay))


def classify(vid, title, channel):
    hay = fold(title + " | " + channel)
    hits = {sid for sid, _, _, kws in SECTIONS if any(match(k, hay) for k in kws)}
    primary = OVERRIDES.get(vid) or next((p for p in PRIORITY if p in hits), "ideas")
    order = [p for p in PRIORITY if p in hits or p == primary]
    return primary, [primary] + [p for p in order if p != primary]


def main():
    data = json.loads(SRC.read_text(encoding="utf-8"))
    out = []
    for v in data["videos"]:
        v = dict(v, title=htmllib.unescape(v["title"]), channel=htmllib.unescape(v.get("channel") or ""))
        primary, tags = classify(v["id"], v["title"], v["channel"])
        out.append({
            "id": v["id"],
            "t": v["title"].strip(),
            "c": v.get("channel") or "",
            "d": v.get("duration") or 0,
            "ds": v.get("duration_string") or "",
            "v": v.get("view_count") or 0,
            "i": v.get("playlist_index") or 0,
            "y": (v.get("upload_date") or "")[:4],
            "l": v.get("language") or language(v["title"], v.get("channel") or ""),
            "s": primary,
            "g": tags,
        })
    # El video sin índice se agregó al final de la playlist.
    last = max(x["i"] for x in out)
    for x in out:
        if not x["i"]:
            last += 1
            x["i"] = last
    payload = {
        "title": data.get("playlist_title", "Geopolítica"),
        "url": data.get("playlist_url"),
        "sections": [{"id": s, "n": n, "desc": d} for s, n, d, _ in SECTIONS],
        "videos": out,
    }
    js = "const PLAYLIST = " + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";"
    html = PAGE.read_text(encoding="utf-8")
    html = re.sub(r"(/\* DATA-START \*/).*?(/\* DATA-END \*/)",
                  lambda m: m.group(1) + "\n" + js + "\n" + m.group(2), html, flags=re.S)
    PAGE.write_text(html, encoding="utf-8")
    return payload


if __name__ == "__main__":
    import collections
    p = main()
    print(collections.Counter(v["s"] for v in p["videos"]))
    print(collections.Counter(v["l"] for v in p["videos"]))
