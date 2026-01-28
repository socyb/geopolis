---
title: "Datos — Línea del tiempo (geopolítica) — compiladoParaLinea.pdf"
created_utc: "2026-01-27T00:00:00Z"
source: "compiladoParaLinea.pdf"
notes:
  - "Este archivo contiene SOLO datos (sin diseño)."
  - "Campos pensados para luego renderizar una línea del tiempo responsive con tarjetas desplegables al hacer click."
schema:
  required_fields: [id, date_start, date_precision, title, summary, details, tags, sources]
  optional_fields: [date_end, location, actors, links]
---

# Dataset (YAML)

```yaml
events:
  - id: e1875_suez_shares
    date_start: "1875-01-01"
    date_precision: "year"
    title: "Compra británica de acciones del Canal de Suez"
    summary: "En la política de Disraeli, el imperialismo arranca con la compra de acciones del Canal de Suez."
    details: >
      El texto presenta la compra de acciones del Canal de Suez (1875) como un punto de arranque simbólico
      del “imperio” en la política británica del periodo.
    location: "Egipto / Reino Unido"
    actors: ["Reino Unido", "Gobierno de Disraeli"]
    tags: ["imperialismo", "infraestructura estratégica", "ruta marítima"]
    sources:
      - "compiladoParaLinea.pdf — sección sobre imperialismo (menciona 1875 como inicio con Suez)."

  - id: e1890_baring_crisis
    date_start: "1890-01-01"
    date_precision: "year"
    title: "Crisis Baring"
    summary: "Crisis financiera que el texto usa como marcador del periodo imperial."
    details: >
      Se menciona la “Baring crisis” (1890) como referencia dentro de la secuencia de hitos del imperialismo.
    tags: ["finanzas internacionales", "imperialismo", "crisis"]
    sources:
      - "compiladoParaLinea.pdf — mención explícita: 'Baring crisis of 1890'."

  - id: e1898_spanish_empire_end
    date_start: "1898-01-01"
    date_precision: "year"
    title: "Guerra de 1898 y fin del imperio español (Cuba, Puerto Rico, Filipinas)"
    summary: "En 1898 EE. UU. toma Cuba, Puerto Rico y Filipinas; el texto lo marca como fin del imperio español."
    details: >
      El compilado señala que en la guerra de 1898 Estados Unidos se apodera de Cuba, Puerto Rico y Filipinas,
      interpretándolo como el cierre del imperio español.
    location: "Caribe / Filipinas / EE. UU. / España"
    actors: ["Estados Unidos", "España", "Cuba", "Puerto Rico", "Filipinas"]
    tags: ["cambio hegemónico", "imperialismo", "guerra"]
    sources:
      - "compiladoParaLinea.pdf — mención explícita del episodio de 1898."

  - id: e1899_1902_south_african_war
    date_start: "1899-01-01"
    date_end: "1902-12-31"
    date_precision: "range"
    title: "Guerra de Sudáfrica (1899–1902)"
    summary: "El texto la enumera como hito (South African War 1899–1902)."
    details: >
      Se menciona la guerra de Sudáfrica de 1899–1902 como uno de los hitos que acompañan
      la expansión imperial y sus conflictos.
    location: "Sudáfrica"
    actors: ["Reino Unido", "Repúblicas bóeres (mencionadas de forma implícita por el conflicto)"]
    tags: ["imperialismo", "guerra", "colonialismo"]
    sources:
      - "compiladoParaLinea.pdf — mención explícita: 'South African War of 1899–1902'."

  - id: e1905_gunboat_diplomacy
    date_start: "1905-01-01"
    date_precision: "year"
    title: "Auge de la ‘diplomacia de cañonero’ (gunboat diplomacy)"
    summary: "El texto indica que hacia 1905 la ‘diplomacia de la fuerza’ se vuelve cada vez más frecuente."
    details: >
      El compilado registra que la “diplomacia de cañonero” (o “diplomacia de la fuerza”) se volvió cada vez
      más frecuente alrededor de 1905, como indicador de coerción imperial.
    tags: ["imperialismo", "coerción", "política exterior"]
    sources:
      - "compiladoParaLinea.pdf — mención explícita: 'gunboat diplomacy increasingly frequent by 1905'."

  - id: e1907_persia_spheres
    date_start: "1907-01-01"
    date_precision: "year"
    title: "Acuerdo anglo-ruso de 1907 sobre esferas de influencia en Persia"
    summary: "Acuerdo que fija esferas de influencia en Persia (y menciona Afganistán/Tíbet)."
    details: >
      Se menciona el acuerdo de 1907 entre Gran Bretaña y Rusia, que reconoce esferas de influencia
      en Persia, e incluye la referencia a Afganistán y Tíbet.
    location: "Persia (Irán) / Asia Central"
    actors: ["Reino Unido", "Rusia"]
    tags: ["esferas de influencia", "imperialismo", "Asia Central"]
    sources:
      - "compiladoParaLinea.pdf — mención explícita del acuerdo de 1907."

  - id: e1914_africa_empires
    date_start: "1914-01-01"
    date_precision: "year"
    title: "Para 1914, casi toda África pertenece a imperios europeos"
    summary: "El texto dice que en 1914 casi toda África formaba parte de algún imperio."
    details: >
      El compilado afirma que para 1914 prácticamente toda África pertenecía a algún imperio,
      subrayando la culminación territorial del reparto colonial.
    location: "África"
    tags: ["colonialismo", "imperios", "reparto territorial"]
    sources:
      - "compiladoParaLinea.pdf — enunciado explícito sobre África en 1914."

  - id: e1919_versailles_league
    date_start: "1919-01-01"
    date_precision: "year"
    title: "1919: Versalles / proyecto de Sociedad de Naciones"
    summary: "Se menciona la promoción de una League of Nations tras 1919."
    details: >
      El texto alude a la promoción de una Sociedad de Naciones después de 1919, vinculada al
      intento de regular el orden internacional tras la guerra.
    tags: ["orden internacional", "multilateralismo", "posguerra"]
    sources:
      - "compiladoParaLinea.pdf — referencia a 'Versailles after 1919' y 'League of Nations'."

  - id: e1925_geneva_protocol
    date_start: "1925-01-01"
    date_precision: "year"
    title: "1925: Convención/Protocolo de Ginebra (armas químicas)"
    summary: "El compilado menciona las Convenciones de Ginebra de 1925 como parte del marco legal."
    details: >
      Aparece la referencia a las Convenciones de Ginebra (1925) en el contexto del
      marco legal internacional sobre guerra y armamento.
    tags: ["derecho internacional", "guerra", "armas químicas"]
    sources:
      - "compiladoParaLinea.pdf — mención: 'Geneva Conventions of 1925 and 1949'."

  - id: e1941_pearl_harbor
    date_start: "1941-01-01"
    date_precision: "year"
    title: "1941: Ataque japonés a Pearl Harbor"
    summary: "El texto lo invoca como mito/fundamento del ‘good war’ estadounidense."
    details: >
      El compilado señala la invocación del ataque japonés a Pearl Harbor (1941) como
      parte de narrativas que legitiman la guerra como respuesta a una agresión.
    location: "Pearl Harbor (base naval de EE. UU.)"
    actors: ["Japón", "Estados Unidos"]
    tags: ["guerra", "mitologías políticas", "EE. UU."]
    sources:
      - "compiladoParaLinea.pdf — mención explícita del ataque de 1941 a Pearl Harbor."

  - id: e1945_1955_occupation
    date_start: "1945-01-01"
    date_end: "1955-12-31"
    date_precision: "range"
    title: "1945–1955: Ocupación aliada de Austria y Alemania"
    summary: "Austria y Alemania fueron ocupadas por fuerzas aliadas hasta 1955."
    details: >
      El texto contrasta la experiencia estadounidense con la europea y señala que Austria y Alemania
      fueron ocupadas por fuerzas aliadas (URSS, EE. UU., Reino Unido y Francia) hasta 1955.
    location: "Austria y Alemania"
    actors: ["URSS", "Estados Unidos", "Reino Unido", "Francia", "Austria", "Alemania"]
    tags: ["posguerra", "ocupación", "Europa"]
    sources:
      - "compiladoParaLinea.pdf — mención explícita: ocupación 'until 1955'."

  - id: e1949_geneva_conventions
    date_start: "1949-01-01"
    date_precision: "year"
    title: "1949: Convenciones de Ginebra"
    summary: "El compilado menciona 1949 como parte del marco legal internacional."
    details: >
      Se menciona el año 1949 (junto con 1925) como parte del conjunto de Convenciones de Ginebra,
      enmarcando regulaciones sobre conflictos.
    tags: ["derecho internacional", "posguerra"]
    sources:
      - "compiladoParaLinea.pdf — mención: 'Geneva Conventions of 1925 and 1949'."

  - id: e1955_warsaw_pact
    date_start: "1955-01-01"
    date_precision: "year"
    title: "1955: Creación del Pacto de Varsovia"
    summary: "Se presenta como equivalente de la OTAN, creado en 1955."
    details: >
      En el pasaje sobre la Guerra Fría, el texto define al Pacto de Varsovia como equivalente de la OTAN
      y especifica su creación en 1955.
    actors: ["URSS", "Estados del bloque oriental (mencionados como aliados del Pacto)"]
    tags: ["Guerra Fría", "alianzas militares", "Europa"]
    sources:
      - "compiladoParaLinea.pdf — mención explícita: Warsaw Pact 'created in 1955'."

  - id: e1966_france_leaves_nato_command
    date_start: "1966-01-01"
    date_precision: "year"
    title: "1966: Francia sale del mando integrado de la OTAN"
    summary: "El texto señala que fue un movimiento ‘shocking’ para estadounidenses y británicos."
    details: >
      Se menciona la decisión francesa de abandonar la estructura de mando liderada por EE. UU. en la OTAN
      en 1966, y su carácter disruptivo dentro de la disciplina geopolítica del bloque occidental.
    actors: ["Francia", "OTAN", "Estados Unidos", "Reino Unido"]
    tags: ["Guerra Fría", "OTAN", "tensiones intra-alianza"]
    sources:
      - "compiladoParaLinea.pdf — mención explícita: Francia deja el mando de la OTAN en 1966."

  - id: e1979_soviet_afghanistan
    date_start: "1979-01-01"
    date_precision: "year"
    title: "1979: Invasión soviética de Afganistán"
    summary: "El texto recuerda la invasión soviética de Afganistán en 1979."
    details: >
      Se registra la invasión soviética de Afganistán (1979) como parte de los episodios de intervención
      y conflicto que anteceden el giro posterior hacia el ‘war on terror’.
    location: "Afganistán"
    actors: ["URSS", "Afganistán"]
    tags: ["Guerra Fría tardía", "Afganistán", "intervención"]
    sources:
      - "compiladoParaLinea.pdf — mención explícita: 'Soviet invasion of Afghanistan (1979)'."

  - id: e1989_soviet_withdrawal_afghanistan
    date_start: "1989-02-01"
    date_precision: "month"
    title: "1989 (febrero): Retiro soviético de Afganistán"
    summary: "El texto indica que la eliminación/retirada soviética se completó en febrero de 1989."
    details: >
      El compilado afirma que la retirada soviética de Afganistán se completó en febrero de 1989.
    location: "Afganistán"
    actors: ["URSS"]
    tags: ["Afganistán", "Guerra Fría tardía", "retiro militar"]
    sources:
      - "compiladoParaLinea.pdf — mención explícita: 'was completed in February 1989'."

  - id: e1990_kuwait_invasion
    date_start: "1990-08-01"
    date_precision: "month"
    title: "1990 (agosto): Irak invade Kuwait; coalición liderada por EE. UU."
    summary: "El texto menciona la invasión iraquí de Kuwait en agosto de 1990 y la coalición posterior."
    details: >
      Se menciona la invasión iraquí de Kuwait en agosto de 1990 y que después una coalición
      (liderada por EE. UU.) liberó Kuwait en el marco de la Guerra del Golfo.
    location: "Kuwait / Irak"
    actors: ["Irak", "Kuwait", "Estados Unidos", "coalición internacional (mencionada)"]
    tags: ["Golfo", "coalición", "intervención"]
    sources:
      - "compiladoParaLinea.pdf — mención explícita: 'Iraqi invasion of Kuwait in August 1990' y 'US-led coalition'."

  - id: e1993_srebrenica_safe_area
    date_start: "1993-04-01"
    date_precision: "month"
    title: "1993 (abril): ONU declara Srebrenica ‘safe area’"
    summary: "Zona especial de orden/seguridad en medio de la guerra en Bosnia."
    details: >
      El texto indica que Srebrenica fue declarada por Naciones Unidas como “safe area” en abril de 1993,
      como intento de legislar una zona de seguridad en medio del conflicto bosnio.
    location: "Srebrenica (Bosnia)"
    actors: ["ONU", "partes en conflicto en Bosnia (mencionadas de forma general)"]
    tags: ["ONU", "Bosnia", "zonas de seguridad", "humanitario"]
    sources:
      - "compiladoParaLinea.pdf — mención explícita: 'safe area' en abril de 1993."

  - id: e1995_srebrenica_massacre
    date_start: "1995-07-01"
    date_precision: "month"
    title: "1995 (julio): Caída de Srebrenica y masacre"
    summary: "El texto menciona ~7,000 hombres y niños bosnios musulmanes asesinados."
    details: >
      Se describe que en julio de 1995 Srebrenica fue sobrepasada por fuerzas serbobosnias y que
      alrededor de 7,000 hombres y niños bosnios musulmanes fueron asesinados, mientras
      fuerzas de paz cercanas no pudieron intervenir.
    location: "Srebrenica (Bosnia)"
    actors: ["Fuerzas serbobosnias", "Bosnios musulmanes", "peacekeepers neerlandeses (mencionados)"]
    tags: ["Bosnia", "crímenes masivos", "Europa", "ONU/peacekeeping"]
    sources:
      - "compiladoParaLinea.pdf — mención explícita: 'In July 1995… some 7,000… were murdered… Dutch peacekeepers… powerless'."

  - id: e1995_dayton
    date_start: "1995-12-01"
    date_precision: "month"
    title: "1995 (diciembre): Acuerdos de Dayton"
    summary: "NATO (liderada por EE. UU.) interviene y se firma el acuerdo en Dayton, Ohio."
    details: >
      El texto afirma que no fue sino hasta la intervención de fuerzas de la OTAN lideradas por EE. UU.
      que se aseguró un arreglo de paz, firmado en Dayton, Ohio, en diciembre de 1995.
    location: "Dayton, Ohio (EE. UU.) / Bosnia (contexto)"
    actors: ["OTAN", "Estados Unidos", "UE (mencionada)", "ONU (mencionada)"]
    tags: ["OTAN", "diplomacia", "posconflicto", "Europa/EE. UU."]
    sources:
      - "compiladoParaLinea.pdf — mención explícita: 'signed in Dayton… in December 1995'."

  - id: e1999_kosovo_nato_airstrikes
    date_start: "1999-01-01"
    date_precision: "year"
    title: "1999: Violencia en Kosovo y bombardeos de la OTAN"
    summary: "El texto menciona Kosovo como violencia posterior y señala bombardeos de la OTAN en 1999."
    details: >
      Kosovo aparece como caso de violencia posterior en la ex Yugoslavia; en otro pasaje, el texto señala
      que en 1999 los bombardeos de la OTAN forzaron la retirada serbia.
    location: "Kosovo / ex Yugoslavia"
    actors: ["OTAN", "Serbia (fuerzas serbias)", "Estados Unidos (en el marco OTAN)"]
    tags: ["Kosovo", "OTAN", "intervención", "Balcánes"]
    sources:
      - "compiladoParaLinea.pdf — referencia a Kosovo como violencia posterior; y mención explícita de 1999 con bombardeos OTAN."

  - id: e2001_0911_attacks
    date_start: "2001-09-11"
    date_precision: "day"
    title: "2001 (11 de septiembre): Atentados del 11-S"
    summary: "El texto los menciona como punto de inflexión para justificar acciones en Afganistán e Irak."
    details: >
      Se refiere a los “September 11th attacks” como detonante/justificación discursiva en el giro hacia
      acciones beligerantes en Afganistán e Irak.
    location: "Estados Unidos"
    actors: ["Al-Qaeda (mencionada)", "Estados Unidos"]
    tags: ["11-S", "guerra contra el terror", "seguridad"]
    sources:
      - "compiladoParaLinea.pdf — mención explícita: 'aftermath of September 11th'."

  - id: e2001_afghanistan_us_attack
    date_start: "2001-01-01"
    date_precision: "year"
    title: "2001: EE. UU. ataca Afganistán y derroca al Talibán"
    summary: "El texto dice que EE. UU. atacó Afganistán y derrocó al Talibán."
    details: >
      El compilado vincula la respuesta posterior al 11-S con acciones en Afganistán: “America…
      overthrew the Taliban and attacked Afghanistan”.
    location: "Afganistán"
    actors: ["Estados Unidos", "Talibán"]
    tags: ["Afganistán", "guerra contra el terror", "intervención"]
    sources:
      - "compiladoParaLinea.pdf — mención explícita sobre derrocamiento del Talibán y ataque a Afganistán."

  - id: e2002_kagan_power_weakness
    date_start: "2002-07-01"
    date_precision: "season"
    title: "2002 (verano): Kagan publica llamado a ‘common understanding’"
    summary: "El texto ubica el argumento de Kagan en el verano de 2002 (antes del ‘build-up’ de 2003)."
    details: >
      Se indica que el llamado a un “little common understanding” apareció en el verano de 2002,
      previo a la escalada hacia la guerra de Irak en 2003.
    actors: ["Robert Kagan", "Estados Unidos", "Europa/UE"]
    tags: ["debate transatlántico", "poder", "multilateralismo"]
    sources:
      - "compiladoParaLinea.pdf — mención explícita: 'appeared in the summer of 2002'."

  - id: e2003_feb_old_europe
    date_start: "2003-02-01"
    date_precision: "month"
    title: "2003 (febrero): Rumsfeld y la etiqueta ‘Old Europe’"
    summary: "Señala a Francia y Alemania como ‘Old Europe’ y contrasta con ‘New Europe’."
    details: >
      El texto menciona que, furioso por la oposición pública de Francia y Alemania a los planes de invasión,
      Donald Rumsfeld (secretario de Defensa) en febrero de 2003 las descalificó como “Old Europe”.
      También contrasta con países ex-Pacto de Varsovia o nuevos miembros de la OTAN como “New Europe”.
    location: "Europa / EE. UU."
    actors: ["Donald Rumsfeld", "Estados Unidos", "Francia", "Alemania", "Polonia", "Hungría", "Bulgaria", "Estonia"]
    tags: ["fractura transatlántica", "OTAN", "Irak 2003"]
    sources:
      - "compiladoParaLinea.pdf — mención explícita: 'in February 2003… Old Europe… New Europe'."

  - id: e2003_iraq_invasion_march
    date_start: "2003-03-01"
    date_precision: "month"
    title: "2003 (marzo): Invasión/asalto liderado por EE. UU. contra Irak"
    summary: "El texto menciona la invasión de Irak en marzo de 2003."
    details: >
      Se menciona el episodio como “US-led invasion of Iraq in March 2003” y como parte de la
      guerra/asalto de 2003, en disputa con socios europeos.
    location: "Irak"
    actors: ["Estados Unidos", "Irak", "aliados (mencionados de forma general)", "Francia", "Alemania"]
    tags: ["Irak 2003", "intervención", "WMD (mencionado)"]
    sources:
      - "compiladoParaLinea.pdf — mención explícita: 'invasion… in March 2003' / 'assault on Iraq'."

  - id: e2004_eu_enlargement
    date_start: "2004-05-01"
    date_precision: "month"
    title: "2004 (mayo): Ampliación sustancial de la Unión Europea"
    summary: "El texto indica que la membresía de la UE aumentó sustancialmente en mayo de 2004."
    details: >
      El compilado afirma que la membresía de la UE se incrementó de forma sustancial en mayo de 2004,
      en un contexto donde se discute su capacidad de proyección internacional en medio de expansión.
    location: "Europa"
    actors: ["Unión Europea", "Estados miembros (mencionados de forma general)"]
    tags: ["UE", "integración europea", "expansión"]
    sources:
      - "compiladoParaLinea.pdf — mención explícita: 'EU membership was substantially increased in May 2004'."
```


# Notas rápidas para el siguiente paso (HTML)
- Render sugerido: 1) línea central horizontal/vertical (según ancho), 2) “nodos” clicables, 3) panel lateral o modal para `details`.
- Orden: por `date_start` (ISO); si hay `date_end`, tratar como rango.
- Recomendación: respetar `date_precision` (no “inventar” día/mes cuando es solo año; en UI se puede mostrar “c. 1905” o “Verano 2002”).
