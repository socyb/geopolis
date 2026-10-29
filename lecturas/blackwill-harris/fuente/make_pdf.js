// Uso: node make_pdf.js <entrada.html> <salida.pdf> [captura_pantalla.png]
const { chromium } = require('playwright');
(async () => {
  const [entrada, salida, captura] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('file://' + entrada, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  if (captura) await p.screenshot({ path: captura, fullPage: true });
  await p.emulateMedia({ media: 'print' });
  await p.pdf({ path: salida, preferCSSPageSize: true, printBackground: true });
  await b.close();
})();
