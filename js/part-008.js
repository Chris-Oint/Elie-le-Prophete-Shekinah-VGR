
(function(){
const $=id=>document.getElementById(id);
/* ---------- A. Photos : plus d'animation ; Branham → brochures, Jésus → Bible ---------- */
window.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('#hdrPhoto,#btnDrawer');if(!t)return;
 e.stopImmediatePropagation();e.preventDefault();
 const h=t.onclick;if(typeof h==='function')h.call(t,new Event('click'));},true);
/* contenu des panneaux : rien d'autre que livres / brochures + recherche */
function cleanPanel(){const b=$('dBody');if(!b)return;const kids=[...b.children];let hide=false;
 kids.forEach(k=>{if(k.classList.contains('v9-logo')){k.classList.add('nb-hide');hide=false;return;}
  if(k.classList.contains('dsec')){const t=k.textContent.trim();hide=(t==='En lecture'||t==='Bibles');}
  else if(k.classList.contains('v9-year'))hide=false;
  k.classList.toggle('nb-hide',hide&&!k.classList.contains('v9-year')&&!k.classList.contains('v9-grid'));});
 const dh=document.querySelector('#drawer .dh b');if(dh){const s=$('drawer').classList.contains('v9-msg')?'Brochures':'Bible';if(dh.textContent!==s)dh.textContent=s;}}
new MutationObserver(cleanPanel).observe($('dBody'),{childList:true});
/* ---------- B. Mémoire de lecture ---------- */
const LK='m4-last';let last={};try{last=JSON.parse(localStorage.getItem(LK)||'{}')}catch(e){}
if(last.doc!=null)window.lastDoc=last.doc;
let ready=false;
setInterval(()=>{if(!ready||typeof S==='undefined')return;let vv=last.v;if(S.mode==='bible'){const hb=document.querySelector('header')?.getBoundingClientRect().bottom||0;for(const c of document.querySelectorAll('#bibleView .vcard')){if(c.getBoundingClientRect().bottom>hb+30){vv=+c.id.slice(2);break}}}
 const n={mode:S.mode,book:S.book,chap:S.chap,v:vv,doc:S.doc!=null?S.doc:last.doc,p:S.doc!=null?S.curP:last.p};
 if(JSON.stringify(n)!==JSON.stringify({mode:last.mode,book:last.book,chap:last.chap,v:last.v,doc:last.doc,p:last.p})){last=n;if(n.doc!=null)window.lastDoc=n.doc;try{localStorage.setItem(LK,JSON.stringify(n))}catch(e){}}},1000);
const boot=setInterval(async()=>{if(typeof D==='undefined'||!D||typeof S==='undefined'||!$('bibleView').children.length||$('loading').style.display!=='none')return;
 clearInterval(boot);try{
  if(last.book!=null&&D.books[last.book])goBible(last.book,last.chap||1,last.v||null);
  if(last.mode==='msg'&&last.doc!=null)await openBrochure(last.doc,last.p||1,null);}catch(e){}
 ready=true;},400);
/* passer en mode brochures = rouvrir la brochure en cours, pas la liste */
const sm0=window.setMode;let guard=false;
window.setMode=function(m){const r=sm0.apply(this,arguments);
 if(m==='msg'&&S.doc==null&&window.lastDoc!=null&&!guard){guard=true;Promise.resolve(openBrochure(window.lastDoc,(last.p||1),null)).finally(()=>guard=false);}return r;};
