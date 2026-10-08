
window.M4CopyText=async function(text){
 text=String(text==null?'':text);if(!text)return false;
 try{if(navigator.clipboard&&navigator.clipboard.writeText&&window.isSecureContext){await navigator.clipboard.writeText(text);return true;}}catch(e){}
 var ok=false;
 try{
  var ae=document.activeElement,sel=getSelection(),rs=[],i;for(i=0;i<sel.rangeCount;i++)rs.push(sel.getRangeAt(i));
  var t=document.createElement('textarea');t.value=text;t.setAttribute('readonly','');
  t.style.cssText='position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;font-size:16px;pointer-events:none';
  document.body.appendChild(t);t.focus();t.select();t.setSelectionRange(0,text.length);
  ok=document.execCommand('copy');t.remove();
  try{if(ae&&ae.focus)ae.focus()}catch(e){}
  sel.removeAllRanges();rs.forEach(function(r){sel.addRange(r)});
 }catch(e){ok=false}
 return ok;
};
