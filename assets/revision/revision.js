/* ==========================================================================
   Revisión en grupo de las preguntas · presentación para proyectar
   Lee TEAMS (definido en la página) y muestra solo el nombre del equipo y su
   pregunta: nunca los integrantes. Incluye los criterios, qué son los
   objetivos y las hipótesis, la dinámica y un reloj de 5, 10 y 15 minutos.
   ========================================================================== */
(() => {
  "use strict";
  if (typeof TEAMS === "undefined" || !window.RevisionArt) return;
  const ART = window.RevisionArt;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const N = TEAMS.length;
  const NUM = ["cero", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce",
    "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte"];
  const nWord = n => NUM[n] || String(n);
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  /* ── Contenido ─────────────────────────────────────────────────────── */
  const PRUEBAS = [
    { k: "abierta", n: "Abierta", d: "No se contesta con un sí, un no, una definición ni un resumen.", q: "¿Se puede responder en una línea?" },
    { k: "acotada", n: "Acotada", d: "Tiene un actor, un lugar y un periodo. Cabe en un trabajo de equipo, no en una enciclopedia.", q: "¿Quién, dónde y desde cuándo?" },
    { k: "tension", n: "Con tensión", d: "Algo está en disputa: alguien gana, alguien pierde o alguien depende de otro.", q: "¿Quién pierde si las cosas siguen así?" },
    { k: "decision", n: "Con decisión", d: "Alguien tiene que elegir algo: una empresa, un sector, un gobierno. Mejor si decide desde México o América Latina.", q: "¿Quién usaría la respuesta, y para decidir qué?" },
    { k: "evidencia", n: "Con evidencia", d: "Saben dónde buscar datos, documentos, informes o prensa para responderla.", q: "¿Dónde van a buscar primero?" },
    { k: "lente", n: "Con lente", d: "Usa al menos un concepto geopolítico para entender el caso, de las lecturas del curso o de otros autores.", q: "¿Qué concepto explica este caso, y de quién es?" },
  ];
  const TIPOS = [
    { n: "Descriptivo", d: "Cuenta cómo es o cómo ocurrió algo, con datos y cronología." },
    { n: "Explicativo", d: "Busca las causas: por qué pasó y por qué pasó así." },
    { n: "Comparativo", d: "Pone lado a lado dos casos, países, empresas o periodos." },
    { n: "Estudio de caso", d: "Mira a fondo una empresa, un sector o un lugar." },
    { n: "Prospectivo", d: "Arma escenarios: qué podría pasar y qué conviene decidir." },
  ];
  const ACC = ["#7d1a52", "#2d49aa", "#8a6420", "#5b3f2c"];
  const KINDS = ["crystal", "ribbon", "mobile"];
  const label = t => t.solo ? "Trabajo individual" : t.name;

  /* ── Marcas del grupo (se guardan en este navegador) ───────────────── */
  const STORE = "geopolis-1541-revision";
  let marks = {};
  try { marks = JSON.parse(localStorage.getItem(STORE)) || {}; } catch { marks = {}; }
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(marks)); } catch { /* sin almacenamiento */ } };
  const markOf = id => (marks[id] ||= { c: {}, tipo: "", sug: [] });

  /* ── Diapositivas de introducción ──────────────────────────────────── */
  const INTRO = [
    () => `
      <article class="rv-slide rv-cover">
        <div class="rv-cover-text">
          <p class="rv-kicker">Trabajo final · Revisión en grupo</p>
          <h1 class="rv-h1">Un paseo por <em>nuestras preguntas</em></h1>
          <p class="rv-lead">Cada pregunta es una pieza del jardín: nos detenemos frente a ella, la miramos entre todos y le ayudamos a crecer. En pantalla solo aparecen el nombre del equipo y su pregunta.</p>
          <ol class="rv-agenda">
            <li><button type="button" data-go="intro:1"><b>Las seis pruebas</b> de una buena pregunta</button></li>
            <li><button type="button" data-go="intro:2"><b>Objetivos e hipótesis</b>, en corto</button></li>
            <li><button type="button" data-go="intro:3"><b>Cómo revisamos</b> cada pregunta</button></li>
            <li><button type="button" data-go="first"><b>${cap(nWord(N))} preguntas</b>, en orden o al azar</button></li>
          </ol>
          <div class="rv-actions">
            <button type="button" class="rv-btn rv-btn--main" data-go="next">Empezar →</button>
            <button type="button" class="rv-btn" data-go="random">🎲 Una pregunta al azar</button>
          </div>
        </div>
        <div class="rv-cover-art">${ART.scene()}</div>
      </article>`,

    () => `
      <article class="rv-slide rv-crit">
        <p class="rv-kicker">1 · Los criterios</p>
        <h2 class="rv-h2">Seis pruebas para una pregunta</h2>
        <p class="rv-lead">Desde adentro del equipo, toda pregunta se ve bien. Por eso la pasamos por ojos ajenos: los del grupo.</p>
        <ol class="rv-crit-grid">${PRUEBAS.map((p, i) => `
          <li style="--d:${i * 70}ms">
            <span class="rv-num">0${i + 1}</span>
            <h3>${p.n}</h3>
            <p>${p.d}</p>
            <p class="rv-ask">«${p.q}»</p>
          </li>`).join("")}
        </ol>
        <div class="rv-starts">
          <p><b>Arranques que abren</b> ¿En qué medida…? · ¿Cómo…? · ¿Por qué…? · ¿Qué tan expuesto…? · ¿Qué estrategia…?</p>
          <p><b>Arranques que cierran</b> ¿Qué es…? · ¿Existe…? · ¿Cuándo pasó…? · ¿Es bueno o malo…? · ¿Cuál es la historia de…?</p>
        </div>
      </article>`,

    () => `
      <article class="rv-slide rv-oh">
        <p class="rv-kicker">2 · Para trabajar en equipo</p>
        <h2 class="rv-h2">Objetivos e hipótesis</h2>
        <p class="rv-lead">La <b>pregunta</b> dice qué queremos saber. El <b>objetivo</b> dice qué vamos a hacer para saberlo. La <b>hipótesis</b> dice qué creemos que vamos a encontrar.</p>
        <div class="rv-oh-grid">
          <section class="rv-oh-card">
            <h3><span class="rv-glyph" aria-hidden="true">◎</span> Objetivo</h3>
            <p class="rv-def">Lo que el trabajo se propone lograr para responder la pregunta.</p>
            <ul>
              <li><b>General:</b> una sola oración. Empieza con un verbo en infinitivo —analizar, explicar, comparar, evaluar— y conserva el actor, el lugar y el periodo de la pregunta.</li>
              <li><b>Específicos:</b> dos o tres pasos para llegar al general. Cada uno se vuelve un apartado del trabajo.</li>
            </ul>
          </section>
          <section class="rv-oh-card rv-oh-card--h">
            <h3><span class="rv-glyph" aria-hidden="true">◇</span> Hipótesis</h3>
            <p class="rv-def">La respuesta tentativa a la pregunta, escrita antes de investigar.</p>
            <ul>
              <li>Es una <b>afirmación</b>, no una pregunta: relaciona una causa con un efecto. «X provocó Y porque Z».</li>
              <li>Se puede <b>poner a prueba</b>: la evidencia puede darle la razón o quitársela. Si nada podría desmentirla, no es hipótesis.</li>
            </ul>
          </section>
        </div>
        <dl class="rv-example">
          <div><dt>Pregunta</dt><dd>¿Qué tan expuestas quedaron las armadoras del Bajío al corte de chips de Nexperia en 2025, y qué estrategias de abastecimiento les reducirían ese riesgo?</dd></div>
          <div><dt>Objetivo general</dt><dd>Evaluar la exposición de las armadoras del Bajío al corte de chips de Nexperia en 2025 e identificar estrategias de abastecimiento que reduzcan ese riesgo.</dd></div>
          <div><dt>Hipótesis</dt><dd>Las armadoras que dependían de un solo proveedor de chips detuvieron sus líneas por más tiempo; tener proveedores fuera del pleito entre Países Bajos y China habría reducido su exposición.</dd></div>
        </dl>
        <div class="rv-task">
          <p><b>En equipo:</b> escriban su objetivo general, dos objetivos específicos y su hipótesis.</p>
          <button type="button" class="rv-btn rv-btn--main" data-go="timer:10">⏱ Iniciar 10 minutos</button>
        </div>
      </article>`,

    () => `
      <article class="rv-slide rv-how">
        <p class="rv-kicker">3 · La dinámica</p>
        <h2 class="rv-h2">Frente a cada pregunta</h2>
        <ol class="rv-steps">
          <li style="--d:0ms"><span class="rv-num">1</span><h3>La leemos en voz alta</h3><p>Tal como está escrita, sin explicarla. Si hay que explicarla, ya encontramos el primer ajuste.</p></li>
          <li style="--d:90ms"><span class="rv-num">2</span><h3>La pasamos por las seis pruebas</h3><p>El grupo dice cuáles pasa y cuáles todavía no. Las marcamos en pantalla.</p></li>
          <li style="--d:180ms"><span class="rv-num">3</span><h3>El equipo nos explica su trabajo</h3><p>¿Qué tipo de trabajo harán y por dónde piensan empezar?</p></li>
          <li style="--d:270ms"><span class="rv-num">4</span><h3>El grupo sugiere dónde buscar</h3><p>Una base de datos, un informe, un medio, una lectura del curso, una persona experta.</p></li>
        </ol>
        <h3 class="rv-sub">Tipos de trabajo</h3>
        <ul class="rv-types">${TIPOS.map(t => `<li><b>${t.n}</b><span>${t.d}</span></li>`).join("")}</ul>
        <p class="rv-note">Cada observación útil cuenta como participación. La más útil casi nunca es «está muy bien».</p>
        <div class="rv-actions">
          <button type="button" class="rv-btn rv-btn--main" data-go="first">Ir a las preguntas →</button>
          <button type="button" class="rv-btn" data-go="random">🎲 Empezar al azar</button>
          <button type="button" class="rv-btn" data-go="timer:5">⏱ 5 minutos por pregunta</button>
        </div>
      </article>`,
  ];

  /* ── Diapositiva de una pregunta ───────────────────────────────────── */
  const sizeOf = q => q.length < 150 ? "xl" : q.length < 230 ? "l" : "m";
  const critState = (m, k) => m.c[k] === 1 ? "pasa" : m.c[k] === -1 ? "falta" : "";
  const questionSlide = i => {
    const t = TEAMS[i], m = markOf(t.id);
    const pass = PRUEBAS.filter(p => m.c[p.k] === 1).length;
    return `
      <article class="rv-slide rv-q" style="--rv-acc:${ACC[i % ACC.length]}">
        <div class="rv-q-main">
          <header class="rv-q-head">
            <p class="rv-kicker">Pregunta ${i + 1} de ${N} · ${t.solo ? "Sin equipo" : "Equipo"}</p>
            <h2 class="rv-team">${esc(label(t))}</h2>
            <ul class="rv-meta"><li>${esc(t.territorio)}</li><li>Lente · ${esc(t.concepto)}</li></ul>
          </header>
          <blockquote class="rv-bigq" data-size="${sizeOf(t.q)}">${esc(t.q)}</blockquote>
        </div>
        <div class="rv-q-art">${ART.sculpture(KINDS[i % KINDS.length])}</div>
        <div class="rv-panels">
          <section class="rv-panel">
            <h3>¿Pasa las seis pruebas? <span class="rv-score">${pass}/6</span></h3>
            <div class="rv-crits">${PRUEBAS.map(p => `
              <button type="button" class="rv-chip" data-crit="${p.k}" data-state="${critState(m, p.k)}" title="${esc(p.q)}">
                <span class="rv-mark" aria-hidden="true"></span>${p.n}</button>`).join("")}
            </div>
            <p class="rv-hint">Toca una prueba: ✓ pasa · ✗ todavía no · sin marca</p>
          </section>
          <section class="rv-panel">
            <h3>🗣 Que el equipo nos explique: ¿qué tipo de trabajo harán?</h3>
            <div class="rv-tipos">${TIPOS.map(x => `
              <button type="button" class="rv-chip" data-tipo="${esc(x.n)}" aria-pressed="${m.tipo === x.n}" title="${esc(x.d)}">${x.n}</button>`).join("")}
            </div>
            <p class="rv-hint">${m.tipo ? esc(TIPOS.find(x => x.n === m.tipo)?.d) : "¿Y por dónde piensan empezar?"}</p>
          </section>
          <section class="rv-panel">
            <h3>🔎 ¿Alguien del grupo sabe dónde encontrar información?</h3>
            <ul class="rv-sugs">${m.sug.map((s, j) => `<li><span>${esc(s)}</span><button type="button" data-sug-del="${j}" aria-label="Quitar sugerencia">×</button></li>`).join("")}</ul>
            <form class="rv-sugform" autocomplete="off">
              <input type="text" name="s" maxlength="160" placeholder="Anotar una fuente, un sitio, un autor…" aria-label="Anotar una sugerencia del grupo">
              <button type="submit" class="rv-btn rv-btn--sm">Anotar</button>
            </form>
          </section>
        </div>
        <p class="rv-homework">✍ Después, en equipo: un <b>objetivo general</b> y una <b>hipótesis</b> para esta pregunta.</p>
      </article>`;
  };

  /* ── Estructura del diálogo ────────────────────────────────────────── */
  if (!$(".rv-defs")) document.body.insertAdjacentHTML("afterbegin", ART.defs());
  document.body.insertAdjacentHTML("beforeend", `
    <dialog class="rv" id="rv" aria-label="Revisión en grupo de las preguntas">
      <div class="rv-top">
        <p class="rv-brand"><span class="rv-dot" aria-hidden="true"></span>Revisión de preguntas · <span>Grupo 1541</span></p>
        <p class="rv-pos" id="rvPos" aria-live="polite"></p>
        <div class="rv-topnav">
          <button type="button" class="rv-ibtn" id="rvHome" title="Volver a la portada" aria-label="Volver a la portada">⌂</button>
          <button type="button" class="rv-ibtn" id="rvPrev" title="Anterior (←)" aria-label="Anterior">←</button>
          <button type="button" class="rv-ibtn" id="rvNext" title="Siguiente (→)" aria-label="Siguiente">→</button>
          <button type="button" class="rv-ibtn" id="rvFull" title="Pantalla completa (F)" aria-label="Pantalla completa">⛶</button>
          <button type="button" class="rv-ibtn" id="rvClose" title="Cerrar (Esc)" aria-label="Cerrar la presentación">✕</button>
        </div>
      </div>
      <div class="rv-stage" id="rvStage" tabindex="-1"></div>
      <div class="rv-foot">
        <div class="rv-timer" id="rvTimer" data-state="idle">
          <div class="rv-tset" role="group" aria-label="Iniciar un reloj">
            <button type="button" data-min="5">5′</button><button type="button" data-min="10">10′</button><button type="button" data-min="15">15′</button>
          </div>
          ${ART.trail()}
          <output class="rv-time" id="rvTime" aria-live="off">--:--</output>
          <button type="button" class="rv-ibtn rv-ibtn--sm" id="rvPause" title="Pausar o seguir (P)" aria-label="Pausar o seguir el reloj" disabled>⏸</button>
          <button type="button" class="rv-ibtn rv-ibtn--sm" id="rvReset" title="Quitar el reloj" aria-label="Quitar el reloj" disabled>↺</button>
        </div>
        <div class="rv-dots" id="rvDots" aria-label="Ir a una pregunta"></div>
        <div class="rv-ctrl">
          <div class="rv-seg" role="group" aria-label="Cómo sale la siguiente pregunta">
            <button type="button" data-mode="seq" aria-pressed="true">En orden</button>
            <button type="button" data-mode="rand" aria-pressed="false">Al azar</button>
          </div>
          <button type="button" class="rv-btn rv-btn--main" id="rvAnother">Otra pregunta →</button>
        </div>
      </div>
      <p class="rv-toast" id="rvToast" role="status" aria-live="polite"></p>
    </dialog>`);

  const dlg = $("#rv"), stage = $("#rvStage"), dots = $("#rvDots");
  let cur = { k: "intro", i: 0 };
  let mode = "seq";
  const hist = [], seen = new Set();

  let toastT;
  const say = msg => {
    const el = $("#rvToast"); el.textContent = msg; el.classList.add("is-on");
    clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove("is-on"), 2800);
  };

  /* ── Navegación ────────────────────────────────────────────────────── */
  const pickRandom = () => {
    const now = cur.k === "q" ? cur.i : -1;
    let pool = TEAMS.map((_, i) => i).filter(i => !seen.has(i) && i !== now);
    if (!pool.length) {
      seen.clear(); if (now >= 0) seen.add(now);
      pool = TEAMS.map((_, i) => i).filter(i => i !== now);
      say("Ya salieron todas las preguntas: empieza otra vuelta.");
    }
    return pool[Math.floor(Math.random() * pool.length)];
  };
  const nextQ = () => mode === "rand" ? pickRandom() : cur.k === "q" ? (cur.i + 1) % N : 0;

  const go = (state, push = true) => {
    if (push && (state.k !== cur.k || state.i !== cur.i)) hist.push(cur);
    if (hist.length > 200) hist.shift();
    cur = state;
    render();
  };
  const next = () => {
    if (cur.k === "intro" && cur.i < INTRO.length - 1) return go({ k: "intro", i: cur.i + 1 });
    go({ k: "q", i: nextQ() });
  };
  const prev = () => {
    if (hist.length) { cur = hist.pop(); return render(); }
    if (cur.k === "intro" && cur.i > 0) { cur = { k: "intro", i: cur.i - 1 }; render(); }
  };

  const render = () => {
    if (cur.k === "q") seen.add(cur.i);
    stage.innerHTML = cur.k === "intro" ? INTRO[cur.i]() : questionSlide(cur.i);
    stage.scrollTop = 0;
    $("#rvPos").textContent = cur.k === "intro"
      ? `Introducción · ${cur.i + 1} de ${INTRO.length}`
      : `Pregunta ${cur.i + 1} de ${N} · han salido ${seen.size}`;
    $("#rvPrev").disabled = !hist.length && !(cur.k === "intro" && cur.i > 0);
    dlg.dataset.view = cur.k;
    dots.innerHTML = TEAMS.map((t, i) => `<button type="button" data-q="${i}"
      class="${seen.has(i) ? "is-seen" : ""}" ${cur.k === "q" && cur.i === i ? 'aria-current="true"' : ""}
      title="${i + 1} · ${esc(label(t))}" aria-label="Pregunta ${i + 1}: ${esc(label(t))}"></button>`).join("");
    $("#rvAnother").textContent = mode === "rand" ? "🎲 Otra al azar" : cur.k === "q" ? "Siguiente pregunta →" : "Primera pregunta →";
  };

  const setMode = m => {
    mode = m;
    dlg.querySelectorAll("[data-mode]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.mode === m)));
    render();
  };

  /* ── Reloj ─────────────────────────────────────────────────────────── */
  const T = { total: 0, left: 0, end: 0, run: false, iv: 0 };
  const tEl = $("#rvTimer"), timeEl = $("#rvTime"), walker = $(".rv-walker", tEl), done = $(".rv-trail-done", tEl);
  let trailLen = 0, ac = null;
  const fmt = ms => { const s = Math.ceil(ms / 1000); return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };
  const audio = () => {
    try { ac ||= new (window.AudioContext || window.webkitAudioContext)(); ac.resume?.(); } catch { ac = null; }
  };
  const chime = () => {
    if (!ac) return;
    const t0 = ac.currentTime;
    [659.25, 783.99, 1046.5].forEach((f, i) => {
      const o = ac.createOscillator(), g = ac.createGain(), t = t0 + i * .24;
      o.type = "sine"; o.frequency.value = f;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.16, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + 1.4);
      o.connect(g).connect(ac.destination); o.start(t); o.stop(t + 1.5);
    });
  };
  const paint = () => {
    const path = done;
    if (!trailLen) { try { trailLen = path.getTotalLength(); } catch { trailLen = 0; } }
    const p = T.total ? 1 - T.left / T.total : 0;
    if (trailLen) {
      path.style.strokeDasharray = `${trailLen}`;
      path.style.strokeDashoffset = `${trailLen * (1 - p)}`;
      const pt = path.getPointAtLength(trailLen * p);
      walker.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
    }
    timeEl.textContent = T.total ? (T.left > 0 ? fmt(T.left) : "¡Tiempo!") : "--:--";
    tEl.dataset.state = !T.total ? "idle" : T.left <= 0 ? "done" : !T.run ? "pause" : T.left <= 60000 ? "last" : "run";
    $("#rvPause").textContent = T.run ? "⏸" : "▶";
    $("#rvPause").disabled = !T.total || T.left <= 0;
    $("#rvReset").disabled = !T.total;
    tEl.querySelectorAll("[data-min]").forEach(b => b.setAttribute("aria-pressed", String(T.total === +b.dataset.min * 60000)));
  };
  const tick = () => {
    if (!T.run) return;
    T.left = Math.max(0, T.end - performance.now());
    if (T.left <= 0) { T.run = false; clearInterval(T.iv); chime(); say("Se acabó el tiempo."); }
    paint();
  };
  const startTimer = min => {
    audio();
    clearInterval(T.iv);
    Object.assign(T, { total: min * 60000, left: min * 60000, end: performance.now() + min * 60000, run: true });
    T.iv = setInterval(tick, 250);
    paint();
    say(`Reloj de ${min} minutos en marcha.`);
  };
  const pauseTimer = () => {
    if (!T.total || T.left <= 0) return;
    if (T.run) { T.left = Math.max(0, T.end - performance.now()); T.run = false; clearInterval(T.iv); }
    else { audio(); T.end = performance.now() + T.left; T.run = true; T.iv = setInterval(tick, 250); }
    paint();
  };
  const resetTimer = () => { clearInterval(T.iv); Object.assign(T, { total: 0, left: 0, run: false }); paint(); };

  /* ── Abrir, cerrar, pantalla completa ──────────────────────────────── */
  const open = start => {
    hist.length = 0;
    cur = start === "random" ? { k: "q", i: pickRandom() } : start || { k: "intro", i: 0 };
    if (!dlg.open) dlg.showModal();
    document.documentElement.classList.add("rv-lock");
    render(); paint();
    stage.focus({ preventScroll: true });
  };
  const fullscreen = () => {
    const d = document;
    if (d.fullscreenElement) d.exitFullscreen?.();
    else d.documentElement.requestFullscreen?.().catch(() => say("Este navegador no permite pantalla completa aquí."));
  };
  dlg.addEventListener("close", () => {
    document.documentElement.classList.remove("rv-lock");
    if (document.fullscreenElement) document.exitFullscreen?.();
  });

  /* ── Eventos ───────────────────────────────────────────────────────── */
  $("#rvHome").addEventListener("click", () => go({ k: "intro", i: 0 }));
  $("#rvPrev").addEventListener("click", prev);
  $("#rvNext").addEventListener("click", next);
  $("#rvFull").addEventListener("click", fullscreen);
  $("#rvClose").addEventListener("click", () => dlg.close());
  $("#rvAnother").addEventListener("click", () => go({ k: "q", i: nextQ() }));
  $("#rvPause").addEventListener("click", pauseTimer);
  $("#rvReset").addEventListener("click", resetTimer);
  tEl.addEventListener("click", e => { const b = e.target.closest("[data-min]"); if (b) startTimer(+b.dataset.min); });
  dlg.querySelector(".rv-seg").addEventListener("click", e => { const b = e.target.closest("[data-mode]"); if (b) setMode(b.dataset.mode); });
  dots.addEventListener("click", e => { const b = e.target.closest("[data-q]"); if (b) go({ k: "q", i: +b.dataset.q }); });

  stage.addEventListener("click", e => {
    const g = e.target.closest("[data-go]");
    if (g) {
      const v = g.dataset.go;
      if (v === "next") next();
      else if (v === "first") go({ k: "q", i: mode === "rand" ? pickRandom() : 0 });
      else if (v === "random") go({ k: "q", i: pickRandom() });
      else if (v.startsWith("intro:")) go({ k: "intro", i: +v.slice(6) });
      else if (v.startsWith("timer:")) startTimer(+v.slice(6));
      return;
    }
    if (cur.k !== "q") return;
    const t = TEAMS[cur.i], m = markOf(t.id);
    const c = e.target.closest("[data-crit]");
    if (c) {
      const k = c.dataset.crit;
      m.c[k] = m.c[k] === 1 ? -1 : m.c[k] === -1 ? 0 : 1;
      if (!m.c[k]) delete m.c[k];
      c.dataset.state = critState(m, k);
      $(".rv-score", stage).textContent = `${PRUEBAS.filter(p => m.c[p.k] === 1).length}/6`;
      save(); return;
    }
    const tp = e.target.closest("[data-tipo]");
    if (tp) {
      m.tipo = m.tipo === tp.dataset.tipo ? "" : tp.dataset.tipo;
      stage.querySelectorAll("[data-tipo]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.tipo === m.tipo)));
      tp.closest(".rv-panel").querySelector(".rv-hint").textContent = m.tipo ? TIPOS.find(x => x.n === m.tipo).d : "¿Y por dónde piensan empezar?";
      save(); return;
    }
    const del = e.target.closest("[data-sug-del]");
    if (del) { m.sug.splice(+del.dataset.sugDel, 1); save(); refreshSugs(m); }
  });
  const refreshSugs = m => {
    $(".rv-sugs", stage).innerHTML = m.sug.map((s, j) => `<li><span>${esc(s)}</span><button type="button" data-sug-del="${j}" aria-label="Quitar sugerencia">×</button></li>`).join("");
  };
  stage.addEventListener("submit", e => {
    if (!e.target.matches(".rv-sugform") || cur.k !== "q") return;
    e.preventDefault();
    const inp = e.target.elements.s, v = inp.value.trim();
    if (!v) return;
    const m = markOf(TEAMS[cur.i].id);
    m.sug.push(v); save(); refreshSugs(m);
    inp.value = ""; inp.focus();
  });

  dlg.addEventListener("keydown", e => {
    if (e.target.closest("input, textarea, select") || e.altKey || e.ctrlKey || e.metaKey) return;
    const k = e.key;
    if (k === "ArrowRight" || k === "PageDown") { e.preventDefault(); next(); }
    else if (k === "ArrowLeft" || k === "PageUp") { e.preventDefault(); prev(); }
    else if (k === "r" || k === "R") go({ k: "q", i: pickRandom() });
    else if (k === "f" || k === "F") fullscreen();
    else if (k === "p" || k === "P") pauseTimer();
    else return;
    e.stopPropagation();
  });

  /* ── Puntos de entrada en la página ────────────────────────────────── */
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-rv-open]");
    if (!b) return;
    const v = b.dataset.rvOpen;
    if (v === "focus") {
      // Desde la vista en grande de un equipo: proyectar esa misma pregunta.
      const id = location.hash.slice(1), i = TEAMS.findIndex(t => t.id === id);
      b.closest("dialog")?.close();
      open(i >= 0 ? { k: "q", i } : undefined);
    } else open(v === "random" ? "random" : undefined);
  });
  // equipos.html?revision abre la presentación directamente (útil en el salón).
  if (new URLSearchParams(location.search).has("revision")) open();
})();
