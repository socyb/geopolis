/* ==========================================================================
   Revisión en grupo · ilustraciones
   Un jardín de esculturas sobre un camino sinuoso: pedestales, árboles de hoja
   dorada, un móvil que se mece. Todo en SVG, sin imágenes externas.
   Expone window.RevisionArt = { defs, scene, sculpture, trail }.
   ========================================================================== */
(() => {
  "use strict";
  const C = {
    ink: "#2b2233", path: "#9d97ad", pathD: "#3e3649", plum: "#7d1a52", gold: "#f2d58b",
    goldD: "#c9a14d", tan: "#c8ad86", bark: "#5b3f2c", blue: "#2d49aa", lav: "#a7a1b8",
    lavD: "#8a83a0", rust: "#9a3b2a", skin: "#b98a68", leaf: "#e9c98a",
  };
  const pts = a => a.map(p => p.join(",")).join(" ");
  // Generador pseudoaleatorio con semilla: la ilustración sale igual cada vez.
  const rng = seed => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

  /* Patrón de punteado que da la textura de grabado. Va una sola vez en la página. */
  const defs = () => `
    <svg class="rv-defs" width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute">
      <defs>
        <pattern id="rvStip" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r=".75" fill="${C.ink}" opacity=".42"/>
          <circle cx="3.5" cy="3.4" r=".55" fill="${C.ink}" opacity=".3"/>
        </pattern>
        <pattern id="rvStipFine" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r=".45" fill="${C.ink}" opacity=".35"/>
        </pattern>
      </defs>
    </svg>`;

  const pedestal = (bx, by, w, h) => {
    const x = bx - w / 2, d = 16, k = d * .55;
    return `<g class="rv-ped" stroke="${C.ink}" stroke-width="1.4" stroke-linejoin="round">
      <rect x="${x}" y="${by}" width="${w}" height="${h}" fill="${C.lav}"/>
      <rect x="${x}" y="${by}" width="${w}" height="${h}" fill="url(#rvStip)" stroke="none" opacity=".7"/>
      <polygon points="${pts([[x + w, by], [x + w + d, by - k], [x + w + d, by + h - k], [x + w, by + h]])}" fill="${C.plum}"/>
      <polygon points="${pts([[x, by], [x + d, by - k], [x + w + d, by - k], [x + w, by]])}" fill="${C.gold}"/>
    </g>`;
  };

  const crystal = (bx, by) => {
    const E = [bx - 46, by - 178], D = [bx + 12, by - 142], Cc = [bx + 40, by - 80],
      B = [bx + 26, by - 2], A = [bx - 24, by - 2], M = [bx + 2, by - 62];
    const f = (p, fill) => `<polygon points="${pts(p)}" fill="${fill}"/>`;
    return `<g class="rv-crystal" stroke="${C.ink}" stroke-width="1.4" stroke-linejoin="round">
      ${f([E, A, M], C.plum)}${f([E, M, D], C.gold)}${f([D, M, Cc], C.lav)}${f([M, A, B], C.tan)}${f([M, B, Cc], C.lavD)}
      <polygon points="${pts([M, B, Cc])}" fill="url(#rvStipFine)" stroke="none"/>
      <polygon points="${pts([D, M, Cc])}" fill="url(#rvStipFine)" stroke="none" opacity=".6"/>
    </g>`;
  };

  // Una cinta dorada en ocho, hecha con dos lemniscatas de Gerono.
  const loop = (cx, cy, a, sx) => {
    const p = [];
    for (let i = 0; i <= 64; i++) {
      const t = (i / 64) * Math.PI * 2;
      p.push([+(cx + a * sx * Math.sin(t) * Math.cos(t)).toFixed(1), +(cy - a * Math.sin(t)).toFixed(1)]);
    }
    return "M" + p.map(q => q.join(" ")).join(" L");
  };
  const ribbon = (bx, by) => {
    const d = `${loop(bx, by - 70, 62, 1.05)} ${loop(bx + 6, by - 168, 34, 1.15)}`;
    const tail = `M${bx - 4} ${by - 8} C${bx + 20} ${by - 2} ${bx + 40} ${by - 4} ${bx + 52} ${by - 14}`;
    return `<g class="rv-ribbon" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="rotate(-10 ${bx} ${by - 90})">
      <path d="${d}" stroke="${C.ink}" stroke-width="15"/><path d="${tail}" stroke="${C.ink}" stroke-width="13"/>
      <path d="${d}" stroke="${C.gold}" stroke-width="11.5"/><path d="${tail}" stroke="${C.gold}" stroke-width="9.5"/>
      <path d="${d}" stroke="${C.goldD}" stroke-width="3" opacity=".55" transform="translate(2 2)"/>
      <path d="${d}" stroke="#fff6dc" stroke-width="2" opacity=".8" transform="translate(-2 -2)"/>
    </g>`;
  };

  // Un móvil: brazos finos que salen de un núcleo y se mecen despacio.
  const mobile = (bx, by) => {
    const hx = bx, hy = by - 120;
    const arms = [
      [-160, 88, "oval", C.bark], [-128, 70, "tie"], [-60, 92, "cup"], [-30, 64, "knob"],
      [10, 96, "spoon"], [40, 60, "oval", C.bark], [150, 80, "oval", C.tan], [118, 46, "knob"],
    ];
    const ends = arms.map(([deg, len, kind, fill]) => {
      const r = deg * Math.PI / 180, x = +(hx + Math.cos(r) * len).toFixed(1), y = +(hy + Math.sin(r) * len).toFixed(1);
      let s = "";
      if (kind === "oval") s = `<ellipse cx="${x}" cy="${y + 4}" rx="9" ry="14" fill="${fill}"/><ellipse cx="${x}" cy="${y + 4}" rx="9" ry="14" fill="url(#rvStip)" stroke="none"/>`;
      if (kind === "knob") s = `<circle cx="${x}" cy="${y}" r="5" fill="${C.bark}"/>`;
      if (kind === "tie") s = `<polygon points="${pts([[x - 11, y - 9], [x + 11, y - 9], [x, y]])}" fill="${C.plum}"/><polygon points="${pts([[x - 11, y + 9], [x + 11, y + 9], [x, y]])}" fill="${C.gold}"/>`;
      if (kind === "cup") s = `<polygon points="${pts([[x - 10, y - 10], [x + 10, y - 10], [x + 3, y + 4], [x - 3, y + 4]])}" fill="${C.lav}"/><rect x="${x - 2}" y="${y + 4}" width="4" height="10" fill="${C.lav}"/>`;
      if (kind === "spoon") s = `<ellipse cx="${x + 2}" cy="${y}" rx="4" ry="8" fill="${C.lavD}"/>`;
      return `<line x1="${hx}" y1="${hy}" x2="${x}" y2="${y}" stroke="${C.plum}" stroke-width="1.6"/>${s}`;
    }).join("");
    return `<g class="rv-mobile-wrap" stroke="${C.ink}" stroke-width="1.2">
      <line x1="${bx}" y1="${by}" x2="${hx}" y2="${hy}" stroke="${C.lavD}" stroke-width="2"/>
      <g class="rv-mobile" style="transform-origin:${hx}px ${hy}px">${ends}
        <path d="M${hx - 14} ${hy - 6} C${hx - 18} ${hy - 22} ${hx + 8} ${hy - 24} ${hx + 6} ${hy - 10} C${hx + 18} ${hy - 6} ${hx + 16} ${hy + 14} ${hx} ${hy + 12} C${hx - 16} ${hy + 14} ${hx - 22} ${hy + 4} ${hx - 14} ${hy - 6}Z" fill="${C.tan}"/>
        <path d="M${hx - 14} ${hy - 6} C${hx - 18} ${hy - 22} ${hx + 8} ${hy - 24} ${hx + 6} ${hy - 10} C${hx + 18} ${hy - 6} ${hx + 16} ${hy + 14} ${hx} ${hy + 12} C${hx - 16} ${hy + 14} ${hx - 22} ${hy + 4} ${hx - 14} ${hy - 6}Z" fill="url(#rvStip)" stroke="none"/>
      </g>
    </g>`;
  };

  const clusters = (cx, cy, rand) => {
    let s = "";
    const n = 5 + Math.floor(rand() * 3);
    for (let i = 0; i < n; i++) {
      const a = rand() * Math.PI * 2, d = 4 + rand() * 13, r = 5.5 + rand() * 4;
      const x = (cx + Math.cos(a) * d).toFixed(1), y = (cy + Math.sin(a) * d).toFixed(1);
      const fill = rand() < .55 ? C.tan : C.leaf;
      s += `<circle cx="${x}" cy="${y}" r="${r.toFixed(1)}" fill="${fill}"/>`;
      if (fill === C.leaf && rand() < .6) s += `<circle cx="${x}" cy="${y}" r="${(r * .45).toFixed(1)}" fill="${C.tan}" stroke="none"/>`;
    }
    return s;
  };
  const tree = (x, y, s, seed, sway = "rv-breeze") => {
    const rand = rng(seed);
    const br = [
      ["M0 -110 C -20 -150 -50 -170 -80 -200", 7], ["M-40 -165 C -60 -175 -90 -170 -112 -158", 4],
      ["M0 -110 C 10 -160 0 -200 -10 -242", 6], ["M0 -110 C 30 -140 60 -160 92 -190", 6],
      ["M50 -155 C 70 -150 95 -140 118 -128", 4], ["M-5 -200 C 20 -215 35 -230 46 -256", 4],
      ["M-60 -185 C -70 -210 -66 -236 -56 -258", 3], ["M70 -170 C 90 -190 110 -200 134 -205", 3],
    ];
    const tips = [[-80, -200], [-112, -158], [-10, -242], [92, -190], [118, -128], [46, -256], [-56, -258],
      [134, -205], [-128, -205], [18, -205], [62, -226], [-34, -226], [-96, -128], [104, -232], [-8, -275], [-82, -238]];
    return `<g transform="translate(${x} ${y}) scale(${s})" stroke="${C.ink}" stroke-linecap="round" stroke-linejoin="round">
      <g class="${sway}" style="transform-origin:${x}px ${y - 110 * s}px">
        ${br.map(([d, w]) => `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="${w + 2.4}"/><path d="${d}" fill="none" stroke="${C.bark}" stroke-width="${w}"/>`).join("")}
        <g stroke-width="1.1">${tips.map(([cx, cy]) => clusters(cx, cy, rand)).join("")}</g>
      </g>
      <path d="M-15 0 C-10 -40 -9 -80 -13 -118 L 13 -118 C 9 -80 11 -40 17 0 Z" fill="${C.bark}" stroke-width="1.6"/>
      <path d="M-4 -10 C-2 -50 -3 -80 -6 -110 M5 -20 C6 -60 4 -90 6 -112" fill="none" stroke="#3d2a1d" stroke-width="1.2"/>
    </g>`;
  };

  const fern = (x, y, h, color = C.tan) => {
    let s = `<path d="M${x} ${y} L${x} ${y - h}" />`;
    for (let i = 1; i < h / 7; i++) {
      const yy = y - i * 7, w = (1 - i * 7 / h) * h * .42;
      s += `<path d="M${x} ${yy} L${x - w} ${yy - w * .55} M${x} ${yy} L${x + w} ${yy - w * .55}"/>`;
    }
    return `<g stroke="${color}" stroke-width="1.6" stroke-linecap="round" fill="none">${s}</g>`;
  };

  const person = (x, y, top, legs, s = 1, kid = false) => {
    const h = kid ? .72 : 1;
    return `<g transform="translate(${x} ${y}) scale(${s * h})" stroke="${C.ink}" stroke-width="1.2">
      <path d="M-5 0 L-4 -26 M5 0 L4 -26" stroke="${legs}" stroke-width="5" stroke-linecap="round"/>
      <path d="M-9 -26 C-10 -40 -8 -50 0 -52 C8 -50 10 -40 9 -26 Z" fill="${top}"/>
      <circle cx="0" cy="-59" r="7" fill="${C.skin}"/>
      <path d="M-7 -60 C-7 -68 7 -68 7 -60 C4 -63 -4 -63 -7 -60Z" fill="${C.ink}"/>
    </g>`;
  };

  const birds = (x, y) => `<g class="rv-birds" fill="none" stroke="${C.bark}" stroke-width="2.2" stroke-linecap="round">
    <path d="M${x} ${y} q6 -6 12 0 q6 -6 12 0"/><path d="M${x + 34} ${y + 8} q5 -5 10 0 q5 -5 10 0"/></g>`;

  const PATH = "M40 578 H600 A73 73 0 0 0 600 432 H340 A58 58 0 0 1 340 316 H962";

  /* La escena completa: el camino sinuoso, tres piezas en sus pedestales y el jardín. */
  const scene = (label = "Ilustración: un jardín de esculturas sobre un camino sinuoso") => `
    <svg class="rv-svg rv-scene" viewBox="0 0 1000 640" role="img" aria-label="${label}">
      ${tree(170, 470, 1.25, 7)}
      <g class="rv-road" fill="none">
        <path class="rv-draw" pathLength="1" d="${PATH}" stroke="${C.pathD}" stroke-width="46"/>
        <path class="rv-draw" pathLength="1" d="${PATH}" stroke="${C.path}" stroke-width="40"/>
        <path class="rv-draw" pathLength="1" d="${PATH}" stroke="url(#rvStip)" stroke-width="40"/>
      </g>
      ${fern(96, 612, 46)}${fern(122, 604, 34, C.goldD)}${fern(724, 520, 38, C.bark)}${fern(468, 262, 34, C.bark)}
      ${pedestal(380, 512, 80, 64)}${crystal(380, 506)}
      ${pedestal(520, 374, 92, 58)}${ribbon(522, 366)}
      ${pedestal(760, 262, 60, 54)}${mobile(768, 256)}
      ${person(262, 580, C.blue, C.ink, .95)}
      ${person(648, 432, C.blue, C.ink, 1.05)}${person(622, 432, C.rust, C.ink, 1, true)}
      ${person(918, 318, C.plum, C.ink, .95)}
      ${tree(880, 628, .72, 21, "rv-breeze rv-breeze--late")}
      ${birds(540, 92)}
    </svg>`;

  /* Una sola pieza en su pedestal, para acompañar cada pregunta. */
  const sculpture = (kind) => {
    const art = kind === "ribbon" ? ribbon(110, 196) : kind === "mobile" ? mobile(110, 196) : crystal(110, 198);
    const extra = kind === "mobile" ? 70 : 0;
    return `<svg class="rv-svg rv-sculpt" viewBox="${-extra / 2} 0 ${230 + extra} 300" aria-hidden="true" focusable="false">
      <path d="M-40 284 H280" stroke="${C.pathD}" stroke-width="34" fill="none"/>
      <path d="M-40 284 H280" stroke="${C.path}" stroke-width="29" fill="none"/>
      <path d="M-40 284 H280" stroke="url(#rvStip)" stroke-width="29" fill="none"/>
      ${fern(20, 270, 30)}${fern(206, 266, 24, C.bark)}
      <g class="rv-float">${pedestal(110, 204, 88, 70)}${art}</g>
    </svg>`;
  };

  /* El sendero del reloj: una caminante que avanza mientras corre el tiempo. */
  const TRAIL = "M8 30 C44 30 44 12 80 12 S116 30 152 30 S188 12 224 12";
  const trail = () => `
    <svg class="rv-svg rv-trail" viewBox="0 0 232 42" aria-hidden="true" focusable="false">
      <path d="${TRAIL}" fill="none" stroke="${C.pathD}" stroke-width="9" stroke-linecap="round"/>
      <path d="${TRAIL}" fill="none" stroke="${C.path}" stroke-width="7" stroke-linecap="round"/>
      <path d="${TRAIL}" fill="none" stroke="url(#rvStipFine)" stroke-width="7" stroke-linecap="round"/>
      <path class="rv-trail-done" d="${TRAIL}" fill="none" stroke="${C.gold}" stroke-width="3" stroke-linecap="round"/>
      <g class="rv-walker"><circle r="5.5" fill="${C.plum}" stroke="${C.ink}" stroke-width="1.2"/><circle r="2" fill="${C.gold}"/></g>
      <g fill="${C.gold}" stroke="${C.ink}" stroke-width="1"><rect x="220" y="1" width="9" height="8"/><polygon points="220,1 224,-2 233,-2 229,1"/></g>
    </svg>`;

  window.RevisionArt = { defs, scene, sculpture, trail, colors: C };
})();