/* ---------- C. Notes (logique des captures) ---------- */
const KEY='nb1',COL=['#8b1e3f','#2f6f8f','#b8862b','#3f7d4a','#7656a4'];
let st;try{st=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
if(!st||!st.fams)st={fams:[{id:'f1',name:'Général'}],notes:[],cur:'f1',set:{bg:'#ffffff',lt:'none',dotted:false,margin:15,space:1.7,img:100,font:'system-ui'}};
st.set=Object.assign({bg:'#ffffff',lt:'none',dotted:false,margin:15,space:1.7,img:100,font:'system-ui'},st.set||{});if(st.set.lines&&st.set.lt==='none')st.set.lt='h';
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const plain=h=>{const d=document.createElement('div');d.innerHTML=h;return d.textContent.trim()};
const nb=document.createElement('section');nb.id='nb';nb.hidden=true;
nb.innerHTML=`<div id="nbHome"><div class="nbbar"><button id="nbBack">←</button><b style="flex:1;text-align:center">Mon espace d’étude</b></div>
<div id="nbSel" hidden><span id="nbCnt"></span><button id="nbPr" class="pri">Imprimer</button><button id="nbDel">Supprimer</button><button id="nbMov">Famille</button><button id="nbCancel">✕</button></div>
<div id="nbTabs"></div><p class="nbhint">← balayer pour changer de famille →</p><div id="nbGrid"></div></div>
<div id="nbEd" hidden>
<div id="edTop"><button type="button" id="edBack" aria-label="Enregistrer et fermer">✓</button><button type="button" id="edMenuBtn" aria-label="Référence et famille">☰</button><span class="sp"></span><button type="button" id="edUndo" aria-label="Annuler">↶</button><button type="button" id="edRedo" aria-label="Rétablir">↷</button><button type="button" id="edSave" aria-label="Enregistrer">💾</button><button type="button" id="edMore" aria-label="Plus d'actions">⋮</button></div>
<div id="edMoreMenu" hidden><button type="button" id="edPrint">Imprimer</button><button type="button" id="edFsMenu">Lecture plein écran</button></div>
<input id="edTitle" placeholder="Titre" autocomplete="off">
<div id="edMeta" hidden><label>Référence</label><input id="edRef" placeholder="Ex. Apocalypse 5:1" autocomplete="off"><label>Famille</label><select id="edFam"></select></div>
<div id="edArea"><span id="edCount">0</span><div id="edWrap"><div id="edBody" contenteditable="true"></div></div></div>
<div id="nbTools"><div class="tpg"><button type="button" data-a="fs" title="Lecture plein écran">⛶</button><button type="button" data-a="set" title="Paramètres de la page">⚙</button><label class="tb" title="Couleur du texte"><span class="tA">A</span><i class="bar" id="tcolBar" style="background:#8b1e3f"></i><input type="color" id="tcol" value="#8b1e3f"></label><label class="tb" title="Surligner"><span class="tH">🖍</span><i class="bar" id="thiBar" style="background:#ffe066"></i><input type="color" id="thi" value="#ffe066"></label><label class="tb tsz" title="Taille"><small>Tt</small><select id="tsz"><option>14</option><option selected>16</option><option>18</option><option>20</option><option>24</option><option>32</option></select></label><button type="button" class="bB" data-c="bold" title="Gras"><b>B</b></button><button type="button" class="bI" data-c="italic" title="Italique"><i>I</i></button><button type="button" class="bU" data-c="underline" title="Souligné"><u>U</u></button><button type="button" class="bS" data-c="strikeThrough" title="Barré"><s>S</s></button></div><div class="tpg"><button type="button" data-c="insertOrderedList" title="Liste numérotée"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 6h11M10 12h11M10 18h11"/><g fill="currentColor" stroke="none" font-size="7.5" font-family="system-ui" font-weight="700"><text x="1" y="8.5">1</text><text x="1" y="14.5">2</text><text x="1" y="20.5">3</text></g></svg></button><button type="button" data-c="insertUnorderedList" title="Liste à puces"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 6h11M10 12h11M10 18h11"/><circle cx="4" cy="6" r="1.4" fill="currentColor"/><circle cx="4" cy="12" r="1.4" fill="currentColor"/><circle cx="4" cy="18" r="1.4" fill="currentColor"/></svg></button><button type="button" data-ins="☐ " title="Case à cocher"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="m8 12.5 3 3 5-6"/></svg></button><button type="button" data-ins="★ " title="Étoile"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg></button><button type="button" data-c="justifyLeft" title="Aligner à gauche"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h18M3 10h11M3 15h18M3 20h11"/></svg></button><button type="button" data-c="justifyCenter" title="Centrer"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h18M7 10h10M3 15h18M7 20h10"/></svg></button><button type="button" data-c="justifyRight" title="Aligner à droite"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h18M10 10h11M3 15h18M10 20h11"/></svg></button><button type="button" data-c="indent" title="Retrait"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4v16M10 6h11M10 12h11M10 18h11"/></svg></button><label class="tb" title="Image"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="9" cy="10" r="1.6" fill="currentColor"/><path d="m4 18 5-5 4 4 3-3 4 4"/></svg><input type="file" id="timg" accept="image/*" hidden></label></div></div>
<div id="nbSet" hidden></div>
<button id="edExit" hidden class="pri">✕</button>
</div>
<div id="nbFab"><div id="nbMenu" hidden><button data-m="add">Ajouter une note</button><button data-m="fam">Nouvelle famille</button><button data-m="select">Sélectionner</button><button data-m="print">Imprimer</button><button data-m="del">Supprimer</button></div><button id="nbPlus">+</button></div>`;
document.body.append(nb);
const pr=document.createElement('div');pr.id='nbPrint';document.body.append(pr);
const q=s=>nb.querySelector(s);let sel=new Set(),selOn=false,editing=null,range=null;
const fam=()=>st.fams.find(f=>f.id===st.cur)||st.fams[0];
function home(){var _s=$('nbSet'),_d=$('nbSetDim');if(_s)_s.hidden=true;if(_d)_d.hidden=true;$('nbHome').hidden=false;$('nbEd').hidden=true;nb.classList.remove('nbfs');$('nbFab').hidden=false;render();}
function render(){const f=fam();st.cur=f.id;
 const fi=st.fams.findIndex(x=>x.id===f.id),N=st.fams.length;
 let slots=N<=3?st.fams.map(x=>[x,x.id===f.id?'c':'s']):[[st.fams[(fi-1+N)%N],'s'],[f,'c'],[st.fams[(fi+1)%N],'s']];
 $('nbTabs').innerHTML='<div class="nbband n'+slots.length+'">'+slots.map(([x,r])=>`<button data-f="${x.id}" class="seg ${r}">${esc(x.name)}</button>`).join('')+'</div>';
 $('nbTabs').querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{st.cur=b.dataset.f;save();render();});
 if(!$('nbTabs')._sw){$('nbTabs')._sw=1;let sx=null,moved=false;const T=$('nbTabs');
  T.addEventListener('pointerdown',e=>{sx=e.clientX;moved=false;});
  T.addEventListener('pointermove',e=>{if(sx!==null&&Math.abs(e.clientX-sx)>12)moved=true;});
  T.addEventListener('pointerup',e=>{if(sx===null)return;const dx=e.clientX-sx;sx=null;const n=st.fams.length;if(n<2||Math.abs(dx)<40)return;const i=st.fams.findIndex(x=>x.id===st.cur);st.cur=st.fams[(i+(dx<0?1:n-1))%n].id;save();render();});
  T.addEventListener('click',e=>{if(moved){e.stopPropagation();e.preventDefault();moved=false;}},true);}
 const L=st.notes.filter(n=>n.fam===f.id);
 $('nbGrid').innerHTML=L.map(n=>`<div class="nbcardv ${sel.has(n.id)?'sel':''}" data-id="${n.id}" style="--c:${n.c}"><i class="pin"></i><span class="ck">${sel.has(n.id)?'✓':''}</span><b>${esc(n.title||'Sans titre')}</b><div class="bl">${esc(plain(n.html)||'…')}</div>${n.ref?`<div class="rf">${esc(n.ref)}</div>`:''}</div>`).join('')||'<p class="nbhint">Aucune note dans cette famille.</p>';
 $('nbGrid').querySelectorAll('.nbcardv').forEach(c=>c.onclick=()=>{const id=c.dataset.id;if(selOn){sel.has(id)?sel.delete(id):sel.add(id);render();}else openEd(id);});
 nb.classList.toggle('selecting',selOn);$('nbSel').hidden=!selOn;$('nbCnt').textContent=sel.size+' sélectionnée'+(sel.size>1?'s':'');}
