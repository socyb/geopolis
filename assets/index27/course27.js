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

  /* ── Código QR de la página ─────────────────────────────────────────── */
  const qrModal = $("#qrModal");
  if (qrModal) {
    $("#qrBtn")?.addEventListener("click", () => qrModal.showModal());

    // Un clic fuera del recuadro también cierra el marco emergente.
    qrModal.addEventListener("click", (e) => {
      const box = qrModal.getBoundingClientRect();
      const outside =
        e.clientX < box.left || e.clientX > box.right ||
        e.clientY < box.top  || e.clientY > box.bottom;
      if (outside) qrModal.close();
    });

    // El aviso flotante queda debajo del <dialog>, así que confirmamos en el propio botón.
    const copyBtn = $("#qrCopyBtn");
    let copyTimer;
    copyBtn?.addEventListener("click", async () => {
      const url = $("#qrUrl")?.textContent.trim() || location.href;
      let message;
      try {
        await navigator.clipboard.writeText(url);
        message = "Liga copiada ✓";
      } catch {
        message = "No se pudo copiar";
      }
      copyBtn.textContent = message;
      clearTimeout(copyTimer);
      copyTimer = setTimeout(() => { copyBtn.textContent = "Copiar liga"; }, 2000);
    });
  }

  /* ── Calendario del curso ───────────────────────────────────────────── */
  // Martes en A-004 y jueves en F-101.
  // Sin clase el 25 de agosto ni el 15 de septiembre (asueto): 30 sesiones.
  // «La era del imperio» ocupó dos sesiones (04 y 05), así que la unidad III
  // se recorre una sesión y las dos últimas del semestre se juntan el 3 de diciembre.
  // El Canal de Panamá dejó de ser sesión propia; se ve el 13 de octubre.
  // El séptimo campo, cuando existe, es la versión de la página que dejó esa sesión.
  const sessions = [
    [ 1,"2026-08-18","A-004","Mesa de brújulas","Nos conocemos · desde dónde miramos el mundo","I","sesiones/s01-mesa-de-brujulas.html"],
    [ 2,"2026-08-20","F-101","Geopolítica clásica y crítica","Escalas · posición · representación","I","sesiones/s02-geopolitica-critica.html"],
    [ 3,"2026-08-27","F-101","Geopolítica crítica y el poder de los mapas","Marcos · proyecciones · contracartografía","I","sesiones/s03-poder-de-los-mapas.html"],
    [ 4,"2026-09-01","A-004","La era del imperio","Hobsbawm · orden territorial · comercio","II","sesiones/s04-la-era-del-imperio.html"],
    [ 5,"2026-09-03","F-101","La era del imperio (II)","Documental · conquista formal e imperio informal","II","#sesion-actual"],
    [ 6,"2026-09-08","A-004","La época de la guerra total","Movilización · industria · frontera","II"],
    [ 7,"2026-09-10","F-101","Diagnóstico del sistema mundial","Policrisis · escenarios","III"],
    [ 8,"2026-09-17","F-101","Interdependencia armamentizada","Redes · coerción económica","III"],
    [ 9,"2026-09-22","A-004","Estados Unidos y China","Competencia · desacoplamiento","III"],
    [10,"2026-09-24","F-101","La guerra de los chips","Tecnología · cuellos de botella","III"],
    [11,"2026-09-29","A-004","Fragmentación geoeconómica","Bloques · comercio · inversión","III"],
    [12,"2026-10-01","F-101","Mapa regional y primer parcial","Integración · síntesis","IV"],
    [13,"2026-10-06","A-004","Nord Stream y seguridad energética","Infraestructura · dependencia","IV"],
    [14,"2026-10-08","F-101","Minerales críticos","Transición energética · negociación","IV"],
    [15,"2026-10-13","A-004","Cuellos de botella marítimos","Panamá · Suez · Mar Rojo","IV"],
    [16,"2026-10-15","F-101","Apple, China y poder estructural","Cadenas globales de valor","IV"],
    [17,"2026-10-20","A-004","IA y cadenas de suministro","Datos · trabajo · infraestructura","V"],
    [18,"2026-10-22","F-101","Pregunta de investigación","Equipos · problema · evidencia","V"],
    [19,"2026-10-27","A-004","El policy memo","Argumento · audiencia · decisión","V"],
    [20,"2026-10-29","F-101","Nearshoring en México","Localización · productividad","V"],
    [21,"2026-11-03","A-004","Estrategias de empresas multinacionales","Adaptación · influencia · salida","V"],
    [22,"2026-11-05","F-101","Matriz de riesgo geopolítico","Probabilidad · impacto · respuesta","V"],
    [23,"2026-11-10","A-004","Sala de consejo","Simulación · decisión bajo presión","V"],
    [24,"2026-11-12","F-101","La Franja y la Ruta","Infraestructura · financiamiento","V"],
    [25,"2026-11-17","A-004","China y América Latina","Comercio · dependencia · agencia","V"],
    [26,"2026-11-19","F-101","Clínica de evidencia y segundo parcial","Contraste · revisión entre pares","VI"],
    [27,"2026-11-24","A-004","México en América del Norte","T-MEC · autonomía · vulnerabilidad","VI"],
    [28,"2026-11-26","F-101","México entre Estados Unidos y China","Automotriz · chips · inversión","VI"],
    [29,"2026-12-01","A-004","Corredores y posición de México","Istmo · frontera · logística","VI"],
    [30,"2026-12-03","F-101","Integración final y cierre","Presentaciones · examen final · retroalimentación","VI"]
  ].map(([number, date, room, title, subtitle, unit, href]) => ({ number, date, room, title, subtitle, unit, href }));

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

  /* ── Línea del tiempo de sesiones ───────────────────────────────────── */
  // Cada sesión que cambia el contenido de la página deja una versión fechada.
  // Las anteriores viven en sesiones/; la de hoy es esta misma página.
  // Solo se dibujan las sesiones que ya ocurrieron: el calendario que viene no se muestra.
  const line = $("#timeline");

  if (line) {
    const base = location.pathname.includes("/sesiones/") ? "../" : "";

    line.replaceChildren(...unlocked.map(s => {
      const isToday = s.number === current.number;
      const item = document.createElement("article");
      item.className = "tl-item" + (isToday ? " is-today" : "");

      const dot = document.createElement("span");
      dot.className = "tl-dot";
      dot.textContent = pad(s.number);

      const body = document.createElement("div");
      body.className = "tl-body";
      const when = document.createElement("span");
      when.className = "tl-date";
      when.textContent = `${Number(s.date.slice(8))} ${MONTHS[s.date.slice(5, 7)]} · ${s.room}`;
      const h3 = document.createElement("h3");
      h3.className = "tl-title";
      if (s.href) {
        const a = document.createElement("a");
        a.href = isToday ? s.href : base + s.href;
        a.textContent = s.title;
        h3.appendChild(a);
      } else {
        h3.textContent = s.title;
      }
      const sub = document.createElement("p");
      sub.className = "tl-sub";
      sub.textContent = s.subtitle;
      body.append(when, h3, sub);

      const side = document.createElement("div");
      side.className = "tl-side";
      const tag = document.createElement("span");
      tag.className = "tl-tag";
      tag.textContent = isToday ? "Versión de hoy" : "Unidad " + s.unit;
      side.appendChild(tag);
      if (s.href) {
        const a = document.createElement("a");
        a.className = "tl-link";
        a.href = isToday ? s.href : base + s.href;
        a.textContent = isToday ? "Ir a la sesión ↓" : "Ver esa versión ↗";
        side.appendChild(a);
      }

      item.append(dot, body, side);
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
  /* ── Diapositivas (citas de Hobsbawm) ───────────────────────────────── */
  const deck = $("#deck");
  if (deck) {
    const slides = $$(".slide", deck);
    const prev   = $("#deckPrev");
    const next   = $("#deckNext");
    const full   = $("#deckFull");
    const count  = $("#deckCount");
    const bar    = $("#deckBar");
    const jump   = $("#deckJump");
    const total  = slides.length;
    let at = 0;

    const pips = slides.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "deck-pip";
      b.setAttribute("aria-label", `Ir a la diapositiva ${i + 1} de ${total}`);
      b.addEventListener("click", () => go(i));
      jump?.appendChild(b);
      return b;
    });

    function go(i) {
      at = Math.max(0, Math.min(total - 1, i));
      slides.forEach((s, k) => {
        s.classList.toggle("is-on", k === at);
        s.setAttribute("aria-hidden", String(k !== at));
      });
      pips.forEach((p, k) => p.classList.toggle("is-on", k === at));
      if (count) count.textContent = `${pad(at + 1)} / ${pad(total)}`;
      if (bar) bar.style.width = `${((at + 1) / total) * 100}%`;
      if (prev) prev.disabled = at === 0;
      if (next) next.disabled = at === total - 1;
    }

    prev?.addEventListener("click", () => go(at - 1));
    next?.addEventListener("click", () => go(at + 1));

    full?.addEventListener("click", () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else deck.requestFullscreen?.().catch(() => say("Tu navegador no dejó abrir pantalla completa"));
    });
    document.addEventListener("fullscreenchange", () => {
      if (full) full.textContent = document.fullscreenElement ? "⤡ Salir" : "⤢ Pantalla completa";
    });

    // Las flechas solo mueven la presentación cuando el foco está en ella.
    deck.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); go(at + 1); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); go(at - 1); }
      else if (e.key === "Home") { e.preventDefault(); go(0); }
      else if (e.key === "End") { e.preventDefault(); go(total - 1); }
      else if (e.key.toLowerCase() === "f") { e.preventDefault(); full?.click(); }
    });

    // Deslizar con el dedo en el celular.
    let x0 = null;
    deck.addEventListener("touchstart", (e) => { x0 = e.changedTouches[0].clientX; }, { passive: true });
    deck.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 55) go(dx < 0 ? at + 1 : at - 1);
      x0 = null;
    }, { passive: true });

    deck.setAttribute("tabindex", "0");
    go(0);
  }
})();
