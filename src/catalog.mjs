export const CATEGORIES=[['all','Tất cả'],['edu','Giáo dục'],['career','Hướng nghiệp'],['sme','Doanh nghiệp / SME'],['game','Game mô phỏng'],['invest','Đầu tư'],['analytics','Phân tích']];
export const normalizeSearch=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[đĐ]/g,'d').toLowerCase().replace(/\s+/g,' ').trim();
export const escapeHtml=value=>String(value??'').normalize('NFC').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function filterProducts(products,query='',category='all') {
  const words=normalizeSearch(query).split(' ').filter(Boolean);
  return products.filter(p=>(category==='all'||p.category===category)&&words.every(w=>normalizeSearch([p.name,p.group,p.tagline,p.shortDesc,...p.users.map(u=>u.desc),CATEGORIES.find(c=>c[0]===p.category)?.[1]].join(' ')).includes(w)));
}
export function categoryCounts(products,query='') {const filtered=filterProducts(products,query);return Object.fromEntries(CATEGORIES.map(([id])=>[id,id==='all'?filtered.length:filtered.filter(p=>p.category===id).length]));}
export function httpsUrl(value) {try {const u=new URL(value);return u.protocol==='https:'?u.href:null;} catch{return null;}}
export function validateCatalog(products) {
  if(!Array.isArray(products)||products.length===0)throw new Error('Catalog không có dữ liệu.');
  const ids=new Set();
  for(const p of products){
    if(!/^g\d{2}$/.test(p.id)||ids.has(p.id))throw new Error('Mã sản phẩm không hợp lệ hoặc bị trùng.');ids.add(p.id);
    if(!CATEGORIES.slice(1).some(([id])=>id===p.category))throw new Error('Danh mục sản phẩm không hợp lệ.');
    if(!p.name||!p.shortDesc||!p.tagline||p.users?.length!==3||!p.features?.length||p.journey?.length!==5||!p.members?.length||!p.sources?.length)throw new Error(`Thiếu nội dung ${p.id}.`);
    if(p.demoUrl&&!httpsUrl(p.demoUrl))throw new Error('Demo phải dùng HTTPS.');
    if(!/^assets\/products\/g\d{2}\.webp$/.test(p.cover))throw new Error('Đường dẫn ảnh không hợp lệ.');
    if(p.sources.some(s=>s.split('/').includes('..')))throw new Error('Đường dẫn nguồn không hợp lệ.');
  }
  return true;
}
