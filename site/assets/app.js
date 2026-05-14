const list = document.getElementById('list');
const post = document.getElementById('post');
let posts=[];

fetch('/data/posts.json').then(r=>r.json()).then(data=>{
  posts=data.filter(p=>!p.draft);
  renderList();
  if(posts[0]) openPost(posts[0].slug);
});
function renderList(){
  list.innerHTML=posts.map(p=>`<div class="item" data-slug="${p.slug}"><div>${p.title}</div><div class="meta">${p.date} · ${p.categories.join(' / ')}</div></div>`).join('');
  list.querySelectorAll('.item').forEach(el=>el.onclick=()=>openPost(el.dataset.slug));
}
function openPost(slug){
  const p=posts.find(x=>x.slug===slug); if(!p) return;
  list.querySelectorAll('.item').forEach(el=>el.classList.toggle('active',el.dataset.slug===slug));
  post.innerHTML=`<h1>${p.title}</h1><div class="meta">${p.date}</div>${window.mdToHtml(p.body)}`;
}
