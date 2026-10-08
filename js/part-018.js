
(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const FAMILIES={
    or:{label:'Or',color:'#c99a24'},
    bordeaux:{label:'Bordeaux',color:'#8b223f'},
    vert:{label:'Vert',color:'#2f7b50'},
    bleu:{label:'Bleu',color:'#4668a9'},
    lavande:{label:'Lavande',color:'#7656a4'}
  };
  const familyKey='wmb-v9-note-families-v1';
  let noteFamilies={};let selectedNoteFamily='all';let selectedMarkFamily='all';
  try{noteFamilies=JSON.parse(localStorage.getItem(familyKey)||'{}')||{}}catch(e){}
  function saveFamilies(){try{localStorage.setItem(familyKey,JSON.stringify(noteFamilies))}catch(e){}}
  function hash(s){let n=0;for(const c of String(s||''))n=(n*31+c.charCodeAt(0))|0;return Math.abs(n)}
  function familyForText(s){const x=String(s||'').toLowerCase();if(/foi|prière|promesse|vert/.test(x))return 'vert';if(/avert|erreur|jugement|bordeaux/.test(x))return 'bordeaux';if(/étude|étudier|lavande/.test(x))return 'lavande';if(/bible|verset|bleu/.test(x))return 'bleu';return ['or','bordeaux','vert','bleu','lavande'][hash(x)%5]}
  function familyColor(f){return FAMILIES[f]?.color||FAMILIES.or.color}
  function familyPaper(f){const c=familyColor(f);return c+'16'}
  function noteId(){return document.querySelector('#noteList .note-link.on')?.dataset.note||''}
  function ensureNoteFilters(){
    const list=$('noteList'),filter=$('noteFilter');if(!list||!filter)return;
    let bar=$('v9NoteFamilies');
    if(!bar){bar=document.createElement('div');bar.id='v9NoteFamilies';filter.parentElement?.after(bar);}
    if(!bar.dataset.v9Built){
      bar.innerHTML='<button type="button" class="v9-family" data-family="all" style="--family-color:var(--v9-theme-accent,#c66f2d)">Toutes</button>'+Object.entries(FAMILIES).map(([id,f])=>'<button type="button" class="v9-family" data-family="'+id+'" style="--family-color:'+f.color+'">'+f.label+'</button>').join('');
      bar.querySelectorAll('button').forEach(b=>b.onclick=()=>{selectedNoteFamily=b.dataset.family;applyNoteCards()});
      bar.dataset.v9Built='1';
    }
  }
  function applyNoteCards(){
    const list=$('noteList');if(!list)return;ensureNoteFilters();
    list.querySelectorAll('.note-link[data-note]').forEach(b=>{
      const id=b.dataset.note;const txt=b.textContent||'';if(!noteFamilies[id]){noteFamilies[id]=familyForText(txt);saveFamilies()}
      const f=noteFamilies[id]||'or';b.dataset.family=f;b.style.setProperty('--note-color',familyColor(f));b.style.setProperty('--note-paper',familyPaper(f));b.style.setProperty('--note-ink','var(--v9-theme-ink,#4c2e23)');b.classList.toggle('v9-note-hidden',selectedNoteFamily!=='all'&&selectedNoteFamily!==f);b.setAttribute('aria-label','Note '+(FAMILIES[f]?.label||f));
    });
    const bar=$('v9NoteFamilies');bar?.querySelectorAll('button').forEach(b=>{b.classList.toggle('on',b.dataset.family===selectedNoteFamily);});
    const id=noteId(),current=noteFamilies[id]||'or';document.querySelectorAll('#v9NoteFamilyChoices button').forEach(b=>b.classList.toggle('on',b.dataset.family===current));
  }
  function ensureNoteFamilyControl(){
    const form=$('noteForm'),subject=$('noteSubject');if(!form||!subject)return;
    let row=$('v9NoteFamilyRow');
    if(!row){row=document.createElement('div');row.id='v9NoteFamilyRow';row.innerHTML='<strong>Famille de la note</strong><div id="v9NoteFamilyChoices"></div>';subject.closest('.study-row')?.after(row);}
    const choices=$('v9NoteFamilyChoices');
    if(choices&&!choices.children.length){choices.innerHTML=Object.entries(FAMILIES).map(([id,f])=>'<button type="button" data-family="'+id+'" style="--family-color:'+f.color+'">'+f.label+'</button>').join('');choices.querySelectorAll('button').forEach(b=>b.onclick=()=>{const id=noteId();if(!id)return;noteFamilies[id]=b.dataset.family;saveFamilies();applyNoteCards()});}
    const id=noteId();if(id&&!noteFamilies[id]){noteFamilies[id]=familyForText(($('noteTitle')?.value||'')+' '+($('noteSubject')?.value||''));saveFamilies()}
    applyNoteCards();
  }
  function styleNoteTools(){
    const tools=$('noteTools');if(!tools)return;
    const u=tools.querySelector('[data-command="underline"]');if(u)u.textContent='Souligner';
    const h=$('noteHighlight');if(h)h.textContent='Surligner';
  }
  function clearNewNoteForTest(){
    const ed=$('noteEditor'),title=$('noteTitle'),subject=$('noteSubject');if(!ed||!title)return;
    setTimeout(()=>{title.value='';if(subject)subject.value='';ed.innerHTML='';const id=noteId();if(id){noteFamilies[id]='or';saveFamilies()}styleNoteTools();applyNoteCards();ed.focus()},80);
  }
  function bindNewNote(){const b=$('newNote');if(!b||b.dataset.v9NotesBound)return;b.dataset.v9NotesBound='1';b.addEventListener('click',clearNewNoteForTest);}
  function ensureNoteView(){if(!$('noteList'))return;ensureNoteFilters();ensureNoteFamilyControl();styleNoteTools();bindNewNote();applyNoteCards()}

  function familyFromMarkArticle(a){
    const sp=a.querySelector('p span');const st=sp?.getAttribute('style')||'';const m=st.match(/(?:background|underline[^ ]*)\s*:\s*(#[0-9a-f]{6})/i);const c=(m?.[1]||'').toLowerCase();
    if(c==='#ffe066'||c==='#c99a24')return'or';if(c==='#9be07a'||c==='#2f7b50')return'vert';if(c==='#a8ceff'||c==='#4668a9')return'bleu';if(c==='#ff9a9a'||c==='#8b223f')return'bordeaux';if(c==='#7656a4')return'lavande';return familyForText(a.textContent||'');
  }
  function ensureMarkFilters(){
    const list=$('markList');if(!list)return;
    const native=list.previousElementSibling;if(native?.querySelector('#markType'))native.classList.add('v9-native-mark-filters');
    let bar=$('v9MarkFamilies');if(!bar){bar=document.createElement('div');bar.id='v9MarkFamilies';list.before(bar)}
    if(!bar.dataset.v9Built){
      bar.innerHTML='<button type="button" class="v9-mark-family" data-family="all" style="--family-color:var(--v9-theme-accent,#c66f2d)">Tout</button>'+Object.entries(FAMILIES).map(([id,f])=>'<button type="button" class="v9-mark-family" data-family="'+id+'" style="--family-color:'+f.color+'">'+f.label+'</button>').join('');
      bar.querySelectorAll('button').forEach(b=>b.onclick=()=>{selectedMarkFamily=b.dataset.family;applyMarkCards()});
      bar.dataset.v9Built='1';
    }
  }
  function applyMarkCards(){
    const list=$('markList');if(!list)return;ensureMarkFilters();
    list.querySelectorAll('article.study-card').forEach(a=>{
      const f=familyFromMarkArticle(a);a.dataset.markFamily=f;a.style.setProperty('--mark-color',familyColor(f));a.style.setProperty('--mark-paper',familyPaper(f));a.classList.toggle('v9-note-hidden',selectedMarkFamily!=='all'&&selectedMarkFamily!==f);
      if(!a.dataset.v9OpenBound){a.dataset.v9OpenBound='1';a.addEventListener('click',e=>{if(e.target.closest('button,a,input,select'))return;const b=a.querySelector('[data-mark-open]');if(b)b.click()})}
    });
    $('v9MarkFamilies')?.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.family===selectedMarkFamily));
  }
  function enhance(){ensureNoteView();applyMarkCards()}
  const sc=$('studyContent');if(sc){new MutationObserver(()=>setTimeout(enhance,45)).observe(sc,{childList:true,subtree:true});setInterval(enhance,450);}
  /* Les panneaux photo Branham/Jésus sont conservés : Branham = brochures,
     Jésus = Bible. Ce test ne change pas leur côté ni leur contenu. */
  window.V9CNotesTest={families:FAMILIES,enhance};
})();
