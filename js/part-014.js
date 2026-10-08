
// ===== V7 — Cahier des charges (UI/UX, lecture, panneau, performance). Le texte biblique n'est pas modifié.
(()=>{
const css=document.createElement('style');css.id='v7Style';css.textContent=`
/* 1.3 En-tête compact : barre du titre remontée au maximum */
#app>header .hrow{height:44px!important;padding:0 10px!important}
#app>header .hrow .round{width:34px;height:34px;font-size:15px}
.hright{display:flex;align-items:center;gap:8px}
.demo{height:30px;width:30px;padding:0!important;border-radius:50%;font-size:11px;opacity:.85}
.hdr-photo{width:38px;height:38px;border-radius:50%;object-fit:cover;object-position:58% 22%;border:1.5px solid #fff;box-shadow:0 0 0 1px var(--line),0 3px 10px #0002;display:block;background:#000}
/* pastilles de couleurs : une seule ligne horizontale */
#app>header #legend{display:flex;flex-wrap:nowrap!important;justify-content:flex-start;gap:6px;padding:0 10px 4px!important;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}
#app>header #legend::-webkit-scrollbar{display:none}
#app>header #legend .lg{flex:none;font-size:10.5px;padding:2px 9px 1px}
#paletteStatus{padding:0 12px 4px}
#app>header .refbar{margin:0 10px 6px!important;padding:6px 12px!important;border-radius:14px}
#app>header .letter{width:30px;height:30px;font-size:14px}
#app>header .rt{font-size:15px}
#app>header .rs{font-size:10.5px;margin-top:1px}
#app>header .para-ic{width:30px;height:30px;font-size:11px}
.book-picker{padding:6px 8px;font-size:12px}
.tabs{display:none!important}
#app>main{padding-top:6px!important}
#simReturn{display:none!important}
body.panel-open #wmbBottomNav,body.wmb-selecting #wmbBottomNav{display:none!important}
body:has(#sheet.on) #wmbBottomNav,body:has(#drawer.on) #wmbBottomNav,body:has(#wmbPassageTools:not([hidden])) #wmbBottomNav{display:none!important}
#wmbBottomNav{z-index:200!important}
.mobile-shortcuts{display:none!important}
.sim-shell,#workSearch .work-results,#studyPanel{padding-bottom:calc(96px + env(safe-area-inset-bottom,0px))!important}
#wmbBottomNav .wmb-nav-bubble.is-on{background:var(--ink)!important;color:#fff}
#wmbBottomNav .wmb-nav-bubble.is-on svg{stroke:#fff}
/* 1.2 Trois bulles principales et deux sélecteurs discrets intercalés */
#wmbBottomNav{left:0!important;right:0!important;transform:none!important;justify-content:space-between;padding:0 18px;gap:0!important;width:100%;max-width:920px;margin:0 auto}
#wmbBottomNav .wmb-nav-bubble{width:54px!important;height:54px!important;transition:transform .55s cubic-bezier(.2,1.65,.35,1)}
#wmbBottomNav .wmb-nav-bubble.dragging{transition:none}
@media(max-width:600px){#wmbBottomNav .wmb-nav-bubble{width:52px!important;height:52px!important}}
#wmbBottomNav .wmb-nav-bubble.wmb-nav-context{width:38px!important;height:42px!important;min-width:38px!important;padding:0!important;border:0!important;border-radius:50%!important;background:transparent!important;box-shadow:none!important;display:grid!important;place-items:center!important;touch-action:manipulation!important;transition:none!important}
#wmbBottomNav .wmb-mini-orb{display:grid;place-items:center;width:19px;height:19px;border:1px solid color-mix(in srgb,var(--bubble-ink,#353535) 22%,transparent);border-radius:50%;background:var(--bubble-bg,radial-gradient(circle at 28% 20%,#fff 0%,#ffffffee 42%,#dce5e9 100%));box-shadow:inset 0 1px 2px #fff9,0 2px 5px #2436462b;color:var(--bubble-ink,#353535);transition:transform .16s ease,box-shadow .16s ease}
#wmbBottomNav .wmb-nav-context:active .wmb-mini-orb{transform:scale(.86);box-shadow:inset 0 1px 2px #fff8,0 1px 2px #24364622}
#wmbBottomNav .wmb-nav-context svg{width:9px;height:9px;overflow:visible;pointer-events:none;stroke:var(--bubble-ink,#353535)!important}
#wmbBottomNav .wmb-nav-context.context-off{visibility:hidden!important;opacity:0!important;pointer-events:none!important}
@media(max-width:600px){#wmbBottomNav .wmb-nav-bubble.wmb-nav-context{width:38px!important;height:42px!important}}

/* 2.1 Lecture plein écran : barre minimale seule */
body.reading-only #wmbReadingBar{padding:calc(5px + env(safe-area-inset-top,0px)) 12px 5px;box-shadow:none;cursor:pointer;justify-content:center}
body.reading-only .wmb-reading-main{font:500 13px/1.2 system-ui;letter-spacing:.01em}
body.reading-only .wmb-reading-sub{font:300 11px system-ui;margin-top:1px}
body.reading-only .wmb-reading-btn{display:none!important}
body.reading-only #app>main{padding-top:48px!important}
body.reading-only .bhead,body.reading-only .wmb-cross,body.reading-only .color-tools,body.reading-only #paletteStatus,body.reading-only .empty-filter{display:none!important}
body.reading-only .vcard,body.reading-only .pcard{background:transparent;padding:6px 4px;margin-bottom:4px}
/* 2.2 Panneau latéral deux tons */
.drawer .dh,.drawer .panel-tabs{background:var(--ink)!important;color:#fff;border-bottom:0}
.drawer .dh .round{background:#fff!important;color:var(--ink)!important}
.drawer .dh .x{background:rgba(255,255,255,.14);color:#fff}
.drawer .panel-tab{background:rgba(255,255,255,.1)!important;color:#fff!important}.drawer .panel-tab small{color:#cfc8bf!important}
.drawer .panel-tab.on{background:#fff!important;color:var(--ink)!important}.drawer .panel-tab.on small{color:var(--mut)!important}
.pg-box{margin:0 0 10px;border-radius:16px;overflow:hidden;border:1px solid var(--line);background:#fff}
.pg-head{background:var(--ink);color:#fff;padding:10px 12px}
.pg-head b{display:block;font-size:13px;line-height:1.3}.pg-head small{display:block;font-size:11px;opacity:.7;margin-top:2px}
.pg-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:6px;padding:10px;max-height:46vh;overflow-y:auto}
.pg-grid button{height:40px;border:0;border-radius:10px;background:var(--bg);font-weight:800;font-size:13px;color:var(--ink)}
.pg-grid button.on{background:var(--navy);color:#fff}
.dit.dash{background:#fff;border:1px dashed var(--line)}
/* V7.1 — Tecno Spark 40 : texte à taille normale, centré */
#app{max-width:100vw!important;margin:0 auto}
#app>main{padding-left:10px!important;padding-right:10px!important;max-width:560px;margin:0 auto}
.vcard,.pcard{padding:12px 14px;border-radius:16px;margin-bottom:9px}
.vt{font-size:16px!important;line-height:1.55!important}
.pt{font-size:15.5px!important;line-height:1.6!important}
.num{width:22px;height:22px;font-size:10px;margin-right:6px}
.vh,.ph{margin-bottom:6px}
.lk,.lkb{padding:5px 10px;font-size:11px}
/* Correspondances repliées : seuls les nombres par couleur restent visibles */
.vcard:not(.cc-open) .chips,.pcard:not(.cc-open) .chips,.vcard:not(.cc-open) .wmb-cross,.pcard:not(.cc-open) .wmb-cross{display:none!important}
.cc-bar{display:flex;align-items:center;gap:6px;margin-top:8px;padding:5px 8px;border-radius:99px;background:var(--bg);cursor:pointer;user-select:none;font:800 10.5px system-ui;color:var(--mut)}
.cc-bar .cc{display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:20px;padding:0 6px;border-radius:99px;color:#fff;font-size:11px}
.cc.c0{background:var(--c0)}.cc.c1{background:var(--c1)}.cc.c2{background:var(--c2)}.cc.c3{background:var(--c3)}
.cc-bar .cc-caret{margin-left:auto;font-size:12px;color:var(--ink)}
.cc-open .cc-bar .cc-caret{transform:rotate(90deg)}
body.reading-only .cc-bar{display:none!important}
/* Ordre visuel : recherche · livres/brochures · tableau de bord · sections · Bible/brochures */
#wmbNavSearch{order:-2}#wmbNavContextBooks{order:-1}#wmbNavDash{order:0}#wmbNavContextSections{order:1}#wmbNavBook{order:2}
/* ===== Modes de présentation (Paramètres → Mode de présentation) ===== */
/* Modèle 1 — Classique : grandes cartes, brochures & passages croisés visibles en bas */
body[data-presentation="1"] .vcard,body[data-presentation="1"] .pcard{padding:18px 18px;border-radius:22px;margin-bottom:12px}
body[data-presentation="1"] .vt{font-size:18px!important;line-height:1.6!important}
body[data-presentation="1"] .pt{font-size:17px!important;line-height:1.68!important}
body[data-presentation="1"] .num{width:26px;height:26px;font-size:10.5px;margin-right:8px}
body[data-presentation="1"] .vcard .chips,body[data-presentation="1"] .pcard .chips{display:flex!important}
body[data-presentation="1"] .cc-bar{background:transparent;padding:4px 0 0;border-top:1px dashed var(--line);border-radius:0;margin-top:10px}
body[data-presentation="1"] #app>main{max-width:none}
/* Modèle 2 — Compact (défaut) : réglé plus haut */
/* Modèle 3 — Élégant : papier chaud, filet coloré, numéros discrets */
body[data-presentation="3"]{--bg:#FAF5EC;--line:#EADFCF}
body[data-presentation="3"] #app>header{background:#FAF5EC}
body[data-presentation="3"] .vcard,body[data-presentation="3"] .pcard{background:#FFFDF9;border-radius:6px 18px 18px 6px;border-left:3px solid #C9A25B;box-shadow:0 1px 0 #EADFCF,0 8px 22px rgba(120,90,40,.07)!important;padding:14px 16px 12px 16px;margin-bottom:10px}
body[data-presentation="3"] .vcard.key{border-left-color:var(--orange);background:#FFF9EE}
body[data-presentation="3"] .vt,body[data-presentation="3"] .pt{font-family:Fraunces,Georgia,"Times New Roman",serif;font-size:17px!important;line-height:1.7!important;color:#241F18}
body[data-presentation="3"] .num{background:transparent;color:#B4863C;width:auto;height:auto;font-size:11px;font-weight:800;margin-right:6px;vertical-align:6px;font-family:Fraunces,Georgia,serif}
body[data-presentation="3"] .vcard.key .num{background:transparent;color:var(--orange)}
body[data-presentation="3"] .vref,body[data-presentation="3"] .pref{color:#B4863C;opacity:1;font-size:10px}
body[data-presentation="3"] .lk,body[data-presentation="3"] .lkb{background:#241F18;border-radius:8px}
body[data-presentation="3"] .cc-bar{background:transparent;padding:6px 0 0;margin-top:8px;border-top:1px solid #EADFCF;border-radius:0;color:#8A6A3A}
body[data-presentation="3"] .cc-bar .cc{border-radius:6px;height:18px;font-size:10.5px}
body[data-presentation="3"] .chip,body[data-presentation="3"] .rchip{border-radius:8px}
body[data-presentation="3"] .refbar{background:#FFFDF9;border:1px solid #EADFCF}
body[data-presentation="3"] .letter{background:#F3E6CF;color:#B4863C}
body[data-presentation="3"] #wmbBottomNav .wmb-nav-bubble{border-color:#EADFCF;background:radial-gradient(circle at 28% 20%,#fff 0%,#FFFDF9 40%,#F1E6D3 100%)}
/* Modèle 4 — Nuit : lecture sombre reposante */
body[data-presentation="4"]{--bg:#141922;--ink:#ECE6DA;--mut:#9AA3B2;--line:#26303D;--navy:#9CC3FF;background:#141922;color:#ECE6DA}
body[data-presentation="4"] #app>header,body[data-presentation="4"] #wmbReadingBar{background:#141922!important;border-color:#26303D}
body[data-presentation="4"] .vcard,body[data-presentation="4"] .pcard{background:#1D2530;box-shadow:none!important;border:1px solid #26303D;border-radius:16px}
body[data-presentation="4"] .vcard.key{background:#262418;border-color:#4A3E1E}
body[data-presentation="4"] .vt,body[data-presentation="4"] .pt{color:#ECE6DA;font-size:16.5px!important;line-height:1.65!important}
body[data-presentation="4"] .num{background:#D2A85A;color:#141922}
body[data-presentation="4"] .vcard.key .lk,body[data-presentation="4"] .lkb{background:#D2A85A;color:#141922}
body[data-presentation="4"] .badge,body[data-presentation="4"] .demo{background:#26303D}
body[data-presentation="4"] .refbar,body[data-presentation="4"] .round,body[data-presentation="4"] .book-picker{background:#1D2530!important;color:#ECE6DA!important}
body[data-presentation="4"] .lg{background:#1D2530}
body[data-presentation="4"] .cc-bar{background:#141922;color:#9AA3B2}
body[data-presentation="4"] .chip,body[data-presentation="4"] .rchip{background:#26303D;color:#CFE0FF}
body[data-presentation="4"] .chip.more{background:#26303D;color:#ECE6DA}
body[data-presentation="4"] .wmb-cross{background:#1D2530;border-color:#26303D;color:#ECE6DA}
body[data-presentation="4"] .wmb-cross-ref,body[data-presentation="4"] .wmb-cross-proof{background:#141922;color:#ECE6DA;border-color:#26303D}
body[data-presentation="4"] #wmbBottomNav .wmb-nav-bubble{background:#1D2530;border-color:#26303D;box-shadow:0 7px 20px #0006}
body[data-presentation="4"] #wmbBottomNav .wmb-nav-bubble svg{stroke:#ECE6DA}
body[data-presentation="4"] .sheet,body[data-presentation="4"] .drawer{background:#1D2530;color:#ECE6DA}
body[data-presentation="4"] .grid button,body[data-presentation="4"] .pg-grid button,body[data-presentation="4"] .x{background:#141922;color:#ECE6DA}
body[data-presentation="4"] .hint,body[data-presentation="4"] .bhead{background:#0E1218}
body[data-presentation="4"] .list .it,body[data-presentation="4"] .dit,body[data-presentation="4"] .li,body[data-presentation="4"] .vitem{background:#141922;color:#ECE6DA;border-color:#26303D}
body[data-presentation="4"] .find{background:#141922;color:#ECE6DA;border-color:#26303D}
/* Modèle 5 — Continu : texte qui s'enchaîne comme une Bible imprimée */
body[data-presentation="5"] #bibleView,body[data-presentation="5"] #msgView{background:#fff;border-radius:14px;padding:16px 14px;box-shadow:0 1px 2px rgba(0,0,0,.04),0 12px 32px rgba(0,0,0,.06)}
body[data-presentation="5"] .vcard{display:inline;background:transparent!important;border:0!important;box-shadow:none!important;padding:0!important;margin:0!important;border-radius:0}
body[data-presentation="5"] .vcard .vh{display:none}
body[data-presentation="5"] .vt{display:inline;font-size:17px!important;line-height:1.85!important;text-align:justify}
body[data-presentation="5"] .vt:after{content:" "}
body[data-presentation="5"] .num{background:transparent;color:#B35C00;width:auto;height:auto;font-size:10.5px;font-weight:800;margin:0 3px 0 0;vertical-align:7px}
body[data-presentation="5"] .vcard.key .vt{background:#FFF6DE;box-decoration-break:clone;-webkit-box-decoration-break:clone}
body[data-presentation="5"] .vcard .cc-bar{display:inline-flex;padding:0 5px;margin:0 3px;gap:3px;background:transparent;vertical-align:middle;font-size:0}
body[data-presentation="5"] .vcard .cc-bar .cc{min-width:16px;height:15px;font-size:9.5px;padding:0 4px}
body[data-presentation="5"] .vcard .cc-bar .cc-caret{display:none}
body[data-presentation="5"] .vcard.cc-open{display:block;margin:10px 0!important;padding:10px!important;background:#FBF8F3!important;border-radius:12px}
body[data-presentation="5"] .vcard.cc-open .vh{display:flex}
body[data-presentation="5"] .pcard{background:transparent;box-shadow:none!important;padding:0 0 12px;margin:0;border-bottom:1px solid var(--line);border-radius:0}
body[data-presentation="5"] .pt{font-size:16.5px!important;line-height:1.8!important;text-align:justify}
body[data-presentation="5"] .pref{color:#B35C00;opacity:1}
/* Sélection tactile : pas de menu natif du téléphone dans la lecture */
#bibleView,#msgView,.vcard,.pcard,.vt,.pt{-webkit-user-select:none!important;user-select:none!important;-webkit-touch-callout:none!important;-webkit-tap-highlight-color:transparent}
/* Bulle flottante d'annotation (surligner / souligner / copier / supprimer) */
#wmbPassageTools{position:fixed!important;left:12px!important;right:auto!important;bottom:auto!important;top:120px;width:min(236px,calc(100vw - 24px));max-height:none!important;padding:8px 10px!important;border-radius:20px!important;background:rgba(255,255,255,.72)!important;backdrop-filter:blur(14px) saturate(1.3);-webkit-backdrop-filter:blur(14px) saturate(1.3);border:1px solid rgba(255,255,255,.9)!important;box-shadow:0 10px 30px rgba(20,30,45,.18),inset 0 1px 0 #fff!important;z-index:210!important;font:12px system-ui;color:var(--ink);transform:none!important}
#wmbPassageTools .wmb-line{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:3px 0}
#wmbPassageTools #wmbSelectionCount{font-size:11px;font-weight:800;color:var(--mut)}
#wmbPassageTools label{display:inline-flex!important;align-items:center;gap:4px;font-size:11px;font-weight:700;background:rgba(255,255,255,.7);border-radius:99px;padding:3px 8px 3px 5px;margin:0}
#wmbPassageTools input[type=checkbox]{width:15px;height:15px;margin:0;accent-color:#1a1c1e}
#wmbPassageTools input[type=color]{width:22px!important;height:22px!important;border:0;padding:0;border-radius:50%;background:transparent;overflow:hidden}
#wmbPassageTools input[type=color]::-webkit-color-swatch-wrapper{padding:0}#wmbPassageTools input[type=color]::-webkit-color-swatch{border:1px solid #0002;border-radius:50%}
#wmbPassageTools details{width:100%;font-size:11px}#wmbPassageTools summary{cursor:pointer;color:var(--navy);font-weight:700;padding:2px 0}
#wmbPassageTools .wmb-themes{grid-template-columns:repeat(4,1fr);gap:5px;margin:6px 0}#wmbPassageTools .wmb-theme{min-height:34px;padding:5px;font-size:10px;border-radius:9px}
#wmbPassageTools button{border:0!important;border-radius:50%!important;width:36px;height:36px;padding:0!important;display:inline-grid;place-items:center;background:rgba(255,255,255,.85)!important;color:var(--ink);font:800 15px system-ui;box-shadow:0 2px 6px #0001;cursor:pointer}
#wmbPassageTools #wmbApply{background:var(--ink)!important;color:#fff}
#wmbPassageTools #wmbErase{color:#B00020}
#wmbPassageTools #wmbSelectionClose{width:26px;height:26px;font-size:12px}
#wmbPassageTools #wmbMarkInfo{margin:2px 0 0;font-size:10.5px;line-height:1.35}#wmbPassageTools #wmbMarkInfo:empty{display:none}
#wmbPassageTools .wmb-acts{display:flex;justify-content:space-around;gap:6px;margin-top:4px}
body[data-presentation="4"] #wmbPassageTools{background:rgba(29,37,48,.82)!important;border-color:#26303D!important;color:#ECE6DA}
body[data-presentation="4"] #wmbPassageTools button,body[data-presentation="4"] #wmbPassageTools label{background:#141922!important;color:#ECE6DA}
/* Échelle générale : réglée dans Paramètres */
.scale-card input[type=range]{width:100%}
.scale-card .scale-val{font-weight:800}
/* ===== Arrière-plans (Paramètres → Arrière-plan) : couleurs pilotées par variables ===== */
body[data-bg]{background:var(--bg)!important;color:var(--ink)}
body[data-bg] #app>header,body[data-bg] #wmbReadingBar,body[data-bg] .tabs,body[data-bg] #workSearch,body[data-bg] #studyPanel,body[data-bg] #simDashboard,body[data-bg] .work-head,body[data-bg] .drawer>div{background:var(--bg)!important;color:var(--ink);border-color:var(--line)}
body[data-bg] .vcard,body[data-bg] .pcard,body[data-bg] .refbar,body[data-bg] .round,body[data-bg] .book-picker,body[data-bg] .lg,body[data-bg] .sheet,body[data-bg] .drawer,body[data-bg] .list .it,body[data-bg] .dit,body[data-bg] .li,body[data-bg] .vitem,body[data-bg] .find,body[data-bg] .wmb-cross,body[data-bg] .pres-card,body[data-bg] .study-card,body[data-bg] .native-card,body[data-bg] .work-card,body[data-bg] .sim-tile,body[data-bg] .tab,body[data-bg] .work-input,body[data-bg] #workQueryRow,body[data-bg] .global-strip button,body[data-bg] .work-row button,body[data-bg] .work-tabs button,body[data-bg] .panel-item,body[data-bg] .pg-box{background:var(--card)!important;color:var(--ink)!important;border-color:var(--line)!important}
body[data-bg] .vcard.key{background:var(--card2)!important}
body[data-bg] .grid button,body[data-bg] .pg-grid button,body[data-bg] .x,body[data-bg] .cc-bar,body[data-bg] .chip,body[data-bg] .rchip,body[data-bg] .wmb-cross-ref,body[data-bg] .wmb-cross-proof,body[data-bg] .letter,body[data-bg] .para-ic,body[data-bg] .native-sn,body[data-bg] .found,body[data-bg] .vbox{background:var(--card2)!important;color:var(--ink)!important;border-color:var(--line)!important}
body[data-bg] .vt,body[data-bg] .pt,body[data-bg] .rt,body[data-bg] .t2,body[data-bg] .t3,body[data-bg] h3,body[data-bg] .native-title{color:var(--ink)!important}
body[data-bg] .rs,body[data-bg] .vref,body[data-bg] .pref,body[data-bg] .work-note,body[data-bg] .native-sub{color:var(--mut)!important}
body[data-bg] .num{background:var(--accent)!important;color:var(--bg)!important}
body[data-bg] .lk,body[data-bg] .lkb,body[data-bg] .tab.on,body[data-bg] .work-tabs button.on,body[data-bg] .global-strip button.on,body[data-bg] .grid button.on,body[data-bg] .pg-grid button.on,body[data-bg] #wmbApply,body[data-bg] .native-open,body[data-bg] #workGo{background:var(--accent)!important;color:var(--bg)!important}
body[data-bg] .bhead,body[data-bg] .hint,body[data-bg] .dh,body[data-bg] .panel-tabs,body[data-bg] .pg-head{background:var(--accent)!important;color:var(--bg)!important}
body[data-bg] .drawer .panel-tab.on{background:var(--bg)!important;color:var(--ink)!important}
body[data-bg] .u.c0{background:rgba(15,123,63,.22)}body[data-bg] .u.c1{background:rgba(30,91,255,.22)}body[data-bg] .u.c2{background:rgba(179,92,0,.22)}body[data-bg] .u.c3{background:rgba(176,0,32,.22)}
body[data-bg] #wmbPassageTools{background:color-mix(in srgb,var(--card) 78%,transparent)!important;color:var(--ink);border-color:var(--line)!important}
body[data-bg] #wmbPassageTools button,body[data-bg] #wmbPassageTools label{background:var(--card2)!important;color:var(--ink)}
/* Contraste des bulles */
#wmbBottomNav .wmb-nav-bubble{background:var(--bubble-bg,radial-gradient(circle at 28% 20%,#fff 0%,#ffffffee 38%,#e7ecefdc 78%,#d4dfe5 100%))!important;opacity:var(--bubble-a,1)}
#wmbBottomNav .wmb-nav-bubble.is-on{background:var(--ink)!important;opacity:1}
#wmbBottomNav .wmb-nav-bubble svg{stroke:var(--bubble-ink,#353535)}
.bg-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
.bg-sw{aspect-ratio:1;border-radius:12px;border:2px solid var(--line);cursor:pointer;display:flex;align-items:flex-end;justify-content:center;font:800 9px system-ui;padding:3px;text-align:center;line-height:1.1;overflow:hidden}
.bg-sw.on{outline:3px solid var(--navy);outline-offset:1px}
.bubble-row{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}
.bubble-row .pres-opt{flex:1;text-align:center;padding:8px 4px}
/* Sélecteur dans les paramètres */
.pres-card{background:var(--study-paper,#fff);border:1px solid var(--line);border-radius:16px;padding:14px;margin:12px 0}
.pres-card h3{margin:0 0 8px;font-size:14px}
.pres-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}@media(max-width:400px){.pres-grid{grid-template-columns:repeat(2,1fr)}}
.pres-prev.p4{background:#141922}.pres-prev.p4:before{background:#1D2530}.pres-prev.p5:before{background:repeating-linear-gradient(#fff 0 4px,#ddd 4px 5px)}
.pres-opt{border:2px solid var(--line);border-radius:14px;padding:10px 8px;background:#fff;cursor:pointer;text-align:left;font:inherit;color:var(--ink)}
.pres-opt.on{border-color:var(--ink);box-shadow:0 0 0 2px #1a1c1e22}
.pres-opt b{display:block;font-size:12.5px}.pres-opt small{display:block;font-size:10.5px;color:var(--mut);margin-top:3px;line-height:1.35}
.pres-prev{height:34px;border-radius:8px;margin-bottom:6px;background:#F6F3EE;position:relative;overflow:hidden}
.pres-prev:before{content:"";position:absolute;left:6px;right:6px;top:6px;height:22px;border-radius:6px;background:#fff;box-shadow:0 1px 3px #0001}
.pres-prev.p1:before{height:26px;top:4px;border-radius:9px}
.pres-prev.p3{background:#FAF5EC}.pres-prev.p3:before{border-left:3px solid #C9A25B;border-radius:3px 6px 6px 3px;background:#FFFDF9}
/* 4.1 Accordéon des résultats brochures */
#workSearch .native-acc{display:flex;align-items:center;gap:6px;width:100%;border:0;border-top:1px solid #f1eae1;background:#fbf8f3;color:var(--navy);padding:10px 16px;font:800 12px system-ui;cursor:pointer;text-align:left}
#workSearch .native-acc .acc-caret{display:inline-block;width:14px}
`;document.head.appendChild(css);

// ---- 1.2 Comportement élastique : étirement vers le centre jusqu'à la moitié de l'écran, retour fluide.
window.elasticNav=function(el){let st=null,moved=false;
 el.addEventListener('pointerdown',e=>{if(e.button)return;el.style.transform='';const r=el.getBoundingClientRect();st={x:e.clientX,y:e.clientY,cx:r.left+r.width/2,id:e.pointerId};moved=false;try{el.setPointerCapture(e.pointerId)}catch(_){}});
 el.addEventListener('pointermove',e=>{if(!st)return;let dx=e.clientX-st.x,dy=e.clientY-st.y;if(!moved&&Math.hypot(dx,dy)<6)return;moved=true;el.classList.add('dragging');
  const mid=innerWidth/2,toCenter=mid-st.cx;
  if(Math.abs(toCenter)>4){const lim=Math.abs(toCenter);const sign=Math.sign(toCenter);let along=dx*sign;along=along>0?Math.min(along,lim):-Math.min(-along*0.35,24);dx=along*sign;}
  else{const lim=innerWidth/4;dx=Math.max(-lim,Math.min(lim,dx));}
  dy=Math.max(-70,Math.min(24,dy*0.5));
  el.style.transform=`translate(${dx}px,${dy}px)`;});
 const release=()=>{if(!st)return;st=null;el.classList.remove('dragging');el.style.transform='';if(moved){el.dataset.dragged='1';setTimeout(()=>delete el.dataset.dragged,400)}};
 el.addEventListener('pointerup',release);el.addEventListener('pointercancel',release);el.addEventListener('lostpointercapture',release);
 el.addEventListener('click',e=>{if(el.dataset.dragged){e.preventDefault();e.stopImmediatePropagation()}},true);
};

const ready=()=>new Promise(r=>{const t=setInterval(()=>{if(D&&D.books){clearInterval(t);r()}},50)});
ready().then(()=>{
 // ---- Grille de paragraphes (feuille rapide en lecture + panneau latéral)
 function paras(){if(S.doc==null)return null;const m=D.meta[S.doc],z=m[4],d=ZD[z];if(!d)return null;return {m,ps:d.docs[S.doc-D.zoff[z]][4]};}
 window.gotoPara=function(n){S.curP=n;const el=$('p_'+n);if(!el)return;el.hidden=false;el.scrollIntoView({block:'center'});el.classList.add('flash');setTimeout(()=>el.classList.remove('flash'),2000);const c=$('curP');if(c)c.textContent='§ '+n;if(window.__v7bar)window.__v7bar();};
 function gridHtml(cls){const p=paras();if(!p)return '';return `<div class="${cls}">${p.ps.map(([n])=>`<button type="button" class="${n===(S.curP||1)?'on':''}" data-pg="${n}">${n}</button>`).join('')}</div>`;}
 window.openParaGrid=function(){const p=paras();if(!p){openDrawer();return}$('shTitle').textContent=`${p.m[0]} — ${p.m[1]}`;$('shSub').textContent=`${p.ps.length} paragraphes • ${year(p.m[0])} • touchez un numéro`;$('shBody').innerHTML=gridHtml('grid');
  $('shBody').querySelectorAll('[data-pg]').forEach(b=>b.onclick=()=>{closeSheet();gotoPara(+b.dataset.pg)});openSheet();const on=$('shBody').querySelector('.on');if(on)on.scrollIntoView({block:'center'});};
 // ---- 2.2 Panneau latéral : grille directe des paragraphes 1 → dernier
 const prevDraw=drawDrawer;
 drawDrawer=function(q){prevDraw(q);const body=$('dBody');
  if(typeof panelMode!=='undefined'&&panelMode==='msg'&&S.doc!=null&&!String(q||'').trim()){const p=paras();if(p){const box=document.createElement('div');box.className='pg-box';box.innerHTML=`<div class="pg-head"><b>${esc(p.m[1])}</b><small>${p.m[0]} • ${year(p.m[0])} • ${p.m[2]==='VGR'?'VGR':'Shekinah'} • ${p.ps.length} paragraphes</small></div>`+gridHtml('pg-grid');body.prepend(box);
   box.querySelectorAll('[data-pg]').forEach(b=>b.onclick=()=>{closeDrawer();gotoPara(+b.dataset.pg)});const on=box.querySelector('.on');if(on)on.scrollIntoView({block:'nearest'});}}
  if(window.GarageSimulation&&!body.querySelector('.dit.dash')){const d=document.createElement('div');d.className='dit dash';d.innerHTML='▦ Tableau de bord<small>Recherche, notes, marquages, historiques, paramètres</small>';d.onclick=()=>{closeDrawer();GarageSimulation.show()};body.append(d);}
 };
 // ---- Correspondances repliées : nombre par couleur, dépliage au clic
 function ccBar(card,links){if(card.querySelector('.cc-bar'))return;if(!links.length)return;const c=[0,0,0,0];links.forEach(li=>c[D.links[li][3]]++);
  const bar=document.createElement('div');bar.className='cc-bar';bar.title='Afficher / masquer les correspondances';
  bar.innerHTML='<span>Correspondances</span>'+c.map((n,k)=>n?`<b class="cc c${k}" title="${CAT[k]}">${n}</b>`:'').join('')+'<span class="cc-caret">▸</span>';
  bar.onclick=e=>{e.stopPropagation();card.classList.toggle('cc-open')};
  const head=card.querySelector('.vh,.ph');if(head)head.after(bar);else card.prepend(bar);}
 function decorateCC(){if(S.mode==='bible')document.querySelectorAll('#bibleView .vcard').forEach(card=>ccBar(card,linksOfVi(viOf(S.book,S.chap,+card.id.slice(2)))));
  else if(S.doc!=null)document.querySelectorAll('#msgView .pcard').forEach(card=>ccBar(card,linksOfPara(S.doc,+card.id.slice(2))));}
 const prevRB=renderBible;renderBible=function(v){const r=prevRB(v);decorateCC();return r;};
 decorateCC();
 // ---- mémoriser la dernière brochure pour la bascule
 const prevOpen=openBrochure;openBrochure=async function(dg,pn,vi){const r=await prevOpen(dg,pn,vi);window.lastDoc=S.doc;decorateCC();return r;};
 // ---- barre de lecture : suivre le paragraphe courant
 window.__v7bar=()=>{const t=$('wmbReadingSub');if(!t||S.mode!=='msg'||S.doc==null)return;const m=D.meta[S.doc];t.textContent=`${year(m[0])} • ${m[2]==='VGR'?'VGR':'Shekinah'} • § ${S.curP||1}`;};
 addEventListener('scroll',()=>{clearTimeout(window.__v7t);window.__v7t=setTimeout(window.__v7bar,120)},{passive:true});
 // ---- Depuis la Bible : un paragraphe cité s'ouvre dans une feuille (référence + verset en haut, paragraphe coloré en bas)
 function colorHtml(text,hits,vi){const L=text.length,c=new Int8Array(L).fill(-1);hits.filter(h=>h[2]===vi).sort((a,b)=>b[3]-a[3]).forEach(h=>{const sp=h[5]||[];for(let a=0;a<sp.length;a+=2)for(let x=sp[a];x<sp[a+1]&&x<L;x++)c[x]=h[3]});let o='',x=0;while(x<L){const k=c[x];let y=x;while(y<L&&c[y]===k)y++;const t=esc(text.slice(x,y));o+=k>=0?`<span class="u c${k}">${t}</span>`:t;x=y}return o;}
 window.colorHtml=colorHtml;
 window.openParaSheet=async function(li){const l=D.links[li],dg=l[0],n=l[1],vi=l[2],m=D.meta[dg],z=m[4];
  if(!available(z)){toast(`Cette brochure est dans la zone ${z} (non intégrée ici).`,3000);return}
  $('shTitle').textContent=`${vref(vi)} → §${n} • ${m[0]}`;$('shSub').innerHTML='Chargement du paragraphe…';$('shBody').innerHTML='';openSheet();
  let d;try{d=await loadZone(z)}catch(e){$('shSub').textContent='Paragraphe indisponible.';return}
  const di=dg-D.zoff[z],doc=d.docs[di],para=doc[4].find(x=>x[0]===n);if(!para){$('shSub').textContent='Paragraphe introuvable.';return}
  const hits=d.hmap.get(di*100000+n)||[];const all=linksOfVi(vi);const cnt=[0,0,0,0];all.forEach(k=>cnt[D.links[k][3]]++);
  const same=all.filter(k=>D.links[k][0]===dg).map(k=>D.links[k][1]).filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b);
  $('shSub').innerHTML=`<span class="serif">« ${esc(vtext(vi))} »</span><div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap;align-items:center"><span style="font:800 10.5px system-ui;color:var(--mut)">${all.length} paragraphe${all.length>1?'s':''} rattaché${all.length>1?'s':''} :</span>${cnt.map((c,k)=>c?`<b class="cc c${k}" title="${CAT[k]}">${c}</b>`:'').join('')}</div>`;
  let h=`<div class="pcard" style="box-shadow:none;border:1px solid var(--line)"><div class="ph"><span class="pref">§${n} • ${m[0]} • ${year(m[0])} • ${m[2]==='VGR'?'VGR':'Shekinah'}</span><span class="k c${l[3]}">${CAT[l[3]]}</span></div><div style="font-weight:800;font-size:13px;margin-bottom:6px">${esc(m[1])}</div><p class="pt" style="user-select:text">${colorHtml(para[1],hits,vi)}</p>
   <div class="vacts"><button data-open="${n}">📖 Lire dans la brochure</button>${same.length>1?`<button class="l" data-list="1">§ ${same.join(' · § ')}</button>`:''}</div></div>`;
  if(same.length>1)h+=`<div class="gtitle">Autres paragraphes de cette brochure pour ${vref(vi,true)}</div><div class="grid">${same.filter(x=>x!==n).map(x=>`<button data-p="${x}">§${x}</button>`).join('')}</div>`;
  h+=`<div class="gtitle" style="margin-top:14px">Toutes les brochures</div><button class="f" id="psAll" style="display:block;margin:4px auto 10px">Voir les ${all.length} paragraphes liés →</button>`;
  $('shBody').innerHTML=h;$('shBody').scrollTop=0;
  $('shBody').querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{closeSheet();openBrochure(dg,+b.dataset.open,vi)});
  $('shBody').querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{const k=all.find(q=>D.links[q][0]===dg&&D.links[q][1]===+b.dataset.p);if(k!=null)openParaSheet(k)});
  const pa=$('psAll');if(pa)pa.onclick=()=>openVerseSheet(vi);};
 // Les pastilles des versets et la liste « MSG liés » ouvrent ce panneau au lieu de la brochure
 const prevRB2=renderBible;renderBible=function(v){const r=prevRB2(v);document.querySelectorAll('#bibleView [data-li]').forEach(e=>e.onclick=ev=>{ev.stopPropagation();openParaSheet(+e.dataset.li)});return r;};
 document.querySelectorAll('#bibleView [data-li]').forEach(e=>e.onclick=ev=>{ev.stopPropagation();openParaSheet(+e.dataset.li)});
 // (feuille verset : les paragraphes sont déployés en entier et colorés ; un appui entre directement dans la brochure)
 // ---- Filtre « Livre » de la recherche : même cadre / même style que les autres grilles (plus de menu système noir)
(function(){const sel=document.getElementById('globalBook'),btn=document.getElementById('globalBookBtn'),grid=document.getElementById('globalBookGrid');if(!sel||!btn||!grid)return;
  const label=()=>{const v=+sel.value;btn.textContent=(v>=0&&D?D.books[v][0]:'Tous les livres')+' ▾';grid.querySelectorAll('[data-gb]').forEach(b=>b.classList.toggle('on',+b.dataset.gb===v))};
  const build=()=>{if(!D||grid.dataset.ok)return;const g=(a,b)=>D.books.slice(a,b).map((x,i)=>`<button type="button" data-gb="${a+i}" title="${esc(x[0])}">${ABBR[a+i]}</button>`).join('');
    grid.innerHTML=`<button type="button" class="all" data-gb="-1">Tous les livres de la Bible</button><div class="gtitle">Ancien Testament</div><div class="grid">${g(0,39)}</div><div class="gtitle">Nouveau Testament</div><div class="grid">${g(39,66)}</div>`;grid.dataset.ok='1';
    grid.querySelectorAll('[data-gb]').forEach(b=>b.onclick=()=>{sel.value=b.dataset.gb;if(sel.onchange)sel.onchange();grid.hidden=true;btn.setAttribute('aria-expanded','false');label()})};
  btn.onclick=()=>{build();grid.hidden=!grid.hidden;btn.setAttribute('aria-expanded',String(!grid.hidden));label()};
  setInterval(()=>{if(!btn.isConnected)return;const want=(+sel.value>=0&&D?D.books[+sel.value][0]:'Tous les livres')+' ▾';if(btn.textContent!==want)label()},500);
})();
// ---- Bulles contextuelles : lecture = recherche | tableau de bord | livre ouvert ; hors lecture = Bible fermée | tableau de bord | livre ouvert
 const ICON_SEARCH='<svg width="27" height="27" viewBox="0 0 32 32" fill="none" stroke="#353535" stroke-width="2.5" stroke-linecap="round"><circle cx="13" cy="13" r="9"/><path d="m20 20 8 8"/></svg>';
 const ICON_BIBLE='<svg width="26" height="26" viewBox="0 0 32 32" fill="none" stroke="#353535" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h20v26H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z"/><path d="M5 24h22"/><path d="M16 8v11M11 12h10"/></svg>';
 const view=()=>{const h=id=>{const e=$(id);return !e||e.hidden};return !h('simDashboard')?'dashboard':!h('workSearch')?'search':!h('studyPanel')?'study':!h('nb')?'study':'reader';};
 async function backToReader(mode){try{if(window.GarageStudy&&GarageStudy.flush)await GarageStudy.flush();}catch(e){}
  {const n=$('nb');if(n&&!n.hidden)n.hidden=true;}const sp=$('studyPanel');if(sp&&!sp.hidden){const c=$('studyClose');if(c&&c.onclick)try{await c.onclick();}catch(e){sp.hidden=true;}else sp.hidden=true;}
  const ws=$('workSearch');if(ws&&!ws.hidden){const c=$('workClose');if(c)c.click();else ws.hidden=true;}
  const dash=$('simDashboard');if(dash)dash.hidden=true;const sr=$('simReturn');if(sr)sr.hidden=true;
  const anno=$('annoToolbar');if(anno&&!anno.hidden&&$('annoClose'))$('annoClose').click();
  closeDrawer();closeSheet();document.body.classList.remove('reading-only');
  if(mode==='bible')$('tabBible').click();else if(S.doc==null&&window.lastDoc!=null)await openBrochure(window.lastDoc,S.curP||0,null);else $('tabMSG').click();
  updateNav();}
 window.v7Left=()=>{if(view()==='reader'){document.body.classList.remove('reading-only');$('searchFloat')&&$('searchFloat').click();setTimeout(updateNav,80);}else backToReader('bible');};
 window.v7Center=()=>{if(view()==='reader'){document.body.classList.remove('reading-only');closeDrawer();closeSheet();if(window.GarageSimulation)GarageSimulation.show();setTimeout(updateNav,80);}else backToReader(S.mode);};
 const prevBook=$('wmbNavBook')&&$('wmbNavBook').onclick;
 if($('wmbNavBook'))$('wmbNavBook').onclick=async()=>{if(view()==='reader'){if(prevBook)await prevBook();}else await backToReader('msg');};
 function updateNav(){const v=view(),L=$('wmbNavSearch'),C=$('wmbNavDash'),R=$('wmbNavBook');if(!L||!C||!R)return;
  const reader=v==='reader';const li=reader?ICON_SEARCH:ICON_BIBLE;if(L.dataset.icon!==(reader?'s':'b')){L.innerHTML=li;L.dataset.icon=reader?'s':'b';}
  L.title=L.ariaLabel=reader?'Recherche':'Retour à la Bible';R.title=R.ariaLabel=reader?'Bible ⇄ Brochures':'Retour à la brochure';C.title=C.ariaLabel=(reader||v==='study')?'Tableau de bord':'Fermer le tableau de bord';
  C.classList.toggle('is-on',v==='dashboard'||v==='search');
  const B=$('wmbNavContextBooks'),P=$('wmbNavContextSections'),isBible=typeof S!=='undefined'&&S&&S.mode==='bible';
  const dash=$('v9Dash'),sheet=$('sheet'),drawer=$('drawer'),overlay=$('ov');
  const showContext=reader&&!document.body.classList.contains('reading-only')&&!document.body.classList.contains('panel-open')&&!document.body.classList.contains('wmb-selecting')&&!(dash&&dash.classList.contains('on'))&&!(sheet&&sheet.classList.contains('on'))&&!(drawer&&drawer.classList.contains('on'))&&!(overlay&&overlay.classList.contains('on'))&&!document.querySelector('#wmbPassageTools:not([hidden])');
  [B,P].forEach(b=>{if(!b)return;b.classList.toggle('context-off',!showContext);b.disabled=!showContext;b.tabIndex=showContext?0:-1;b.setAttribute('aria-hidden',String(!showContext));});
  if(B)B.title=B.ariaLabel=isBible?'Choisir un livre de la Bible':'Choisir une brochure';
  if(P)P.title=P.ariaLabel=isBible?'Choisir un chapitre ou un verset':(typeof S!=='undefined'&&S&&S.doc!=null?'Choisir un paragraphe':'Choisir une brochure avant ses paragraphes');}
 window.v7UpdateNav=updateNav;
 const navObs=new MutationObserver(()=>{clearTimeout(window.__v7n);window.__v7n=setTimeout(updateNav,30)});
 ['simDashboard','workSearch','studyPanel','nb'].forEach(id=>{const e=$(id);if(e)navObs.observe(e,{attributes:true,attributeFilter:['hidden']})});
 ['drawer','sheet','ov'].forEach(id=>{const e=$(id);if(e)navObs.observe(e,{attributes:true,attributeFilter:['class']})});
 navObs.observe(document.body,{attributes:true,attributeFilter:['data-mobile-view','class']});
 setTimeout(updateNav,200);
 // ---- Modes de présentation (3 modèles), mémorisés
 const PRES=[['1','Classique','Grandes cartes, brochures et passages croisés visibles en bas.'],['3','Élégant','Papier chaud, filet doré, numéros discrets, correspondances repliées.'],['4','Nuit','Fond sombre reposant, numéros dorés, mêmes fonctions.']];
 function setPres(v){document.body.dataset.presentation=v;try{localStorage.setItem('wmb-presentation',v)}catch(e){}document.querySelectorAll('.pres-opt').forEach(b=>b.classList.toggle('on',b.dataset.pres===v));}
 setPres((()=>{try{const v=localStorage.getItem('wmb-presentation')||'1';return ['1','3','4','6','7','8'].includes(v)?v:'1'}catch(e){return '1'}})());
 function presCard(){const c=document.createElement('section');c.className='pres-card';c.id='presModeCard';c.innerHTML='<h3>Mode de présentation</h3><div class="pres-grid">'+PRES.map(([v,t,d])=>`<button type="button" class="pres-opt ${document.body.dataset.presentation===v?'on':''}" data-pres="${v}"><div class="pres-prev p${v}"></div><b>${v}. ${t}</b><small>${d}</small></button>`).join('')+'</div>';c.querySelectorAll('.pres-opt').forEach(b=>b.onclick=()=>setPres(b.dataset.pres));return c;}
 // Échelle générale de l'application
 function setScale(v){v=Math.max(70,Math.min(140,+v||100));document.body.style.zoom=(v/100);try{localStorage.setItem('wmb-scale',String(v))}catch(e){}const o=$('scaleVal');if(o)o.textContent=v+' %';const r=$('scaleRange');if(r&&+r.value!==v)r.value=v;}
 setScale(100);
 function scaleCard(){const c=document.createElement('section');c.className='pres-card scale-card';c.id='scaleCard';const v=(()=>{try{return localStorage.getItem('wmb-scale')||100}catch(e){return 100}})();
  c.innerHTML=`<h3>Taille générale de l'application <span class="scale-val" id="scaleVal">${v} %</span></h3><input type="range" id="scaleRange" min="70" max="140" step="5" value="${v}"><div style="display:flex;justify-content:space-between;font-size:11px;color:var(--mut)"><span>Plus petit</span><span>Normal</span><span>Plus grand</span></div><div style="display:flex;gap:6px;margin-top:8px"><button type="button" class="pres-opt" data-scale="-5" style="flex:1;text-align:center">−</button><button type="button" class="pres-opt" data-scale="0" style="flex:2;text-align:center">Normal (100 %)</button><button type="button" class="pres-opt" data-scale="5" style="flex:1;text-align:center">+</button></div>`;
  c.querySelector('#scaleRange').oninput=e=>setScale(e.target.value);c.querySelectorAll('[data-scale]').forEach(b=>b.onclick=()=>{const d=+b.dataset.scale;setScale(d?(+$('scaleRange').value+d):100)});return c;}
 // ---- Arrière-plans (27) : [nom, fond, carte, carte2, encre, discret, ligne, accent, sombre?]
 const BGS=[['Auto (modèle)',null],['Blanc','#FFFFFF','#F7F7F7','#EFEFEF','#1A1C1E','#7A7570','#E4E4E4','#1A1C1E'],['Crème','#F6F3EE','#FFFFFF','#F0EBE3','#1A1C1E','#8A8076','#E8E0D6','#1A1C1E'],['Parchemin','#F1E6CF','#FAF3E3','#EADFC5','#3A2E1E','#8B7355','#DCCBA6','#6B4F2A'],['Papier ancien','#E9DCC3','#F3E9D6','#E2D3B4','#3B2F21','#8A7154','#D2BF9B','#7A5A30'],['Sépia','#F2E5CE','#FBF3E2','#EBDCBF','#4A3A28','#9A7B58','#DFCBA4','#7B5A34'],['Sable','#EFE6D8','#F8F2E8','#E7DCC9','#2E2A24','#8A7F72','#DED2BF','#3E3830'],['Lin','#F4EFE6','#FCF9F3','#ECE5D8','#2A2622','#847B70','#E1D8C9','#5A4E40'],['Ivoire','#FFFDF5','#FFFFFF','#F7F2E4','#242220','#8A8378','#EAE3D2','#2E2A24'],['Rose poudré','#F7ECEC','#FDF6F6','#F1E2E2','#3A2A2A','#96777A','#E8D3D3','#7A3F4A'],['Lavande','#EFEAF6','#F8F5FC','#E7E0F2','#2B2438','#7E7595','#DCD3EA','#5A4B8A'],['Menthe','#E9F3EC','#F4FAF6','#DFEEE4','#1F2E25','#6F8A79','#D0E3D7','#2E7D4F'],['Ciel','#E9F0F7','#F5F8FC','#DFE9F3','#1E2A38','#6F8095','#D0DDEA','#1E5BFF'],['Eau','#E6F2F2','#F3FAFA','#DBEDED','#1D3232','#6A8A8A','#CDE2E2','#1F6F6F'],['Olive','#EEF0E2','#F7F8EE','#E5E8D3','#2A2E1E','#7B806A','#D8DCC2','#5B6B2A'],['Terre','#EAE0D6','#F4EDE6','#E1D4C6','#332A22','#8B7A6A','#D6C7B6','#7A4F2A'],['Gris chaud','#ECEAE7','#F6F5F3','#E3E0DC','#232221','#7E7A75','#D9D5CF','#2A2827'],['Or pâle','#F6EFD9','#FCF8EA','#EFE6CB','#3A321E','#8F8360','#E5D9B2','#9B7843'],['Charbon','#1E1E1E','#2A2A2A','#353535','#ECE8E1','#A9A49B','#3C3C3C','#D2A85A',1],['Ardoise','#2B3138','#353C45','#3F4751','#E9ECEF','#A5AEB9','#46505B','#9CC3FF',1],['Nuit bleue','#141922','#1D2530','#26303D','#ECE6DA','#9AA3B2','#2E3948','#D2A85A',1],['Noir','#000000','#121212','#1E1E1E','#F2EFE9','#A8A39B','#2A2A2A','#E0B25C',1],['Encre','#101418','#181E25','#222A33','#E6E9EE','#98A2AE','#2B343E','#7FB2FF',1],['Chocolat','#2B1D16','#382720','#463129','#F1E7DD','#B8A395','#513A31','#E3B27A',1],['Bordeaux','#2A161B','#381E25','#462630','#F3E6E9','#B99AA3','#532D39','#E7A0B0',1],['Forêt','#14221A','#1C2E23','#25392C','#E6EFE9','#9BB3A4','#2F4637','#9BD8B0',1],['Marine','#0F1B2D','#162540','#1E3052','#E6ECF5','#9AA9C2','#27406A','#8FC1FF',1],['Vert d’eau sombre','#132A2A','#1B3636','#244343','#E4F0F0','#99B7B7','#2E5252','#8FD6D6',1]];
 function applyBg(i){const b=BGS[i]||BGS[0];const st=document.body.style;if(!b[1]){['--bg','--card','--card2','--ink','--mut','--line','--accent','--navy'].forEach(v=>st.removeProperty(v));delete document.body.dataset.bg;delete document.body.dataset.dark;}
  else{st.setProperty('--bg',b[1]);st.setProperty('--card',b[2]);st.setProperty('--card2',b[3]);st.setProperty('--ink',b[4]);st.setProperty('--mut',b[5]);st.setProperty('--line',b[6]);st.setProperty('--accent',b[7]);st.setProperty('--navy',b[8]?b[7]:'#0F2D7A');document.body.dataset.bg=String(i);document.body.dataset.dark=b[8]?'1':'0';}
  try{localStorage.setItem('wmb-bg',String(i))}catch(e){}document.querySelectorAll('.bg-sw').forEach(x=>x.classList.toggle('on',+x.dataset.bg===i));const tc=document.querySelector('meta[name=theme-color]');if(tc)tc.content=b[1]||'#f6f3ee';applyBubbles();}
 // ---- Contraste des bulles : teinte (blanc / fond / sombre) + opacité
 const BUB={tint:'blanc',alpha:100};try{Object.assign(BUB,JSON.parse(localStorage.getItem('wmb-bubbles')||'{}'))}catch(e){}
 function applyBubbles(){const st=document.body.style,a=Math.max(.2,Math.min(1,BUB.alpha/100));const dark=document.body.dataset.dark==='1';
  let bg,ink;if(BUB.tint==='sombre'){bg='rgba(26,28,30,'+a+')';ink='#fff'}else if(BUB.tint==='fond'){bg='color-mix(in srgb,var(--card,#fff) '+Math.round(a*100)+'%,transparent)';ink=dark?'#ECE6DA':'#353535'}else{bg='rgba(255,255,255,'+a+')';ink='#353535'}
  st.setProperty('--bubble-bg',bg);st.setProperty('--bubble-ink',ink);st.setProperty('--bubble-a','1');try{localStorage.setItem('wmb-bubbles',JSON.stringify(BUB))}catch(e){}
  document.querySelectorAll('[data-tint]').forEach(b=>b.classList.toggle('on',b.dataset.tint===BUB.tint));const o=$('bubbleVal');if(o)o.textContent=BUB.alpha+' %';}
 applyBg((()=>{try{return +localStorage.getItem('wmb-bg')||0}catch(e){return 0}})());
 function bgCard(){const c=document.createElement('section');c.className='pres-card';c.id='bgCard';c.innerHTML='<h3>Arrière-plan de lecture <small style="font-weight:500;color:var(--mut)">(écritures adaptées automatiquement)</small></h3><div class="bg-grid">'+BGS.map((b,i)=>`<button type="button" class="bg-sw ${(+document.body.dataset.bg||0)===i?'on':''}" data-bg="${i}" title="${b[0]}" style="background:${b[1]||'linear-gradient(135deg,#fff 50%,#1E1E1E 50%)'};color:${b[4]||'#888'};border-color:${b[6]||'#ccc'}">${b[0]}</button>`).join('')+'</div>';c.querySelectorAll('.bg-sw').forEach(x=>x.onclick=()=>applyBg(+x.dataset.bg));return c;}
 function bubbleCard(){const c=document.createElement('section');c.className='pres-card';c.id='bubbleCard';c.innerHTML=`<h3>Contraste des bulles <span class="scale-val" id="bubbleVal">${BUB.alpha} %</span></h3><input type="range" id="bubbleRange" min="20" max="100" step="5" value="${BUB.alpha}"><div style="display:flex;justify-content:space-between;font-size:11px;color:var(--mut)"><span>Transparentes</span><span>Opaques</span></div><div class="bubble-row"><button type="button" class="pres-opt" data-tint="blanc">Blanches</button><button type="button" class="pres-opt" data-tint="fond">Teinte du fond</button><button type="button" class="pres-opt" data-tint="sombre">Sombres</button></div>`;
  c.querySelector('#bubbleRange').oninput=e=>{BUB.alpha=+e.target.value;applyBubbles()};c.querySelectorAll('[data-tint]').forEach(b=>b.onclick=()=>{BUB.tint=b.dataset.tint;applyBubbles()});return c;}
 const sc=$('studyContent');
 if(sc){const inject=()=>{if(document.querySelector('[data-study="settings"].on')&&!$('presModeCard')){const h3=sc.querySelector('h3');const cards=[presCard(),bgCard(),bubbleCard(),scaleCard()];if(h3)cards.forEach(x=>h3.before(x));else cards.reverse().forEach(x=>sc.prepend(x));setTimeout(applyBubbles,0);}};new MutationObserver(()=>setTimeout(inject,0)).observe(sc,{childList:true});inject();}
 // ---- Bulle flottante d'annotation : compacte, translucide, à côté du passage pressé
 (function(){const tools=$('wmbPassageTools');if(!tools)return;let last={x:20,y:200};
  document.addEventListener('pointerdown',e=>{if(e.target.closest('#bibleView .vt,#msgView .pt'))last={x:e.clientX,y:e.clientY}},{passive:true,capture:true});
  const ic={wmbApply:['✓','Appliquer / changer'],wmbErase:['🗑','Supprimer les types cochés'],wmbCopy:['⧉','Copier le passage']};
  Object.entries(ic).forEach(([id,[t,l]])=>{const b=$(id);if(b){b.textContent=t;b.title=l;b.setAttribute('aria-label',l)}});
  const acts=$('wmbApply')&&$('wmbApply').parentElement;if(acts)acts.classList.add('wmb-acts');
  const det=tools.querySelector('details');if(det){const sum=det.querySelector('summary');if(sum)sum.textContent='Couleurs nommées…';}
  function place(){const w=tools.offsetWidth||236,h=tools.offsetHeight||150;let x=Math.min(Math.max(12,last.x-w/2),innerWidth-w-12);let y=last.y-h-18;if(y<64)y=last.y+28;if(y+h>innerHeight-90)y=Math.max(64,innerHeight-h-90);tools.style.left=x+'px';tools.style.top=y+'px';}
  new MutationObserver(()=>{if(!tools.hidden){place();requestAnimationFrame(place)}}).observe(tools,{attributes:true,attributeFilter:['hidden']});
  // Quand la zone est décochée (plus aucun pointillé), la bulle disparaît
  let selT=null;new MutationObserver(()=>{clearTimeout(selT);selT=setTimeout(()=>{if(!tools.hidden&&!document.querySelector('.wmb-dotted')&&window.WMBMarks&&WMBMarks.close)WMBMarks.close()},120)}).observe(document.querySelector('main'),{childList:true,subtree:true});
  // Aucun menu natif de copie dans la lecture
  document.addEventListener('selectstart',e=>{if(e.target&&e.target.nodeType===3?e.target.parentElement.closest('#bibleView,#msgView'):e.target.closest&&e.target.closest('#bibleView,#msgView'))e.preventDefault()});
 })();
 // ---- 1.1 Écran par défaut : la Bible, immédiatement
 ['simStartup','simDashboard'].forEach(id=>{const e=$(id);if(e)e.hidden=true});document.body.classList.remove('reading-only');if(S.mode!=='bible'){setMode('bible');renderBible();}
 // ---- 4 Performance : préchauffage du moteur (index Bible + zones) en arrière-plan
 const warm=()=>{try{window.GaragePrewarm&&window.GaragePrewarm()}catch(e){}};
 setTimeout(warm,0);
});
})();