function setSel(on){selOn=on;if(!on)sel.clear();render();}
$('nbCancel').onclick=()=>setSel(false);
function printList(list){if(!list.length)return;pr.innerHTML=list.map(n=>`<article><h1>${esc(n.title)}</h1><p><i>${esc(n.ref||'')}</i></p>${n.html}</article>`).join('');window.print();}
$('nbPr').onclick=()=>printList(st.notes.filter(n=>sel.has(n.id)));
$('nbDel').onclick=()=>{if(sel.size&&confirm('Supprimer '+sel.size+' note(s) ?')){st.notes=st.notes.filter(n=>!sel.has(n.id));save();setSel(false);}};
$('nbMov').onclick=()=>{if(!sel.size)return;const nm=prompt('Déplacer vers quelle famille ?\n'+st.fams.map(f=>'• '+f.name).join('\n'));const f=st.fams.find(x=>x.name.toLowerCase()===(nm||'').trim().toLowerCase());if(f){st.notes.forEach(n=>{if(sel.has(n.id))n.fam=f.id});save();setSel(false);}};
/* bulle + déplaçable */
const fab=$('nbFab'),plus=$('nbPlus');let drag=null;
plus.addEventListener('pointerdown',e=>{const r=fab.getBoundingClientRect();drag={x:e.clientX,y:e.clientY,l:r.left,t:r.top,m:false};plus.setPointerCapture(e.pointerId);});
plus.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>8)drag.m=true;if(drag.m){fab.style.left=Math.max(0,Math.min(innerWidth-70,drag.l+dx))+'px';fab.style.top=Math.max(0,Math.min(innerHeight-70,drag.t+dy))+'px';fab.style.right='auto';fab.style.bottom='auto';fab.style.alignItems='flex-start';}});
plus.addEventListener('pointerup',()=>{if(drag&&!drag.m){const o=$('nbMenu').hidden;$('nbMenu').hidden=!o;plus.textContent=o?'✕':'+';}drag=null;});
function closeMenu(){$('nbMenu').hidden=true;plus.textContent='+';}
$('nbMenu').querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{const m=b.dataset.m;closeMenu();
 if(m==='add')openEd(null);
 else if(m==='fam'){const n=(prompt('Nom de la nouvelle famille :')||'').trim();if(n){const f={id:uid(),name:n};st.fams.push(f);st.cur=f.id;save();render();}}
 else setSel(true);});
