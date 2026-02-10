digraph Nordstream_Pizarron_2026_02_06 {
  // Lienzo: 1440 x 900 px  (72 dpi = 20 x 12.5 in)
  rankdir=LR;
  size="20,12.5!";
  dpi=72;
  ratio=fill;
  bgcolor="white";
  labelloc="t";
  label=<<B>Nord Stream (1 y 2) — cronología, actores y energía</B><BR/>
         <FONT POINT-SIZE="10">(apuntes de clase · 6 feb 2026)</FONT>>;
  fontname="Helvetica Neue";
  fontsize=15;

  newrank=true;
  compound=true;
  splines=true;
  nodesep=0.45;
  ranksep=0.80;
  pad=0.35;

  node [shape=box, style="rounded,filled", fillcolor="white",
        fontname="Helvetica Neue", fontsize=11, margin="0.14,0.08"];
  edge [fontname="Helvetica Neue", fontsize=9, color="gray45"];

  // ========= COLUMNA 1 — CRONOLOGÍA =========
  subgraph cluster_timeline {
    label=<<B>Cronología</B>>;
    style="rounded"; color="#3B78A8"; fontcolor="#3B78A8";
    fontname="Helvetica Neue"; fontsize=12;
    margin=18;

    y2014     [label="2014\n· Euromaidán\n· Referéndum\n· Anexión de Crimea"];
    occidente [label="«Occidente»\nEE.UU. · Canadá · UE\n→ Sanciones"];
    y2016     [label="2016\nBrexit · Trump"];
    y2022_feb [label="2022 (feb)\n«Op. militar especial»\n→ guerra / invasión",
               fillcolor="#FFF3CD"];
    wagner    [label="Grupo Wagner\n(mercenario)"];

    y2014     -> occidente [label="reacción"];
    occidente -> y2016     [label="derivas políticas"];
    y2016     -> y2022_feb [label="escalada"];
    y2022_feb -> wagner    [label="actor en guerra"];
  }

  // ========= COLUMNA 2 — ACTORES =========
  subgraph cluster_actores {
    label=<<B>Actores (empresa + política alemana)</B>>;
    style="rounded"; color="#7D5BA6"; fontcolor="#7D5BA6";
    fontname="Helvetica Neue"; fontsize=12;
    margin=18;

    gazprom   [label="Gazprom", fillcolor="#E8DAEF"];
    schroeder [label="G. Schröder"];
    merkel    [label="A. Merkel"];
    scholz    [label="O. Scholz"];
    merz      [label="F. Merz"];

    merkel -> schroeder [label="legado"];
    scholz -> merkel    [style=dashed, label="continuidades\n/ rupturas"];
    merz   -> scholz    [style=dashed, label="oposición"];

    { rank=same; schroeder; merkel; scholz; merz; }
  }

  // ========= COLUMNA 3 — NORD STREAM =========
  subgraph cluster_nordstream {
    label=<<B>Infraestructura energética crítica</B>>;
    style="rounded"; color="#C0392B"; fontcolor="#C0392B";
    fontname="Helvetica Neue"; fontsize=12;
    margin=18;

    ns1       [label="Nord Stream 1"];
    ns2       [label="Nord Stream 2"];
    sep2022   [shape=oval, style="filled", fillcolor="#F5B7B1",
               label="Sep 2022\nSabotaje"];
    y2023     [label="2023\n(debates)"];
    preguntas [shape=note, style="filled", fillcolor="#FDEBD0",
               label="Preguntas clave\n¿A quién benefició?\n¿Quién tenía motivos?"];

    ns1     -> sep2022    [label="evento clave"];
    ns2     -> sep2022    [label="evento clave"];
    sep2022 -> y2023      [label="consecuencias"];
    sep2022 -> preguntas  [label="investigación"];

    { rank=same; ns1; ns2; }
    { rank=same; y2023; preguntas; }
  }

  // ========= COLUMNA 4 — MIX ENERGÉTICO =========
  subgraph cluster_energia {
    label=<<B>Energía (mezcla y sustituciones)</B>>;
    style="rounded"; color="#1E8449"; fontcolor="#1E8449";
    fontname="Helvetica Neue"; fontsize=12;
    margin=18;

    detenido [label="NS2 detenido"];
    nuclear  [label="E. nuclear"];
    gas44    [label="Gas natural\n≈ 44 %"];
    mix      [label="Mix energético", fillcolor="#D5F5E3"];
    carbon   [label="Carbón"];
    lng      [label="LNG (GNL)"];
    puertos  [label="Puertos"];

    detenido -> nuclear [style=dashed, label="debate / retorno"];
    gas44    -> mix     [label="peso relativo"];
    mix      -> carbon  [label="↑"];
    mix      -> lng     [label="↑"];
    lng      -> puertos [label="infraestructura"];

    { rank=same; detenido; gas44; }
    { rank=same; carbon; lng; }
  }

  // --- Aristas inter-cluster ---
  y2022_feb -> ns1 [style=dashed, color="#C0392B",
                     label="tensión\nenergética"];
  y2022_feb -> ns2 [style=dashed, color="#C0392B",
                     label="tensión\nenergética"];

  gazprom -> ns1 [label="vínculo", color="#7D5BA6",
                   lhead=cluster_nordstream];
  gazprom -> ns2 [label="vínculo", color="#7D5BA6",
                   lhead=cluster_nordstream];

  ns2 -> detenido [label="status", color="#1E8449"];

  preguntas -> gazprom [style=dotted, label="hipótesis"];
  preguntas -> mix     [style=dotted, label="efectos\nen energía"];

  // --- Guías invisibles para distribuir 4 columnas ---
  wagner    -> gazprom  [style=invis, weight=5];
  gazprom   -> ns1      [style=invis, weight=3];
  y2022_feb -> sep2022  [style=invis, weight=5];
  sep2022   -> detenido [style=invis, weight=5];
  preguntas -> gas44    [style=invis, weight=3];
}
