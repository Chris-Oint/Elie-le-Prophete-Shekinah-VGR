/* =========================================================================
   part-024.js — LIEN PROFOND + OUVERTURE BIBLE INSTANTANEE
   1) #b=CODE&p=NNN&ed=VGR|Shekinah   -> ouvre la brochure au paragraphe
   2) #v=LIVRE-CHAPITRE-VERSET        -> ouvre la Bible au verset (ex. #v=65-10-7)
   Dans les deux cas : ouverture directe (sans animation) + surlignage
   du passage pendant quelques secondes, pour une reference rapide.
   ========================================================================= */
(function () {
  'use strict';
  if (window.__WMB_DEEPLINK_V2) return;
  window.__WMB_DEEPLINK_V2 = true;

  /* ---------- style : ouverture instantanee + surlignage ---------- */
  var st = document.createElement('style');
  st.textContent =
    'html.wmb-rapide *,html.wmb-rapide *::before,html.wmb-rapide *::after{' +
    'animation-duration:1ms!important;animation-delay:0s!important;' +
    'transition-duration:1ms!important;transition-delay:0s!important}' +
    '.wmb-flash{background:#ffe9a8!important;box-shadow:0 0 0 2px #d9a441 inset!important;' +
    'border-radius:6px}' +
    'body.m4-dark .wmb-flash,body.dark .wmb-flash{background:#5a4a15!important}';
  (document.head || document.documentElement).appendChild(st);

  function flash(el, ms) {
    if (!el) return;
    el.classList.remove('wmb-flash');
    void el.offsetWidth;
    el.classList.add('wmb-flash');
    setTimeout(function () { el.classList.remove('wmb-flash'); }, ms || 2800);
  }

  function rapide(fn) {
    var r = document.documentElement;
    r.classList.add('wmb-rapide');
    try { return fn(); }
    finally { setTimeout(function () { r.classList.remove('wmb-rapide'); }, 350); }
  }

  /* ---------- 1. Bible : ouverture directe et surlignee ---------- */
  function waitFn(name) {
    return new Promise(function (res) {
      var n = 0;
      (function step() {
        try { if (typeof window[name] === 'function') return res(window[name]); } catch (e) { }
        if (++n > 400) return res(null);
        setTimeout(step, 100);
      })();
    });
  }

  waitFn('goBible').then(function (orig) {
    if (!orig || orig.__rapide) return;
    var f = function (b, c, v) {
      var r = rapide(function () { return orig(b, c, v); });
      var out = r;
      try {
        var el = (v != null) ? document.getElementById('v_' + v) : null;
        if (el) {
          el.scrollIntoView({ block: 'center' });
          flash(el, 2800);
          var vt = el.querySelector('.vt');
          if (vt) { vt.classList.add('wmb-xref-target'); setTimeout(function () { vt.classList.remove('wmb-xref-target'); }, 3200); }
        } else {
          window.scrollTo(0, 0);
        }
      } catch (e) { }
      return out;
    };
    f.__rapide = true;
    window.goBible = f;
  });

  /* ---------- 2. liens profonds ---------- */
  function parse() {
    var h = String(location.hash || '').replace(/^#\/?/, '');
    if (!h) return null;
    var m = /(?:^|[#&])b=([0-9]{2}-[0-9]{2}[0-9]{2}[A-Za-z]?)/.exec(h);
    if (m) {
      var p = /[#&]p=(\d{1,4})/.exec(h), ed = /[#&]ed=(vgr|shekinah)/i.exec(h);
      return { t: 'b', code: m[1].toUpperCase(), p: p ? parseInt(p[1], 10) : 1, ed: ed ? ed[1] : null };
    }
    var v = /(?:^|[#&])v=(\d{1,2})-(\d{1,3})-(\d{1,3})/.exec(h);
    if (v) return { t: 'v', b: +v[1], c: +v[2], v: +v[3] };
    return null;
  }

  function waitData(bible) {
    return new Promise(function (res) {
      var n = 0;
      (function step() {
        try {
          if (typeof D !== 'undefined' && D && D.meta && D.meta.length &&
              (!bible || (D.books && D.books.length > 60))) return res(true);
        } catch (e) { }
        if (++n > 400) return res(false);
        setTimeout(step, 100);
      })();
    });
  }

  var lastKey = '';
  /* l'application restaure sa dernière lecture au démarrage : on vérifie
     que le lien profond a bien été appliqué, et on le réapplique au besoin */
  function conforme(q) {
    try {
      if (typeof S === 'undefined' || !S) return false;
      if (q.t === 'v') return S.mode === 'bible' && S.book === q.b && S.chap === q.c;
      if (typeof D === 'undefined' || !D || !D.meta[S.doc]) return false;
      return S.mode === 'msg' && D.meta[S.doc][0] === q.code && S.curP === q.p;
    } catch (e) { return false; }
  }

  async function go(force) {
    var q = parse(); if (!q) return;
    var key = JSON.stringify(q);
    if (key === lastKey && !force) return;
    lastKey = key;
    if (!(await waitData(q.t === 'v'))) { try { alert('Données non chargées : réessayez.'); } catch (e) { } return; }

    if (q.t === 'v') {
      var fn = await waitFn('goBible');
      if (!fn) return;
      try { rapide(function () { fn(q.b, q.c, q.v); }); } catch (e) { }
      var el = document.getElementById('v_' + q.v);
      if (!el) { await new Promise(function (r) { setTimeout(r, 250); }); el = document.getElementById('v_' + q.v); }
      if (el) { el.scrollIntoView({ block: 'center' }); flash(el, 3200); }
      return;
    }

    var ofn = await waitFn('openBrochure');
    if (!ofn) return;
    var idx = -1;
    if (q.ed) idx = D.meta.findIndex(function (x) { return x[0] === q.code && String(x[2]).toLowerCase() === q.ed.toLowerCase(); });
    if (idx < 0) idx = D.meta.findIndex(function (x) { return x[0] === q.code; });
    if (idx < 0) { try { toast('Brochure introuvable : ' + q.code, 2600); } catch (e) { } return; }
    try { var tab = document.getElementById('tabMSG'); if (tab) tab.click(); } catch (e) { }
    try { await rapide(function () { return ofn(idx, q.p, null); }); } catch (e) { }
    for (var t = 0; t < 3; t++) {
      await new Promise(function (r) { setTimeout(r, 350); });
      var e2 = document.getElementById('p_' + q.p);
      if (e2) {
        e2.hidden = false;
        e2.scrollIntoView({ block: 'center' });
        flash(e2, 3200);
        break;
      }
    }
  }

  addEventListener('hashchange', function () { lastKey = ''; go(true); });
  [1200, 2600, 4500, 7000, 10000, 14000, 20000].forEach(function (ms) {
    setTimeout(function () { if (!conforme(parse())) go(true); }, ms);
  });
  window.__wmbOpen = function () { lastKey = ''; return go(true); };
})();
