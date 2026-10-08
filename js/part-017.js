
(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const THEMES={
    'orange':{label:'Clair',swatch:'#f4f1ea',bg:'#faf8f4',card:'#ffffff',paper:'#fffdf9',ink:'#2a2622',muted:'#7d756c',line:'#e7e0d6',accent:'#b4683a',accent2:'#8b2233',header:'#f1ede5',bubble:'#ffffff',bubbleBorder:'#c9b8a2',c0:'#287b58',c1:'#5278bd',c2:'#c47732',c3:'#a84855'},
    'nuit':{label:'Charbon',swatch:'#222224',bg:'#18181a',card:'#26262a',paper:'#2b2b2f',ink:'#f1ead8',muted:'#b9ae96',line:'#5b4a2b',accent:'#d4a85a',accent2:'#e3c07a',header:'#121214',bubble:'#2a2a2d',bubbleBorder:'#c9a45c',c0:'#72b38d',c1:'#8eace0',c2:'#e0ad6a',c3:'#d98b98'}
  };
  const KEY='wmb-v9-global-theme-v1';
  let state={id:'orange',soft:74};
  try{const x=JSON.parse(localStorage.getItem(KEY)||'{}');if(THEMES[x.id])state.id=x.id;if(Number.isFinite(+x.soft))state.soft=Math.max(0,Math.min(100,+x.soft))}catch(e){}
  function hex(h){h=String(h).replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');const n=parseInt(h,16);return [n>>16,(n>>8)&255,n&255]}
  function rgb(c){const a=hex(c);return '#'+a.map(n=>n.toString(16).padStart(2,'0')).join('')}
  function mix(a,b,t){const x=hex(a),y=hex(b),q=Math.max(0,Math.min(1,t));return '#'+x.map((n,i)=>Math.round(n+(y[i]-n)*q).toString(16).padStart(2,'0')).join('')}
  function applyTheme(id=state.id,soft=state.soft,save=true){
    if(!THEMES[id])id='orange';state={id,soft:Math.max(0,Math.min(100,+soft||0))};const t=THEMES[id],q=state.soft/100;
    const soften=c=>mix(c,'#ffffff',q*.20),softBg=c=>mix(c,'#ffffff',q*.10);
    const root=document.documentElement,body=document.body;
    const vars={
      '--v9-theme-bg':softBg(t.bg),'--v9-theme-card':soften(t.card),'--v9-theme-paper':soften(t.paper),
      '--v9-theme-ink':id==='nuit'?t.ink:mix(t.ink,'#2f2925',q*.10),'--v9-theme-muted':t.muted,'--v9-theme-line':t.line,
      '--v9-theme-accent':soften(t.accent),'--v9-theme-accent-2':soften(t.accent2),'--v9-theme-header':softBg(t.header),
      '--v9-theme-bubble':soften(t.bubble),'--v9-theme-bubble-border':soften(t.bubbleBorder),'--v9-theme-bubble-ink':id==='nuit'?t.ink:t.ink,
      '--c0':soften(t.c0),'--c1':soften(t.c1),'--c2':soften(t.c2),'--c3':soften(t.c3),'--study-paper':soften(t.paper)
    };
    Object.entries(vars).forEach(([k,v])=>root.style.setProperty(k,v));
    root.dataset.v9Theme=id;body.dataset.v9Theme=id;
    const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=vars['--v9-theme-header'];
    if(save)try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}
    paintThemeCard();
  }
  function ensureThemeCard(){
    const sc=$('studyContent');if(!sc||!sc.querySelector('#appTheme'))return;
    let card=$('v9GlobalThemeCard');
    if(!card){
      card=document.createElement('section');card.id='v9GlobalThemeCard';card.className='study-card';
      card.innerHTML='<h3>Thème général <span id="v9ThemeName"></span></h3><p>Choisis une harmonie pour toute l’application. La douceur rééquilibre les couleurs afin de garder un rendu chaleureux, calme et lisible.</p><div id="v9GlobalThemeGrid"></div><label for="v9ThemeSoft">Douceur des couleurs <output id="v9ThemeSoftValue"></output></label><input id="v9ThemeSoft" type="range" min="0" max="100" step="1"><div id="v9ThemeSoftLine"><span>Plus affirmé</span><span>Plus doux</span></div><div id="v9ThemeStatus" role="status" aria-live="polite"></div>';
      sc.prepend(card);
    }
    const appTheme=$('appTheme');
    if(appTheme&&!appTheme.dataset.v9Bound){appTheme.dataset.v9Bound='1';appTheme.addEventListener('change',()=>{const map={clair:'orange',sepia:'orange',nuit:'nuit'};applyTheme(map[appTheme.value]||'orange',state.soft)})}
    const range=$('v9ThemeSoft');if(range&&!range.dataset.v9Bound){range.dataset.v9Bound='1';range.addEventListener('input',()=>applyTheme(state.id,+range.value))}
    paintThemeCard();
  }
  function paintThemeCard(){
    const grid=$('v9GlobalThemeGrid'),range=$('v9ThemeSoft'),name=$('v9ThemeName'),value=$('v9ThemeSoftValue'),status=$('v9ThemeStatus');
    if(!grid)return;const t=THEMES[state.id];
    grid.innerHTML=Object.entries(THEMES).map(([id,x])=>'<button type="button" data-v9-theme-choice="'+id+'" class="'+(id===state.id?'on':'')+'" style="background:'+x.swatch+';color:'+(id==='nuit'?'#fff':'#3d2d24')+'"><span>'+x.label+'</span></button>').join('');
    grid.querySelectorAll('[data-v9-theme-choice]').forEach(b=>b.addEventListener('click',()=>{applyTheme(b.dataset.v9ThemeChoice,state.soft);if(status)status.textContent='Thème « '+THEMES[state.id].label+' » appliqué à toute l’application.'}));
    if(name)name.textContent='— '+t.label;if(range)range.value=state.soft;if(value)value.textContent=state.soft+' %';
  }
  applyTheme(state.id,state.soft,false);
  const sc=$('studyContent');
  if(sc){const mo=new MutationObserver(()=>setTimeout(ensureThemeCard,30));mo.observe(sc,{childList:true,subtree:true});setInterval(ensureThemeCard,350);ensureThemeCard();}
  /* Mode de test automatique : dans la prévisualisation dédiée, les cinq bulles
     s’ouvrent seules afin que le test soit immédiatement visible. */
  const dash=$('v9Dash'),ov=$('v9DashOv');
  if(dash&&location.pathname==='/'){
    setTimeout(()=>{dash.classList.add('on');ov&&ov.classList.add('on')},1100);
  }
  window.V9CThemesTest={themes:THEMES,applyTheme,openSettings:()=>{const b=document.querySelector('#v9Dash [data-go="settings"]');if(b)b.click()}};
})();
