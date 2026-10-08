
(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const dash=$('v9Dash');
  const sel=$('v9Sel');
  const dashOverlay=$('v9DashOv');
  if(!dash)return;

  const storageKey='wmb-v9-bubbles-side';
  let side='right';
  try{side=localStorage.getItem(storageKey)==='left'?'left':'right'}catch(e){}

  function applyDock(el){
    if(!el)return;
    el.classList.toggle('dock-left',side==='left');
    el.classList.toggle('dock-right',side!=='left');
  }
  function setSide(next){
    side=next==='left'?'left':'right';
    try{localStorage.setItem(storageKey,side)}catch(e){}
    applyDock(dash);applyDock(sel);
    if(sel&&sel.classList.contains('on'))requestAnimationFrame(positionSelection);
  }
  applyDock(dash);applyDock(sel);

  /* Cinquième bulle : Dictionnaire, ajoutée avant les quatre bulles originales. */
  if(!dash.querySelector('[data-go="dictionary"]')){
    const b=document.createElement('button');
    b.type='button';
    b.className='v9b';
    b.dataset.go='dictionary';
    b.setAttribute('aria-label','5 · Dictionnaire');
    b.title='Dictionnaire';
    b.innerHTML='<span class="ic"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#5a1420" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 5.5v15M8 7h8M8 11h8M8 15h5"/></svg></span><small>5 · Dictionnaire</small>';
    b.addEventListener('click',function(e){
      e.preventDefault();e.stopPropagation();
      dash.classList.remove('on');if(dashOverlay)dashOverlay.classList.remove('on');
      location.href='../../dictionnaire/';
    });
    dash.insertBefore(b,dash.firstElementChild||null);
  }

  /* Placement de la famille de sélection : même côté que le tableau de bord,
     centrée autour du passage maintenu lorsque ses pointillés existent. */
  let selectionPoint={x:24,y:180};
  document.addEventListener('pointerdown',e=>{
    const p=e.target.closest&&e.target.closest('#bibleView .vt,#msgView .pt');
    if(p)selectionPoint={x:e.clientX,y:e.clientY};
  },{capture:true,passive:true});

  function selectionRects(){
    return [...document.querySelectorAll('.wmb-dotted')]
      .map(el=>el.getBoundingClientRect())
      .filter(r=>r.width||r.height);
  }
  function positionSelection(){
    if(!sel||!sel.classList.contains('on'))return;
    applyDock(sel);
    const h=sel.offsetHeight||220;
    const rs=selectionRects();
    let y;
    if(rs.length){
      const top=Math.min(...rs.map(r=>r.top));
      const bottom=Math.max(...rs.map(r=>r.bottom));
      y=(top+bottom-h)/2;
    }else{
      y=selectionPoint.y-h/2;
    }
    y=Math.max(76,Math.min(innerHeight-h-12,y));
    sel.style.top=Math.round(y)+'px';
    sel.style.bottom='auto';
    if(side==='left'){sel.style.left='12px';sel.style.right='auto'}
    else{sel.style.left='auto';sel.style.right='12px'}
  }
  let placeFrame=0;
  function scheduleSelection(){
    cancelAnimationFrame(placeFrame);
    placeFrame=requestAnimationFrame(()=>{placeFrame=0;positionSelection()});
  }
  if(sel){
    new MutationObserver(()=>{if(sel.classList.contains('on'))scheduleSelection()})
      .observe(sel,{attributes:true,attributeFilter:['class'],subtree:true});
    window.addEventListener('resize',scheduleSelection,{passive:true});
    window.addEventListener('scroll',scheduleSelection,{passive:true});
  }

  /* Déplacement groupé gauche/droite. Un tap garde exactement l'action d'origine;
     un déplacement horizontal fixe le côté pour les cinq ou les trois bulles. */
  function makeGroupDockable(el){
    if(!el)return;
    let state=null;
    let suppress=false;
    el.addEventListener('pointerdown',e=>{
      if(!e.isPrimary||!e.target.closest('.v9b'))return;
      state={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false};
      try{e.target.setPointerCapture(e.pointerId)}catch(err){}
    },{capture:true});
    el.addEventListener('pointermove',e=>{
      if(!state||state.id!==e.pointerId)return;
      const dx=e.clientX-state.x,dy=e.clientY-state.y;
      if(Math.hypot(dx,dy)>9)state.moved=true;
      if(state.moved){e.preventDefault();el.classList.add('is-dragging')}
    },{passive:false});
    const finish=e=>{
      if(!state||state.id!==e.pointerId)return;
      const moved=state.moved;state=null;el.classList.remove('is-dragging');
      if(moved){setSide(e.clientX<innerWidth/2?'left':'right');suppress=true;setTimeout(()=>{suppress=false},450)}
    };
    el.addEventListener('pointerup',finish,{passive:true});
    el.addEventListener('pointercancel',finish,{passive:true});
    el.addEventListener('lostpointercapture',finish,{passive:true});
    el.addEventListener('click',e=>{
      if(suppress){e.preventDefault();e.stopImmediatePropagation();suppress=false}
    },true);
  }
  makeGroupDockable(sel);

  /* Si la palette s'ouvre, elle part vers l'intérieur de l'écran, à l'opposé
     de la colonne de bulles. */
  if(sel){
    new MutationObserver(()=>{
      if(sel.classList.contains('on'))positionSelection();
    }).observe(sel,{attributes:true,attributeFilter:['class'],subtree:true});
  }
  setSide(side);
  window.V9CBubblesTest={setSide,positionSelection,getSide:()=>side};
})();
