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
  // Martes en A-004; jueves en F-101 hasta el 1 de octubre y en A-101 desde el 15.
  // Sin clase el 25 de agosto ni el 15 de septiembre (asueto): 30 sesiones.
  // «La era del imperio» ocupó dos sesiones (04 y 05) y «La época de la guerra
  // total» otras dos (06 y 07), y «La globalización del peligro» (Dodds) otras dos
  // (08 y 09): la unidad II cierra el 22 de septiembre y la III empieza el 24
  // con Farrell y Newman
  // y las dos últimas sesiones del semestre se juntan el 3 de diciembre.
  // El Canal de Panamá dejó de ser sesión propia; se ve el 13 de octubre.
  // El 1 de octubre solo hubo primer parcial, y el 6 la unidad III se alarga una
  // sesión con la guerra de los chips (Rodríguez Urbina, actividad 7), en el lugar
  // que tenía Nord Stream: la unidad IV empieza el 8 de octubre.
  // El 8 de octubre no hay clase en el salón: vamos a la conferencia del COMEXI en
  // la Semana Académica. Apple, China y poder estructural (actividad 8) pasa al 13 y
  // cuellos de botella marítimos queda pendiente, igual que Nord Stream.
  // El 15 de octubre es el taller que arranca el trabajo final (del tema a la
  // pregunta de investigación), y minerales críticos pasa al 22.
  // El séptimo campo, cuando existe, es la versión de la página que dejó esa sesión.
  // El octavo, la hora a la que se abre una versión preparada con anticipación.
  const sessions = [
    [ 1,"2026-08-18","A-004","Mesa de brújulas","Nos conocemos · desde dónde miramos el mundo","I","sesiones/s01-mesa-de-brujulas.html"],
    [ 2,"2026-08-20","F-101","Geopolítica clásica y crítica","Escalas · posición · representación","I","sesiones/s02-geopolitica-critica.html"],
    [ 3,"2026-08-27","F-101","Geopolítica crítica y el poder de los mapas","Marcos · proyecciones · contracartografía","I","sesiones/s03-poder-de-los-mapas.html"],
    [ 4,"2026-09-01","A-004","La era del imperio","Hobsbawm · orden territorial · comercio","II","sesiones/s04-la-era-del-imperio.html"],
    [ 5,"2026-09-03","F-101","La era del imperio (II)","Documental · conquista formal e imperio informal","II","sesiones/s05-la-era-del-imperio-ii.html"],
    [ 6,"2026-09-08","A-004","La época de la guerra total","Movilización · industria · frontera","II"],
    [ 7,"2026-09-10","F-101","La época de la guerra total (II)","Documental · de la guerra total a la guerra fría","II","sesiones/s07-la-epoca-de-la-guerra-total-ii.html"],
    [ 8,"2026-09-17","F-101","La globalización del peligro","Dodds · quién dibuja las líneas · quién nombra la amenaza","II","sesiones/s08-la-globalizacion-del-peligro.html"],
    [ 9,"2026-09-22","A-004","La globalización del peligro (II)","Carrera nuclear · teoría de juegos · apartheid global","II"],
    [10,"2026-09-24","F-101","La economía convertida en arma","Farrell y Newman · cuellos de botella · coerción económica","III","sesiones/s10-la-economia-convertida-en-arma.html"],
    [11,"2026-09-29","A-004","Fragmentación geoeconómica","Bloques · comercio · inversión","III"],
    [12,"2026-10-01","F-101","Primer parcial","Ensayo argumentado · Dodds, Hobsbawm, Farrell y Newman","III"],
    [13,"2026-10-06","A-004","La armamentización de los chips","Rodríguez Urbina · litografía · Taiwán · 2023 contra 2026","III","sesiones/s13-la-armamentizacion-de-los-chips.html"],
    [14,"2026-10-08","Auditorio Pérez del Toro","Semana Académica: conferencia del COMEXI","Vanessa Zárate · Consejo Mexicano de Asuntos Internacionales","IV"],
    [15,"2026-10-13","A-004","Apple, China y poder estructural","McGee · cadenas globales de valor · actividad 8","IV","sesiones/s15-apple-china-y-poder-estructural.html"],
    [16,"2026-10-15","A-101","Del tema a la pregunta","Taller · equipos · pregunta de investigación","IV","#sesion-actual","07:00"],
    [17,"2026-10-20","A-004","IA y cadenas de suministro","Datos · trabajo · infraestructura","V"],
    [18,"2026-10-22","A-101","Minerales críticos","Transición energética · negociación","V"],
    [19,"2026-10-27","A-004","El policy memo","Argumento · audiencia · decisión","V"],
    [20,"2026-10-29","A-101","Nearshoring en México","Localización · productividad","V"],
    [21,"2026-11-03","A-004","Estrategias de empresas multinacionales","Adaptación · influencia · salida","V"],
    [22,"2026-11-05","A-101","Matriz de riesgo geopolítico","Probabilidad · impacto · respuesta","V"],
    [23,"2026-11-10","A-004","Sala de consejo","Simulación · decisión bajo presión","V"],
    [24,"2026-11-12","A-101","La Franja y la Ruta","Infraestructura · financiamiento","V"],
    [25,"2026-11-17","A-004","China y América Latina","Comercio · dependencia · agencia","V"],
    [26,"2026-11-19","A-101","Clínica de evidencia y segundo parcial","Contraste · revisión entre pares","VI"],
    [27,"2026-11-24","A-004","México en América del Norte","T-MEC · autonomía · vulnerabilidad","VI"],
    [28,"2026-11-26","A-101","México entre Estados Unidos y China","Automotriz · chips · inversión","VI"],
    [29,"2026-12-01","A-004","Corredores y posición de México","Istmo · frontera · logística","VI"],
    [30,"2026-12-03","A-101","Integración final y cierre","Presentaciones · examen final · retroalimentación","VI"]
  ].map(([number, date, room, title, subtitle, unit, href, opens]) => ({ number, date, room, title, subtitle, unit, href, opens }));

  const MONTHS = { "01":"ene","02":"feb","03":"mar","04":"abr","05":"may","06":"jun",
                   "07":"jul","08":"ago","09":"sep","10":"oct","11":"nov","12":"dic" };

  // ?fecha=AAAA-MM-DD fuerza un día (a mediodía); ?fecha=AAAA-MM-DDTHH:MM, también la hora.
  const queryDate = new URLSearchParams(location.search).get("fecha");
  const clockNow = Object.fromEntries(new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23"
  }).formatToParts(new Date()).map(p => [p.type, p.value]));
  const localNow = `${clockNow.year}-${clockNow.month}-${clockNow.day}T${clockNow.hour}:${clockNow.minute}`;
  const requestedNow = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(queryDate || "") ? queryDate
                     : /^\d{4}-\d{2}-\d{2}$/.test(queryDate || "") ? `${queryDate}T12:00` : null;
  // Ciudad de México usa UTC−06:00 durante este semestre. La vista previa usa
  // esa misma zona, aunque el dispositivo esté en otro país.
  const previewTime = requestedNow ? Date.parse(`${requestedNow}:00-06:00`) : NaN;
  const isPreview = Number.isFinite(previewTime)
    && new Date(previewTime - 6 * 3600e3).toISOString().slice(0, 16) === requestedNow;
  const now = isPreview ? requestedNow : localNow;
  const today = now.slice(0, 10);
  const cursor = today < sessions[0].date ? sessions[0].date : today;

  // La portada lleva la versión de una sesión concreta, y se publica la víspera:
  // esa sesión es la vigente aunque su fecha todavía no llegue. Con ?fecha= manda
  // el calendario, para poder recorrer el semestre día por día.
  let published = sessions.find(s => s.href === "#sesion-actual");

  // Una versión preparada con anticipación puede llevar hora de apertura (el
  // octavo campo). Hasta esa hora de su día sigue al frente la versión anterior,
  // que mientras tanto vuelve a ser el ancla de la portada.
  if (published?.opens && now < `${published.date}T${published.opens}`) {
    // Conserva segundos y milisegundos: una pestaña abierta desde el lunes
    // también cambia a las 07:00 del jueves. Al volver de suspensión se revisa
    // de nuevo, porque el navegador puede haber detenido sus temporizadores.
    if (!isPreview) {
      const opensAt = Date.parse(`${published.date}T${published.opens}:00-06:00`);
      let releaseTimer;
      const checkRelease = () => {
        clearTimeout(releaseTimer);
        const wait = opensAt - Date.now();
        if (wait <= 0) { location.reload(); return; }
        releaseTimer = setTimeout(checkRelease, Math.min(wait, 2147483647));
      };
      checkRelease();
      window.addEventListener("focus", checkRelease);
      window.addEventListener("pageshow", checkRelease);
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) checkRelease();
      });
    }
    const before = sessions.filter(s => s.number < published.number && s.href).pop();
    if (before) {
      published.href = undefined;
      before.href = "#sesion-actual";
      published = before;
    }
  }
  const byDate = sessions.filter(s => s.date <= cursor && (!s.opens || now >= `${s.date}T${s.opens}`));
  const current = (!isPreview && published) || byDate[byDate.length - 1] || sessions[0];
  const unlocked  = sessions.filter(s => (s.date <= cursor || s.number === current.number) && s.number <= current.number);

  /* ── Versiones de la portada ────────────────────────────────────────── */
  // Mientras una versión espera su hora, la portada lleva dos, cada una en un
  // .s-version con data-sesion. Se ve la de la sesión actual (o la última antes
  // de ella), y lo demás marcado con data-sesion —ligas del menú, botón de la
  // portada, «Trae contigo», fecha del pie— la sigue. El ancla #sesion-actual
  // pasa a la sección [data-ancla] de la versión que se ve.
  const tagged = $$("[data-sesion]");
  if (tagged.length) {
    const nums  = [...new Set(tagged.map(el => Number(el.dataset.sesion)))].sort((a, b) => a - b);
    const shown = nums.filter(n => n <= current.number).pop() ?? nums[0];
    tagged.forEach(el => { el.hidden = Number(el.dataset.sesion) !== shown; });
    $$(".s-version").forEach(v => {
      const anchor = $("[data-ancla]", v);
      if (anchor) anchor.id = Number(v.dataset.sesion) === shown ? "sesion-actual" : `sesion-${v.dataset.sesion}`;
    });
    if (location.hash === "#sesion-actual") $("#sesion-actual")?.scrollIntoView();
  }
  const [y, m, d] = cursor.split("-");
  const pad = n => String(n).padStart(2, "0");

  const dateEl = $("#todayDate");
  if (dateEl) dateEl.textContent = `${Number(d)} ${MONTHS[m]} ${y}`;

  const activeEl = $("#activeSession");
  if (activeEl) activeEl.textContent = `${pad(current.number)} · ${current.title}`;

  const countEl = $("#sessionCount");
  if (countEl) countEl.textContent = `${pad(unlocked.length)} / ${sessions.length}`;

  // Una sesión se abre igual desde la portada que desde una versión archivada:
  // las archivadas viven en sesiones/ y la vigente es un ancla de la portada.
  const inArchive = location.pathname.includes("/sesiones/");
  const hrefFor = s => !s.href ? null
    : s.href.startsWith("#") ? (inArchive ? "../index27.html" + s.href : s.href)
    : (inArchive ? "../" : "") + s.href;

  /* ── Riel de sesiones ───────────────────────────────────────────────── */
  // La tira bajo la portada: la sesión de hoy y todas las que ya pasaron, en orden.
  // Las que dejaron versión propia llevan liga; las demás se ven, pero no se abren.
  const track = $("#railTrack");

  if (track) {
    // En una versión archivada, data-here dice qué sesión se está viendo.
    const hereNumber = Number(track.dataset.here) || 0;

    track.replaceChildren(...unlocked.map(s => {
      const isToday = s.number === current.number;
      const isHere  = s.number === hereNumber;
      const link    = isHere ? null : hrefFor(s);
      const node = document.createElement(link ? "a" : "span");
      node.className = "rail-item"
        + (isToday ? " is-current" : "")
        + (isHere ? " is-here" : "")
        + (!s.href ? " is-off" : "");
      if (link) {
        node.href = link;
        if (isToday) node.setAttribute("aria-current", "true");
      }
      if (isHere) node.setAttribute("aria-current", "page");

      const num = document.createElement("span");
      num.className = "rail-num";
      num.textContent = pad(s.number);
      const when = document.createElement("span");
      when.className = "rail-date";
      when.textContent = `${Number(s.date.slice(8))} ${MONTHS[s.date.slice(5, 7)]}`;
      const name = document.createElement("span");
      name.className = "rail-title";
      name.textContent = s.title;

      node.append(num, when, name);
      if (isHere) {
        const you = document.createElement("span");
        you.className = "rail-you";
        you.textContent = "estás aquí";
        node.appendChild(you);
      }
      return node;
    }));

    // Deja la sesión de hoy a la vista sin mover el scroll de la página.
    const focusOn = $(".rail-item.is-here", track) || $(".rail-item.is-current", track);
    if (focusOn) track.scrollLeft = focusOn.offsetLeft - (track.clientWidth - focusOn.offsetWidth) / 2;
  }

  /* ── Línea del tiempo de sesiones ───────────────────────────────────── */
  // Cada sesión que cambia el contenido de la página deja una versión fechada.
  // Las anteriores viven en sesiones/; la de hoy es esta misma página.
  // Solo se dibujan las sesiones que ya ocurrieron: el calendario que viene no se muestra.
  const line = $("#timeline");

  if (line) {
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
        a.href = hrefFor(s);
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
        a.href = hrefFor(s);
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

  /* ── Hilos de la lectura: tarjetas que se voltean ───────────────────────── */
  const hilos = $$(".flip");
  if (hilos.length) {
    const fished = new Set();
    const counter = $("#hiloCount");
    // Cada sesión nombra sus tarjetas: hilos en la sesión 08, frases en la 10.
    const noun = $(".flipgrid")?.dataset.noun || "hilos";

    const tell = () => {
      if (!counter) return;
      const left = hilos.length - fished.size;
      counter.textContent = left === 0
        ? `Ya salieron ${hilos.length} de ${hilos.length} ${noun}`
        : `${left} de ${hilos.length} ${noun} sin salir`;
    };

    hilos.forEach(card => {
      card.addEventListener("click", () => {
        const open = card.classList.toggle("is-flipped");
        card.setAttribute("aria-pressed", String(open));
      });
    });

    $("#hiloPick")?.addEventListener("click", () => {
      const pool = hilos.filter(c => !fished.has(c));
      if (!pool.length) { say(`Ya no quedan ${noun} por salir`); return; }
      const pick = pool[Math.floor(Math.random() * pool.length)];
      fished.add(pick);
      hilos.forEach(c => c.classList.remove("is-picked"));
      pick.classList.add("is-picked");
      pick.scrollIntoView({ behavior: "smooth", block: "center" });
      pick.focus({ preventScroll: true });
      tell();
    });

    $("#hiloReset")?.addEventListener("click", () => {
      fished.clear();
      hilos.forEach(c => {
        c.classList.remove("is-picked", "is-flipped");
        c.setAttribute("aria-pressed", "false");
      });
      tell();
    });

    tell();
  }

  /* ── Clasificador: cada pieza a su paso de la cadena ────────────────── */
  // Cada .sort-item lleva data-answer; cada botón, data-pick. Se cuenta lo que
  // sale bien al primer intento, y la explicación aparece al acertar.
  $$("[data-sorter]").forEach(sorter => {
    const items = $$(".sort-item", sorter);
    const score = $(".sorter-score", sorter);
    const tally = () => {
      if (!score) return;
      const done  = items.filter(i => i.classList.contains("is-done")).length;
      const first = items.filter(i => i.dataset.first === "1").length;
      score.textContent = done === items.length
        ? `Listo: ${first} de ${items.length} al primer intento`
        : `${done} de ${items.length} colocadas · ${first} al primer intento`;
    };

    items.forEach(item => {
      const why = $(".sort-why", item);
      $$("[data-pick]", item).forEach(btn => btn.addEventListener("click", () => {
        if (item.classList.contains("is-done")) return;
        const right = btn.dataset.pick === item.dataset.answer;
        if (!item.dataset.tries) item.dataset.tries = "0";
        item.dataset.tries = String(Number(item.dataset.tries) + 1);
        btn.classList.add(right ? "is-right" : "is-wrong");
        btn.setAttribute("aria-pressed", "true");
        if (right) {
          item.classList.add("is-done");
          if (item.dataset.tries === "1") item.dataset.first = "1";
          $$("[data-pick]", item).forEach(b => { b.disabled = b !== btn; });
          if (why) why.hidden = false;
        } else {
          btn.disabled = true;
        }
        tally();
      }));
    });

    $("[data-sorter-reset]", sorter)?.addEventListener("click", () => {
      items.forEach(item => {
        item.classList.remove("is-done");
        delete item.dataset.tries;
        delete item.dataset.first;
        $$("[data-pick]", item).forEach(b => {
          b.disabled = false;
          b.classList.remove("is-right", "is-wrong");
          b.setAttribute("aria-pressed", "false");
        });
        const why = $(".sort-why", item);
        if (why) why.hidden = true;
      });
      tally();
    });

    tally();
  });

  /* ── Abrir o cerrar de un golpe todos los desplegables de una sección ── */
  $$("[data-open-all]").forEach(btn => {
    const scope = $(btn.dataset.openAll);
    if (!scope) return;
    // Las tablas de datos de las gráficas se quedan como estén.
    const boxes = $$("details", scope).filter(d => !d.classList.contains("chart-table"));
    const label = () => {
      const allOpen = boxes.every(d => d.open);
      btn.textContent = allOpen ? "Cerrar todas las respuestas" : "Abrir todas las respuestas";
    };
    btn.addEventListener("click", () => {
      const open = !boxes.every(d => d.open);
      boxes.forEach(d => { d.open = open; });
      label();
    });
    boxes.forEach(d => d.addEventListener("toggle", label));
    label();
  });

  /* ── Capítulos de un video: saltar al minuto en el reproductor ──────── */
  $$("[data-chapters]").forEach(box => {
    const frame = $("iframe", box);
    const base  = frame?.dataset.base;
    if (!frame || !base) return;
    const chaps = $$(".chap", box);
    chaps.forEach(btn => btn.addEventListener("click", () => {
      frame.src = `${base}?start=${btn.dataset.start}&autoplay=1`;
      chaps.forEach(b => b.setAttribute("aria-pressed", String(b === btn)));
    }));
  });

  /* ── Gráficas: etiqueta flotante al pasar o enfocar un punto ────────── */
  $$("[data-chart]").forEach(chart => {
    const tip = $(".chart-tip", chart);
    if (!tip) return;
    const show = (pt) => {
      tip.innerHTML = "";
      const [head, ...rest] = pt.dataset.tip.split("|");
      const b = document.createElement("b");
      b.textContent = head;
      tip.appendChild(b);
      rest.forEach(line => {
        const span = document.createElement("span");
        span.textContent = line;
        tip.appendChild(span);
      });
      const box = chart.getBoundingClientRect();
      const dot = pt.getBoundingClientRect();
      const x = dot.left + dot.width / 2 - box.left;
      const y = dot.top - box.top;
      tip.style.left = `${Math.min(Math.max(x, 90), box.width - 90)}px`;
      tip.style.top  = `${y}px`;
      tip.classList.add("is-on");
      $$("[data-tip]", chart).forEach(p => p.classList.toggle("is-hot", p === pt));
    };
    const hide = () => {
      tip.classList.remove("is-on");
      $$("[data-tip]", chart).forEach(p => p.classList.remove("is-hot"));
    };
    $$("[data-tip]", chart).forEach(pt => {
      pt.addEventListener("pointerenter", () => show(pt));
      pt.addEventListener("focus", () => show(pt));
      pt.addEventListener("pointerleave", hide);
      pt.addEventListener("blur", hide);
    });
  });

  /* ── Cronología: ver solo un lado ───────────────────────────────────── */
  $$("[data-crono]").forEach(crono => {
    const items = $$(".crono-item", crono);
    const btns  = $$("[data-filter]", crono);
    btns.forEach(btn => btn.addEventListener("click", () => {
      const side = btn.dataset.filter;
      // data-side puede traer dos lados ("eu cn"); la marca del artículo se queda siempre.
      items.forEach(it => {
        const sides = (it.dataset.side || "").split(" ");
        it.hidden = side !== "todo" && !sides.includes(side) && !it.classList.contains("crono-mark");
      });
      btns.forEach(b => b.setAttribute("aria-pressed", String(b === btn)));
    }));
  });

  /* ── Red de actores: ver un tramo y la ficha de cada actor ──────────── */
  // Cada nodo y cada conexión traen data-t con los tramos en los que aparecen
  // (0 el aviso, 1 adiós a las fábricas, 2 del iPod al iPhone, 3 la trampa).
  $$("[data-net]").forEach(net => {
    net.classList.add("net--js");
    const nodes = $$(".nd", net);
    const edges = $$(".ed", net);
    const cards = $$(".actor", net);
    const intro = $(".net-intro", net);
    const clear = $(".net-clear", net);
    const cap   = $(".net-cap", net);
    const btns  = $$("[data-tramo]", net);
    const byId  = Object.fromEntries(nodes.map(n => [n.dataset.id, n]));
    let tramo = "todo";
    let sel = null;

    const inT = el => tramo === "todo" || (el?.dataset.t || "").split(" ").includes(tramo);
    const touches = e => e.dataset.a === sel || e.dataset.b === sel;

    const paint = () => {
      const near = new Set(sel ? [sel] : []);
      edges.forEach(e => {
        const on = inT(e) && inT(byId[e.dataset.a]) && inT(byId[e.dataset.b]);
        e.classList.toggle("is-out", !on);
        e.classList.toggle("is-dim", !!sel && !touches(e));
        e.classList.toggle("is-hot", !!sel && on && touches(e));
        if (sel && on && touches(e)) { near.add(e.dataset.a); near.add(e.dataset.b); }
      });
      nodes.forEach(n => {
        const id = n.dataset.id;
        n.classList.toggle("is-out", !inT(n));
        n.classList.toggle("is-dim", !!sel && !near.has(id));
        n.classList.toggle("is-sel", id === sel);
        n.setAttribute("aria-pressed", String(id === sel));
      });
      cards.forEach(c => c.classList.toggle("is-on", c.dataset.id === sel));
      if (intro) intro.hidden = !!sel;
      if (clear) clear.hidden = !sel;
    };

    const pick = (id) => {
      sel = (id && id !== sel) ? id : null;
      if (sel && !inT(byId[sel])) {
        tramo = "todo";
        btns.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.tramo === "todo")));
        if (cap) cap.textContent = cap.dataset.capTodo;
      }
      paint();
    };

    nodes.forEach(n => {
      n.addEventListener("click", () => pick(n.dataset.id));
      n.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(n.dataset.id); }
      });
    });
    $$(".actor-go", net).forEach(b => b.addEventListener("click", () => {
      pick(b.dataset.go);
      byId[b.dataset.go]?.focus({ preventScroll: true });
    }));
    clear?.addEventListener("click", () => pick(null));

    btns.forEach(btn => btn.addEventListener("click", () => {
      tramo = btn.dataset.tramo;
      btns.forEach(b => b.setAttribute("aria-pressed", String(b === btn)));
      const key = "cap" + (tramo === "todo" ? "Todo" : tramo);
      if (cap && cap.dataset[key]) cap.textContent = cap.dataset[key];
      if (sel && !inT(byId[sel])) sel = null;
      paint();
    }));

    paint();
  });

  /* ── ¿Quién tiene el poder aquí? Clasificar diez episodios ──────────── */
  // Cada .pz trae la lectura posible en data-tipo y data-estr. No hay respuesta
  // única: se marca si coincide, y la tarjeta resume lo que escogió cada quien.
  const poder = $("[data-poder]");
  if (poder) {
    const STORE_P = "geopolis27-poder";
    const items = $$(".pz", poder);
    const scoreP = $("[data-poder-score]", poder);
    const LBL = { rel: "relacional", est: "estructural", seg: "seguridad", prod: "producción", fin: "finanzas", con: "conocimiento" };
    let st = { picks: {}, name: "", dis: "", why: "", actor: "", arg: "" };
    try { st = Object.assign(st, JSON.parse(localStorage.getItem(STORE_P) || "{}")); } catch { /* sin almacenamiento */ }
    const keep = () => { try { localStorage.setItem(STORE_P, JSON.stringify(st)); } catch { /* sin almacenamiento */ } };

    const done = n => !!(st.picks[n]?.tipo && st.picks[n]?.estr);
    const match = (item) => {
      const p = st.picks[item.dataset.n] || {};
      return p.tipo === item.dataset.tipo && p.estr === item.dataset.estr;
    };

    const paintItem = (item) => {
      const n = item.dataset.n;
      const p = st.picks[n] || {};
      const fin = done(n);
      $$("[data-k]", item).forEach(b => {
        const on = p[b.dataset.k] === b.dataset.v;
        const key = item.dataset[b.dataset.k] === b.dataset.v;
        b.setAttribute("aria-pressed", String(on));
        b.classList.toggle("is-match", fin && on && key);
        b.classList.toggle("is-diff", fin && on && !key);
        b.classList.toggle("is-key", fin && !on && key);
      });
      const why = $(".sort-why", item);
      if (why) why.hidden = !fin;
      item.classList.toggle("is-done", fin);
    };

    const fields = {
      name: $("#pName"), dis: $("#pDisagree"), why: $("#pWhy"), arg: $("#pArg")
    };
    const radios = $$('input[name="pActor"]', poder);
    const set = (id, text) => { const el = $(id); if (el) el.textContent = text; };

    const render = () => {
      items.forEach(paintItem);
      const total = items.length;
      const listos = items.filter(i => done(i.dataset.n));
      const coinc = listos.filter(match).length;
      if (scoreP) {
        scoreP.textContent = listos.length === total
          ? `Listo: coincides con la lectura posible en ${coinc} de ${total}`
          : `${listos.length} de ${total} episodios clasificados · coincides en ${coinc}`;
      }
      const count = (k, v) => items.filter(i => st.picks[i.dataset.n]?.[k] === v).length;
      set("#pcName", st.name || "Tu nombre");
      set("#pcRel", count("tipo", "rel"));
      set("#pcEst", count("tipo", "est"));
      set("#pcSeg", count("estr", "seg"));
      set("#pcProd", count("estr", "prod"));
      set("#pcFin", count("estr", "fin"));
      set("#pcCon", count("estr", "con"));
      set("#pcMatch", listos.length === total
        ? `Coincido con la lectura posible en ${coinc} de ${total} episodios.`
        : `Llevo ${listos.length} de ${total} episodios clasificados.`);
      const opt = fields.dis?.selectedOptions?.[0];
      set("#pcDis", st.dis
        ? `No estoy de acuerdo con «${opt ? opt.textContent.replace(/^\d+\.\s*/, "") : ""}»${st.why ? `: ${st.why}` : "."}`
        : "");
      set("#pcActor", st.actor || "—");
      set("#pcArg", st.arg);
      return { total, listos: listos.length, coinc };
    };

    items.forEach(item => {
      $$("[data-k]", item).forEach(btn => btn.addEventListener("click", () => {
        const n = item.dataset.n;
        st.picks[n] = Object.assign({}, st.picks[n], { [btn.dataset.k]: btn.dataset.v });
        keep();
        render();
      }));
    });

    // Cargar lo guardado en el formulario
    Object.entries(fields).forEach(([k, el]) => { if (el && st[k]) el.value = st[k]; });
    radios.forEach(r => { r.checked = r.value === st.actor; });

    $("#poderForm")?.addEventListener("input", () => {
      Object.entries(fields).forEach(([k, el]) => { if (el) st[k] = el.value.trim(); });
      st.actor = radios.find(r => r.checked)?.value || "";
      keep();
      render();
    });
    $("#poderForm")?.addEventListener("submit", e => e.preventDefault());

    $("[data-poder-reset]", poder)?.addEventListener("click", () => {
      st.picks = {};
      keep();
      render();
      say("Episodios en blanco");
    });

    $("#pClear")?.addEventListener("click", () => {
      Object.values(fields).forEach(el => { if (el) el.value = ""; });
      radios.forEach(r => { r.checked = false; });
      Object.assign(st, { name: "", dis: "", why: "", actor: "", arg: "" });
      keep();
      render();
      say("Tarjeta en blanco");
    });

    $("#pCopy")?.addEventListener("click", async () => {
      const r = render();
      const count = (k, v) => items.filter(i => st.picks[i.dataset.n]?.[k] === v).length;
      const lines = [
        "MI MAPA DEL PODER · McGee (2025), Apple in China",
        "Geopolítica Internacional · FCA UNAM · Grupo 1541 · 13 de octubre de 2026", "",
        `Nombre: ${st.name || "—"}`,
        `Episodios clasificados: ${r.listos} de ${r.total} · coincido con la lectura posible en ${r.coinc}`,
        `Relacional: ${count("tipo", "rel")} · Estructural: ${count("tipo", "est")}`,
        `Seguridad: ${count("estr", "seg")} · Producción: ${count("estr", "prod")} · Finanzas: ${count("estr", "fin")} · Conocimiento: ${count("estr", "con")}`
      ];
      items.forEach(i => {
        const p = st.picks[i.dataset.n];
        if (p?.tipo && p?.estr) lines.push(`  ${$(".sort-q b", i)?.textContent}: ${LBL[p.tipo]}, ${LBL[p.estr]}`);
      });
      const dis = $("#pcDis")?.textContent;
      if (dis) lines.push("", dis);
      lines.push("", `¿Puede Apple ser entendido como un actor geopolítico en sí mismo? ${st.actor || "—"}`);
      if (st.arg) lines.push(st.arg);
      const text = lines.join("\n");
      try {
        await navigator.clipboard.writeText(text);
        say("Tarjeta copiada ✓");
      } catch {
        const helper = document.createElement("textarea");
        helper.value = text;
        helper.setAttribute("readonly", "");
        helper.style.cssText = "position:fixed;top:-1000px";
        document.body.appendChild(helper);
        helper.select();
        try { document.execCommand("copy"); say("Tarjeta copiada ✓"); }
        catch { say("No se pudo copiar en este navegador"); }
        helper.remove();
      }
    });

    $("#pPrint")?.addEventListener("click", () => {
      root.classList.add("print-poder");
      window.print();
      setTimeout(() => root.classList.remove("print-poder"), 400);
    });

    render();
  }

  /* ── Taller: reloj de estaciones ────────────────────────────────────── */
  // Un botón por estación con su tiempo; el conteo se calcula contra el reloj
  // del sistema para no desfasarse si la pestaña se queda en segundo plano.
  const clock = $("#reloj");
  if (clock) {
    const stBtns = $$(".clock-st", clock);
    const STATIONS = stBtns.map(b => ({
      name: $("strong", b).textContent.trim(),
      min: parseInt($("small", b).textContent, 10)
    }));
    const tTime  = $("#clockTime");
    const tName  = $("#clockName");
    const tLabel = $("#clockLabel");
    const tBar   = $("#clockBar");
    const tAlert = $("#clockAlert");
    const goBtn  = $("#clockGo");
    const baseTitle = document.title;
    let station = 0, total = 0, left = 0, endAt = 0, timer = null;

    const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
    const paint = () => {
      const secs = Math.max(0, Math.ceil(left));
      tTime.textContent = fmt(secs);
      tBar.style.width = `${total ? (1 - left / total) * 100 : 0}%`;
      document.title = timer ? `${fmt(secs)} · ${STATIONS[station].name}` : baseTitle;
    };
    const beep = () => {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        [0, .32, .64].forEach(at => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.value = 880;
          gain.gain.setValueAtTime(.0001, ctx.currentTime + at);
          gain.gain.exponentialRampToValueAtTime(.25, ctx.currentTime + at + .02);
          gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + at + .25);
          osc.connect(gain).connect(ctx.destination);
          osc.start(ctx.currentTime + at);
          osc.stop(ctx.currentTime + at + .27);
        });
      } catch { /* sin audio */ }
    };
    const stop = () => {
      clearInterval(timer);
      timer = null;
      goBtn.textContent = left > 0 && left < total ? "▶ Seguir" : "▶ Iniciar";
      paint();
    };
    const tick = () => {
      left = (endAt - Date.now()) / 1000;
      if (left > 0) { paint(); return; }
      left = 0;
      stop();
      clock.classList.add("is-done");
      tLabel.textContent = "Tiempo";
      tAlert.textContent = `Se acabó el tiempo de «${STATIONS[station].name}».`;
      beep();
    };
    const start = () => {
      if (left <= 0) left = total;
      clock.classList.remove("is-done");
      tLabel.textContent = `Estación ${station + 1} de ${STATIONS.length}`;
      endAt = Date.now() + left * 1000;
      clearInterval(timer);
      timer = setInterval(tick, 250);
      goBtn.textContent = "❚❚ Pausar";
      paint();
    };
    const pick = (i) => {
      clearInterval(timer);
      timer = null;
      station = i;
      total = left = STATIONS[i].min * 60;
      clock.classList.remove("is-done");
      tName.textContent = STATIONS[i].name;
      tLabel.textContent = `Estación ${i + 1} de ${STATIONS.length}`;
      stBtns.forEach((b, j) => b.setAttribute("aria-pressed", String(j === i)));
      goBtn.textContent = "▶ Iniciar";
      paint();
    };

    stBtns.forEach((b, i) => b.addEventListener("click", () => pick(i)));
    goBtn.addEventListener("click", () => (timer ? stop() : start()));
    $("#clockReset").addEventListener("click", () => pick(station));
    $("#clockNext").addEventListener("click", () => pick((station + 1) % STATIONS.length));
    const fullBtn = $("#clockFull");
    if (!clock.requestFullscreen) fullBtn.hidden = true;
    fullBtn.addEventListener("click", () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else clock.requestFullscreen().catch(() => say("No se pudo abrir en pantalla completa"));
    });
    document.addEventListener("fullscreenchange", () => {
      fullBtn.textContent = document.fullscreenElement ? "✕ Salir" : "⛶ Pantalla completa";
    });
    pick(0);
  }

  /* ── Taller: tu brújula de la sesión 01 ─────────────────────────────── */
  // Si en este navegador quedó la brújula de la primera sesión, se recuerda al
  // armar equipo: el Este parecido, el Oeste distinto.
  const myCompass = $("#myCompass");
  if (myCompass) {
    try {
      const b = JSON.parse(localStorage.getItem("geopolis27-brujula") || "{}");
      const show = (id, value) => {
        if (!value) return false;
        $(`#${id}Text`).textContent = value;
        $(`#${id}`).hidden = false;
        return true;
      };
      const any = [show("myCompassE", b.interest), show("myCompassS", b.region), show("myCompassW", b.lens)].some(Boolean);
      if (any) myCompass.hidden = false;
    } catch { /* sin brújula guardada */ }
  }

  /* ── Taller: la ficha del equipo ────────────────────────────────────── */
  // Se guarda en el navegador, se copia como texto para el foro de Moodle y se
  // imprime sola. Los territorios la llenan desde su botón «Lo elegimos».
  const ficha = $("#fichaForm");
  if (ficha) {
    const STORE = "geopolis27-ficha-pregunta";
    const F = {
      team: "#fTeam", crew: "#fCrew", terr: "#fTerr", actor: "#fActor", place: "#fPlace",
      when: "#fWhen", tension: "#fTension", decision: "#fDecision", q1: "#fQ1", q2: "#fQ2",
      lens: "#fLens", sources: "#fSources", unknown: "#fUnknown"
    };
    const checks = $$('.checks input[type="checkbox"]', ficha);
    const val = (k) => ($(F[k]).value || "").trim();
    const terrCards = $$(".terr");

    const markTerr = (name) => terrCards.forEach(card => {
      const on = card.dataset.terr === name;
      card.classList.toggle("is-picked", on);
      const btn = $(".terr-pick", card);
      btn.setAttribute("aria-pressed", String(on));
      btn.textContent = on ? "✓ Elegido" : "Lo elegimos";
    });

    const render = () => {
      const data = {};
      Object.keys(F).forEach(k => { data[k] = val(k); });
      data.tests = checks.filter(c => c.checked).map(c => c.value);
      try { localStorage.setItem(STORE, JSON.stringify(data)); } catch { /* sin almacenamiento */ }

      $("#bTeam").textContent = data.team;
      const bQ = $("#bQ");
      bQ.textContent = data.q2 || data.q1;
      bQ.classList.toggle("is-v1", !data.q2 && !!data.q1);
      $("#bQTag").textContent = data.q2 ? "Pregunta · borrador 2" : data.q1 ? "Pregunta · borrador 1" : "Pregunta · sin escribir";
      $("#bTerr").textContent = data.terr;
      $("#bCase").textContent = [data.actor, data.place, data.when].filter(Boolean).join(" · ");
      $("#bTension").textContent = data.tension;
      $("#bDecision").textContent = data.decision;
      $("#bLens").textContent = data.lens;
      $("#bSources").textContent = data.sources;
      $("#bUnknown").textContent = data.unknown;
      $("#bCrew").textContent = data.crew;
      $("#bTests").replaceChildren(...checks.map(c => {
        const s = document.createElement("span");
        s.textContent = (c.checked ? "✓ " : "") + c.value;
        if (c.checked) s.className = "is-on";
        return s;
      }));
      markTerr(data.terr);
    };

    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || "{}");
      Object.keys(F).forEach(k => { if (saved[k]) $(F[k]).value = saved[k]; });
      (saved.tests || []).forEach(t => { const c = checks.find(x => x.value === t); if (c) c.checked = true; });
    } catch { /* ficha vacía */ }
    render();

    ficha.addEventListener("input", render);
    ficha.addEventListener("change", render);
    ficha.addEventListener("submit", e => e.preventDefault());

    terrCards.forEach(card => $(".terr-pick", card).addEventListener("click", () => {
      $(F.terr).value = card.dataset.terr;
      render();
      say(`Territorio: ${card.dataset.terr} ✓`);
    }));

    const asText = () => {
      const lines = [
        "FICHA DEL EQUIPO · PREGUNTA DE INVESTIGACIÓN",
        "Geopolítica Internacional · FCA UNAM · Grupo 1541 · 2027-1 · 15 de octubre de 2026",
        ""
      ];
      const add = (label, value) => { if (value) lines.push(`${label}: ${value}`); };
      const list = (label, value) => {
        if (value) lines.push(`${label}:`, ...value.split("\n").filter(Boolean).map(l => `  · ${l.trim()}`));
      };
      add("Equipo", val("team"));
      list("Integrantes", val("crew"));
      add("Territorio", val("terr"));
      add("Caso", [val("actor"), val("place"), val("when")].filter(Boolean).join(" · "));
      add("Tensión", val("tension"));
      add("Decisión en juego", val("decision"));
      add("Pregunta, borrador 1", val("q1"));
      add("Pregunta, borrador 2", val("q2"));
      const passed = checks.filter(c => c.checked).map(c => c.value);
      if (passed.length) lines.push(`Pruebas que pasa: ${passed.length} de 6 (${passed.join(", ")})`);
      add("Concepto geopolítico", val("lens"));
      list("Fuentes por buscar", val("sources"));
      add("Lo que todavía no sabemos", val("unknown"));
      return lines.length > 3 ? lines.join("\n") : "";
    };

    $("#fichaCopy").addEventListener("click", async () => {
      const text = asText();
      if (!text) { say("Escriban algo primero 🧭"); return; }
      try {
        await navigator.clipboard.writeText(text);
        say("Ficha copiada ✓ Pégala en el foro de Moodle");
      } catch {
        const helper = document.createElement("textarea");
        helper.value = text;
        helper.setAttribute("readonly", "");
        helper.style.cssText = "position:fixed;top:-1000px";
        document.body.appendChild(helper);
        helper.select();
        try { document.execCommand("copy"); say("Ficha copiada ✓ Pégala en el foro de Moodle"); }
        catch { say("No se pudo copiar en este navegador"); }
        helper.remove();
      }
    });

    $("#fichaPrint").addEventListener("click", () => {
      root.classList.add("print-card");
      window.print();
      setTimeout(() => root.classList.remove("print-card"), 400);
    });

    $("#fichaClear").addEventListener("click", () => {
      if (!window.confirm("¿Borrar toda la ficha del equipo?")) return;
      Object.values(F).forEach(sel => { $(sel).value = ""; });
      checks.forEach(c => { c.checked = false; });
      try { localStorage.removeItem(STORE); } catch { /* sin almacenamiento */ }
      render();
      say("Ficha en blanco");
    });
  }
})();
