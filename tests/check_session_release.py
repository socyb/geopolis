"""Prueba la apertura de la sesión 16 con Chromium y un reloj controlado.

Preparación: python3 -m pip install playwright; python3 -m playwright install chromium
Uso: python3 tests/check_session_release.py [--chrome /ruta/al/ejecutable]
No modifica datos del navegador del usuario ni necesita servicios externos.
"""

import argparse
from datetime import datetime
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import sync_playwright


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--chrome", help="Chromium/Chrome ya instalado (opcional)")
    args = parser.parse_args()
    repo = Path(__file__).resolve().parents[1]
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=str(repo)))
    Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_port}/"
    errors, missing = [], []
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True, executable_path=args.chrome)

            def open_page(at, path="index27.html", zone="America/Mexico_City", width=1440):
                ctx = browser.new_context(
                    timezone_id=zone, viewport={"width": width, "height": 900},
                    reduced_motion="reduce", color_scheme="light",
                )
                # La prueba depende solo de los archivos del repositorio.
                ctx.route("**/*", lambda route: route.continue_()
                          if route.request.url.startswith(base)
                          else route.fulfill(status=200, body=""))
                page = ctx.new_page()
                page.on("pageerror", lambda error: errors.append(str(error)))
                page.on("response", lambda response: missing.append(response.url)
                        if response.url.startswith(base) and response.status >= 400 else None)
                time = datetime.fromisoformat(at)
                page.clock.install(time=time)
                page.clock.pause_at(time)
                page.goto(base + path, wait_until="networkidle")
                return ctx, page

            def check_home(page, number):
                version = page.locator(f'.s-version[data-sesion="{number}"]')
                other = 16 if number == 15 else 15
                assert version.is_visible()
                assert not page.locator(f'.s-version[data-sesion="{other}"]').is_visible()
                assert page.locator("#activeSession").inner_text().startswith(f"{number:02d} ·")
                assert page.locator("#sessionCount").inner_text() == f"{number} / 30"
                assert page.locator("#sesion-actual").count() == 1
                assert version.locator("#sesion-actual").count() == 1
                assert page.locator(".rail-item.is-current").get_attribute("href") == "#sesion-actual"
                assert page.locator(f'.topnav [data-sesion="{number}"]:not([hidden])').count() > 0
                assert page.locator(f'.topnav [data-sesion="{other}"]:not([hidden])').count() == 0
                assert page.locator(f'.cta-row [data-sesion="{number}"]').is_visible()
                assert page.locator(f'.nowbar [data-sesion="{number}"]').is_visible()
                assert page.locator(f'footer [data-sesion="{number}"]').is_visible()
                assert page.evaluate("""() => {
                    const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
                    return ids.length === new Set(ids).size;
                }""")

            for at, expected in [
                ("2026-10-12T18:00:00-06:00", 15),
                ("2026-10-13T09:00:00-06:00", 15),
                ("2026-10-15T06:59:59.900-06:00", 15),
                ("2026-10-15T07:00:00-06:00", 16),
                ("2026-10-16T09:00:00-06:00", 16),
            ]:
                ctx, page = open_page(at)
                check_home(page, expected)
                ctx.close()
                print("OK horario", at, expected)

            for query, expected in [
                ("2026-10-13", 15), ("2026-10-15T06:59", 15),
                ("2026-10-15T07:00", 16), ("2026-10-15", 16),
                ("invalida", 15), ("2026-10-15T99:00", 15), ("2026-02-30", 15),
            ]:
                ctx, page = open_page("2026-10-12T18:00:00-06:00", f"?fecha={query}#sesion-actual")
                check_home(page, expected)
                assert page.url.endswith("#sesion-actual")
                ctx.close()
            print("OK vistas previas y redirección del index")

            for zone in ["UTC", "Asia/Tokyo", "America/Los_Angeles"]:
                for at, expected in [("2026-10-15T12:59:59+00:00", 15),
                                     ("2026-10-15T13:00:00+00:00", 16)]:
                    ctx, page = open_page(at, zone=zone)
                    check_home(page, expected)
                    ctx.close()
            print("OK hora de Ciudad de México desde otras zonas")

            for start in ["2026-10-15T06:59:59.500-06:00", "2026-10-12T18:00:00-06:00"]:
                ctx, page = open_page(start)
                check_home(page, 15)
                until = int((datetime.fromisoformat("2026-10-15T07:00:00-06:00")
                             - datetime.fromisoformat(start)).total_seconds() * 1000)
                page.clock.fast_forward(until - 1)
                check_home(page, 15)
                with page.expect_navigation(wait_until="networkidle"):
                    page.clock.fast_forward(1)
                check_home(page, 16)
                ctx.close()
            print("OK recarga exacta, incluso con pestaña abierta desde el lunes")

            ctx, page = open_page("2026-10-12T18:00:00-06:00")
            page.clock.set_system_time(datetime.fromisoformat("2026-10-15T07:05:00-06:00"))
            with page.expect_navigation(wait_until="networkidle"):
                page.evaluate("window.dispatchEvent(new Event('focus'))")
            check_home(page, 16)
            ctx.close()
            print("OK al volver a una pestaña suspendida")

            for page_path, number in [
                ("sesiones/s13-la-armamentizacion-de-los-chips.html", 13),
                ("sesiones/s15-apple-china-y-poder-estructural.html", 15),
            ]:
                for at, active in [("2026-10-13T09:00:00-06:00", 15),
                                   ("2026-10-15T07:00:00-06:00", 16)]:
                    ctx, page = open_page(at, page_path)
                    assert page.locator(".rail-item.is-here .rail-num").inner_text() == str(number)
                    if number != active:
                        assert page.locator(".rail-item.is-current").get_attribute("href") == "../index27.html#sesion-actual"
                    if number == 13:
                        assert page.locator(".arch-nav a").last.get_attribute("href") == "s15-apple-china-y-poder-estructural.html"
                    ctx.close()
            print("OK versiones archivadas y navegación")

            for width in [375, 768, 1440]:
                for number, query in [(15, "2026-10-13"), (16, "2026-10-15T07:00")]:
                    ctx, page = open_page("2026-10-12T18:00:00-06:00", f"index27.html?fecha={query}", width=width)
                    check_home(page, number)
                    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), (number, width)
                    page.locator("#themeToggle").click()
                    assert page.locator("html").get_attribute("data-theme") == "dark"
                    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), (number, width, "dark")
                    page.emulate_media(media="print")
                    assert not page.locator(f'.s-version[data-sesion="{31-number}"]').is_visible()
                    ctx.close()
            print("OK escritorio, móvil, tema oscuro e impresión de la versión vigente")

            ctx, page = open_page("2026-10-13T09:00:00-06:00")
            page.locator("#pName").fill("Prueba del martes")
            page.locator(".pz").first.locator('[data-k="tipo"]').first.click()
            page.locator(".pz").first.locator('[data-k="estr"]').first.click()
            assert "1 de" in page.locator("[data-poder-score]").inner_text()
            page.locator("#deckNext").click()
            page.locator('[data-net] .nd[data-id="apple"]').click()
            assert page.locator("#actor-apple").is_visible()
            page.goto(base + "index27.html?fecha=2026-10-15T07:00", wait_until="networkidle")
            page.locator("#fTeam").fill("Prueba del jueves")
            page.locator(".terr-pick").first.click()
            page.locator("#fQ1").fill("¿Cómo cambia una decisión de negocios?")
            assert page.locator("#bQ").inner_text() == "¿Cómo cambia una decisión de negocios?"
            assert page.locator("#fTerr").input_value()
            page.locator(".qflip .flip").first.click()
            assert "is-flipped" in page.locator(".qflip .flip").first.get_attribute("class")
            page.locator("#clockGo").click()
            page.clock.fast_forward(2000)
            assert page.locator("#clockTime").inner_text() == "09:58"
            page.locator("#clockGo").click()
            page.clock.fast_forward(2000)
            assert page.locator("#clockTime").inner_text() == "09:58"
            page.locator("#clockNext").click()
            assert page.locator("#clockTime").inner_text() == "12:00"
            page.reload(wait_until="networkidle")
            assert page.locator("#fTeam").input_value() == "Prueba del jueves"
            page.goto(base + "sesiones/s15-apple-china-y-poder-estructural.html", wait_until="networkidle")
            assert page.locator("#pName").input_value() == "Prueba del martes"
            ctx.close()
            print("OK actividades de ambas sesiones, reloj y persistencia independiente")
            browser.close()
        assert not errors, errors
        assert not missing, missing
        print("OK sin errores JavaScript ni recursos locales faltantes")
    finally:
        server.shutdown()
        server.server_close()


if __name__ == "__main__":
    main()
