const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const fileInput = document.getElementById('file');
const importBtn = document.getElementById('importBtn');
const downloadBtn = document.getElementById('downloadBtn');
const title = document.getElementById('title');

function mdToHtml(md){return md
  .replace(/^### (.*$)/gim,'<h3>$1</h3>')
  .replace(/^## (.*$)/gim,'<h2>$1</h2>')
  .replace(/^# (.*$)/gim,'<h1>$1</h1>')
  .replace(/^> (.*$)/gim,'<blockquote>$1</blockquote>')
  .replace(/\*\*(.*?)\*\*/gim,'<strong>$1</strong>')
  .replace(/\*(.*?)\*/gim,'<em>$1</em>')
  .replace(/\n$/gim,'<br />');}
function render(){preview.innerHTML = `<h1>${title.value || '未命名文章'}</h1>` + mdToHtml(editor.value)}
editor.addEventListener('input', render); title.addEventListener('input', render);
importBtn.onclick=()=>fileInput.click();
fileInput.onchange=async()=>{const f=fileInput.files[0]; if(!f) return; editor.value=await f.text(); render();};
downloadBtn.onclick=()=>{const blob=new Blob([editor.value],{type:'text/markdown;charset=utf-8'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=(title.value||'post')+'.md'; a.click(); URL.revokeObjectURL(a.href);};
render();
