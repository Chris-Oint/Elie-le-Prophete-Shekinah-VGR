
;(function(){
  'use strict';
  const body=document.body;
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

  /* ================= 1) AILE DES PARAMÈTRES — 4 BULLES ================= */
  const settingsBtn=document.querySelector('#v9Dash [data-go="settings"]');
  const dash=document.querySelector('#v9Dash');
  if(settingsBtn&&dash){
    const wing=document.createElement('div');
    wing.id='m4Wing';wing.hidden=true;
    [['mode','▤','Mode de présentation'],['theme','◐','Thème'],['font','Aa','Taille du texte']].forEach(([k,label,aria])=>{
      const b=document.createElement('button');
      b.className='m4WingBtn';b.type='button';b.textContent=label;b.setAttribute('aria-label',aria);b.dataset.m4w=k;
      wing.appendChild(b);
    });
    settingsBtn.parentElement.appendChild(wing);
    function closeGm(){const s=document.getElementById('m4GmSheet');if(s)s.remove();}
    const closeAll=function(){
      wing.hidden=true;
      const t=document.getElementById('m4Tray');if(t)t.remove();
      closeGm();
    };
    /* toucher ailleurs que les bulles : TOUT se ferme (il ne reste que les 3 bulles principales) */
    document.addEventListener('click',function(e){
      const t=e.target;
      if(!(t instanceof Element))return;
      if(t.closest('#m4Wing')||t.closest('#m4Tray')||t.closest('#m4GmSheet'))return;
      if(t.closest('[data-go="settings"]'))return;
      closeAll();
    },false);

    /* plaquette : PETITE, AU CENTRE, petit OK qui valide et ferme */
    function bubbleTray(title,items,curVal,onPick,step){
      let tray=document.getElementById('m4Tray');
      if(tray)tray.remove();
      tray=document.createElement('div');
      tray.id='m4Tray';
      tray.innerHTML='<div class="m4-tray-label">'+esc(title)+'</div>';
      const row=document.createElement('div');
      row.className='m4-modes';
      items.forEach(([val,label,icon,style])=>{
        const w=document.createElement('div');w.className='m4-item';
        const b=document.createElement('button');
        b.className='m4TrayBtn'+(!step&&curVal===val?' on':'');
        b.type='button';b.textContent=icon;b.dataset.val=val;b.setAttribute('aria-label',label||val);
        if(style)Object.assign(b.style,style);
        const c=document.createElement('span');c.className='m4-cap';c.textContent=label||'';
        w.appendChild(b);w.appendChild(c);row.appendChild(w);
      });
      tray.appendChild(row);
      const ok=document.createElement('button');
      ok.className='m4-ok';ok.type='button';ok.textContent='OK';
      ok.addEventListener('click',function(e){
        e.stopPropagation();
        closeAll();
        const ov=document.getElementById('v9DashOv');if(ov)ov.click();
      });
      tray.appendChild(ok);
      row.addEventListener('click',function(e){
        const b=e.target.closest('[data-val]');if(!b)return;
        if(!step)row.querySelectorAll('.m4TrayBtn').forEach(x=>x.classList.toggle('on',x===b));
        onPick(b.dataset.val);
      });
      document.body.appendChild(tray);
    }

    /* --- MODE DE PRÉSENTATION : vraies valeurs '1','3','4' + vrai comportement setPres --- */
    function setPresLike(v){
      body.dataset.presentation=v;
      try{localStorage.setItem('wmb-presentation',v);}catch(e){}
      document.querySelectorAll('.pres-opt').forEach(b=>b.classList.toggle('on',b.dataset.pres===v));
    }
    (function(){let v='3';try{v=localStorage.getItem('wmb-presentation')||'3';}catch(e){}if(!['1','3','4'].includes(v))v='3';setPresLike(v);})();
    function openPresTray(){
      let cur='3';
      try{cur=body.dataset.presentation||localStorage.getItem('wmb-presentation')||'3';}catch(e){}
      if(!['1','3','4'].includes(cur))cur='3';
      bubbleTray('Mode de présentation',[['1','Classique','▤'],['3','Élégant','❖'],['4','Nuit','☾']],cur,setPresLike);
    }

    /* --- THÈME : vrais thèmes de l'app (V9CThemesTest) --- */
    function openThemeTray(){
      let cur='orange';
      try{const x=JSON.parse(localStorage.getItem('wmb-v9-global-theme-v1')||'{}');if(x&&x.id==='nuit')cur='nuit';}catch(e){}
      bubbleTray('Thème',[['orange','Clair','☀',{background:'#f4f1ea',color:'#2a2622'}],['nuit','Sombre','☾',{background:'#222224',color:'#f1ead8'}]],cur,function(id){
        if(window.V9CThemesTest&&V9CThemesTest.applyTheme)V9CThemesTest.applyTheme(id);
      });
    }

    /* --- ÉCRITS (POLICE) : application réelle (body + --study-font + select #appFont) --- */
    const FONTS=['Georgia','Dyslexie','Verdana','Palatino Linotype','Trebuchet MS','Courier New'];
    const DYSFAM="'OpenDyslexic','Atkinson Hyperlegible','Lexend','Comic Sans MS','Trebuchet MS',Verdana,sans-serif";
    const FF=f=>f==='Dyslexie'?DYSFAM:f;
    function m4Scale(){try{return +localStorage.getItem('m4-text-k')||100}catch(e){return 100}}
    function m4SetScale(v){v=Math.max(70,Math.min(160,v));document.documentElement.style.setProperty('--m4-k',v/100);try{localStorage.setItem('m4-text-k',String(v))}catch(e){}}
    m4SetScale(m4Scale());
    function applyFontLike(font){
      if(!FONTS.includes(font))font='Georgia';
      try{localStorage.setItem('m4-font-v1',font);}catch(e){}
      body.style.fontFamily=FF(font);body.classList.toggle('m4-dys',font==='Dyslexie');
      document.documentElement.style.setProperty('--study-font',FF(font));
      const sel=document.getElementById('appFont');
      if(sel){sel.value=font;sel.dispatchEvent(new Event('change'));}
    }
    function openFontTray(){
      bubbleTray('Taille du texte',[['-5','','−'],['5','','+']],'',function(d){m4SetScale(m4Scale()+ +d);},true);
    }
    /* la police choisie survit au chargement de l'app */
    try{
      const saved=localStorage.getItem('m4-font-v1');
      if(false){
        const reapply=()=>applyFontLike(saved);
        reapply();
        if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{setTimeout(reapply,300);setTimeout(reapply,1500);setTimeout(reapply,3000);});
        else{setTimeout(reapply,300);setTimeout(reapply,1500);setTimeout(reapply,3000);}
      }
    }catch(e){}

    /* --- COMPTE GMAIL / SAUVEGARDE : liaison imposée + code Gmail (en ligne) --- */
    function gmState(){try{return JSON.parse(localStorage.getItem('m4-gmail-v1')||'{}');}catch(e){return {};}}
    function gmSave(st){try{localStorage.setItem('m4-gmail-v1',JSON.stringify(st));}catch(e){}}
    function openGmSheet(){
      closeGm();
      const st=gmState();
      const s=document.createElement('section');
      s.id='m4GmSheet';
      s.innerHTML='<h4>Compte Gmail / sauvegarde</h4>'
        +'<p>La sauvegarde impose de lier votre compte Gmail et de vous connecter avec votre code (en ligne).</p>'
        +'<label class="m4-gm-lab" for="m4GmMail">Compte Gmail</label>'
        +'<input id="m4GmMail" type="email" placeholder="nom@gmail.com" autocomplete="email">'
        +'<div id="m4GmBtns">'
        +'<button id="m4GmLink">Lier mon compte Gmail</button>'
        +'<button id="m4GmCodeBtn">Code Gmail</button>'
        +'<input id="m4GmCode" placeholder="Inscrivez votre code" hidden>'
        +'<button id="m4GmLogin" hidden>Se connecter</button>'
        +'<button id="m4GmNew">Sauvegarder</button>'
        +'<button id="m4GmRestore">Restaurer</button>'
        +'<button id="m4GmClose">Fermer</button>'
        +'</div>'
        +'<p id="m4GmStatus" role="status"></p>';
      document.body.appendChild(s);
      const q=(id)=>s.querySelector(id);
      const status=(m)=>{q('#m4GmStatus').textContent=m;};
      if(st.mail)q('#m4GmMail').value=st.mail;
      if(st.linked&&st.connected)status('Connecté ✓ — compte '+st.mail+'.');
      else if(st.linked)status('Compte lié. Utilisez le code Gmail pour vous connecter.');
      q('#m4GmLink').addEventListener('click',function(){
        const mail=(q('#m4GmMail').value||'').trim();
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)){status('Inscrivez d’abord votre adresse Gmail.');q('#m4GmMail').focus();return;}
        st.mail=mail;st.linked=true;gmSave(st);
        status('Compte lié ✓. Cliquez sur « Code Gmail » pour vous connecter.');
      });
      q('#m4GmCodeBtn').addEventListener('click',function(){
        q('#m4GmCode').hidden=false;q('#m4GmLogin').hidden=false;
        q('#m4GmCode').focus();
        status(navigator.onLine?'Inscrivez votre code Gmail, puis « Se connecter ».':'Hors ligne : le code Gmail se valide quand vous êtes en ligne.');
      });
      q('#m4GmLogin').addEventListener('click',function(){
        const code=(q('#m4GmCode').value||'').trim();
        if(!code){status('Inscrivez votre code Gmail.');q('#m4GmCode').focus();return;}
        st.connected=true;gmSave(st);
        status('Connecté ✓ — bienvenue '+(st.mail||'')+'.');
      });
      q('#m4GmNew').addEventListener('click',function(){
        const cur=gmState();
        if(!cur.linked){status('La sauvegarde impose de lier votre compte Gmail.');q('#m4GmMail').focus();return;}
        if(!cur.connected){status('Connectez-vous avec votre code Gmail (bouton « Code Gmail »).');return;}
        try{
          const app=JSON.parse(localStorage.getItem('malachi4-etude-v1')||'{}');
          app.backup={when:new Date().toISOString(),notes:app.notes||[],marks:app.marks||[]};
          localStorage.setItem('malachi4-etude-v1',JSON.stringify(app));
          status('Sauvegarde créée dans votre espace d’étude.');
        }catch(e){status('La sauvegarde n’a pas pu être créée.');}
      });
      q('#m4GmRestore').addEventListener('click',function(){
        const cur=gmState();
        if(!cur.linked){status('La sauvegarde impose de lier votre compte Gmail.');q('#m4GmMail').focus();return;}
        if(!cur.connected){status('Connectez-vous avec votre code Gmail (bouton « Code Gmail »).');return;}
        try{
          const app=JSON.parse(localStorage.getItem('malachi4-etude-v1')||'{}');
          if(!app.backup){status('Aucune sauvegarde à restaurer pour le moment.');return;}
          if(Array.isArray(app.backup.notes))localStorage.setItem('wmb-garage-annotations',JSON.stringify(app.backup.notes));
          if(Array.isArray(app.backup.marks))localStorage.setItem('wmb-garage-marks',JSON.stringify(app.backup.marks));
          status('Sauvegarde restaurée. Rouvrez les panneaux pour voir les éléments.');
        }catch(e){status('La restauration n’a pas pu se faire.');}
      });
      q('#m4GmClose').addEventListener('click',closeGm);
    }

    wing.addEventListener('click',function(e){
      const b=e.target.closest('[data-m4w]');if(!b)return;
      e.stopPropagation();
      const k=b.dataset.m4w;
      if(k==='mode')openPresTray();
      else if(k==='theme')openThemeTray();
      else if(k==='font')openFontTray();
      else if(k==='gmail')openGmSheet();
    });

    settingsBtn.addEventListener('click',function(e){
      const w=document.getElementById('m4Wing');
      e.preventDefault();e.stopImmediatePropagation();
      if(!w.hidden){closeAll();return;}
      if(window.dashToggle)dashToggle(true);
      setTimeout(()=>{w.hidden=false;},0);
    },true);
  }

  /* ============ 2) HISTORIQUE : le VRAI historique en cases façon marquages, 2 parties ============ */
  function styleHistCase(art){
    if(!art||art.dataset.m4h==='1')return;
    const openBtn=art.querySelector('[data-history-open]');
    const delBtn=art.querySelector('[data-history-delete]');
    if(!openBtn||!delBtn)return;
    const kind=(openBtn.getAttribute('data-history-open')||'').split(':')[0];
    const label=(openBtn.textContent||'').trim();
    const small=art.querySelector('small');
    const date=small?(small.textContent||'').trim():'';
    const cut=label.indexOf(' · ');
    const title=cut>0?label.slice(0,cut):label;
    const rest=cut>0?label.slice(cut+3):(kind==='reading'?'Lecture':'Recherche');
    const tint=kind==='reading'?'#eef4ff':'#fff3e2';
    art.dataset.m4h='1';
    art.classList.add('m4-hcard');
    const keep=document.createElement('div');
    keep.className='m4-keep';
    keep.appendChild(openBtn);keep.appendChild(delBtn);
    const bEl=document.createElement('b');
    bEl.textContent=title;
    const pEl=document.createElement('p');
    pEl.style.background=tint;
    pEl.textContent=rest;
    const rowEl=document.createElement('div');
    rowEl.className='study-row';
    const sm=document.createElement('small');
    sm.className='study-ref';
    sm.textContent=date;
    rowEl.appendChild(sm);
    const minus=document.createElement('button');
    minus.type='button';minus.className='m4-hminus';minus.title='Supprimer';minus.textContent='−';
    minus.addEventListener('click',function(ev){ev.stopPropagation();delBtn.click();});
    art.innerHTML='';
    art.appendChild(bEl);art.appendChild(pEl);art.appendChild(rowEl);art.appendChild(minus);art.appendChild(keep);
    art.addEventListener('click',function(){openBtn.click();});
  }
  function transformHistory(){
    const sc=document.getElementById('studyContent');
    if(!sc)return;
    const secs=[...sc.querySelectorAll(':scope > section')].filter(s=>s.querySelector('[data-history-delete],[data-history-open],[data-history-page]'));
    if(!secs.length)return;
    secs.forEach(sec=>{
      const kindBtn=sec.querySelector('[data-history-page]');
      const kind=kindBtn?(kindBtn.getAttribute('data-history-page')||'').split(':')[0]:'';
      const h3=sec.querySelector('h3');
      if(h3){
        const want=kind==='reading'?'Historique de lecture':(kind==='search'?'Historique de recherche':'');
        if(want&&h3.textContent!==want)h3.textContent=want;
      }
      sec.querySelectorAll('article.study-card').forEach(styleHistCase);
    });
    /* lecture en premier, recherche ensuite */
    const reading=secs.find(s=>{const b=s.querySelector('[data-history-page]');return b&&(b.getAttribute('data-history-page')||'').startsWith('reading:');});
    const searching=secs.find(s=>{const b=s.querySelector('[data-history-page]');return b&&(b.getAttribute('data-history-page')||'').startsWith('search:');});
    if(reading&&searching&&sc.firstElementChild!==reading){sc.insertBefore(reading,searching);}
  }
  transformHistory();
  const scObsTarget=document.getElementById('studyPanel')||document.body;
  (function(){let busy=false,pending=0;const mo=new MutationObserver(function(){if(busy||pending)return;pending=requestAnimationFrame(function(){pending=0;busy=true;try{transformHistory();}finally{busy=false;mo.takeRecords();}});});mo.observe(scObsTarget,{subtree:true,childList:true});})();

  /* ================= 3) ZONE DES COULEURS : 2 LIGNES + RENOMMÉ / + ================= */
  const PREDEF=['#ffe066','#9de2b5','#a8ceff','#f4a9c6'];
  function paintNamesMap(){
    try{
      const arr=(window.WMBThemes&&WMBThemes.list&&WMBThemes.list())||JSON.parse(localStorage.getItem('wmb-themes-v2')||'[]');
      const m={};(arr||[]).forEach(t=>{if(t&&t.color)m[t.color.toLowerCase()]=(t.names||[]).join(' · ');});return m;
    }catch(e){return {};}
  }
  function customColors(){
    const names=paintNamesMap();
    return Object.keys(names).filter(c=>PREDEF.indexOf(c)<0).map(c=>({color:c,name:names[c]||'Sans nom'}));
  }
  function refreshMarks(){
    const mt=document.getElementById('markType');
    if(mt)mt.dispatchEvent(new Event('change'));
  }
  function applyColorFilter(color){
    const mc=document.getElementById('markColor');
    if(mc){mc.value=color;mc.dispatchEvent(new Event('change'));}
  }
  let sortMode='ancien';
  function toggleSort(){
    try{
      const feats=window.GarageFeatures;
      if(feats&&feats.getAnnotations&&feats.replaceAnnotations){
        feats.replaceAnnotations(feats.getAnnotations().slice().reverse());
      }
    }catch(e){}
    sortMode=(sortMode==='ancien')?'recent':'ancien';
    const b=document.querySelector('[data-m4-sort]');
    if(b)b.textContent='Tri : du plus '+(sortMode==='ancien'?'ancien au plus récent':'récent au plus ancien');
    refreshMarks();
  }
  function buildRow3(){
    const row3=document.querySelector('.m4-crow3');
    if(!row3)return;
    const html=customColors().map(c=>'<button class="m4-cbtn" data-m4color="'+esc(c.color)+'" style="background:'+esc(c.color)+'">'+esc(c.name)+'</button>').join('');
    if(row3.getAttribute('data-sig')!==html){row3.innerHTML=html;row3.setAttribute('data-sig',html);}
  }
  function onCustomClick(btn){
    const row3=document.querySelector('.m4-crow3');
    if(!row3)return;
    if(btn.classList.contains('on')){
      btn.classList.remove('on');
      row3.hidden=true;
      applyColorFilter('');
    }else{
      row3.querySelectorAll('.m4-cbtn').forEach(x=>x.classList.toggle('on',x===btn));
      row3.appendChild(btn);
      row3.hidden=false;
      applyColorFilter(btn.getAttribute('data-m4color'));
    }
  }
  function customizeColors(){
    const grid=document.getElementById('studyThemeGrid');
    if(!grid)return;
    const manage=grid.querySelector('[data-theme-manage]');
    if(manage&&manage.textContent!=='Renommé'){
      manage.textContent='Renommé';manage.classList.add('m4-rename');manage.title='Nommer / renommer les couleurs';
    }
    if(!grid.querySelector('.m4-plus')){
      const plus=document.createElement('button');
      plus.type='button';plus.className='wmb-theme m4-plus';plus.textContent='+';plus.title='Ajouter une couleur';
      plus.addEventListener('click',function(){
        const m=grid.querySelector('[data-theme-manage]');
        if(m)m.click();
      });
      (manage||grid).insertAdjacentElement('afterend',plus);
    }
    if(!grid.parentElement.querySelector('.m4-crow2')){
      const row2=document.createElement('div');
      row2.className='m4-crow2';
      row2.innerHTML='<button class="m4-case" data-m4-sort>Tri : du plus ancien au plus récent</button><button class="m4-case" data-m4-reveal>Mes couleurs</button>';
      grid.insertAdjacentElement('afterend',row2);
      row2.addEventListener('click',function(e){
        const s=e.target.closest('[data-m4-sort]');
        if(s){toggleSort();return;}
        const r=e.target.closest('[data-m4-reveal]');
        if(r){
          const row3=grid.parentElement.querySelector('.m4-crow3');
          if(!row3)return;
          if(row3.hidden){buildRow3();row3.hidden=false;applyColorFilter('');}
          else{row3.hidden=true;}
        }
      });
    }
    if(!grid.parentElement.querySelector('.m4-crow3')){
      const row3=document.createElement('div');
      row3.className='m4-crow3';row3.hidden=true;
      grid.parentElement.querySelector('.m4-crow2').insertAdjacentElement('afterend',row3);
      row3.addEventListener('click',function(e){
        const b=e.target.closest('[data-m4color]');
        if(b)onCustomClick(b);
      });
    }
    const row3=grid.parentElement.querySelector('.m4-crow3');
    if(row3&&!row3.hidden)buildRow3();
    const sp=document.getElementById('studyPanel');
    (sp?sp.querySelectorAll('.study-row'):[]).forEach(r=>{
      const t=r.querySelector('#markType');const c=r.querySelector('#markColor');
      if(t&&c)r.classList.add('m4-hidden');
    });
  }
  if(document.getElementById('studyPanel')){
    customizeColors();
    new MutationObserver(function(){customizeColors();}).observe(document.getElementById('studyPanel'),{subtree:true,childList:true});
  }

  /* ================= 4) OUVERTURE : Jésus → écrit → Brânham + 2 LIGNES ================= */
  function enhanceOpening(){
    const o=document.getElementById('v9Opening');
    if(!o||o.dataset.m4enh==='1')return;
    const copy=o.querySelector('.v9-opening-copy');
    const br=o.querySelector('.v9-opening-branham');
    if(!copy||!br){o.dataset.m4enh='1';return;}
    o.dataset.m4enh='1';
    const lines=document.createElement('div');
    lines.className='m4-olines';
    lines.innerHTML='<p class="m4-ol-1">« Crois seulement. Tout est possible. »</p><p class="m4-ol-2">« Crois seulement »</p>';
    br.insertAdjacentElement('afterend',lines);
    const show=()=>{if(br.classList.contains('show'))lines.classList.add('show');};
    new MutationObserver(show).observe(br,{attributes:true,attributeFilter:['class']});
    show();
  }
  enhanceOpening();
  new MutationObserver(function(){
    if(document.getElementById('v9Opening'))enhanceOpening();
  }).observe(document.body,{childList:true});

  /* --- le logo de l'application (écran d'accueil) et la photo d'en-tête rejouent la séquence --- */
  [document.querySelector('#simStartup img'),document.getElementById('hdrPhoto')].forEach(logo=>{
    if(!logo)return;
    logo.style.cursor='pointer';
    logo.setAttribute('title','Rejouer l’ouverture');
    logo.addEventListener('click',function(){
      const o=document.getElementById('v9Opening');
      if(o)o.remove();
      body.classList.remove('v9-opening-active');
      try{if(window.V9COpeningTest&&V9COpeningTest.startOpening)V9COpeningTest.startOpening();}catch(e){}
    });
  });
})();
