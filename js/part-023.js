
(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const wait=fn=>{if($('wmbNavDash'))fn();else setTimeout(()=>wait(fn),120)};
  const view=()=>{
    const hidden=id=>{const e=$(id);return !e||e.hidden};
    return !hidden('simDashboard')?'dashboard':!hidden('workSearch')?'search':(!hidden('studyPanel')||!hidden('nb'))?'study':'reader';
  };
  const studyZone=()=>{
    if(view()!=='study')return null;
    // Les trois listes existent parfois simultanément : seul l’onglet .on est la source de vérité.
    const active=document.querySelector('#studyPanel [data-study].on');
    return active?.dataset.study||null;
  };
  const showToast=text=>{let t=$('m4CaptureToast');if(!t){t=document.createElement('div');t.id='m4CaptureToast';document.body.appendChild(t)}t.textContent=text;t.classList.add('on');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('on'),1500)};
  function returnHome(){
    try{if(window.M4FinalSettings&&!$('m4Wing')?.hidden)window.M4FinalSettings.close()}catch(e){}
    if(window.v7Center)window.v7Center();
    else {document.body.classList.remove('reading-only');$('workClose')?.click();$('studyClose')?.click();}
    $('v9Dash')?.classList.remove('on');$('v9DashOv')?.classList.remove('on');
  }
  async function openZone(zone){
    try{if(window.M4FinalSettings&&!$('m4Wing')?.hidden)window.M4FinalSettings.close()}catch(e){}
    $('v9Dash')?.classList.remove('on');$('v9DashOv')?.classList.remove('on');
    document.body.classList.remove('reading-only');
    if(window.closeDrawer)closeDrawer(); if(window.closeSheet)closeSheet();
    const ws=$('workSearch');if(ws&&!ws.hidden)$('workClose')?.click();
    /* le bloc-notes se ferme (note enregistrée) pour laisser passer Marquage / Historique */
    {const n=$('nb');if(n&&!n.hidden&&zone!=='notes'){if(window.NB&&NB.close)NB.close();else n.hidden=true;}}
    if(window.GarageStudy)await GarageStudy.open(zone);
    window.v7UpdateNav?.();
  }
  function cycleStudy(dir){
    const cur=studyZone();
    const order=['notes','marks','history'];
    let i=order.indexOf(cur); if(i<0)i=dir<0?0:order.length-1;
    const next=order[(i+(dir<0?1:-1)+order.length)%order.length];
    openZone(next);
  }
  function cycleSearch(dir){
    // La rotation porte uniquement sur les trois onglets du haut.
    const tabs=[...document.querySelectorAll('#workSearch [data-st]')]
      .filter(b=>['brochures','bible','advanced'].includes(b.dataset.st));
    if(!tabs.length)return;
    const current=(typeof searchTab==='string'?searchTab:null)||tabs.find(b=>b.classList.contains('on'))?.dataset.st||'brochures';
    const i=Math.max(0,tabs.findIndex(b=>b.dataset.st===current));
    const next=tabs[(i+(dir<0?1:-1)+tabs.length)%tabs.length];
    next?.click();
  }
  function saveCanvas(canvas){
    canvas.toBlob(blob=>{if(!blob){showToast('Capture non disponible');return}const file=new File([blob],'malachi4-capture-'+Date.now()+'.png',{type:'image/png'});try{const a=document.createElement('a');a.download=file.name;a.href=URL.createObjectURL(blob);a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1200);showToast('Capture d’écran enregistrée');}catch(e){showToast('Capture créée, téléchargement bloqué')}} ,'image/png');
  }
  async function screenshot(){
    // Sur un vrai téléphone, demander d’abord au navigateur la capture de l’écran courant.
    try{
      if(navigator.mediaDevices?.getDisplayMedia){
        const stream=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:1},audio:false});
        const track=stream.getVideoTracks()[0],video=document.createElement('video');video.srcObject=stream;video.muted=true;video.playsInline=true;await video.play();
        await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
        const canvas=document.createElement('canvas');canvas.width=video.videoWidth||innerWidth*devicePixelRatio;canvas.height=video.videoHeight||innerHeight*devicePixelRatio;canvas.getContext('2d').drawImage(video,0,0,canvas.width,canvas.height);track.stop();video.srcObject=null;saveCanvas(canvas);return;
      }
    }catch(e){/* permission refusée ou API indisponible : repli DOM ci-dessous */}
    const canvas=document.createElement('canvas'),scale=Math.min(2,devicePixelRatio||1),w=innerWidth,h=innerHeight;canvas.width=w*scale;canvas.height=h*scale;
    const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="width:'+w+'px;height:'+h+'px;overflow:hidden;background:'+getComputedStyle(document.body).backgroundColor+'">'+document.documentElement.outerHTML.replace(/<script[\s\S]*?<\/script>/gi,'')+'</div></foreignObject></svg>';
    const img=new Image();img.onload=()=>{const c=canvas.getContext('2d');c.scale(scale,scale);c.drawImage(img,0,0);saveCanvas(canvas)};img.onerror=()=>showToast('Capture non disponible dans ce navigateur');img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  }
  function vertical(dir){
    if(dir<0){
      if(view()==='reader'){
        try{if(typeof S!=='undefined'&&S.mode==='bible'){openChaps(S.book);openSheet();}else if(window.openParaGrid)openParaGrid();else openDrawer();}catch(e){}
      }else returnHome();
    }else returnHome();
  }
  wait(function(){
    const b=$('wmbNavDash');if(!b||b.dataset.m4FinalGestures)return;b.dataset.m4FinalGestures='1';
    let p=null,timer=null,longFired=false;
    b.addEventListener('pointerdown',e=>{if(!e.isPrimary)return;p={id:e.pointerId,x:e.clientX,y:e.clientY};longFired=false;document.body.classList.add('m4-gesture-active');clearTimeout(timer);timer=setTimeout(()=>{if(p){longFired=true;showToast('Relâchez pour enregistrer la capture')}} ,650);try{b.setPointerCapture(e.pointerId)}catch(x){}},{capture:true,passive:false});
    b.addEventListener('pointermove',e=>{if(!p||e.pointerId!==p.id)return;if(Math.hypot(e.clientX-p.x,e.clientY-p.y)>12){clearTimeout(timer);timer=null}},{capture:true,passive:false});
    const end=e=>{if(!p||e.pointerId!==p.id)return;clearTimeout(timer);timer=null;const dx=e.clientX-p.x,dy=e.clientY-p.y;p=null;document.body.classList.remove('m4-gesture-active');if(longFired){e.preventDefault();e.stopImmediatePropagation();screenshot();return}if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){e.preventDefault();e.stopImmediatePropagation();if(view()==='study')cycleStudy(dx<0?-1:1);else if(view()==='search')cycleSearch(dx<0?-1:1);return}if(Math.abs(dy)>45&&Math.abs(dy)>Math.abs(dx)){e.preventDefault();e.stopImmediatePropagation();vertical(dy<0?-1:1)}};
    b.addEventListener('pointerup',end,{capture:true,passive:false});b.addEventListener('pointercancel',end,{capture:true,passive:false});
  });
  // Un clic hors d’une sélection ou d’un panneau ferme seulement le panneau de paramètres, sans voile visuel.
  document.addEventListener('click',e=>{const wing=$('m4Wing');if(wing&&!wing.hidden&&!e.target.closest('#m4Wing,#m4Tray,#v9Dash [data-go="settings"]'))window.M4FinalSettings?.close()},true);
  window.M4InteractionFinal={returnHome,cycleStudy,cycleSearch,screenshot};
})();