/* éditeur */
const DEF={bg:'#ffffff',lt:'none',dotted:false,margin:15,space:1.7,img:100,font:'system-ui'};
const BGS=['#ffffff','#000000','#d93025','#ffeb3b','#bdbdbd','#c8e6c9','#9ccc3c','#228b22','#00e5ff','#b2dfdb','#f3dede','#fffdf7','#efe3cf','#dfe8f5'];
const LTS=[['none','Vide'],['h','Ligne horizontale'],['v','Ligne verticale'],['grid','Grille'],['dot','Point']];
const FONTS=[['system-ui','Par défaut du système'],['Georgia','Georgia'],['Times New Roman','Times'],['serif','Serif'],['Courier New','Courier'],['monospace','Monospace'],['serif-monospace','Machine à écrire'],['cursive','Manuscrite'],['casual','Décontractée'],['sans-serif-condensed','Condensée'],['sans-serif-light','Fine'],['sans-serif-black','Épaisse'],['sans-serif-smallcaps','Petites capitales'],['fantasy','Fantaisie']];
function tile(lt,dot,h){if(lt==='none')return null;const d=dot?' stroke-dasharray="3 3"':'',st0=' stroke="rgb(0,0,0)" stroke-opacity=".3" fill="none"';let w,hh,body;
 if(lt==='h'){w=6;hh=h;body='<path d="M0 '+(h-.5)+'H6"'+st0+d+'/>';}
 else if(lt==='v'){w=h;hh=6;body='<path d="M'+(h-.5)+' 0V6"'+st0+d+'/>';}
 else if(lt==='grid'){w=h;hh=h;body='<path d="M0 '+(h-.5)+'H'+h+'M'+(h-.5)+' 0V'+h+'"'+st0+d+'/>';}
 else{w=h;hh=h;body='<circle cx="'+h/2+'" cy="'+h/2+'" r="1.3" fill="rgb(0,0,0)" fill-opacity=".4"/>';}
 const s='<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+hh+'">'+body+'</svg>';
 return {img:'url("data:image/svg+xml,'+encodeURIComponent(s)+'")',size:w+'px '+hh+'px'};}
