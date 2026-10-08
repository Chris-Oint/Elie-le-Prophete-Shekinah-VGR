
(function(){
  'use strict';
  const $=id=>document.getElementById(id);

  /* Le dictionnaire reste visible comme fonction à venir, mais non cliquable. */
  function disableDictionary(){
    const dash=$('v9Dash'),b=dash?.querySelector('[data-go="dictionary"]');if(!b)return;
    b.removeAttribute('data-go');b.disabled=true;b.classList.add('v9-coming-soon');b.setAttribute('aria-disabled','true');b.title='Dictionnaire — bientôt';
    const label=b.querySelector('small');if(label)label.textContent='Dictionnaire bientôt';
    b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation()},true);
    b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopImmediatePropagation()},true);
  }

  /* Sélecteur de brochure : une seule brochure peut être choisie. */
  let picker=null;
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function fold(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
  function getMeta(){try{return typeof D!=='undefined'&&D?.meta?D.meta:null}catch(e){return null}}
  function createPicker(){
    if(picker)return picker;
    picker=document.createElement('div');picker.id='v9BrochurePicker';picker.innerHTML='<div class="v9-brochure-box" role="dialog" aria-modal="true" aria-label="Sélectionner une brochure"><div class="v9-brochure-head"><h3>Choisir une brochure</h3><button type="button" class="v9-picker-close" aria-label="Fermer">×</button></div><input id="v9BrochureQuery" type="search" placeholder="Code ou titre…" aria-label="Rechercher une brochure"><div class="v9-brochure-list" id="v9BrochureList"></div></div>';
    document.body.append(picker);picker.addEventListener('click',e=>{if(e.target===picker)closePicker()});picker.querySelector('.v9-picker-close').onclick=closePicker;picker.querySelector('#v9BrochureQuery').oninput=renderPicker;return picker;
  }
  function renderPicker(){
    const box=createPicker(),list=$('v9BrochureList'),q=fold($('v9BrochureQuery')?.value||''),meta=getMeta();if(!list)return;
    if(!meta){list.innerHTML='<div class="v9-picker-status">Chargement des brochures…</div>';setTimeout(renderPicker,350);return}
    const ids=meta.map((m,i)=>({m,i})).filter(x=>!q||fold(x.m[0]+' '+x.m[1]+' '+x.m[2]).includes(q)).slice(0,160);
    list.innerHTML=ids.length?ids.map(x=>'<button type="button" class="v9-brochure-item" data-doc="'+x.i+'"><span class="v9-brochure-code">'+esc(x.m[0])+(x.m[2]==='VGR'?' · VGR':'')+'</span><span><span class="v9-brochure-title">'+esc(x.m[1])+'</span><span class="v9-brochure-sub">'+esc(x.m[3]||'')+' · '+esc(x.m[5]||'')+' §</span></span></button>').join(''):'<div class="v9-picker-status">Aucune brochure trouvée.</div>';
    list.querySelectorAll('[data-doc]').forEach(b=>b.onclick=()=>{const i=+b.dataset.doc;closePicker();if($('workSearch'))$('workSearch').hidden=true;try{if(typeof openBrochure==='function')openBrochure(i,0,null);else $('hdrPhoto')?.click()}catch(e){$('hdrPhoto')?.click()}});
  }
  function openPicker(){const box=createPicker();box.classList.add('on');const q=$('v9BrochureQuery');if(q){q.value='';setTimeout(()=>q.focus(),60)}renderPicker()}
  function closePicker(){picker?.classList.remove('on')}
  function bindBrochureButton(){const b=$('v9SelectBrochure');if(!b)return;b.onclick=e=>{e.preventDefault();e.stopPropagation();openPicker()};b.title='Sélectionner une seule brochure';}
  bindBrochureButton();setInterval(()=>{bindBrochureButton();disableDictionary()},500);

  /* Animation d’ouverture : Jésus, texte exact de l’en-tête, puis Branham. */
  function typeText(el,text,speed,done){let i=0;el.textContent='';const tick=()=>{if(i<text.length){el.textContent+=text[i++];setTimeout(tick,speed)}else if(done)done()};tick()}
  function startOpening(){
    if(window.M4Splash)return window.M4Splash.play();
    if($('v9Opening'))return;
    const jesus=$('jesusPhoto')?.src||$('bookFloat img')?.src||'';
    const branham=$('hdrPhoto')?.src||'';
    const m1=($('motto')?.querySelector('.m1')?.textContent||'« Voici, je vous enverrai Élie, le prophète »').trim();
    const m2=($('motto')?.querySelector('.m2')?.textContent||'MALACHIE 4 · LA LUMIÈRE DU SOIR').trim();
    const o=document.createElement('div');o.id='v9Opening';o.setAttribute('role','dialog');o.setAttribute('aria-label','Ouverture de WMB Bible d’étude');o.innerHTML='<img class="v9-opening-photo v9-opening-jesus" alt="Jésus"><div class="v9-opening-copy"><p class="v9-opening-m1"><span id="v9OpeningM1"></span><i class="v9-opening-cursor"></i></p><p class="v9-opening-m2"><span id="v9OpeningM2"></span><i class="v9-opening-cursor"></i></p></div><img class="v9-opening-photo v9-opening-branham" alt="William Marrion Branham"><button type="button" class="v9-opening-skip">Passer l’animation</button>';
    document.body.append(o);document.body.classList.add('v9-opening-active');o.querySelector('.v9-opening-jesus').src=jesus;o.querySelector('.v9-opening-branham').src=branham;o.querySelector('.v9-opening-skip').onclick=()=>finish(true);
    let done=false;
    function finish(skip){if(done)return;done=true;const b=o.querySelector('.v9-opening-branham');if(skip){o.classList.add('leave');setTimeout(end,180)}else{b.classList.add('show');setTimeout(()=>{o.classList.add('leave');setTimeout(end,800)},2000)}}
    function end(){o.remove();document.body.classList.remove('v9-opening-active');}
    setTimeout(()=>typeText($('v9OpeningM1'),m1,43,()=>setTimeout(()=>typeText($('v9OpeningM2'),m2,38,()=>setTimeout(()=>finish(false),250)),230)),300);
  }
  /* ouverture lancee des le debut de la page par m4-splash-boot */
  window.V9COpeningTest={openPicker,startOpening,closePicker};
})();
