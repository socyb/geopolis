# Código QR de la página del curso (`index27.html`)

Este README documenta **solo** el trabajo hecho sobre
[`index27.html`](index27.html) — la página del curso *Geopolítica Internacional
Aplicada a los Negocios Internacionales* (FCA · UNAM · Grupo 1541 · Semestre
2027-1): la incorporación de un **código QR** que abre esa misma página.

---

## Qué hace

En la **barra superior fija** aparece el QR en pequeño (34 px), a la izquierda de
los botones de tema (🌙) e impresión (🖨). Como la barra es `sticky`, el código
queda disponible en todo momento, sin importar dónde esté el lector en la página.

Al hacer clic, el QR se amplía en un **marco emergente** (`<dialog>` nativo) que
incluye el código en grande, la URL en texto, un botón para copiar la liga y otro
para descargar el SVG.

El marco se cierra de tres formas: con **Esc**, con la **×**, o con un clic fuera
del recuadro.

## Archivos

| Archivo | Qué se agregó |
|---|---|
| [`assets/index27/qr-index27.svg`](assets/index27/qr-index27.svg) | El código QR en vectorial (archivo nuevo) |
| [`index27.html`](index27.html) | Botón `.qr-btn` en la barra superior (línea 45) y el `<dialog id="qrModal">` (líneas 718–733) |
| [`assets/index27/course27.css`](assets/index27/course27.css) | Estilos del botón y del marco emergente (líneas 635–684) |
| [`assets/index27/course27.js`](assets/index27/course27.js) | Apertura, cierre y copiado de la liga (líneas 44–74) |

## Decisiones de diseño

**El QR conserva fondo claro en modo oscuro.** El resto de la página cambia de
paleta con el tema, pero el código se dibuja siempre en tinta `#16202c` sobre
papel `#fffcf6`. Invertir un QR hace que algunos lectores fallen; mantener el
contraste estándar garantiza que escanee en ambos temas.

**Corrección de errores nivel H.** Es el nivel más alto (recupera hasta ~30 % del
símbolo dañado). Pensado para proyectarlo en el salón o imprimirlo: tolera
reflejos, dobleces y fotos a distancia. Sube la densidad a versión 6 (41×41
módulos), que sigue siendo cómoda de escanear.

**La confirmación de copiado va en el propio botón, no en el toast.** El elemento
`<dialog>` se pinta en la *top layer* del navegador, por encima de cualquier
`z-index`; el aviso flotante `.toast` de la página quedaría oculto tras el modal.
Por eso "Copiar liga" cambia su propia etiqueta a "Liga copiada ✓" durante dos
segundos.

**Estilo consistente con el resto de la página.** El botón y el marco reutilizan
los tokens del lenguaje visual de carta náutica ya existente: borde de tinta de
2 px, sombra dura (`--shadow`), `::backdrop` con desenfoque y la misma tipografía
mono para la URL. El marco se oculta al imprimir.

**Accesibilidad.** El botón lleva `aria-label` y `aria-haspopup="dialog"`; el
marco usa `aria-labelledby`. Al ser un `<dialog>` nativo, el foco queda atrapado
dentro y Esc cierra sin JavaScript adicional. Ambas imágenes tienen `alt`.

## La URL codificada

```
https://socyb.github.io/geopolis/index27.html
```

Es la ruta estándar de GitHub Pages para este repositorio (`socyb/geopolis`). No
hay archivo `CNAME`, así que **conviene confirmarla** si el sitio se sirve desde
otro dominio. Si cambia, hay que actualizarla en dos lugares:

1. La constante `URL` del script de regeneración (abajo).
2. El texto visible en [`index27.html`](index27.html), dentro de
   `<p class="qr-url mono" id="qrUrl">`.

## Regenerar el QR

El SVG se generó con [segno](https://pypi.org/project/segno/). Para rehacerlo
—por ejemplo si cambia la URL— desde la raíz del repositorio:

```bash
pip install segno
```

```python
import segno

URL = "https://socyb.github.io/geopolis/index27.html"

q = segno.make(URL, error='h')          # corrección de errores nivel H
m = q.matrix
n = len(m)
BORDER = 4                              # zona de silencio obligatoria (4 módulos)
size = n + BORDER * 2

# Un solo path: cada corrida horizontal de módulos oscuros es un rectángulo.
parts = []
for y, row in enumerate(m):
    x = 0
    while x < n:
        if row[x]:
            run = 1
            while x + run < n and row[x + run]:
                run += 1
            parts.append(f"M{x+BORDER} {y+BORDER}h{run}v1h-{run}z")
            x += run
        else:
            x += 1
d = "".join(parts)

svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" '
    f'width="{size*8}" height="{size*8}" shape-rendering="crispEdges" role="img" '
    f'aria-label="Código QR de la página del curso">\n'
    f'  <title>Código QR · {URL}</title>\n'
    f'  <rect width="{size}" height="{size}" fill="#fffcf6"/>\n'
    f'  <path fill="#16202c" d="{d}"/>\n'
    f'</svg>\n'
)
open("assets/index27/qr-index27.svg", "w").write(svg)
```

El `shape-rendering="crispEdges"` mantiene los bordes de los módulos nítidos a
cualquier escala; por eso el CSS no fuerza `image-rendering`.

## Verificación hecha

- **Decodificación real:** el SVG se rasterizó a PNG y se pasó por el detector de
  QR de CoreImage (macOS Vision). Devuelve la URL esperada.
- **Fidelidad del trazado:** se reconstruyó la matriz a partir del `path` del SVG
  y se comparó módulo por módulo con la que produce el codificador. Coinciden, y
  la zona de silencio quedó limpia.
- **Sintaxis:** el HTML quedó con las etiquetas balanceadas y el JS parsea sin
  errores.
- **Carga en navegador:** servida en local, todos los recursos responden 200
  (HTML, CSS, JS, SVG y el GIF de la página).

## Ver la página en local

```bash
python3 -m http.server 8027 --bind 127.0.0.1
```

Luego abrir <http://127.0.0.1:8027/index27.html>.

> Ojo: el QR apunta a la URL publicada, no a `localhost`. Si se escanea desde la
> vista previa local, lleva a la página en GitHub Pages.
