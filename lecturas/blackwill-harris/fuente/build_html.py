"""Arma el HTML de un solo archivo: fuentes incrustadas + los tres SVG de Graphviz.

Uso:  python3 build_html.py <carpeta_fuentes> <carpeta_svg> <plantilla.html> <salida.html>
"""
import base64
import re
import sys
from pathlib import Path

fuentes, carpeta_svg, plantilla, salida = map(Path, sys.argv[1:5])

# Familia CSS = el nombre exacto que Graphviz escribe en font-family
FUENTES = {
    "Oswald Bold": "Oswald-700.ttf",
    "Oswald Medium": "Oswald-500.ttf",
    "Barlow Condensed Medium": "BarlowCondensed-500.ttf",
    "Barlow Condensed Medium Italic": "BarlowCondensed-500i.ttf",
    "Barlow Condensed SemiBold": "BarlowCondensed-600.ttf",
    "Barlow": "Barlow-400.ttf",
    "Barlow SemiBold": "Barlow-600.ttf",
    "Barlow Italic": "Barlow-400i.ttf",
    "Courier Prime": "CourierPrime-400.ttf",
    "Courier Prime Bold": "CourierPrime-700.ttf",
    "Permanent Marker": "PermanentMarker-400.ttf",
    "Bebas Neue": "BebasNeue-400.ttf",
    "Ma Shan Zheng": "MaShanZheng-sub.ttf",
}
css = []
for familia, archivo in FUENTES.items():
    datos = base64.b64encode((fuentes / archivo).read_bytes()).decode()
    css.append(f'@font-face{{font-family:"{familia}";src:url(data:font/ttf;base64,{datos}) format("truetype");font-display:block}}')

ESQUEMAS = {
    "%%SVG_CAP1%%": ("cap1_que_es_la_geoeconomia.svg", "e1"),
    "%%SVG_CAP3A%%": ("cap3a_siete_instrumentos.svg", "e2"),
    "%%SVG_CAP3B%%": ("cap3b_dotaciones_y_tensiones.svg", "e3"),
}


def limpiar_svg(texto, prefijo):
    texto = texto[texto.index("<svg"):]
    texto = re.sub(r'<svg width="[^"]+" height="[^"]+"', '<svg class="esquema-svg" preserveAspectRatio="xMidYMid meet"', texto, count=1)
    texto = re.sub(r'id="([^"]+)"', lambda m: f'id="{prefijo}-{m.group(1)}"', texto)
    texto = re.sub(r"<!--.*?-->\n?", "", texto, flags=re.S)
    return texto


html = plantilla.read_text(encoding="utf-8").replace("/*%%FUENTES%%*/", "\n".join(css))
for marca, (archivo, prefijo) in ESQUEMAS.items():
    html = html.replace(marca, limpiar_svg((carpeta_svg / archivo).read_text(encoding="utf-8"), prefijo))
salida.write_text(html, encoding="utf-8")
print(f"{salida} · {salida.stat().st_size / 1e6:.2f} MB")
