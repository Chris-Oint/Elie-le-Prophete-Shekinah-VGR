
(function(){try{
var JES="assets/jesus.jpg",BRA="assets/branham.jpg";
var L1="\u00ab Voici, je vous enverrai \u00c9lie, le proph\u00e8te \u00bb",L2="MALACHIE 4 \u00b7 LA LUMI\u00c8RE DU SOIR",L3="Crois seulement, tout est possible";
var o=null,tm=[],done=false;
function later(f,ms){tm.push(setTimeout(f,ms))}
function typeText(el,txt,sp,cb){var i=0;el.textContent="";(function tick(){if(done)return;if(i<txt.length){el.textContent+=txt.charAt(i++);later(tick,sp)}else if(cb)cb()})()}
function appReady(){return window.M4BibleReady===true}
function end(){if(!o)return;var x=o;o=null;x.classList.add("leave");setTimeout(function(){x.remove();document.body.classList.remove("m4-booting")},720)}
function finishWhenReady(){var w=Date.now();(function chk(){if(!o)return;if(appReady()||Date.now()-w>25000)end();else setTimeout(chk,200)})()}
function setup(el,txt){el.innerHTML='<span class="m4s-v"></span><span class="m4s-h"></span>';el.lastChild.textContent=txt}
function typeIn(el,txt,sp,cb){var v=el.firstChild,h=el.lastChild,i=0;(function tick(){if(done)return;if(i<txt.length){i++;v.textContent=txt.slice(0,i);h.textContent=txt.slice(i);later(tick,sp)}else if(cb)cb()})()}
function startPt(el){var n=el.lastChild.firstChild,r=document.createRange();r.setStart(n,0);r.setEnd(n,1);var b=r.getBoundingClientRect();return {x:b.left+3,y:b.top+b.height/2}}
function ctr(el){var b=el.getBoundingClientRect();return {x:b.left+b.width/2,y:b.top+b.height/2}}
function kill(b,x,y){b.style.transition="opacity .35s ease,transform .35s ease";b.style.transform="translate("+x+"px,"+y+"px) scale(.2)";b.style.opacity="0";setTimeout(function(){if(b.parentNode)b.remove()},420)}
function drop(from,to,cb){
 var b=document.createElement("div");b.className="m4s-ball";o.appendChild(b);
 var x0=from.x-11,y0=from.y-11,x1=to.x-11,y1=to.y-11;
 var a=b.animate([
  {transform:"translate("+x0+"px,"+y0+"px) scale(.2)",opacity:0,offset:0,easing:"ease-out"},
  {transform:"translate("+x0+"px,"+(y0-18)+"px) scale(1.2)",opacity:1,offset:.22,easing:"cubic-bezier(.5,0,1,.7)"},
  {transform:"translate("+x1+"px,"+y1+"px) scale(1)",opacity:1,offset:1}
 ],{duration:1000,fill:"forwards"});
 a.onfinish=function(){if(done)return;b.style.opacity="1";b.style.transform="translate("+x1+"px,"+y1+"px) scale(1)";a.cancel();cb(function(){kill(b,x1,y1)})};
}
function unroll(mid,px){var r=mid.getBoundingClientRect(),p=Math.max(0,Math.min(100,(px-r.left)/r.width*100));
 mid.style.transition="none";mid.style.clipPath="inset(0 "+(100-p)+"% 0 "+p+"% round 20px)";void mid.offsetWidth;
 mid.style.transition="clip-path .9s cubic-bezier(.3,.7,.2,1)";mid.style.clipPath="inset(0 0 0 0 round 20px)"}
function play(){
 tm.forEach(clearTimeout);tm=[];done=false;if(o)o.remove();
 o=document.createElement("div");o.id="m4Splash";
 o.innerHTML='<div class="m4s-stack"><img class="m4s-ph m4s-j" alt="J\u00e9sus"><div class="m4s-mid"><p class="m4s-1"></p><p class="m4s-2"></p></div><img class="m4s-ph m4s-b" alt="William Marrion Branham"><p class="m4s-3"></p></div><button type="button" class="m4s-skip">Passer l\u2019animation</button>';
 document.body.appendChild(o);document.body.classList.add("m4-booting");
 var jj=o.querySelector(".m4s-j"),mid=o.querySelector(".m4s-mid"),p1=o.querySelector(".m4s-1"),p2=o.querySelector(".m4s-2"),bb=o.querySelector(".m4s-b"),c=o.querySelector(".m4s-3");
 jj.src=JES;bb.src=BRA;
 setup(p1,L1);setup(p2,L2);setup(c,L3);
 o.querySelector(".m4s-skip").onclick=function(){done=true;finishWhenReady()};
 later(function(){
  var s1=startPt(p1);
  drop(ctr(jj),s1,function(k1){
   unroll(mid,s1.x);k1();
   later(function(){typeIn(p1,L1,40,function(){later(function(){typeIn(p2,L2,36,function(){later(function(){
    drop(ctr(mid),ctr(bb),function(k2){
     bb.classList.add("show");k2();
     later(function(){
      var s3=startPt(c);
      drop(ctr(bb),s3,function(k3){k3();later(function(){typeIn(c,L3,40,function(){later(finishWhenReady,1800)})},250)});
     },1000);
    });
   },300)})},200)})},700);
  });
 },900);
 later(end,30000);
}
window.M4Splash={play:play};
play();
}catch(e){try{document.body.classList.remove("m4-booting")}catch(x){}}})();
