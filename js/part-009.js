
(function(){
const $=id=>document.getElementById(id);
/* ---------- Marquages / Historiques ---------- */
const sc=$('studyContent');
if(sc){
const st={color:null,type:null},hs={a:new Set(),b:new Set()};let lastSec=null,tm=0;
const lum=c=>{const n=parseInt(c.slice(1),16);return(.299*(n>>16)+.587*((n>>8)&255)+.114*(n&255))/255};
function applyM(){const t=$('markType'),c=$('markColor');if(!t||!c)return;t.value=st.type||'all';c.value=st.color||'all';t.dispatchEvent(new Event('change'));
 document.querySelectorAll('#m4MarkBar .m4pill').forEach(b=>b.classList.toggle('on',b.dataset.c===st.color));document.querySelectorAll('#m4MarkBar .m4t[data-t]').forEach(b=>b.classList.toggle('on',b.dataset.t===st.type));$('m4MarkBar').classList.toggle('sel',!!st.color);}
function marks(){const grid=$('studyThemeGrid'),list=$('markList');if(!grid||!list)return;const bs=[...grid.querySelectorAll('[data-theme-color]')];if(!bs.length)return;
 const key=bs.map(b=>b.dataset.themeColor+b.textContent).join('|');let bar=$('m4MarkBar');
 if(!bar||bar.dataset.k!==key){const fresh=!bar;if(bar)bar.remove();if(fresh){const c=$('markColor').value,t=$('markType').value;st.color=c!=='all'?c:null;st.type=t!=='all'?t:null;}
  bar=document.createElement('div');bar.id='m4MarkBar';bar.className='m4rows';bar.dataset.k=key;
  const one=bs.map(b=>{const c=b.dataset.themeColor;return'<button type="button" class="m4pill" data-c="'+c+'" style="--pc:'+c+';--pt:'+(lum(c)>.62?'#1d1d1d':'#fff')+'"></button>'});
  const half=Array(Math.max(1,Math.ceil(6/bs.length))).fill(one).flat();
  const row=(d,dl)=>{const r=document.createElement('div');r.className='m4row';const tr=document.createElement('div');tr.className='m4track';tr.style.cssText='--d:'+d+'s;animation-delay:-'+dl+'s';tr.innerHTML=half.concat(half).join('');tr.querySelectorAll('.m4pill').forEach((p,i)=>p.textContent=bs[i%bs.length].textContent);r.append(tr);return r;};
  const r1=document.createElement('div');r1.className='m4row3 m4chips';r1.innerHTML='<button type="button" class="m4t" data-r="1">Tout</button><button type="button" class="m4t" data-s="1">Tri : '+($('markList').classList.contains('m4rev')?'récent':'ancien')+'</button>';bar.append(r1);const mk=(arr,i0)=>{const r=document.createElement('div');r.className='m4row m4static';r.innerHTML=arr.join('');r.querySelectorAll('.m4pill').forEach((q,i)=>q.textContent=bs[i0+i].textContent);return r;};bar.append(mk(one.slice(0,3),0));if(bs.length>3)bar.append(mk(one.slice(3),3));const r3=document.createElement('div');r3.className='m4row3';r3.className='m4row3 m4tools';r3.innerHTML='<button type="button" class="m4t" data-m="manage"><i>✎</i>Nommer</button><button type="button" class="m4t" data-t="highlight"><i>🖍</i>Surlignage</button><button type="button" class="m4t" data-t="underline"><i><u>U</u></i>Soulignage</button>';bar.append(r3);
  bar.addEventListener('click',e=>{const p=e.target.closest('.m4pill'),t=e.target.closest('.m4t');if(p){st.color=st.color===p.dataset.c?null:p.dataset.c;applyM();}else if(t){if(t.dataset.s){const L=$('markList');L.classList.toggle('m4rev');t.textContent='Tri : '+(L.classList.contains('m4rev')?'récent':'ancien');}else if(t.dataset.r){st.color=null;st.type=null;applyM();}else if(t.dataset.m){const g=$('studyThemeGrid');g&&g.querySelector('[data-theme-manage]')&&g.querySelector('[data-theme-manage]').click();}else{st.type=st.type===t.dataset.t?null:t.dataset.t;applyM();}}});
  grid.after(bar);const row0=$('markType').closest('.study-row');row0&&row0.classList.add('m4-hide');
  bar.querySelectorAll('.m4pill').forEach(b=>b.classList.toggle('on',b.dataset.c===st.color));bar.querySelectorAll('.m4t[data-t]').forEach(b=>b.classList.toggle('on',b.dataset.t===st.type));bar.classList.toggle('sel',!!st.color);}
 list.querySelectorAll('article.study-card:not(.m4card)').forEach(a=>{a.classList.add('m4card');const sm=a.querySelector('small'),m=sm&&sm.textContent.match(/(Surligné|Souligné)\s*·\s*(#[0-9a-f]{6})/i);if(m){a.style.setProperty('--sc',m[2]);a.classList.add(/^Surl/i.test(m[1])?'m4-hl':'m4-ul');}});}
const TR=[['reading','Lecture','#c99b25','a'],['search','Recherche','#4466a8','a'],['at','AT','#b8862b','b'],['nt','NT','#8b2233','b'],['vgr','VGR','#2f7d4f','b'],['shk','SHK','#7656a4','b']];
function applyH(){const A=hs.a,B=hs.b;sc.querySelectorAll('article.m4card[data-k]').forEach(a=>{a.hidden=!((!A.size||A.has(a.dataset.k))&&(!B.size||B.has(a.dataset.s)));});
 document.querySelectorAll('#m4HistBar .m4tr').forEach(b=>b.classList.toggle('on',(b.dataset.g==='a'?hs.a:hs.b).has(b.dataset.v)));}
function hist(){const secs=[...sc.querySelectorAll('section')].filter(x=>x.querySelector('[data-history-clear]'));if(!secs.length)return;
 if(!$('m4HistBar')){const bar=document.createElement('div');bar.id='m4HistBar';bar.className='m4hrows';
  const mkb=([v,l,c,g])=>'<button type="button" class="m4tr" data-v="'+v+'" data-g="'+g+'" style="--tc:'+c+'">'+l+'</button>';
  const GA=TR.filter(x=>x[3]==='a'),GB=TR.filter(x=>x[3]==='b');
  bar.innerHTML='<div class="hb-title">Historique</div><div class="hb-band"><div class="hb-strip" id="hbStrip">'+GB.map(mkb).join('').repeat(5)+'</div></div><div class="hb-types">'+GA.map(mkb).join('')+'</div>';
  bar.addEventListener('click',e=>{const b=e.target.closest('.m4tr');if(!b)return;const S=b.dataset.g==='a'?hs.a:hs.b;S.has(b.dataset.v)?S.delete(b.dataset.v):S.add(b.dataset.v);applyH();});
  secs[0].before(bar);
  const hs_=bar.querySelector('#hbStrip'),unit=()=>hs_.scrollWidth/5,init=()=>{if(hs_.scrollWidth>hs_.clientWidth)hs_.scrollLeft=unit()*2;};init();setTimeout(init,60);
  hs_.addEventListener('scroll',()=>{const w=unit();if(!w)return;if(hs_.scrollLeft<w)hs_.scrollLeft+=w;else if(hs_.scrollLeft>=w*3)hs_.scrollLeft-=w;},{passive:true});}
 const H=(window.GarageStudy&&GarageStudy.getState().histories)||{};
 secs.forEach(sec=>sec.querySelectorAll('article.study-card:not(.m4card)').forEach(a=>{const op=a.querySelector('[data-history-open]'),de=a.querySelector('[data-history-delete]');if(!op)return;const[kind,i]=op.dataset.historyOpen.split(':'),x=(H[kind]||[])[+i]||{};
  let src='o',info='';if(kind==='reading'){const m=/^b:(\d+):/.exec(x.key||''),m2=/^m:(\d+):/.exec(x.key||'');if(m){src=+m[1]<39?'at':'nt';info='Bible · '+(src==='at'?'AT':'NT');}else{let meta=x.label||'';try{const d=window.D&&D.docs&&D.docs[+(m2&&m2[1])];if(d)meta+=' '+[d.src,d.source,d.corpus,d.s,d.t,d.title,d.name,d.id].filter(v=>typeof v==='string').join(' ');}catch(e){}src=/shek|shp/i.test(meta)?'shk':/vgr/i.test(meta)?'vgr':'o';info='Brochure'+(src==='vgr'?' · VGR':src==='shk'?' · SHK':'');}}
  else info='Recherche :';
  a.classList.add('m4card');a.dataset.k=kind;a.dataset.s=src;a.style.setProperty('--sc',kind==='search'?'#4466a8':{at:'#c99b25',nt:'#8b2233',vgr:'#2f7d4f',shk:'#7656a4'}[src]||'#c99b25');
  const date=a.querySelector('small');[...a.children].forEach(c=>c!==date&&c.classList.add('m4-orig'));
  const b=document.createElement('b');b.textContent=kind==='search'?(x.q||op.textContent):(x.label||op.textContent);const p=document.createElement('p');p.textContent=info;
  const r=document.createElement('div');r.className='study-row';const b1=document.createElement('button'),b2=document.createElement('button');b1.type=b2.type='button';b1.textContent=kind==='search'?'Relancer la recherche':'Lire le passage';b2.textContent='Retirer';b1.onclick=()=>op.click();b2.onclick=()=>de&&de.click();r.append(b1,b2);a.append(b,p,r);if(date)a.append(date);}));
 applyH();}
function run(){const cur=(document.querySelector('#studyPanel [data-study].on')||{}).dataset;const k=cur&&cur.study;if(k!==lastSec){lastSec=k;hs.a.clear();hs.b.clear();}marks();hist();}
new MutationObserver(()=>{clearTimeout(tm);tm=setTimeout(run,30)}).observe(sc,{childList:true,subtree:true});
}
/* ---------- Bloc-notes : 3 apparences + retour du téléphone ---------- */
const nb=$('nb'),menu=$('nbMenu'),plus=$('nbPlus');
if(nb&&menu){
const M=[['1','Classique','Onglets de familles, cartes en tiroir (actuel)'],['2','Liège','Tableau de liège, post-it colorés et punaises'],['3','Cadre bois','Tableau de liège encadré, onglets en haut']];
let cur='4';
const setM=v=>{cur=v;nb.dataset.model=v;try{localStorage.setItem('m4-nb-model',v)}catch(e){}};setM(cur);
const btn=document.createElement('button');btn.dataset.m='look';btn.textContent='Apparence du bloc-notes';
btn.onclick=()=>{menu.hidden=true;if(plus)plus.textContent='+';const o=document.createElement('div');o.id='m4Look';o.innerHTML='<div><b>Apparence du bloc-notes</b>'+M.map(([v,n,d])=>'<button type="button" data-v="'+v+'" class="'+(v===cur?'on':'')+'">'+v+' · '+n+'<small>'+d+'</small></button>').join('')+'</div>';
 o.addEventListener('click',e=>{const b=e.target.closest('[data-v]');if(b)setM(b.dataset.v);if(b||e.target===o)o.remove();});document.body.append(o);};
/* Retour du téléphone : géré par la pile de navigation principale (WMBNavigation) */
}
})();
