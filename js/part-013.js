
(()=>{
  if(window.__WMB_UI_PATCH_V1)return; window.__WMB_UI_PATCH_V1=true;
  const $=id=>document.getElementById(id);
  const escHtml=s=>{const d=document.createElement('div');d.textContent=String(s??'');return d.innerHTML};
  const waitForData=()=>new Promise(resolve=>{const t=setInterval(()=>{if(D&&D.books&&D.meta){clearInterval(t);resolve()}},50);setTimeout(()=>{clearInterval(t);resolve()},30000)});
  const stateKey='wmb-cross-display-v1';
  let crossMode=localStorage.getItem(stateKey)==='compact'?'compact':'detail';
  const modeLabel=()=>crossMode==='detail'?'Détaillé':'Compact';
  const saveMode=()=>{try{localStorage.setItem(stateKey,crossMode)}catch(e){}};
  function addStyles(){
    const s=document.createElement('style');s.textContent=`
      /* WMB V6 UI harmonisation — le PAYLOAD biblique reste intact */
      #wmbBottomNav{position:fixed;left:50%;bottom:calc(12px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:165;display:flex;align-items:center;gap:clamp(34px,13vw,110px);pointer-events:none}
      #wmbBottomNav .wmb-nav-bubble{pointer-events:auto;width:54px;height:54px;border-radius:50%;border:1px solid #fff;background:radial-gradient(circle at 28% 20%,#fff 0%,#ffffffee 38%,#e7ecefdc 78%,#d4dfe5 100%);box-shadow:inset 0 2px 4px #fff,inset 0 -4px 7px #b3c6d655,0 7px 20px #24364626;display:grid;place-items:center;color:#353535;cursor:pointer;touch-action:none}
      #wmbBottomNav .wmb-nav-bubble img{width:34px;height:34px;object-fit:contain;pointer-events:none}.wmb-nav-bubble svg{pointer-events:none}
      #wmbBottomNav .wmb-nav-bubble.wmb-dashboard{width:46px;height:46px}
      body.reading-only #wmbBottomNav{display:none}
      #wmbReadingBar{display:none;position:fixed;top:0;left:0;right:0;z-index:155;padding:calc(6px + env(safe-area-inset-top,0px)) 10px 6px;background:color-mix(in srgb,var(--bg) 94%,transparent);backdrop-filter:blur(14px);border-bottom:1px solid var(--line);box-shadow:0 2px 12px #0001}
      body.reading-only #wmbReadingBar{display:flex;align-items:center;gap:7px}.wmb-reading-main{min-width:0;flex:1;text-align:center;font:800 12px system-ui}.wmb-reading-sub{font:10px system-ui;color:var(--mut);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.wmb-reading-btn{border:1px solid var(--line);background:var(--study-paper,#fff);color:var(--ink);border-radius:999px;padding:7px 9px;font:800 11px system-ui;cursor:pointer;white-space:nowrap}
      body.reading-only main{padding-top:58px!important;max-width:920px;margin:auto}body.reading-only .bhead{display:block!important;position:sticky;top:45px;z-index:4;background:var(--bg);padding-top:7px}
      body.reading-only .pcard,body.reading-only .vcard{box-shadow:none!important;border-radius:10px}
      .wmb-cross{margin:8px 0 2px;padding:8px 10px;border:1px solid var(--line);border-radius:14px;background:var(--study-paper,#fff);font:12px system-ui}.wmb-cross-head{display:flex;align-items:center;justify-content:space-between;gap:8px}.wmb-cross-title{font-weight:800}.wmb-cross-tabs{display:flex;gap:4px}.wmb-cross-tabs button{border:1px solid var(--line);background:transparent;color:var(--ink);border-radius:999px;padding:4px 7px;font:800 10px system-ui;cursor:pointer}.wmb-cross-tabs button.on{background:var(--ink);color:#fff}.wmb-cross-ref{display:inline-block;margin:4px 4px 0 0;border:1px solid var(--line);border-radius:999px;padding:5px 8px;background:var(--bg);color:var(--ink);cursor:pointer;font:700 10.5px system-ui}.wmb-cross-proof{margin-top:7px;padding:8px 10px;border-left:3px solid var(--c0);background:var(--bg);border-radius:8px;font:15px/1.55 Georgia,serif}.wmb-cross-proof mark{background:#ffe27a;color:inherit}.wmb-cross-more{margin-top:6px;border:0;background:none;color:var(--ink);text-decoration:underline;font:700 11px system-ui;cursor:pointer;padding:2px}.wmb-cross-more-list{display:none;margin-top:5px}.wmb-cross-more-list.on{display:block}.wmb-cross-more-list button{display:block;width:100%;text-align:left;margin:4px 0;border:1px solid var(--line);background:var(--bg);border-radius:9px;padding:6px 8px;color:var(--ink);cursor:pointer;font:11px system-ui}
      #wmbStartupPhoto{position:fixed;right:12px;top:calc(12px + env(safe-area-inset-top,0px));width:72px;height:72px;border-radius:50%;object-fit:cover;z-index:191;box-shadow:0 5px 18px #0002;border:2px solid #fff}
      @media(max-width:600px){#wmbBottomNav{gap:clamp(28px,16vw,75px)}#wmbBottomNav .wmb-nav-bubble{width:50px;height:50px}.wmb-cross-proof{font-size:14px}body.reading-only .bhead{top:44px}}
      @media(prefers-reduced-motion:reduce){#wmbBottomNav .wmb-nav-bubble{transition:none}}
    `;document.head.appendChild(s);
  }
  function buildChrome(){
    if(!$('wmbBottomNav')){
      const nav=document.createElement('nav');nav.id='wmbBottomNav';nav.setAttribute('aria-label','Navigation rapide');
      nav.innerHTML=`<button class="wmb-nav-bubble" id="wmbNavBook" aria-label="Basculer Bible / brochure" title="Bible ⇄ Brochures"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#353535" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4.5h6a4 4 0 0 1 4 4V20a3 3 0 0 0-3-3H2z"/><path d="M22 4.5h-6a4 4 0 0 0-4 4V20a3 3 0 0 1 3-3h7z"/><path d="M5 9h3M5 12h3M16 9h3M16 12h3"/></svg></button>
      <button type="button" class="wmb-nav-bubble wmb-nav-context" id="wmbNavContextSections" aria-label="Choisir un chapitre ou un verset" title="Choisir un chapitre ou un verset"><span class="wmb-mini-orb" aria-hidden="true"><svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#353535" stroke-width="1.2" stroke-linecap="round"><path d="M2 2h3v3H2zM7 2h3v3H7zM2 7h3v3H2zM7 7h3v3H7z"/></svg></span></button>
      <button class="wmb-nav-bubble" id="wmbNavDash" aria-label="Table des matières" title="Table des matières"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#353535" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h10"/><circle cx="19" cy="18" r="1.4" fill="#353535" stroke="none"/></svg></button>
      <button type="button" class="wmb-nav-bubble wmb-nav-context" id="wmbNavContextBooks" aria-label="Choisir un livre de la Bible" title="Choisir un livre de la Bible"><span class="wmb-mini-orb" aria-hidden="true"><svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#353535" stroke-width="1.2" stroke-linecap="round"><path d="M4 2.5h6M4 5.5h6M4 8.5h6"/><circle cx="2" cy="2.5" r=".6" fill="#353535" stroke="none"/><circle cx="2" cy="5.5" r=".6" fill="#353535" stroke="none"/><circle cx="2" cy="8.5" r=".6" fill="#353535" stroke="none"/></svg></span></button>
      <button class="wmb-nav-bubble" id="wmbNavSearch" aria-label="Recherche" title="Recherche"><svg width="27" height="27" viewBox="0 0 32 32" fill="none" stroke="#353535" stroke-width="2.5" stroke-linecap="round"><circle cx="13" cy="13" r="9"/><path d="m20 20 8 8"/></svg></button>`;
      document.body.appendChild(nav);
      nav.querySelectorAll('.wmb-nav-bubble:not(.wmb-nav-context)').forEach(b=>window.elasticNav?window.elasticNav(b):elasticBubble(b));
      $('wmbNavBook').onclick=async()=>{if(document.body.classList.contains('reading-only'))document.body.classList.remove('reading-only');if(!D)return;if(S.mode==='bible'){if(S.doc==null&&window.lastDoc!=null)await openBrochure(window.lastDoc,S.curP||0,null);else $('tabMSG')?.click();}else $('tabBible')?.click();};
      $('wmbNavSearch').onclick=()=>{if(window.v7Left)window.v7Left();else $('searchFloat')?.click();};
      $('wmbNavDash').onclick=()=>{if(window.v7Center)window.v7Center();};
      $('wmbNavContextBooks').onclick=()=>{if(!D)return;const panel=S.mode==='bible'?'bible':'msg';if(window.WMBOpenContextPanel)window.WMBOpenContextPanel(panel);else (panel==='bible'?$('btnDrawer'):$('hdrPhoto'))?.click();};
      $('wmbNavContextSections').onclick=()=>{if(!D)return;if(S.mode==='bible'){if(typeof openChaps==='function'&&typeof openSheet==='function'){openChaps(S.book);openSheet();}return;}if(S.doc!=null&&window.openParaGrid){window.openParaGrid();return;}if(window.WMBOpenContextPanel)window.WMBOpenContextPanel('msg');else $('hdrPhoto')?.click();};
    }
    if(!$('wmbReadingBar')){
      const bar=document.createElement('div');bar.id='wmbReadingBar';bar.innerHTML=`<button class="wmb-reading-btn" id="wmbReadingBook" aria-label="Bible / brochure" hidden>Livre</button><div class="wmb-reading-main" role="button" tabindex="0" title="Sélection rapide"><div id="wmbReadingTitle">Lecture</div><div class="wmb-reading-sub" id="wmbReadingSub"></div></div><button class="wmb-reading-btn" id="wmbReadingSelect" hidden>Chapitre</button>`;document.body.appendChild(bar);
      $('wmbReadingBook').onclick=()=>{if(S.mode==='bible')$('tabMSG')?.click();else $('tabBible')?.click();};
      const quick=()=>{if(!D)return;if(S.mode==='bible'){openChaps(S.book);openSheet()}else if(window.openParaGrid)window.openParaGrid();else openDrawer()};
      $('wmbReadingSelect').onclick=quick;bar.querySelector('.wmb-reading-main').onclick=quick;
    }
    
  }
  const setT=(id,v)=>{const e=$(id);if(e&&e.textContent!==v)e.textContent=v};
  function updateReadingBar(){if(!$('wmbReadingTitle')||!S||!D)return;if(S.mode==='bible'&&D.books[S.book]){setT('wmbReadingTitle',`${D.books[S.book][0]} ${S.chap}`);setT('wmbReadingSub','');setT('wmbReadingBook','Bible');setT('wmbReadingSelect','Chapitre');}else if(S.doc!=null&&D.meta[S.doc]){const m=D.meta[S.doc];setT('wmbReadingTitle',`${m[0]} — ${m[1]}`);setT('wmbReadingSub',`${year(m[0])} • ${m[2]==='VGR'?'VGR':'Shekinah'}`);setT('wmbReadingBook','Brochure');setT('wmbReadingSelect','Paragraphes');}}
  function toggleModeTabs(container,onChange){
    const box=document.createElement('div');box.className='wmb-cross-tabs';box.innerHTML=`<button type="button" data-cross-mode="detail">Détaillé</button><button type="button" data-cross-mode="compact">Compact</button>`;
    box.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.crossMode===crossMode));box.querySelectorAll('button').forEach(b=>b.onclick=e=>{e.stopPropagation();crossMode=b.dataset.crossMode;saveMode();box.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));onChange()});container.appendChild(box);return box;
  }
  function getBrochureParagraph(dg,pn){try{const m=D.meta[dg],z=m[4],d=ZD[z];if(!d)return null;return d.docs[dg-D.zoff[z]][4].find(x=>x[0]===pn)?.[1]||null}catch(e){return null}}
  function buildBibleCross(card,vi){
    if(card.querySelector('.wmb-cross'))return;const links=linksOfVi(vi);if(!links.length)return;
    const groups=[];const map=new Map();links.slice().sort(sortLinks).forEach(li=>{const l=D.links[li],key=l[0];if(!map.has(key)){const g={dg:key,items:[]};map.set(key,g);groups.push(g)}map.get(key).items.push(l)});
    const box=document.createElement('section');box.className='wmb-cross';box.innerHTML=`<div class="wmb-cross-head"><span class="wmb-cross-title">Correspondances dans les brochures · ${groups.length}</span></div><div class="wmb-cross-body"></div>`;const head=box.querySelector('.wmb-cross-head');toggleModeTabs(head,()=>paint());card.appendChild(box);
    async function paint(){const body=box.querySelector('.wmb-cross-body');body.innerHTML='';for(const g of groups){const m=D.meta[g.dg], first=g.items[0],refs=g.items.map(x=>x[1]);const wrap=document.createElement('div');wrap.className='wmb-cross-group';const ref=document.createElement('button');ref.className='wmb-cross-ref';ref.textContent=`${m[0]} · ${year(m[0])} · § ${first[1]}`;ref.onclick=()=>openBrochure(g.dg,first[1],vi);wrap.appendChild(ref);
        if(crossMode==='compact'){if(g.items.length>1){const more=document.createElement('button');more.className='wmb-cross-more';more.textContent=`${g.items.length-1} autres paragraphes retrouvés dans cette brochure`;const list=document.createElement('div');list.className='wmb-cross-more-list';g.items.slice(1).forEach(x=>{const b=document.createElement('button');b.textContent=`§ ${x[1]} · ${m[0]} · ${year(m[0])}`;b.onclick=()=>openBrochure(g.dg,x[1],vi);list.appendChild(b)});more.onclick=()=>list.classList.toggle('on');wrap.append(more,list)}}else{const p=getBrochureParagraph(g.dg,first[1]);if(p){const proof=document.createElement('div');proof.className='wmb-cross-proof';proof.textContent=`§ ${first[1]} · ${m[0]} · ${year(m[0])}\n${p}`;wrap.appendChild(proof)}else{const load=document.createElement('button');load.className='wmb-cross-more';load.textContent='Afficher l’extrait de ce paragraphe';load.onclick=async()=>{await loadZone(m[4]);paint()};wrap.appendChild(load)}if(g.items.length>1){const more=document.createElement('button');more.className='wmb-cross-more';more.textContent=`${g.items.length-1} autres paragraphes retrouvés dans cette brochure`;const list=document.createElement('div');list.className='wmb-cross-more-list';g.items.slice(1).forEach(x=>{const b=document.createElement('button');b.textContent=`§ ${x[1]} · ${m[0]} · ${year(m[0])}`;b.onclick=()=>openBrochure(g.dg,x[1],vi);list.appendChild(b)});more.onclick=()=>list.classList.toggle('on');wrap.append(more,list)}}body.appendChild(wrap)}}
    paint();
  }
  function buildBrochureCross(card,dg,n){
    if(card.querySelector('.wmb-cross'))return;const links=linksOfPara(dg,n);if(!links.length)return;const unique=[...new Map(links.map(li=>[D.links[li][2],D.links[li]])).values()];
    const box=document.createElement('section');box.className='wmb-cross';box.innerHTML=`<div class="wmb-cross-head"><span class="wmb-cross-title">Références bibliques · ${unique.length}</span></div><div class="wmb-cross-body"></div>`;const head=box.querySelector('.wmb-cross-head');toggleModeTabs(head,()=>paint());card.appendChild(box);
    function paint(){const body=box.querySelector('.wmb-cross-body');body.innerHTML='';if(crossMode==='compact'){unique.forEach(l=>{const b=document.createElement('button');b.className='wmb-cross-ref';b.textContent=vref(l[2]);b.onclick=()=>goBible(VB[l[2]],VC[l[2]],VV[l[2]]);body.appendChild(b)});}else{const l=unique[0],wrap=document.createElement('div');wrap.className='wmb-cross-group';const b=document.createElement('button');b.className='wmb-cross-ref';b.textContent=vref(l[2]);b.onclick=()=>goBible(VB[l[2]],VC[l[2]],VV[l[2]]);const proof=document.createElement('div');proof.className='wmb-cross-proof';proof.textContent=vtext(l[2]);wrap.append(b,proof);if(unique.length>1){const more=document.createElement('button');more.className='wmb-cross-more';more.textContent=`${unique.length-1} autres références bibliques`;const list=document.createElement('div');list.className='wmb-cross-more-list';unique.slice(1).forEach(x=>{const q=document.createElement('button');q.textContent=vref(x[2]);q.onclick=()=>goBible(VB[x[2]],VC[x[2]],VV[x[2]]);list.appendChild(q)});more.onclick=()=>list.classList.toggle('on');wrap.append(more,list)}body.appendChild(wrap)}}
    paint();
  }
  async function decorateAll(){
    if(!D)return;
    if(S.mode==='bible'){document.querySelectorAll('#bibleView .vcard').forEach(card=>{const n=+card.id.slice(2);buildBibleCross(card,viOf(S.book,S.chap,n))});}
    if(S.mode==='msg'&&S.doc!=null){document.querySelectorAll('#msgView .pcard').forEach(card=>buildBrochureCross(card,S.doc,+card.id.slice(2)))}
    updateReadingBar();
  }
  async function install(){
    addStyles();buildChrome();
    const oldRenderBible=window.renderBible,oldOpenBrochure=window.openBrochure,oldSetMode=window.setMode;
    if(oldRenderBible&&!oldRenderBible.__wmbWrapped){const f=function(...a){const r=oldRenderBible.apply(this,a);setTimeout(()=>{decorateAll();if(window.v7UpdateNav)window.v7UpdateNav()},0);updateReadingBar();return r};f.__wmbWrapped=true;window.renderBible=f;}
    if(oldOpenBrochure&&!oldOpenBrochure.__wmbWrapped){const f=async function(...a){const r=await oldOpenBrochure.apply(this,a);setTimeout(()=>{decorateAll();if(window.v7UpdateNav)window.v7UpdateNav()},0);updateReadingBar();return r};f.__wmbWrapped=true;window.openBrochure=f;}
    if(oldSetMode&&!oldSetMode.__wmbWrapped){const f=function(...a){const r=oldSetMode.apply(this,a);setTimeout(()=>{updateReadingBar();if(window.v7UpdateNav)window.v7UpdateNav()},0);return r};f.__wmbWrapped=true;window.setMode=f;}
    const originalToggle=document.querySelector('main')?.onclick;
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.body.classList.remove('reading-only');updateReadingBar()}});
    document.addEventListener('click',e=>{if(e.target.closest('.vcard,.pcard')&&!e.target.closest('button,a,input,select,.wmb-cross'))setTimeout(updateReadingBar,0)},{passive:true});
    // Le bouton de recherche reste fonctionnel, mais la nouvelle barre est la navigation visible.
    $('bookFloat')?.style.setProperty('display','none','important');$('searchFloat')?.style.setProperty('display','none','important');
    // Accueil : ouvrir directement la Bible une fois les données prêtes.
    const openBible=()=>{if($('simStartup'))$('simStartup').hidden=true;if($('simDashboard'))$('simDashboard').hidden=true;document.body.classList.remove('reading-only');if(D&&S){S.doc=null;setMode('bible');renderBible();}};
    openBible();
    let decoT=null;const observer=new MutationObserver(muts=>{if(muts.some(m=>m.target.closest&&m.target.closest('.wmb-cross,#wmbReadingBar')))return;clearTimeout(decoT);decoT=setTimeout(()=>{if(S&&D)decorateAll()},60)});observer.observe(document.querySelector('main'),{childList:true,subtree:false});
  }
  waitForData().then(install);
})();

