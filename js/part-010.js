
(function(){
 const sp=document.getElementById('studyPanel');if(!sp)return;
 const b=document.createElement('button');b.id='m4Back';b.type='button';b.textContent='← Retour';
 b.addEventListener('click',async function(){
  const c=document.getElementById('studyClose');
  try{if(c&&c.onclick)await c.onclick();}catch(e){}
  sp.hidden=true;
 });
 sp.insertBefore(b,sp.firstChild);
 /* le retour reste possible partout, même dans l'historique */
 window.addEventListener('popstate',function(){setTimeout(function(){
  if(!sp.hidden&&document.querySelector('[data-study="history"].on')&&!(history.state&&history.state.mobileNav)){sp.hidden=true;}
 },60);},true);
})();
