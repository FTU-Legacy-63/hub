import {CATEGORIES,categoryCounts,filterProducts,validateCatalog} from './catalog.mjs';
import {renderCard,renderChip,detailUrl} from './cards.mjs';
const root=new URL('./',import.meta.url),$=id=>document.getElementById(id);
function home(products){
 const track=$('track'),search=$('q'),chips=$('chips'),prev=$('prev'),next=$('next');
 const params=new URLSearchParams(location.search);let query=params.get('q')||'',selected=CATEGORIES.some(c=>c[0]===params.get('category'))?params.get('category'):'all';search.value=query;
 function controls(){prev.disabled=track.scrollLeft<=2;next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-2;}
 function render(){
  const rows=filterProducts(products,query,selected),counts=categoryCounts(products,query);
  chips.innerHTML=CATEGORIES.map(([id,label])=>renderChip(id,label,counts[id],selected===id)).join('');
  track.innerHTML=rows.map(p=>renderCard(p)).join('');track.hidden=rows.length===0;$('no-results').hidden=rows.length>0;
  $('count').textContent=rows.length;$('cat-label').textContent=CATEGORIES.find(c=>c[0]===selected)[1];track.scrollLeft=0;
  const url=new URL(location.href);if(query)url.searchParams.set('q',query);else url.searchParams.delete('q');if(selected==='all')url.searchParams.delete('category');else url.searchParams.set('category',selected);history.replaceState(null,'',url);
  requestAnimationFrame(controls);
 }
 chips.addEventListener('click',event=>{const button=event.target.closest('[data-cat]');if(!button)return;selected=button.dataset.cat;render();chips.querySelector(`[data-cat="${selected}"]`).focus({preventScroll:true});});
 search.addEventListener('input',()=>{query=search.value;render();});$('search-form').addEventListener('submit',event=>event.preventDefault());
 $('reset').addEventListener('click',()=>{query='';selected='all';search.value='';render();search.focus({preventScroll:true});});
 const move=direction=>track.scrollBy({left:direction*Math.max(track.clientWidth*.8,280),behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
 prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));track.addEventListener('scroll',controls,{passive:true});new ResizeObserver(controls).observe(track);
 if(query||selected!=='all')render();else controls();
}
function detail(p){
 const dialog=$('feature-dialog'),image=$('feature-image'),caption=$('feature-caption');
 document.querySelectorAll('[data-feature]').forEach(button=>button.addEventListener('click',()=>{const f=p.features[Number(button.dataset.feature)];image.src=new URL(f.media||p.cover,root);image.alt=f.mediaCaption||p.coverCaption;caption.textContent=image.alt;dialog.showModal();}));
 dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});
}
function notFound(){const main=$('main');main.innerHTML='<h1>Không tìm thấy sản phẩm.</h1><p>Đường dẫn có thể đã thay đổi.</p><a href="'+new URL('index.html#san-pham',root).href+'">Về danh sách sản phẩm</a>';}
async function start(){
 try{
  const responses=await Promise.all([fetch(new URL('products.json',root)),fetch(new URL('site.config.json',root))]);if(responses.some(r=>!r.ok))throw new Error('Data request failed');
  const [catalog]=await Promise.all(responses.map(r=>r.json()));validateCatalog(catalog.products);
  if(document.body.dataset.page==='not-found'){notFound();return;}
  if(document.body.dataset.page==='router'){const id=new URLSearchParams(location.search).get('id'),p=catalog.products.find(p=>p.id===id);if(p)location.replace(detailUrl(p));else notFound();return;}
  if(document.body.dataset.page==='home')home(catalog.products);else{const p=catalog.products.find(p=>p.id===document.body.dataset.product);if(!p)throw new Error('Unknown product');detail(p);}
  document.querySelector('[data-feedback-preview]')?.addEventListener('submit',event=>event.preventDefault());
 }catch(error){const alert=document.createElement('div');alert.className='runtime-error';alert.setAttribute('role','alert');alert.innerHTML='<h2>Chưa tải được dữ liệu tương tác.</h2><p>Bạn vẫn có thể đọc hồ sơ bên dưới. Hãy tải lại khi kết nối ổn định.</p><button type="button">Tải lại</button>';alert.querySelector('button').addEventListener('click',()=>location.reload());$('main').prepend(alert);}
}
void start();
