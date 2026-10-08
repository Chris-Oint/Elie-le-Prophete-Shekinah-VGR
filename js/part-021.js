
(function(){
  'use strict';
  var $=function(id){return document.getElementById(id)};

  /* ---- A. Éditeur : menus, annuler / rétablir, compteur ---- */
  function cnt(){var b=$('edBody'),c=$('edCount');if(b&&c)c.textContent=(b.innerText||'').replace(/\n$/,'').length}
  function closeMenus(){var m=$('edMeta'),x=$('edMoreMenu');if(m)m.hidden=true;if(x)x.hidden=true}
  function on(id,ev,fn){var el=$(id);if(el&&!el.dataset.v10){el.dataset.v10='1';el.addEventListener(ev,fn)}}
  function wire(){
    on('edUndo','click',function(){var b=$('edBody');if(b)b.focus();document.execCommand('undo');cnt()});
    on('edRedo','click',function(){var b=$('edBody');if(b)b.focus();document.execCommand('redo');cnt()});
    on('edMenuBtn','click',function(){var m=$('edMeta'),x=$('edMoreMenu');if(x)x.hidden=true;if(m)m.hidden=!m.hidden});
    on('edMore','click',function(){var m=$('edMeta'),x=$('edMoreMenu');if(m)m.hidden=true;if(x)x.hidden=!x.hidden});
    on('edPrint','click',closeMenus);
    on('edFsMenu','click',function(){closeMenus();var f=document.querySelector('#nbTools [data-a=fs]');if(f)f.click()});
    on('edBody','input',cnt);
  }
  wire();setInterval(wire,800);
  window.addEventListener('nb-editor-open',function(){closeMenus();setTimeout(cnt,0)});
  /* les boutons d'outils ne doivent jamais retirer le focus (le clavier reste ouvert) */
  ['pointerdown','mousedown'].forEach(function(ev){document.addEventListener(ev,function(e){var t=e.target;if(t&&t.closest&&t.closest('#edTop button,#edMoreMenu button,#nbTools button'))e.preventDefault()},true)});

  /* ---- B. Clavier du téléphone uniquement : règles d'ouverture / fermeture ---- */
  var EDIT='#edBody,#edTitle,#edRef,#workQ';
  var maxH=0,sawKb=false;
  function vh(){return window.visualViewport?window.visualViewport.height:window.innerHeight}
  function track(){var h=vh();if(h>maxH)maxH=h;if(h<maxH-120)sawKb=true}
  function kbOpen(){return vh()<maxH-120}
  track();
  if(window.visualViewport)window.visualViewport.addEventListener('resize',track);
  window.addEventListener('resize',track);
  window.addEventListener('orientationchange',function(){setTimeout(function(){maxH=vh();sawKb=false},500)});
  function isEdit(el){return !!(el&&el.matches&&el.matches('input:not([type=checkbox]):not([type=range]):not([type=color]):not([type=file]):not([type=radio]):not([type=button]),textarea,[contenteditable="true"]'))}
  /* toucher en dehors d'une zone d'écriture (et des outils) : le clavier se ferme */
  document.addEventListener('pointerdown',function(e){
    var a=document.activeElement;if(!isEdit(a))return;
    var t=e.target;if(!t||!t.closest)return;
    if(t.closest('input,textarea,select,label,[contenteditable="true"],#edTop,#edMoreMenu,#edMeta,#nbTools,#nbSet'))return;
    a.blur();
  },true);
  /* toucher la zone d'écriture : le clavier s'ouvre, ou se rouvre s'il avait disparu ; il reste ouvert ensuite */
  var lastRange=null;
  document.addEventListener('selectionchange',function(){var s=getSelection(),b=$('edBody');if(b&&s.rangeCount&&b.contains(s.anchorNode))lastRange=s.getRangeAt(0).cloneRange()});
  document.addEventListener('click',function(e){
    var el=e.target&&e.target.closest?e.target.closest(EDIT):null;if(!el)return;
    if(document.activeElement===el){
      if(sawKb&&!kbOpen()){el.blur();setTimeout(function(){el.focus();if(el.id==='edBody'&&lastRange){var s=getSelection();s.removeAllRanges();s.addRange(lastRange)}},40)}
    }else{el.focus()}
  },true);
  /* ouverture de la recherche : le clavier apparaît tout seul */
  function focusQ(){var q=$('workQ');if(!q)return;try{q.focus({preventScroll:true})}catch(x){q.focus()}setTimeout(function(){if(document.activeElement!==q)q.focus()},180)}
  function watchSearch(){
    var s=$('workSearch');if(!s){setTimeout(watchSearch,300);return}
    var was=s.hidden;
    new MutationObserver(function(){if(was&&!s.hidden)focusQ();was=s.hidden}).observe(s,{attributes:true,attributeFilter:['hidden']});
  }
  watchSearch();

  /* ---- C. Copier (menu du téléphone) : verset = livre chapitre:verset ; paragraphe = titre · date · traduction · § ---- */
  document.addEventListener('copy',function(e){
    try{
      var sel=getSelection();if(!sel||sel.isCollapsed||!sel.anchorNode||!sel.focusNode)return;
      function host(n){var el=n.nodeType===1?n:n.parentElement;return el&&el.closest?el.closest('.vt,.pt'):null}
      var a=host(sel.anchorNode),f=host(sel.focusNode)||a;if(!a)return;
      var ca=a.closest('.vcard,.pcard'),cf=f.closest('.vcard,.pcard')||ca;if(!ca)return;
      if(typeof D==='undefined'||!D||typeof S==='undefined')return;
      var ia=+ca.id.slice(2),ib=+cf.id.slice(2),lo=Math.min(ia,ib),hi=Math.max(ia,ib),span=lo===hi?String(lo):lo+'–'+hi,ref;
      if(a.classList.contains('vt')){ref=D.books[S.book][0]+' '+S.chap+':'+span}
      else{var m=D.meta[S.doc];if(!m)return;ref=m[1]+' · '+(m[2]==='VGR'?'VGR':'Shekinah')+' · '+('19'+String(m[0]).slice(0,2))+' · §'+span}
      var txt=sel.toString().replace(/\s+$/,'');if(!txt)return;
      e.clipboardData.setData('text/plain',txt+'\n— '+ref);e.preventDefault();
    }catch(x){}
  },true);
})();
