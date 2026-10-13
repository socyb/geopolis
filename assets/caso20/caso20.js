/* Preparación independiente: los borradores nunca salen del navegador. */
(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const PREFIX = "geopolis-caso20-";
  const PUBLIC_URL = "https://socyb.github.io/geopolis/metodo-del-caso-20oct26.html";
  const context = "Seminario de Negocios Internacionales III · FCA UNAM\nMartes 20 de octubre de 2026 · 16:00—18:00 (Ciudad de México)\nPlenaria: aula 3 de Método del Caso, tercer piso del edificio J";
  const read = key => {
    try {
      const data = JSON.parse(localStorage.getItem(PREFIX + key) || "{}");
      return data && typeof data === "object" && !Array.isArray(data) ? data : {};
    } catch { return {}; }
  };
  const save = (key, data) => {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(data)); return true; }
    catch { return false; }
  };
  let toastTimer;
  const say = message => {
    const toast = $("#caseToast");
    toast.textContent = message;
    toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-on"), 4200);
  };
  const copy = async text => {
    try { await navigator.clipboard.writeText(text); say("Texto copiado."); }
    catch {
      const dialog = document.createElement("dialog");
      dialog.className = "copy-dialog";
      const label = document.createElement("label");
      label.textContent = "Selecciona y copia el texto";
      const area = document.createElement("textarea");
      area.value = text;
      area.readOnly = true;
      area.rows = 10;
      label.append(area);
      const close = document.createElement("button");
      close.type = "button";
      close.className = "btn";
      close.textContent = "Cerrar";
      close.addEventListener("click", () => dialog.close());
      dialog.append(label, close);
      dialog.addEventListener("close", () => dialog.remove());
      document.body.append(dialog);
      dialog.showModal();
      area.select();
    }
  };
  const download = (text, name) => {
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const print = (title, text) => {
    const paper = $("#printDocument");
    const h1 = document.createElement("h1");
    h1.textContent = title;
    const body = document.createElement("div");
    body.className = "print-text";
    body.textContent = text;
    paper.replaceChildren(h1, body);
    paper.hidden = false;
    document.body.dataset.print = "document";
    window.print();
  };
  window.addEventListener("afterprint", () => {
    delete document.body.dataset.print;
    $("#printDocument").hidden = true;
  });

  /* Tema compartido con el curso; los datos de esta actividad son independientes. */
  const applyTheme = theme => {
    document.documentElement.dataset.theme = theme;
    $("#caseTheme").textContent = theme === "dark" ? "☀" : "◐";
    $("#caseTheme").setAttribute("aria-label", theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro");
  };
  let theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  try { theme = localStorage.getItem("geopolis27-theme") || theme; } catch { /* preferencia del sistema */ }
  applyTheme(theme === "dark" ? "dark" : "light");
  $("#caseTheme").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("geopolis27-theme", next); } catch { /* tema solo para esta visita */ }
  });

  /* Hoja individual: borrador, texto e impresión con el contenido completo. */
  const analysisForm = $("#analysisForm");
  const analysisFields = $$("[name]", analysisForm);
  const savedAnalysis = read("analysis-v1");
  analysisFields.forEach(field => {
    if (typeof savedAnalysis[field.name] === "string") field.value = savedAnalysis[field.name];
  });
  if ($("#aAction3").value || $("#aBalance3").value) $(".extra-alternative").open = true;
  analysisForm.addEventListener("submit", event => event.preventDefault());
  analysisForm.addEventListener("input", () => {
    const data = Object.fromEntries(analysisFields.map(field => [field.name, field.value]));
    $("#analysisSave").textContent = save("analysis-v1", data)
      ? "Borrador guardado en este navegador."
      : "No se pudo guardar aquí. Descarga tu análisis antes de cerrar.";
  });
  const analysisText = () => {
    const value = name => analysisForm.elements.namedItem(name).value.trim();
    return [
      "ANÁLISIS INDIVIDUAL · CONTENTRA", context,
      "Caso: Social Media Platforms: The Governance and Ethics Design of Content Moderation · SMU-25-0011", "",
      `Nombre: ${value("name") || "Sin indicar"}`, `Equipo: ${value("team") || "Por definir"}`, "",
      "1. HECHOS RELEVANTES Y EVIDENCIA", value("facts") || "Por escribir", "",
      "2. PROBLEMA CENTRAL O DILEMA", value("problem") || "Por escribir", "",
      "3. ALTERNATIVAS DE SOLUCIÓN",
      ...[1, 2, 3].flatMap((n, i) => {
        if (n === 3 && !value("action3") && !value("balance3")) return [];
        return [`\nAlternativa ${"ABC"[i]}`, value(`action${n}`) || "Por escribir",
          "Recursos, ventajas, desventajas y consecuencias:", value(`balance${n}`) || "Por escribir"];
      }), "", "POSTURA PROVISIONAL Y EVIDENCIA QUE PODRÍA CAMBIARLA (OPCIONAL)", value("position") || "Por discutir"
    ].join("\n");
  };
  $("#copyAnalysis").addEventListener("click", () => copy(analysisText()));
  $("#downloadAnalysis").addEventListener("click", () => download(analysisText(), "analisis-contentra-20oct26.txt"));
  $("#printAnalysis").addEventListener("click", () => print("Mi análisis del caso", analysisText()));

  /* Equipos: validación antes de modificar una distribución ya guardada. */
  const roster = $("#roster");
  const count = $("#teamCount");
  const modes = $$('input[name="teamMode"]');
  const mode = () => modes.find(input => input.checked).value;
  let teams = [];
  let generatedSignature = "";
  const signature = () => JSON.stringify([mode(), roster.value.trim(), mode() === "random" ? count.value : ""]);
  const isCurrent = () => teams.length >= 3 && signature() === generatedSignature;
  const exportButtons = [$("#copyTeams"), $("#downloadTeams"), $("#printTeams")];
  const message = (text, kind = "") => {
    $("#teamMessage").textContent = text;
    $("#teamMessage").className = "team-message" + (kind ? ` is-${kind}` : "");
  };
  const saveTeams = () => {
    if (!save("teams-v1", { mode: mode(), roster: roster.value, count: count.value, teams, generatedSignature })) {
      $("#teamsSave").textContent = "No se pudo guardar aquí. Descarga la distribución antes de cerrar.";
    }
  };
  const checkStale = () => {
    const stale = teams.length > 0 && !isCurrent();
    exportButtons.forEach(button => { button.disabled = !isCurrent(); });
    if (stale) message("La lista o el modo cambió. Genera de nuevo los equipos para actualizar esta distribución.", "stale");
    else if (teams.length) message("Distribución lista. Acuerden una vocería y anoten el aula cuando la coordinación la asigne.");
    else message("Agrega al menos tres personas y genera la distribución.");
  };
  const updateMode = () => {
    const manual = mode() === "manual";
    $("#teamCountField").hidden = manual;
    count.disabled = manual;
    $("#rosterLabel").textContent = manual ? "Equipos acordados · separa cada equipo con una línea vacía" : "Lista del grupo · un nombre por renglón";
    $("#rosterHelp").textContent = manual
      ? "Escribe solo nombres, uno por renglón. Una línea vacía inicia el siguiente equipo; no agregues encabezados."
      : "Usa nombres que permitan distinguir a cada persona. El sorteo reparte a todos en equipos de tamaños semejantes.";
    $("#makeTeams").textContent = manual ? "Registrar equipos" : teams.length ? "Volver a sortear" : "Sortear equipos";
  };
  const makeNode = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const renderTeams = () => {
    $("#teamEmpty").hidden = teams.length > 0;
    $("#teamSummary").textContent = teams.length
      ? `${teams.length} equipos · ${teams.reduce((total, team) => total + team.members.length, 0)} personas`
      : "Todavía no hay equipos";
    $("#teamResults").replaceChildren(...teams.map((team, i) => {
      const article = makeNode("article", "team-card");
      const head = makeNode("div", "team-card-head");
      head.append(makeNode("h3", "", `Equipo ${i + 1}`), makeNode("span", "", `${team.members.length} personas`));
      const list = document.createElement("ol");
      list.append(...team.members.map(name => makeNode("li", "", name)));
      article.append(head, list);
      [["speaker", "Vocería", "Por acordar"], ["room", "Aula del equipo", "La asigna coordinación"]].forEach(([key, label, placeholder]) => {
        const field = makeNode("div", "case-field");
        const name = makeNode("label", "", label);
        const input = document.createElement("input");
        input.id = `team-${i}-${key}`;
        name.htmlFor = input.id;
        input.value = team[key] || "";
        input.maxLength = 160;
        input.placeholder = placeholder;
        input.addEventListener("input", () => { team[key] = input.value; saveTeams(); });
        field.append(name, input);
        article.append(field);
      });
      return article;
    }));
    updateMode();
    checkStale();
  };
  const savedTeams = read("teams-v1");
  if (savedTeams.mode === "manual") modes.find(input => input.value === "manual").checked = true;
  if (typeof savedTeams.roster === "string") roster.value = savedTeams.roster;
  if (typeof savedTeams.count === "string") count.value = savedTeams.count;
  if (Array.isArray(savedTeams.teams) && savedTeams.teams.length >= 3 && savedTeams.teams.every(team =>
    team && Array.isArray(team.members) && team.members.length >= 1 && team.members.length <= 7
    && team.members.every(name => typeof name === "string" && name.trim()))) {
    teams = savedTeams.teams.map(team => ({ members: team.members, speaker: typeof team.speaker === "string" ? team.speaker : "", room: typeof team.room === "string" ? team.room : "" }));
    generatedSignature = typeof savedTeams.generatedSignature === "string" ? savedTeams.generatedSignature : "";
  }
  renderTeams();
  roster.addEventListener("input", () => { checkStale(); saveTeams(); });
  count.addEventListener("input", () => { checkStale(); saveTeams(); });
  modes.forEach(input => input.addEventListener("change", () => { updateMode(); checkStale(); saveTeams(); }));

  $("#teamsForm").addEventListener("submit", event => {
    event.preventDefault();
    const lines = text => text.split(/\r?\n/).map(name => name.trim()).filter(Boolean);
    const names = lines(roster.value);
    if (names.length < 3) { message("Se necesitan al menos tres personas para formar tres equipos.", "error"); return; }
    const seen = new Set();
    const duplicates = [];
    names.forEach(name => {
      const key = name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").toLocaleLowerCase("es");
      if (seen.has(key)) duplicates.push(name);
      seen.add(key);
    });
    if (duplicates.length) { message(`Hay nombres repetidos: ${[...new Set(duplicates)].join(", ")}. Agrega apellidos o iniciales para distinguirlos.`, "error"); return; }
    let groups;
    if (mode() === "manual") {
      groups = roster.value.trim().split(/\r?\n\s*\r?\n/).map(lines).filter(group => group.length);
      if (groups.length < 3 || groups.some(group => group.length > 7)) {
        message("Registra al menos tres equipos y no más de siete integrantes por equipo. Separa los equipos con una línea vacía.", "error"); return;
      }
    } else {
      const minimum = Math.max(3, Math.ceil(names.length / 7));
      const total = count.value.trim() ? Number(count.value) : minimum;
      if (!Number.isInteger(total) || total < minimum || total > names.length) {
        message(`Con ${names.length} personas, elige entre ${minimum} y ${names.length} equipos. Así ninguno queda vacío ni supera siete integrantes.`, "error"); return;
      }
      const pool = names.slice();
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      groups = Array.from({ length: total }, () => []);
      pool.forEach((name, i) => groups[i % total].push(name));
    }
    teams = groups.map(members => ({ members, speaker: "", room: "" }));
    generatedSignature = signature();
    renderTeams();
    saveTeams();
  });
  const teamsText = () => ["EQUIPOS · MÉTODO DEL CASO · CONTENTRA", context, "",
    ...teams.flatMap((team, i) => [`EQUIPO ${i + 1} · ${team.members.length} personas`,
      ...team.members.map((name, j) => `${j + 1}. ${name}`), `Vocería: ${team.speaker.trim() || "Por acordar"}`,
      `Aula del equipo: ${team.room.trim() || "Pendiente de asignación por coordinación"}`, ""]),
    "Lleva el caso y tu análisis individual. Confirma con el profesor el punto de reunión.", PUBLIC_URL].join("\n");
  $("#copyTeams").addEventListener("click", () => { if (isCurrent()) copy(teamsText()); });
  $("#downloadTeams").addEventListener("click", () => { if (isCurrent()) download(teamsText(), "equipos-contentra-20oct26.txt"); });
  $("#printTeams").addEventListener("click", () => { if (isCurrent()) print("Equipos para el caso", teamsText()); });

  /* Reloj: usa tiempo transcurrido real, incluso en segundo plano. */
  let duration = 20 * 60, remaining = duration, endsAt = 0, interval = null;
  const displayTime = () => {
    const seconds = Math.max(0, Math.ceil(remaining));
    $("#timerDisplay").textContent = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  };
  const tick = () => {
    remaining = Math.max(0, (endsAt - Date.now()) / 1000);
    displayTime();
    if (!remaining) {
      clearInterval(interval); interval = null;
      $("#caseTimer").classList.add("is-done");
      $("#timerState").textContent = "Tiempo cumplido. Reúnanse con el profesor.";
      $("#timerToggle").textContent = "Volver a iniciar";
    }
  };
  const resetTimer = seconds => {
    clearInterval(interval); interval = null;
    duration = remaining = seconds;
    $("#caseTimer").classList.remove("is-done");
    $("#timerState").textContent = "Listo para comenzar";
    $("#timerToggle").textContent = "Iniciar";
    $$("[data-minutes]").forEach(button => button.setAttribute("aria-pressed", String(Number(button.dataset.minutes) * 60 === duration)));
    displayTime();
  };
  $("#timerToggle").addEventListener("click", () => {
    if (interval) {
      tick(); clearInterval(interval); interval = null;
      if (remaining > 0) { $("#timerState").textContent = "En pausa"; $("#timerToggle").textContent = "Continuar"; }
    } else {
      if (remaining <= 0) remaining = duration;
      endsAt = Date.now() + remaining * 1000;
      interval = setInterval(tick, 250);
      $("#caseTimer").classList.remove("is-done");
      $("#timerState").textContent = "Discusión en curso";
      $("#timerToggle").textContent = "Pausar";
    }
  });
  $("#timerReset").addEventListener("click", () => resetTimer(duration));
  $$("[data-minutes]").forEach(button => button.addEventListener("click", () => resetTimer(Number(button.dataset.minutes) * 60)));
  document.addEventListener("visibilitychange", () => { if (!document.hidden && interval) tick(); });

  const ready = read("ready-v1");
  const checks = $$("[data-ready]");
  const renderReady = () => {
    const done = checks.filter(input => input.checked).length;
    $("#readyProgress").value = done;
    $("#readyCount").textContent = `${done} de 4 listos`;
  };
  checks.forEach(input => {
    input.checked = ready[input.dataset.ready] === true;
    input.addEventListener("change", () => {
      save("ready-v1", Object.fromEntries(checks.map(item => [item.dataset.ready, item.checked])));
      renderReady();
    });
  });
  renderReady();
  $("#copyPage").addEventListener("click", () => copy(PUBLIC_URL));
})();
