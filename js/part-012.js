
(function(){
 const r=document.documentElement,vv=window.visualViewport;
 function upd(){
  let h=0;if(vv)h=Math.max(0,window.innerHeight-vv.height-vv.offsetTop);
  r.style.setProperty('--m4kb',(h>80?h:0)+'px');
 }
 if(vv){vv.addEventListener('resize',upd);vv.addEventListener('scroll',upd);}
 window.addEventListener('resize',upd);upd();
 /* l'éditeur seul montre la barre (pas sur l'accueil des notes) */
 const nb=document.getElementById('nb'),ed=document.getElementById('nbEd'),t=document.getElementById('nbTools');
 function vis(){if(t&&ed)t.style.display=(ed.hidden||nb.classList.contains('nbfs'))?'none':'';}
 if(ed){new MutationObserver(vis).observe(ed,{attributes:true,attributeFilter:['hidden']});new MutationObserver(vis).observe(nb,{attributes:true,attributeFilter:['class']});vis();}
})();
