
(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const search=$('workSearch');if(!search)return;
  function bookSvg(){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 5.5v15M8 7h8M8 11h8M8 15h5"/></svg>'}
  function bibleSvg(){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h11a3 3 0 0 1 3 3v14H8a3 3 0 0 1-3-3z"/><path d="M5 18V4M8 9h7M11.5 6v6M8.5 9h6"/></svg>'}
  function mountSelectionRow(){
    const corp=$('workCorpora');if(!corp)return;
    let row=$('v9SearchSelectRow');
    if(!row){
      row=document.createElement('div');row.id='v9SearchSelectRow';
      row.innerHTML='<button type="button" id="v9SelectBook" title="Sélectionner un livre biblique" aria-label="Sélectionner un livre">'+bibleSvg()+'<span>Livre</span></button><button type="button" id="v9SelectBrochure" title="Sélectionner une brochure" aria-label="Sélectionner une brochure">'+bookSvg()+'<span>Broch.</span></button>';
      corp.after(row);
      $('v9SelectBook').onclick=()=>{$('globalBookBtn')?.click();refreshSelectionRow()};
      $('v9SelectBrochure').onclick=()=>{
        if(typeof openPanel==='function')openPanel('msg');
        else if($('hdrPhoto'))$('hdrPhoto').click();
        else $('btnDrawer')?.click();
      };
    }
    refreshSelectionRow();
  }
  function refreshSelectionRow(){
    const row=$('v9SearchSelectRow');if(!row)return;
    const sel=$('globalBook'),book=$('v9SelectBook');
    if(sel&&book){const v=+sel.value;const label=v>=0?sel.options[sel.selectedIndex]?.text||'Livre':'Livre';const short=v>=0?(label.length>9?label.slice(0,9)+'…':label):'Livre';book.querySelector('span').textContent=v>=0?short:'Livre';book.classList.toggle('on',v>=0);book.title=v>=0?'Livre sélectionné : '+label:'Sélectionner un livre biblique';}
  }
  function compactLabels(){
    const corp=$('workCorpora');if(corp){const labels={'AT':'AT','NT':'NT','SHP':'Shekinah','VGR':'VGR'};corp.querySelectorAll('[data-source]').forEach(b=>{const k=b.dataset.source;if(labels[k]){b.title=k==='AT'?'Ancien Testament':k==='NT'?'Nouveau Testament':k==='SHP'?'Shekinah':'Version VGR';b.textContent=labels[k]}})}
    const rows=document.querySelectorAll('#modeFilters .global-strip');
    if(rows[0]){const lab=rows[0].querySelector('.filter-label');if(lab)lab.textContent='Phrase';const bs=rows[0].querySelectorAll('[data-mode]');if(bs[0])bs[0].childNodes[0].textContent='Exact ';if(bs[1])bs[1].childNodes[0].textContent='Var. ph. ';}
    if(rows[1]){const lab=rows[1].querySelector('.filter-label');if(lab)lab.textContent='Mot';const bs=rows[1].querySelectorAll('[data-mode]');if(bs[0])bs[0].childNodes[0].textContent='Exact ';if(bs[1])bs[1].childNodes[0].textContent='Var. mot. ';}
  }
  function paintSortLabels(){
    const r=$('sortRelevance'),d=$('sortDate');if(!r||!d)return;
    const s=typeof sort==='string'?sort:'relevance',a=typeof ascending==='boolean'?ascending:false;
    r.textContent='Pertin. '+(s==='relevance'?(a?'↑':'↓'):'↕');
    d.textContent='Année '+(s==='date'?(a?'↑':'↓'):'↕');
    r.classList.toggle('on',s==='relevance');d.classList.toggle('on',s==='date');
    r.setAttribute('aria-label','Trier par pertinence '+(s==='relevance'?(a?'croissante':'décroissante'):'non sélectionné'));
    d.setAttribute('aria-label','Trier par année '+(s==='date'?(a?'croissante':'décroissante'):'non sélectionnée'));
  }
  function bindSort(){
    const r=$('sortRelevance'),d=$('sortDate');if(r&&!r.dataset.v9SearchBound){r.dataset.v9SearchBound='1';r.onclick=()=>{if(typeof sortChanged==='function')sortChanged('relevance');setTimeout(paintSortLabels,0)}}
    if(d&&!d.dataset.v9SearchBound){d.dataset.v9SearchBound='1';d.onclick=()=>{if(typeof sortChanged==='function')sortChanged('date');setTimeout(paintSortLabels,0)}}
  }
  function enhance(){mountSelectionRow();compactLabels();bindSort();refreshSelectionRow();paintSortLabels();try{observer.takeRecords()}catch(e){}}
  const observer=new MutationObserver(()=>setTimeout(enhance,20));observer.observe(search,{childList:true,subtree:true});
  setInterval(enhance,450);enhance();
  window.V9CSearchTest={enhance,paintSortLabels};
})();
