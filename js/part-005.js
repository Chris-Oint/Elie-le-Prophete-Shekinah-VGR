
(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  let writingBubble=null,dragging=false,dragMoved=false;
  function hideWritingBubble(){if(writingBubble){writingBubble.remove();writingBubble=null}dragging=false;dragMoved=false}
  function makeWritingBubbleOnly(){
    if(writingBubble&&writingBubble.isConnected)return writingBubble;
    document.querySelectorAll('#v9WritingBubble').forEach(e=>e.remove());
    const host=$('noteForm')||document.body;writingBubble=document.createElement('button');writingBubble.id='v9WritingBubble';writingBubble.type='button';writingBubble.innerHTML='<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 9.5c7-2 12.5-.8 18 3.4v27c-5.5-4.2-11-5.4-18-3.4zM42 9.5c-7-2-12.5-.8-18 3.4v27c5.5-4.2 11-5.4-18-3.4z"/><path d="M24 12.9v27M10 15.5c4.4-.7 8.6.2 12 2.7M38 15.5c-4.4-.7-8.6.2-12 2.7"/></svg>';writingBubble.setAttribute('aria-label','Enregistrer la note');writingBubble.title='Cliquer une fois ou deux fois pour enregistrer';host.append(writingBubble);try{const p=JSON.parse(localStorage.getItem('wmb-v9-writing-bubble-position')||'null');if(p&&Number.isFinite(p.x)&&Number.isFinite(p.y)){writingBubble.style.left=p.x+'%';writingBubble.style.top=p.y+'%'}}catch(e){}
    let drag=null;suppress=false;
    writingBubble.addEventListener('pointerdown',e=>{drag={id:e.pointerId,x:e.clientX,y:e.clientY};dragMoved=false;writingBubble.setPointerCapture?.(e.pointerId)});
    writingBubble.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>7)dragMoved=true;if(dragMoved){e.preventDefault();writingBubble.classList.add('is-dragging');writingBubble.style.left=Math.max(8,Math.min(92,e.clientX/innerWidth*100))+'%';writingBubble.style.top=Math.max(12,Math.min(86,e.clientY/innerHeight*100))+'%'}},{passive:false});
    const end=e=>{if(!drag||drag.id!==e.pointerId)return;const moved=dragMoved;drag=null;writingBubble.classList.remove('is-dragging');if(moved){suppress=true;setTimeout(()=>suppress=false,260);try{localStorage.setItem('wmb-v9-writing-bubble-position',JSON.stringify({x:parseFloat(writingBubble.style.left),y:parseFloat(writingBubble.style.top)}))}catch(err){}}};
    writingBubble.addEventListener('pointerup',end);writingBubble.addEventListener('pointercancel',end);
    writingBubble.addEventListener('click',e=>{if(suppress)return;e.preventDefault();if($('studyClose'))$('studyClose').click()});
    return writingBubble;
  }
  let suppress=false;
  function ensureOnlyDuringNote(){const form=$('noteForm'),study=$('studyPanel');if(study?.hidden||!form||form.hidden||!form.classList.contains('v9-fullscreen-note')){hideWritingBubble();return}const b=makeWritingBubbleOnly();if(b.parentElement!==form)form.append(b)}
  function printReader(){const r=$('v9NoteReader');if(!r)return;let sheet=$('wmbPrintSheet');if(!sheet){sheet=document.createElement('section');sheet.id='wmbPrintSheet';document.body.append(sheet)}sheet.innerHTML='<h1>'+escapeHtml(r.querySelector('.v9-reader-head strong')?.textContent||'Note')+'</h1><p>'+escapeHtml(r.querySelector('.v9-reader-meta')?.textContent||'')+'</p>'+r.querySelector('.v9-reader-body')?.innerHTML;window.print()}
  function escapeHtml(s){const d=document.createElement('div');d.textContent=s||'';return d.innerHTML}
  function patchReader(){const r=$('v9NoteReader');if(!r)return;const p=r.querySelector('[data-reader-action="print"]');if(p&&!p.dataset.v9PrintPatched){p.dataset.v9PrintPatched='1';p.onclick=()=>{r.querySelector('#v9ReaderActions')?.classList.remove('on');printReader()}}}
  function keyReference(key){if(!key)return'';const a=String(key).split(':');if(a[0]==='b'){const b=+a[1],c=+a[2],v=+a[3],data=typeof D!=='undefined'?D:null;return data?.books?.[b]?data.books[b][0]+' '+c+':'+v:'Bible '+c+':'+v}if(a[0]==='m'){const d=+a[1],p=+a[2],data=typeof D!=='undefined'?D:null,m=data?.meta?.[d];if(m)return m[1]+' · '+(m[2]==='VGR'?'VGR':'Shekinah')+' · '+('19'+String(m[0]).slice(0,2))+' · §'+p;return 'Brochure · §'+p}return''}
  function selectedPayload(){const units=window.WMBMarks?.getSelection?.()||[];if(units.length)return units.map(u=>{const text=String(u.text||'').slice(u.start,u.end);return text+'\n— '+keyReference(u.key)}).join('\n\n');const s=window.GarageFeatures?.getSelectionState?.();if(s){return String(s.text||'').slice(s.start,s.end)+'\n— '+keyReference(s.key)}return''}
  async function copyMetadata(feedback){const text=selectedPayload();if(!text){if(feedback)feedback.textContent='Sélection vide.';return}try{if(!await window.M4CopyText(text))throw Error();if(feedback)feedback.textContent='Texte et référence copiés.'}catch(e){if(feedback)feedback.textContent='Copie refusée par le navigateur.'}}
  function patchCopy(){const a=$('annoCopy');if(a&&!a.dataset.v9MetaCopy){a.dataset.v9MetaCopy='1';a.onclick=()=>copyMetadata($('annoFeedback'))}const b=$('wmbCopy');if(b&&!b.dataset.v9MetaCopy){b.dataset.v9MetaCopy='1';b.onclick=()=>copyMetadata($('wmbMarkInfo'))}}
  function enhance(){ensureOnlyDuringNote();patchReader();patchCopy()}
  const observer=new MutationObserver(enhance);observer.observe(document.body,{childList:true,subtree:true});setInterval(enhance,500);enhance();
  window.addEventListener('beforeprint',()=>{$('wmbPrintSheet')?.classList.add('v9-printing-note')});
})();
