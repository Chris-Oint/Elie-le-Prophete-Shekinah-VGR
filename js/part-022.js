
(function(){
  'use strict';
  const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
  const root=document.documentElement,body=document.body,KEY='wmb-v9-global-theme-v1';
  const themeSet={
    orange:{label:'Clair',icon:'☀'},nuit:{label:'Sombre',icon:'☾'}
  };
  function safeGet(k,fallback){try{const v=localStorage.getItem(k);return v===null?fallback:v}catch(e){return fallback}}
  function safeSet(k,v){try{localStorage.setItem(k,v)}catch(e){}}
  function getTheme(){try{const x=JSON.parse(localStorage.getItem(KEY)||'{}');return x.id==='nuit'?'nuit':'orange'}catch(e){return 'orange'}}
  function applyTheme(id,save=true){
    id=id==='nuit'?'nuit':'orange';
    root.dataset.v9Theme=id;body.dataset.v9Theme=id;
    root.dataset.themeMode=id==='nuit'?'sombre':'clair';
    root.style.setProperty('--m4-theme-mode',id);
    const dark=id==='nuit';
    const vars=dark?{
      '--v9-theme-bg':'#151719','--v9-theme-card':'#222527','--v9-theme-paper':'#2a2d30','--v9-theme-ink':'#f2efe7',
      '--v9-theme-muted':'#b8b1a5','--v9-theme-line':'#4a4e50','--v9-theme-accent':'#f0b853','--v9-theme-accent-2':'#d19abb',
      '--v9-theme-header':'#191b1d','--v9-theme-bubble':'#272a2d','--v9-theme-bubble-border':'#b6a875','--v9-theme-bubble-ink':'#f2efe7',
      '--bg':'#151719','--card':'#222527','--card2':'#2a2d30','--ink':'#f2efe7','--mut':'#b8b1a5','--line':'#4a4e50',
      '--blue':'#f0b853','--navy':'#f4cf7f','--orange':'#79bde4','--c0':'#d5a2c9','--c1':'#f0b853','--c2':'#79bde4','--c3':'#71d9bb',
      '--m4-ui-bg':'#151719','--m4-ui-card':'#222527','--m4-ui-paper':'#2a2d30','--m4-ui-ink':'#f2efe7','--m4-ui-muted':'#b8b1a5','--m4-ui-line':'#4a4e50',
      '--m4-ui-accent':'#f0b853','--m4-ui-accent2':'#d19abb','--m4-ui-key':'#29261f','--m4-ui-keyline':'#655b3b','--m4-ui-chip':'#282a30','--m4-ui-chip-ink':'#d5a2c9','--m4-ui-orange':'#79bde4'
    }:{
      '--v9-theme-bg':'#f5f2ec','--v9-theme-card':'#ffffff','--v9-theme-paper':'#fffaf1','--v9-theme-ink':'#24211f',
      '--v9-theme-muted':'#81786f','--v9-theme-line':'#e7e0d6','--v9-theme-accent':'#1e5bff','--v9-theme-accent-2':'#0f7b3f',
      '--v9-theme-header':'#f4efe8','--v9-theme-bubble':'#ffffff','--v9-theme-bubble-border':'#d8cdbd','--v9-theme-bubble-ink':'#302b26',
      '--bg':'#f5f2ec','--card':'#ffffff','--card2':'#fffaf1','--ink':'#24211f','--mut':'#81786f','--line':'#e7e0d6',
      '--blue':'#1e5bff','--navy':'#0f2d7a','--orange':'#ff8a3d','--c0':'#287b58','--c1':'#1e5bff','--c2':'#c47732','--c3':'#a84855',
      '--m4-ui-bg':'#f5f2ec','--m4-ui-card':'#ffffff','--m4-ui-paper':'#fffaf1','--m4-ui-ink':'#24211f','--m4-ui-muted':'#81786f','--m4-ui-line':'#e7e0d6',
      '--m4-ui-accent':'#1e5bff','--m4-ui-accent2':'#0f7b3f','--m4-ui-key':'#fff8e6','--m4-ui-keyline':'#ffe0b2','--m4-ui-chip':'#edf6f0','--m4-ui-chip-ink':'#24734e','--m4-ui-orange':'#ff8a3d'
    };
    Object.entries(vars).forEach(([k,v])=>root.style.setProperty(k,v));
    const meta=$('meta[name="theme-color"]');if(meta)meta.content=dark?'#191b1d':'#f4efe8';
    if(save){safeSet(KEY,JSON.stringify({id,soft:0}));safeSet('wmb-theme',dark?'sombre':'clair');}
    if(window.V9CThemesTest){window.V9CThemesTest.applyTheme=(theme)=>applyTheme(theme,true);}
    document.dispatchEvent(new CustomEvent('m4-theme-change',{detail:{id,mode:dark?'sombre':'clair'}}));
  }
  function getScale(){const n=Number(safeGet('m4-text-k','100'));return Number.isFinite(n)?Math.max(70,Math.min(160,n)):100}
  function setScale(n){n=Math.max(70,Math.min(160,Math.round(n)));root.style.setProperty('--m4-k',String(n/100));safeSet('m4-text-k',String(n));return n}
  function getPres(){let v=safeGet('wmb-presentation','3');if(!['1','3','4'].includes(v))v='3';return v}
  function setPres(v){if(!['1','3','4'].includes(String(v)))return;v=String(v);body.dataset.presentation=v;safeSet('wmb-presentation',v);$$('.pres-opt').forEach(b=>b.classList.toggle('on',b.dataset.pres===v));}
  function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  applyTheme(getTheme(),false);setScale(getScale());setPres(getPres());
  const dash=$('#v9Dash'),settingsBtn=$('#v9Dash [data-go="settings"]'),dashOv=$('#v9DashOv');
  if(!dash||!settingsBtn)return;
  let wing=$('#m4Wing');
  if(!wing){wing=document.createElement('div');wing.id='m4Wing'}
  if(wing.parentElement!==body)body.appendChild(wing);
  wing.innerHTML='';
  [['mode','▤','Mode de présentation'],['theme','◐','Thème'],['font','Aa','Taille des écrits']].forEach(([k,icon,label])=>{
    const b=document.createElement('button');b.type='button';b.className='m4WingBtn';b.dataset.m4w=k;b.textContent=icon;b.setAttribute('aria-label',label);wing.appendChild(b);
  });
  wing.hidden=true;
  let backdrop=$('#finalSettingsBackdrop');
  if(!backdrop){backdrop=document.createElement('div');backdrop.id='finalSettingsBackdrop';backdrop.hidden=true;body.appendChild(backdrop)}
  let tray=null,activeKind='';
  function closeSettings(closeDash){
    wing.hidden=true;backdrop.hidden=true;if(tray){tray.remove();tray=null}activeKind='';
    if(closeDash){dash.classList.remove('on');if(dashOv)dashOv.classList.remove('on')}
  }
  function makeTray(kind){
    if(tray)tray.remove();activeKind=kind;tray=document.createElement('div');tray.id='m4Tray';tray.setAttribute('role','dialog');tray.setAttribute('aria-modal','true');
    const title=kind==='mode'?'Mode de présentation':kind==='theme'?'Thème':'Taille des écrits';
    tray.innerHTML='<div class="m4-tray-label">'+title+'</div><div class="m4-modes"></div><button type="button" class="m4-ok">OK</button>';
    const row=tray.querySelector('.m4-modes');
    function addBubble(value,label,icon,selected,choose){
      const item=document.createElement('div');item.className='m4-item';
      const b=document.createElement('button');b.type='button';b.className='m4TrayBtn'+(selected?' on':'');b.dataset.val=value;b.textContent=icon;b.setAttribute('aria-label',label);b.title=label;
      const caption=document.createElement('span');caption.className='m4-cap';caption.textContent=label;
      b.addEventListener('click',e=>{e.stopPropagation();row.querySelectorAll('.m4TrayBtn').forEach(x=>x.classList.toggle('on',x===b));choose(value);});
      item.append(b,caption);row.appendChild(item);
    }
    if(kind==='mode'){
      const labels={'1':'Classique','3':'Élégant','4':'Nuit'};const icons={'1':'▤','3':'❖','4':'☾'};const cur=getPres();
      ['1','3','4'].forEach(v=>addBubble(v,labels[v],icons[v],cur===v,setPres));
    }else if(kind==='theme'){
      const cur=getTheme();Object.entries(themeSet).forEach(([v,t])=>addBubble(v,t.label,t.icon,cur===v,id=>applyTheme(id,true)));
    }else{
      const n=getScale();
      addBubble('minus','Diminuer la taille','−',false,()=>{const v=setScale(getScale()-5);row.querySelectorAll('.m4-cap').forEach(x=>x.textContent='');row.querySelectorAll('.m4TrayBtn').forEach(x=>x.classList.remove('on'));tray.querySelector('.m4-tray-label').textContent='Taille des écrits · '+v+' %';});
      addBubble('plus','Augmenter la taille','+',false,()=>{const v=setScale(getScale()+5);row.querySelectorAll('.m4-cap').forEach(x=>x.textContent='');row.querySelectorAll('.m4TrayBtn').forEach(x=>x.classList.remove('on'));tray.querySelector('.m4-tray-label').textContent='Taille des écrits · '+v+' %';});
      tray.querySelector('.m4-tray-label').textContent='Taille des écrits · '+n+' %';
    }
    tray.querySelector('.m4-ok').addEventListener('click',e=>{e.stopPropagation();closeSettings(true)});
    tray.addEventListener('click',e=>e.stopPropagation());body.appendChild(tray);
  }
  // Le réglage est un volet dédié : les anciennes rubriques sauvegarde, polices et palettes sont masquées.
  function positionWing(){const r=settingsBtn.getBoundingClientRect(),w=innerWidth<=380?44:48,h=3*w+16;let left=r.left-w-12;if(left<8)left=Math.min(innerWidth-w-8,r.right+8);const top=Math.max(12,Math.min(r.top,innerHeight-h-12));root.style.setProperty('--m4-wing-x',Math.round(left)+'px');root.style.setProperty('--m4-wing-y',Math.round(top)+'px')}
  function openWing(){const wasOpen=!wing.hidden;if(wasOpen){closeSettings(false);return}positionWing();wing.hidden=false;backdrop.hidden=false;dash.classList.add('on');if(dashOv)dashOv.classList.add('on');}
  document.addEventListener('click',e=>{
    const target=e.target;if(!(target instanceof Element))return;
    const gear=target.closest('#v9Dash [data-go="settings"]');
    if(gear){e.preventDefault();e.stopImmediatePropagation();openWing();return}
    if(target.closest('#m4Wing')){e.stopPropagation();const b=target.closest('[data-m4w]');if(b){e.preventDefault();e.stopImmediatePropagation();makeTray(b.dataset.m4w)}return}
    if(target.closest('#m4Tray'))return;
    if(target.closest('#finalSettingsBackdrop')){closeSettings(true);return}
    if(!wing.hidden){closeSettings(true)}
  },true);
  backdrop.addEventListener('click',e=>{e.stopPropagation();closeSettings(true)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!wing.hidden)closeSettings(true)});
  // La carte native reste masquée si un ancien point d’entrée de l’application la reconstruit.
  const sc=$('#studyContent');if(sc){const hideLegacy=()=>{if(sc.querySelector('#appFont'))sc.classList.add('m4-settings-legacy');else sc.classList.remove('m4-settings-legacy')};new MutationObserver(hideLegacy).observe(sc,{childList:true,subtree:true});hideLegacy()}
  window.M4FinalSettings={applyTheme,getTheme,setScale,getScale,setPresentation:setPres,getPresentation:getPres,open:openWing,close:()=>closeSettings(true)};
  document.title='WMB Bible d’étude';
})();
