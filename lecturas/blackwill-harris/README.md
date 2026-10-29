# Café «Por otros medios»

Esquemas de lectura de Blackwill y Harris (2016), *War by Other Means: Geoeconomics and Statecraft*,
capítulos 1 y 3. Esta carpeta es pública pero ninguna página del curso la enlaza.

- Ver: <https://socyb.github.io/geopolis/lecturas/blackwill-harris/blackwill-harris-caps-1-y-3.html>
- PDF: <https://socyb.github.io/geopolis/lecturas/blackwill-harris/blackwill-harris-caps-1-y-3.pdf>

| Archivo | Qué es |
|---|---|
| `blackwill-harris-caps-1-y-3.html` | Todo en un solo archivo: fuentes y esquemas incrustados. Funciona sin internet. |
| `blackwill-harris-caps-1-y-3.pdf` | 9 hojas: carta horizontal para el texto, doble carta (17 × 11 in) para los tres esquemas. |
| `dot/*.dot` | Los tres esquemas en DOT. |
| `dot/*.svg` | Los mismos esquemas dibujados por Graphviz. |
| `fuente/` | Los guiones para regenerar el HTML y el PDF. |

## Para cambiar un esquema

1. Instala Oswald, Barlow Condensed, Courier Prime, Permanent Marker, Bebas Neue y Ma Shan Zheng
   (Google Fonts, en TTF estático). Sin ellas, Graphviz mide mal el texto y las tarjetas se descuadran.
2. Edita el `.dot` y dibújalo:
   `dot -Tsvg dot/cap1_que_es_la_geoeconomia.dot -o dot/cap1_que_es_la_geoeconomia.svg`
3. Arma de nuevo el HTML y el PDF. `build_html.py` espera los TTF en una carpeta, con los nombres que
   trae su tabla `FUENTES`; `make_pdf.js` usa Playwright con Chromium.
   ```
   python3 fuente/build_html.py <carpeta_ttf> dot fuente/plantilla.html blackwill-harris-caps-1-y-3.html
   node fuente/make_pdf.js "$PWD/blackwill-harris-caps-1-y-3.html" blackwill-harris-caps-1-y-3.pdf
   ```

`fuente/gen_dot.py` escribió los `.dot` la primera vez; si lo vuelves a correr, sobrescribe lo que hayas
editado a mano en ellos.