function applySet(){const s=st.set,e=$('nbEd'),h=Math.round(16*s.space*10)/10;
 e.style.setProperty('--nbbg',s.bg);e.style.setProperty('--nbm',s.margin+'px');e.style.setProperty('--nbs',s.space);e.style.setProperty('--nbi',s.img+'%');e.style.setProperty('--nbf',s.font);
 const tl=tile(s.lt,s.dotted,h);e.style.setProperty('--nbl',tl?tl.img:'none');e.style.setProperty('--nbls',tl?tl.size:'auto');
 const m=/^#([0-9a-f]{6})$/i.exec(s.bg);let dark=false;if(m){const n=parseInt(m[1],16);dark=(0.299*(n>>16)+0.587*((n>>8)&255)+0.114*(n&255))<110;}
 e.style.setProperty('--nbink',dark?'#f2f2f2':'#222');}
function stepper(k,label,min,max,val,disp){return '<div class="sc"><div class="sct">'+label+' : <b id="sv-'+k+'">'+disp+'</b></div><div class="scr"><button type="button" data-adj="'+k+'" data-d="-1">−</button><input type="range" data-k="'+k+'" min="'+min+'" max="'+max+'" step="1" value="'+val+'"><button type="button" data-adj="'+k+'" data-d="1">+</button></div></div>';}
function renderSet(){const s=st.set,h=14;
 let o='<div class="sh"><button type="button" class="sx" data-s="close" aria-label="Fermer">⌄</button><b>Paramètres de la page</b><button type="button" class="sr" data-s="reset">Réinitialiser</button></div>';
 o+='<div class="sl">Arrière-plan</div><div class="sbg"><label class="sw cust" title="Couleur personnalisée">🎨<input type="color" id="sBgC" value="'+(/^#[0-9a-f]{6}$/i.test(s.bg)?s.bg:'#ffffff')+'"></label>'+BGS.map(c=>'<button type="button" class="sw'+(s.bg===c?' on':'')+'" data-bg="'+c+'" style="background:'+c+'" aria-label="'+c+'"></button>').join('')+'</div>';
 o+='<div class="srow"><span class="sl">Ligne</span><label class="sdot"><input type="checkbox" id="sDot"'+(s.dotted?' checked':'')+'><span>Ligne en pointillés</span></label></div>';
 o+='<div class="slt">'+LTS.map(([k,l])=>{const tl=tile(k,s.dotted,h);return '<div><button type="button" class="lt'+(s.lt===k?' on':'')+'" data-lt="'+k+'" style="'+(tl?'background-image:'+tl.img+';background-size:'+tl.size:'')+'"></button><small>'+l+'</small></div>';}).join('')+'</div>';
 o+='<div class="s2">'+stepper('margin','Marge de page',0,40,s.margin,s.margin)+stepper('space','Espacement des lignes',12,26,Math.round(s.space*10),s.space.toFixed(1))+'</div>';
 o+=stepper('img','Taille de l’image',30,100,s.img,s.img+'%');
 o+='<div class="sl">Police de caractères</div><div class="sf">'+FONTS.map(([f,l])=>'<div><button type="button" class="ft'+(s.font===f?' on':'')+'" data-font="'+f+'" style="font-family:'+f+'">Note</button><small>'+l+'</small></div>').join('')+'</div>';
 $('nbSet').innerHTML=o;}
function ensureDim(){if($('nbSetDim'))return;const d=document.createElement('div');d.id='nbSetDim';d.hidden=true;$('nbSet').before(d);d.onclick=closeSet;}
function closeSet(){$('nbSet').hidden=true;const d=$('nbSetDim');if(d)d.hidden=true;}
function openSet(){const a=document.activeElement;if(a&&a.blur)a.blur();ensureDim();renderSet();$('nbSet').hidden=false;$('nbSetDim').hidden=false;kb();}
$('nbSet').addEventListener('click',function(e){const t=e.target.closest('[data-s],[data-bg],[data-lt],[data-font],[data-adj]');if(!t)return;
 if(t.dataset.s==='close'){closeSet();return;}
 if(t.dataset.s==='reset'){st.set=Object.assign({},DEF);save();applySet();renderSet();return;}
 if(t.dataset.bg)st.set.bg=t.dataset.bg;
 else if(t.dataset.lt)st.set.lt=t.dataset.lt;
 else if(t.dataset.font!==undefined)st.set.font=t.dataset.font;
 else if(t.dataset.adj){const inp=$('nbSet').querySelector('input[data-k="'+t.dataset.adj+'"]');inp.value=+inp.value+(+t.dataset.d);inp.dispatchEvent(new Event('input',{bubbles:true}));return;}
 save();applySet();renderSet();});
$('nbSet').addEventListener('input',function(e){const t=e.target;
 if(t.id==='sBgC'){st.set.bg=t.value;save();applySet();return;}
 if(t.id==='sDot'){st.set.dotted=t.checked;save();applySet();renderSet();return;}
 if(t.dataset&&t.dataset.k){const k=t.dataset.k,v=+t.value;if(k==='space')st.set.space=v/10;else st.set[k]=v;save();applySet();const lab=$('sv-'+k);if(lab)lab.textContent=k==='space'?(v/10).toFixed(1):k==='img'?v+'%':v;}});
function openEd(id){editing=id?st.notes.find(n=>n.id===id):null;$('nbHome').hidden=true;$('nbEd').hidden=false;$('nbFab').hidden=true;closeMenu();
 $('edTitle').value=editing?editing.title:'';$('edRef').value=editing?editing.ref:'';$('edBody').innerHTML=editing?editing.html:'';
 $('edFam').innerHTML=st.fams.map(f=>`<option value="${f.id}">${esc(f.name)}</option>`).join('');$('edFam').value=editing?editing.fam:fam().id;applySet();kb();burst();window.dispatchEvent(new Event('nb-editor-open'));}
function saveEd(){const t=$('edTitle').value.trim(),r=$('edRef').value.trim(),h=$('edBody').innerHTML;if(!editing){if(!t&&!r&&!plain(h)&&!/<img/.test(h))return;editing={id:uid(),c:COL[st.notes.length%COL.length]};st.notes.push(editing);}
 Object.assign(editing,{title:t,ref:r,html:h,fam:$('edFam').value});st.cur=editing.fam;save();}
$('edSave').onclick=()=>{saveEd();const b=$('edSave');b.classList.add('ok');setTimeout(()=>b.classList.remove('ok'),800);};
$('edBack').onclick=()=>{saveEd();home();};
$('edPrint').onclick=()=>{saveEd();if(editing)printList([editing]);};
$('edExit').onclick=()=>{nb.classList.remove('nbfs');$('edExit').hidden=true;$('edBody').contentEditable='true';};
/* barre d'outils au-dessus du clavier */
function kb(){const e=$('nbEd');if(!e||e.hidden)return;const v=window.visualViewport,h=v?v.height:innerHeight,tp=v?v.offsetTop:0;e.style.top=tp+'px';e.style.height=h+'px';e.style.setProperty('--tbh',($('nbTools').offsetHeight||64)+'px');}
let _bt=0;function burst(){const t0=Date.now();cancelAnimationFrame(_bt);(function f(){kb();if(Date.now()-t0<900)_bt=requestAnimationFrame(f);})();}
document.addEventListener('focusin',burst);document.addEventListener('focusout',()=>setTimeout(burst,60));window.addEventListener('resize',burst);window.addEventListener('orientationchange',()=>setTimeout(burst,300));
if(window.visualViewport){visualViewport.addEventListener('resize',kb);visualViewport.addEventListener('scroll',kb);}
document.addEventListener('selectionchange',()=>{const s=getSelection();if(s.rangeCount&&$('edBody').contains(s.anchorNode))range=s.getRangeAt(0).cloneRange();});
function restore(){if(!range)return;$('edBody').focus();const s=getSelection();s.removeAllRanges();s.addRange(range);}
const ex=(c,v)=>{restore();document.execCommand('styleWithCSS',false,true);document.execCommand(c,false,v);};
$('nbTools').addEventListener('pointerdown',e=>{if(e.target.closest('button'))e.preventDefault();});
$('nbTools').querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>ex(b.dataset.c));
$('tcol').oninput=e=>ex('foreColor',e.target.value);$('thi').oninput=e=>ex('hiliteColor',e.target.value);
$('tsz').onchange=e=>{restore();document.execCommand('fontSize',false,'7');$('edBody').querySelectorAll('font[size="7"]').forEach(f=>{f.removeAttribute('size');f.style.fontSize=e.target.value+'px'});};
$('timg').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{restore();document.execCommand('insertImage',false,r.result);};r.readAsDataURL(f);e.target.value='';};
$('nbTools').querySelector('[data-a=set]').onclick=openSet;
$('nbTools').querySelectorAll('[data-ins]').forEach(b=>b.onclick=()=>{restore();document.execCommand('insertText',false,b.dataset.ins);});
$('tcol').addEventListener('input',e=>{$('tcolBar').style.background=e.target.value;});$('thi').addEventListener('input',e=>{$('thiBar').style.background=e.target.value;});
$('nbTools').querySelector('[data-a=fs]').onclick=()=>{$('nbSet').hidden=true;nb.classList.add('nbfs');$('edExit').hidden=false;$('edBody').contentEditable='false';};
/* ouverture / fermeture */
$('nbBack').onclick=()=>{nb.hidden=true;setSel(false);};
nb.addEventListener('touchstart',e=>{nb._x=e.touches[0].clientX;nb._y=e.touches[0].clientY;},{passive:true});
nb.addEventListener('touchend',e=>{if($('nbHome').hidden||!e.changedTouches.length)return;const dx=e.changedTouches[0].clientX-nb._x,dy=e.changedTouches[0].clientY-nb._y;if(Math.abs(dx)<70||Math.abs(dx)<Math.abs(dy)*2)return;const i=st.fams.findIndex(f=>f.id===st.cur)+(dx<0?1:-1);if(st.fams[i]){st.cur=st.fams[i].id;save();render();}},{passive:true});
window.NB={open(){nb.hidden=false;home();},fit:kb,
 state(){return {ed:$('nbEd').hidden?0:1,id:editing?editing.id:null,fs:nb.classList.contains('nbfs')?1:0,sel:selOn?1:0};},
 exitFs(){nb.classList.remove('nbfs');$('edExit').hidden=true;$('edBody').contentEditable='true';},
 close(){if(!$('nbEd').hidden){try{saveEd();}catch(e){}}NB.exitFs();const _s=$('nbSet'),_d=$('nbSetDim');if(_s)_s.hidden=true;if(_d)_d.hidden=true;if(selOn){selOn=false;sel.clear();}nb.hidden=true;},
 sync(t){if(nb.hidden){nb.hidden=false;home();}
  if(!t.ed){NB.exitFs();if(!$('nbEd').hidden){try{saveEd();}catch(e){}home();}if(!!t.sel!==!!selOn)setSel(!!t.sel);}
  else{if($('nbEd').hidden){if(selOn){selOn=false;sel.clear();}openEd(t.id||null);}
   if(t.fs&&!nb.classList.contains('nbfs')){$('nbSet').hidden=true;nb.classList.add('nbfs');$('edExit').hidden=false;$('edBody').contentEditable='false';}
   else if(!t.fs&&nb.classList.contains('nbfs'))NB.exitFs();}}};
new MutationObserver(()=>{if(window.WMBNavigation&&WMBNavigation.schedule)WMBNavigation.schedule();}).observe(nb,{attributes:true,attributeFilter:['hidden','class'],subtree:true});
setInterval(()=>{const sp=$('studyPanel');if(sp&&!sp.hidden&&$('newNote')){sp.hidden=true;NB.open();}},250);
})();
