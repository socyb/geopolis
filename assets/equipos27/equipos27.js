/* Bitácora de los equipos · búsqueda de tripulantes e impresión completa */
(() => {
  "use strict";

  const fold = (s) => s.normalize("NFC").toLowerCase().replace(/ñ/g, "n~")
    .normalize("NFD").replace(/[̀-ͯ]/g, "");

  const input = document.getElementById("rosterQ");
  const items = [...document.querySelectorAll("#roster li")];
  const count = document.getElementById("rosterCount");

  input?.addEventListener("input", () => {
    const words = fold(input.value).split(/\s+/).filter(Boolean);
    let shown = 0;
    items.forEach((li) => {
      const hit = words.every((w) => li.dataset.q.includes(w));
      li.hidden = !hit;
      if (hit) shown++;
    });
    count.textContent = shown === 1 ? "1 tripulante" : `${shown} tripulantes`;
  });

  // Al imprimir, las listas de fuentes salen desplegadas.
  const folds = [...document.querySelectorAll("details.srcs")];
  let wasOpen = [];
  window.addEventListener("beforeprint", () => {
    wasOpen = folds.map((d) => d.open);
    folds.forEach((d) => { d.open = true; });
  });
  window.addEventListener("afterprint", () => {
    folds.forEach((d, i) => { d.open = wasOpen[i]; });
  });

  // Si llegas con el ancla de un equipo, sus fuentes se abren.
  const openTarget = () => {
    const card = location.hash && document.querySelector(`${location.hash}.crewcard`);
    card?.querySelector("details.srcs")?.setAttribute("open", "");
  };
  window.addEventListener("hashchange", openTarget);
  openTarget();
})();
