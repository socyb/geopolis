/* ==========================================================================
   Geopolítica Internacional · FCA UNAM · Grupo 1541 · Semestre 2027-1
   ========================================================================== */
(() => {
  "use strict";

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ── Tema claro / oscuro ────────────────────────────────────────────── */
  const root = document.documentElement;
  const themeBtn = $("#themeToggle");
  const stored = localStorage.getItem("geopolis27-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    if (themeBtn) {
      themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
      themeBtn.setAttribute("aria-label", theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
    }
  };
  applyTheme(stored || (prefersDark ? "dark" : "light"));

  themeBtn?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("geopolis27-theme", next);
    applyTheme(next);
  });

  $("#printBtn")?.addEventListener("click", () => window.print());

  /* ── Aviso flotante ─────────────────────────────────────────────────── */
  const toast = $("#toast");
  let toastTimer;
  const say = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-on"), 2600);
  };

  /* ── Calendario del curso ───────────────────────────────────────────── */
  // Martes en A-004 y jueves en F-101. El 15 de septiembre es de asueto.
  const sessions = [
    [ 1,"2026-08-18","A-004","Mesa de brújulas","Nos conocemos · desde dónde miramos el mundo","I"],
    [ 2,"2026-08-20","F-101","Geopolítica clásica y crítica","Escalas · posición · representación","I"],
    [ 3,"2026-08-25","A-004","Actores, poder y marcos","Estados · empresas · redes","I"],
    [ 4,"2026-08-27","F-101","La era del imperio","Orden territorial · comercio","II"],
    [ 5,"2026-09-01","A-004","El Canal de Panamá","Infraestructura · soberanía","II"],
    [ 6,"2026-09-03","F-101","La época de la guerra total","Movilización · industria · frontera","II"],
    [ 7,"2026-09-08","A-004","Diagnóstico del sistema mundial","Policrisis · escenarios","III"],
    [ 8,"2026-09-10","F-101","Interdependencia armamentizada","Redes · coerción económica","III"],
    [ 9,"2026-09-17","F-101","Estados Unidos y China","Competencia · desacoplamiento","III"],
    [10,"2026-09-22","A-004","La guerra de los chips","Tecnología · cuellos de botella","III"],
    [11,"2026-09-24","F-101","Fragmentación geoeconómica","Bloques · comercio · inversión","III"],
    [12,"2026-09-29","A-004","Mapa regional y primer parcial","Integración · síntesis","IV"],
    [13,"2026-10-01","F-101","Nord Stream y seguridad energética","Infraestructura · dependencia","IV"],
    [14,"2026-10-06","A-004","Minerales críticos","Transición energética · negociación","IV"],
    [15,"2026-10-08","F-101","Cuellos de botella marítimos","Panamá · Suez · Mar Rojo","IV"],
    [16,"2026-10-13","A-004","Apple, China y poder estructural","Cadenas globales de valor","IV"],
    [17,"2026-10-15","F-101","IA y cadenas de suministro","Datos · trabajo · infraestructura","V"],
    [18,"2026-10-20","A-004","Pregunta de investigación","Equipos · problema · evidencia","V"],
    [19,"2026-10-22","F-101","El policy memo","Argumento · audiencia · decisión","V"],
    [20,"2026-10-27","A-004","Nearshoring en México","Localización · productividad","V"],
    [21,"2026-10-29","F-101","Estrategias de empresas multinacionales","Adaptación · influencia · salida","V"],
    [22,"2026-11-03","A-004","Matriz de riesgo geopolítico","Probabilidad · impacto · respuesta","V"],
    [23,"2026-11-05","F-101","Sala de consejo","Simulación · decisión bajo presión","V"],
    [24,"2026-11-10","A-004","La Franja y la Ruta","Infraestructura · financiamiento","V"],
    [25,"2026-11-12","F-101","China y América Latina","Comercio · dependencia · agencia","V"],
    [26,"2026-11-17","A-004","Clínica de evidencia y segundo parcial","Contraste · revisión entre pares","VI"],
    [27,"2026-11-19","F-101","México en América del Norte","T-MEC · autonomía · vulnerabilidad","VI"],
    [28,"2026-11-24","A-004","México entre Estados Unidos y China","Automotriz · chips · inversión","VI"],
    [29,"2026-11-26","F-101","Corredores y posición de México","Istmo · frontera · logística","VI"],
    [30,"2026-12-01","A-004","Integración final","Presentaciones · examen final","VI"],
    [31,"2026-12-03","F-101","Cierre del semestre","Retroalimentación · recuperación","VI"]
  ].map(([number, date, room, title, subtitle, unit]) => ({ number, date, room, title, subtitle, unit }));

  const MONTHS = { "01":"ene","02":"feb","03":"mar","04":"abr","05":"may","06":"jun",
                   "07":"jul","08":"ago","09":"sep","10":"oct","11":"nov","12":"dic" };

  const queryDate = new URLSearchParams(location.search).get("fecha");
  const localDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City", year: "numeric", month: "2-digit", day: "2-digit"
  }).format(new Date());
  const today = /^\d{4}-\d{2}-\d{2}$/.test(queryDate || "") ? queryDate : localDate;
  const cursor = today < sessions[0].date ? sessions[0].date : today;

  const unlocked = sessions.filter(s => s.date <= cursor);
  const current  = unlocked[unlocked.length - 1] || sessions[0];
  const [y, m, d] = cursor.split("-");
  const pad = n => String(n).padStart(2, "0");

  const dateEl = $("#todayDate");
  if (dateEl) dateEl.textContent = `${Number(d)} ${MONTHS[m]} ${y}`;

  const activeEl = $("#activeSession");
  if (activeEl) activeEl.textContent = `${pad(current.number)} · ${current.title}`;

  const countEl = $("#sessionCount");
  if (countEl) countEl.textContent = `${pad(unlocked.length)} / ${sessions.length}`;

  const list = $("#archiveList");
  if (list) {
    list.replaceChildren(...[...unlocked].reverse().map(s => {
      const item = document.createElement("article");
      item.className = "archive-item" + (s.number === current.number ? " is-current" : "");
      item.innerHTML =
        `<span class="ai-num">${pad(s.number)}</span>` +
        `<time datetime="${s.date}">${Number(s.date.slice(8))} ${MONTHS[s.date.slice(5, 7)]}</time>` +
        `<span class="ai-body"><strong></strong><small></small></span>` +
        `<span class="ai-tag">${s.number === current.number ? "Hoy" : "Unidad " + s.unit}</span>`;
      item.querySelector("strong").textContent = s.title;
      item.querySelector("small").textContent  = `${s.subtitle} · ${s.room}`;
      return item;
    }));
  }

  /* ── Brújula interactiva ────────────────────────────────────────────── */
  const POINTS = {
    n: {
      label: "Norte · Identidad", accent: "var(--guinda)", tint: "var(--tint-red)",
      question: "¿Cómo te llamas y qué estudias?",
      hint: "Tu nombre, tu carrera y el semestre en el que vas. Si ya trabajas o haces prácticas, cuéntalo: eso también orienta tu mirada.",
      examples: ["nombre", "carrera", "semestre", "trabajo o prácticas"]
    },
    e: {
      label: "Este · Interés", accent: "var(--cobalt)", tint: "var(--tint-blue)",
      question: "¿Qué tema geopolítico te interesa hoy y por qué?",
      hint: "Elige uno solo, el que de verdad te da curiosidad, coraje o preocupación. El «por qué» importa más que el tema.",
      examples: ["aranceles", "migración", "chips", "energía", "agua", "IA", "crimen organizado", "minerales críticos"]
    },
    s: {
      label: "Sur · Territorio", accent: "var(--teal)", tint: "var(--tint-teal)",
      question: "¿Qué región o país sigues más?",
      hint: "Puede ser por familia, por trabajo, por un viaje o por pura fascinación. Vale también una región de México.",
      examples: ["China", "Estados Unidos", "Unión Europea", "Medio Oriente", "Sudamérica", "África", "el sur de México"]
    },
    w: {
      label: "Oeste · Mirada", accent: "var(--amber)", tint: "var(--tint-amber)",
      question: "¿De dónde sacas lo que sabes del mundo?",
      hint: "Tus fuentes y también tu tiempo libre: series, libros, música, deportes, videojuegos. Todo eso arma el lente con el que miras.",
      examples: ["TikTok", "YouTube", "pódcast", "prensa", "X", "clases", "familia", "videojuegos"]
    },
    c: {
      label: "Centro · Rumbo", accent: "var(--plum)", tint: "var(--tint-plum)",
      question: "¿Qué te gustaría poder hacer mejor al final del curso?",
      hint: "Una habilidad concreta. Es la que vamos a entrenar contigo durante el semestre, así que vale la pena pensarla bien.",
      examples: ["argumentar", "escribir un memo", "leer noticias con criterio", "detectar sesgos", "sustentar una decisión"]
    }
  };

  const buttons  = $$(".compass-pt, .compass-hub");
  const detail   = $("#compassDetail");
  const cdKicker = $("#cdKicker");
  const cdQ      = $("#cdQuestion");
  const cdHint   = $("#cdHint");
  const cdEg     = $("#cdExamples");

  const showPoint = (key) => {
    const data = POINTS[key];
    if (!data || !detail) return;

    buttons.forEach(btn => {
      const on = btn.dataset.point === key;
      btn.setAttribute("aria-pressed", String(on));
      btn.style.setProperty("--accent", POINTS[btn.dataset.point]?.accent || "");
      btn.style.setProperty("--accent-tint", POINTS[btn.dataset.point]?.tint || "");
    });

    detail.style.setProperty("--accent", data.accent);
    cdKicker.textContent = data.label;
    cdKicker.style.color = data.accent;
    cdQ.textContent = data.question;
    cdHint.textContent = data.hint;
    cdEg.replaceChildren(...data.examples.map(text => {
      const li = document.createElement("li");
      li.textContent = text;
      return li;
    }));
  };

  buttons.forEach(btn => btn.addEventListener("click", () => showPoint(btn.dataset.point)));
  if (buttons.length) showPoint("n");

  /* ── Constructor de brújula ─────────────────────────────────────────── */
  const FIELDS = [
    { input: "#fName",     out: "#bcName",     key: "name",     copy: "Nombre" },
    { input: "#fInterest", out: "#bcInterest", key: "interest", copy: "Interés (E)" },
    { input: "#fRegion",   out: "#bcRegion",   key: "region",   copy: "Territorio (S)" },
    { input: "#fLens",     out: "#bcLens",     key: "lens",     copy: "Mirada (O)" },
    { input: "#fGoal",     out: "#bcGoal",     key: "goal",     copy: "Rumbo (centro)" },
    { input: "#fNews",     out: "#bcNews",     key: "news",     copy: "Noticia" }
  ];
  const STORE = "geopolis27-brujula";
  const form = $("#builderForm");

  if (form) {
    const render = () => {
      const saved = {};
      FIELDS.forEach(f => {
        const input = $(f.input);
        const out = $(f.out);
        const value = (input?.value || "").trim();
        saved[f.key] = value;
        if (out) out.textContent = value;
      });
      localStorage.setItem(STORE, JSON.stringify(saved));
    };

    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || "{}");
      FIELDS.forEach(f => { const el = $(f.input); if (el && saved[f.key]) el.value = saved[f.key]; });
    } catch { /* almacenamiento no disponible */ }
    render();

    form.addEventListener("input", render);
    form.addEventListener("submit", e => e.preventDefault());

    $("#copyBtn")?.addEventListener("click", async () => {
      const lines = ["MI BRÚJULA GEOPOLÍTICA", "Geopolítica Internacional · FCA UNAM · Grupo 1541 · 2027-1", ""];
      FIELDS.forEach(f => {
        const value = ($(f.input)?.value || "").trim();
        if (value) lines.push(`${f.copy}: ${value}`);
      });

      if (lines.length === 3) { say("Escribe algo primero 🧭"); return; }

      const text = lines.join("\n");
      try {
        await navigator.clipboard.writeText(text);
        say("Brújula copiada ✓");
      } catch {
        const helper = document.createElement("textarea");
        helper.value = text;
        helper.setAttribute("readonly", "");
        helper.style.cssText = "position:fixed;top:-1000px";
        document.body.appendChild(helper);
        helper.select();
        try { document.execCommand("copy"); say("Brújula copiada ✓"); }
        catch { say("No se pudo copiar en este navegador"); }
        helper.remove();
      }
    });

    $("#printCardBtn")?.addEventListener("click", () => {
      root.classList.add("print-card");
      window.print();
      setTimeout(() => root.classList.remove("print-card"), 400);
    });

    $("#clearBtn")?.addEventListener("click", () => {
      FIELDS.forEach(f => { const el = $(f.input); if (el) el.value = ""; });
      render();
      say("Brújula en blanco");
      $("#fName")?.focus();
    });
  }
})();
