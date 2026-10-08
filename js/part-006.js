
(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  function ensureSaveButton(){
    const form=$('noteForm');if(!form||!form.classList.contains('v9-fullscreen-note'))return;
    const head=form.querySelector('.v9-full-note-header');if(!head||head.querySelector('.v9-note-save'))return;
    const b=document.createElement('button');b.type='button';b.className='v9-note-save';
    b.textContent='Enregistrer';b.title='Enregistrer la note';
    b.onclick=()=>{try{if(window.GarageStudy?.flush)window.GarageStudy.flush()}catch(e){}
      const c=$('studyClose');if(c){c.click()}else{form.hidden=true;form.classList.remove('v9-fullscreen-note');document.body.classList.remove('v9-note-modal-open')}};
    const reader=head.querySelector('.v9-full-note-reader');
    if(reader)head.insertBefore(b,reader);else head.append(b);
  }
  new MutationObserver(()=>setTimeout(ensureSaveButton,40)).observe(document.body,{childList:true,subtree:true});
  setInterval(ensureSaveButton,600);ensureSaveButton();
})();
