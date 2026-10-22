// Port the supplied HTML, not a reinterpretation of its visual design.
// Only data, privacy, accessibility and functional bindings change the templates.
import {parseHTML} from 'linkedom';
import {readFileSync} from 'node:fs';
import {escapeHtml as e,CATEGORIES} from '../src/catalog.mjs';
import {renderCard,renderChip,repoUrl,readmeUrl} from '../src/cards.mjs';
const label=p=>CATEGORIES.find(c=>c[0]===p.category)[1];
const starOutline=readFileSync(new URL('../assets/icons/star-outline.svg',import.meta.url),'utf8').trim().replace('<svg ','<svg aria-hidden="true" ').replace('width="24"','width="28"').replace('height="24"','height="28"');
const text=(node,value)=>{if(!node)throw new Error('Reference binding missing');node.textContent=value;};
const source=(p,path)=>repoUrl(p)+'/blob/main/'+path.split('/').map(encodeURIComponent).join('/');
function external(a,url){a.setAttribute('href',url);a.setAttribute('target','_blank');a.setAttribute('rel','noopener noreferrer');}
function fragment(document,html){const div=document.createElement('div');div.innerHTML=html;return [...div.childNodes];}

function feedback(document,catalog,config,p){
 document.querySelector('#fb-sent')?.remove();
 const section=document.querySelector('#feedback, #gop-y'),form=section.querySelector('#fb-form');
 const preview=document.createElement('p');preview.id='feedback-status';preview.setAttribute('role','status');
 preview.setAttribute('style','margin:0 0 22px;font-size:14px;line-height:1.6;color:var(--c-navy)');
 preview.innerHTML='<strong>Biểu mẫu sắp mở</strong><br>Chưa nhận hoặc lưu phản hồi tại đây.';
 form.before(preview);form.setAttribute('aria-describedby',preview.id);form.setAttribute('data-feedback-preview','');
 // No fields for names, email or personal contact details are retained.
 const privateField=document.querySelector('#fb-name')?.parentElement?.parentElement||document.querySelector('#pd-email')?.parentElement;
 privateField?.remove();
 for(const node of form.querySelectorAll('input,textarea,select,button'))node.setAttribute('disabled','');
 const select=form.querySelector('select');
 if(select)select.innerHTML='<option value="">Chọn sản phẩm…</option>'+catalog.products.map(x=>`<option value="${e(x.id)}">${e(x.group+' - '+x.name)}</option>`).join('');
 const roles=form.querySelector('#fb-roles');
 if(roles)roles.innerHTML=['Sinh viên','Giảng viên','Doanh nghiệp','Khác'].map((r,i)=>`<button disabled type="button" aria-pressed="${i===0}" style="min-height:44px;padding:0 16px;border-radius:var(--radius-pill,999px);border:1px solid ${i===0?'var(--c-blue-900,#0B2C8F)':'rgba(6,18,53,.3)'};background:${i===0?'var(--c-blue-900,#0B2C8F)':'var(--c-white,#FFFFFF)'};color:${i===0?'var(--c-white,#FFFFFF)':'var(--c-navy,#061235)'};font:inherit;font-size:14px">${r}</button>`).join('');
 form.querySelector('#fb-stars').innerHTML=[1,2,3,4,5].map(n=>`<button disabled type="button" aria-label="${n} trên 5 điểm (xem trước)" style="width:44px;height:44px;border:none;background:transparent;padding:0;display:grid;place-items:center;color:var(--c-ink-placeholder,#55617D)">${starOutline}</button>`).join('');
 const submit=form.querySelector('button[type=submit]');submit.type='button';submit.textContent='Góp ý sắp mở';submit.setAttribute('disabled','');
 for(const note of form.querySelectorAll('p'))if(note.textContent.includes('Email chỉ dùng'))note.textContent='Không cần đăng nhập. Không thu tên hoặc email cá nhân.';
 if(!form.querySelector('p'))form.append(...fragment(document,'<p style="margin:0;font-size:13px;line-height:1.5;color:var(--c-ink-muted)">Không cần đăng nhập. Không thu tên hoặc email cá nhân.</p>'));
 const left=section.firstElementChild.firstElementChild;
 for(const a of left.querySelectorAll('a'))if(a.textContent.includes('Mở issue'))external(a,config.repositoryUrl+'/issues/new');
 for(const paragraph of left.querySelectorAll('p')){
  if(paragraph.textContent.includes('Mỗi góp ý được chuyển'))paragraph.textContent='Bạn đã dùng thử một sản phẩm? Chia sẻ điều hữu ích và điều cần cải thiện. Biểu mẫu ẩn danh sẽ được mở sau; hiện trang chưa nhận phản hồi.';
  if(paragraph.textContent.includes('Góp ý được gửi thẳng'))paragraph.textContent=`Biểu mẫu góp ý cho ${p.group} - ${p.name} sẽ được mở sau. Hiện trang chưa nhận hoặc lưu phản hồi.`;
 }
 const steps=left.querySelectorAll('li > span:last-child');
 ['Chọn sản phẩm, chấm điểm và viết góp ý khi biểu mẫu mở.','Không cần tài khoản GitHub; không thu tên hay email cá nhân.','Theo dõi các cập nhật tại repository của từng nhóm.'].forEach((s,i)=>{if(steps[i])text(steps[i],s);});
 // Preserve old #feedback deep links as well as the supplied detail #gop-y.
 if(section.id==='gop-y'){const alias=document.createElement('span');alias.id='feedback';section.prepend(alias);}
 if(p){const context=document.createElement('p');context.className='feedback-context';context.textContent=p.group+' - '+p.name;form.prepend(context);}
 const embed=config.feedback?.embedUrl;
 if(embed){const url=new URL(embed);if(url.protocol!=='https:'||url.hostname!=='docs.google.com'||!/^\/forms\/d\/(?:e\/)?[A-Za-z0-9_-]+\/viewform$/.test(url.pathname))throw new Error('Invalid published feedback URL');
  if(!/^entry\.\d+$/.test(config.feedback.productEntry||''))throw new Error('Feedback productEntry is required to prefill each product');
  // Home starts blank; each detail prefills exactly its own product.
  url.search='';url.searchParams.set('embedded','true');
  if(p)url.searchParams.set(config.feedback.productEntry,p.group+' - '+p.name);
  const open=new URL(url);open.searchParams.delete('embedded');
  preview.textContent=p?`Biểu mẫu đã điền sẵn: ${p.group} - ${p.name}. Bạn có thể đổi lựa chọn trong Google Forms.`:'Chọn sản phẩm bạn muốn góp ý trong biểu mẫu bên dưới.';
  for(const paragraph of left.querySelectorAll('p'))if(paragraph.textContent.includes('chưa nhận')||paragraph.textContent.includes('sẽ được mở sau'))paragraph.textContent='Chia sẻ điều hữu ích và điều cần cải thiện sau khi dùng thử sản phẩm. Không cần ghi tên hoặc email.';
  if(steps[0])text(steps[0],p?'Sản phẩm đang xem đã được điền sẵn. Chấm điểm và viết góp ý.':'Chọn sản phẩm, chấm điểm và viết góp ý.');
  form.replaceWith(...fragment(document,`<iframe class="form-frame" src="${e(url.href)}" title="Góp ý ${e(p?.name||'FTU Legacy K63')}" loading="lazy" referrerpolicy="no-referrer"></iframe><p><a href="${e(open.href)}" target="_blank" rel="noopener noreferrer">Mở biểu mẫu trong tab mới ↗</a></p><p>Không thu tên/email. Phản hồi do Google Forms xử lý; chỉ xác nhận bên trong biểu mẫu mới cho biết đã gửi thành công.</p>`));
 }
}

function home(document,catalog,config){
 document.querySelector('#chips').innerHTML=CATEGORIES.map(([id,name])=>renderChip(id,name,id==='all'?catalog.products.length:catalog.products.filter(p=>p.category===id).length,id==='all')).join('');
 document.querySelector('#track').innerHTML=catalog.products.map(p=>renderCard(p,'./')).join('');
 text(document.querySelector('#count'),catalog.products.length);
 feedback(document,catalog,config);
}

function product(document,p,catalog,config){
 document.querySelectorAll('[data-field]').forEach(node=>text(node,{name:p.name,catLabel:label(p),group:'Nhóm '+p.group.slice(1)}[node.dataset.field]));
 const hero=document.querySelector('#top');
 text(hero.querySelector('h1 + p'),p.tagline);
 const actions=hero.querySelector('h1 + p + div').querySelectorAll('a');
 external(actions[0],p.demoUrl||readmeUrl(p));if(!p.demoUrl)text(actions[0],'Đọc hồ sơ dự án ↗');
 external(actions[1],repoUrl(p));
 const meta=hero.querySelectorAll('dl dd');[p.version||p.status,p.tech.length?p.tech.join(' / '):'Chưa công bố',p.updated].forEach((s,i)=>text(meta[i],s));
 const media=hero.querySelector('div[style*="aspect-ratio"]');
 media.innerHTML=`<img class="product-cover" src="${e(p.cover)}" alt="${e(p.coverCaption)}" width="960" height="600" fetchpriority="high" style="width:100%;height:100%;object-fit:cover;object-position:top;border-radius:22px">`;
 media.parentElement.append(...fragment(document,`<p class="media-caption">${e(p.coverCaption)}</p>`));
 const users=document.querySelectorAll('#doi-tuong article');
 p.users.forEach((u,i)=>{text(users[i].querySelector('h3'),u.title);text(users[i].querySelector('dt'),i===2?'Bối cảnh':'Nhu cầu');text(users[i].querySelector('dd'),u.desc);users[i].querySelector('dl > div:last-child').remove();});
 const features=document.querySelector('#tinh-nang ol'),examples=[...features.children];features.innerHTML='';
 p.features.forEach((f,i)=>{const li=examples[Math.min(i,1)].cloneNode(true);text(li.querySelector('span'),String(i+1).padStart(2,'0'));text(li.querySelector('h3'),f.title);text(li.querySelector('p'),f.desc);
  const button=document.createElement('button');button.type='button';button.className='feature-trigger';button.setAttribute('data-feature',String(i));button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-label',f.title+': xem minh họa');
  while(li.firstChild)button.append(li.firstChild);li.append(button);features.append(li);
 });
 const benefitArticles=document.querySelectorAll('#loi-ich article');
 text(benefitArticles[1].querySelector('h3'),'TRONG HỌC TẬP VÀ ĐÀO TẠO');
 [p.benefits.user,p.benefits.org].forEach((list,i)=>{const ul=benefitArticles[i].querySelector('ul'),prototype=ul.firstElementChild.cloneNode(true);ul.innerHTML='';list.forEach(s=>{const li=prototype.cloneNode(true);while(li.childNodes.length>1)li.lastChild.remove();li.append(document.createTextNode(s));ul.append(li);});});
 text(document.querySelector('#hanh-trinh blockquote'),p.rationale);
 document.querySelectorAll('#hanh-trinh ol li').forEach((li,i)=>{text(li.querySelector('span'),'BƯỚC '+(i+1));text(li.querySelector('p'),p.journey[i]);});
 text(document.querySelector('#nhom h2'),'Nhóm '+p.group.slice(1));
 const team=document.querySelectorAll('#nhom article'),leadText=team[0].querySelectorAll('p');
 [p.lead?'ĐẦU MỐI ĐƯỢC CÔNG BỐ':'ĐẦU MỐI NHÓM',p.lead?.name||p.group,p.lead?.role||'Repo chưa xác định riêng người liên hệ. Trao đổi với nhóm qua repository.'].forEach((s,i)=>text(leadText[i],s));
 const contact=team[0].querySelector('a');external(contact,repoUrl(p));text(contact,'Trao đổi qua repository ↗');
 const members=team[1].querySelector('ul'),prototype=members.firstElementChild.cloneNode(true);members.innerHTML='';
 p.members.forEach(m=>{const li=prototype.cloneNode(true);const spans=li.querySelectorAll('span');text(spans[0],m.name);text(spans[1],m.role);members.append(li);});
 const links=team[1].querySelectorAll('a');external(links[0],repoUrl(p));external(links[1],readmeUrl(p));
 document.querySelector('#nhom > div').append(...fragment(document,`<details class="evidence"><summary>Nguồn thông tin và phạm vi kiểm chứng</summary><p>Mô tả lợi ích là mục tiêu sử dụng, không phải kết quả nghiên cứu hiệu quả đã được kiểm chứng. Nội dung tổng hợp từ tài liệu nhóm; không hàm ý đã thử nghiệm trên người dùng thật.</p><ul>${p.sources.map(path=>`<li><a href="${e(source(p,path))}" target="_blank" rel="noopener noreferrer">${e(path)}</a></li>`).join('')}</ul><p>Snapshot repo: <code>${e(p.sourceSha?.slice(0,12)||'')}</code>. Không công khai email hay mã sinh viên.</p></details>`));
 feedback(document,catalog,config,p);
 const dialog=document.createElement('dialog');dialog.id='feature-dialog';dialog.setAttribute('aria-label','Minh họa tính năng');
 dialog.innerHTML='<button type="button" class="dialog-close" autofocus>Đóng ×</button><img id="feature-image" width="960" height="600" alt=""><p id="feature-caption"></p>';
 document.body.append(dialog);
}

export function renderReference(raw,catalog,config,{p=null,base='./',fontsCSS=''}={}){
 const replacements={
  '[Thêm 1–2 câu về mục tiêu của dự án lớp.]':'Khám phá bản trải nghiệm và đọc lại hành trình phát triển của từng nhóm.',
  '[Tên học phần đầy đủ]':'Technology in Banking and Finance',
  'Học kỳ [I], năm học [2026–2027]':'Học theo dự án, năm 2026',
  '[Học hàm, Họ và tên]':e(config.instructor),'[Khoa / Bộ môn]':'Trường Đại học Ngoại thương',
  '[Số nhóm]':String(catalog.products.length),'[Số sản phẩm]':String(catalog.products.length),'[Năm]':'2026',
  '[ftu-legacy-63]':'FTU-Legacy-63'
 };
 for(const [key,value] of Object.entries(replacements))raw=raw.replaceAll(key,value);
 const {document}=parseHTML(raw);
 document.querySelectorAll('script,link[href*="fonts.googleapis.com"],link[href*="fonts.gstatic.com"]').forEach(x=>x.remove());
 document.body.dataset.product=p?.id||'';document.body.dataset.page=p?'product':'home';
 document.querySelectorAll('a[href="https://github.com/"]').forEach(a=>external(a,config.organizationUrl));
 document.querySelectorAll('a[href^="mailto:"]').forEach((a,i)=>{external(a,i===0?config.courseUrl:config.repositoryUrl);text(a,i===0?'Tài liệu học phần ↗':'Repository showcase ↗');});
 if(p)product(document,p,catalog,config);else home(document,catalog,config);
 // Keep the source's visual values, while fixing functional/semantic gaps.
 document.querySelector('header')?.setAttribute('role','banner');document.querySelector('footer')?.setAttribute('role','contentinfo');
 const wrapper=document.body.firstElementChild,main=document.createElement('main');main.id='main';main.tabIndex=-1;main.setAttribute('style',wrapper.getAttribute('style'));
 const nodes=[...wrapper.childNodes];for(const node of nodes)main.append(node);wrapper.replaceWith(main);
 document.body.prepend(...fragment(document,'<a class="skip-link" href="#main">Đến nội dung chính</a>'));
 document.querySelectorAll('a').forEach(a=>{const href=a.getAttribute('href');if(href?.startsWith('https://')){a.setAttribute('target','_blank');a.setAttribute('rel','noopener noreferrer');}});
 for(const node of document.querySelectorAll('[src],[href]'))for(const attr of ['src','href']){const value=node.getAttribute(attr);if(value&&(value.startsWith('assets/')||value==='tokens.css'||value.startsWith('index.html')))node.setAttribute(attr,base+value);}
 const title=p?`${p.name} | FTU Legacy K63`:'FTU Legacy K63 | Ý tưởng tài chính thành sản phẩm';
 const description=p?.shortDesc||'Khám phá 10 sản phẩm học tập của sinh viên K63, CTTT Tài chính - Ngân hàng, Trường Đại học Ngoại thương.';
 const canonical=p?`${config.url}san-pham/${p.id}/`:config.url;
 text(document.querySelector('title'),title);
 document.head.append(...fragment(document,`<meta name="description" content="${e(description)}"><meta name="theme-color" content="#02040A"><meta name="referrer" content="strict-origin-when-cross-origin"><link rel="canonical" href="${e(canonical)}"><meta property="og:type" content="website"><meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(description)}"><meta property="og:url" content="${e(canonical)}"><meta property="og:image" content="${e(config.url)}assets/og.webp"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="${base}assets/favicon.svg"><link rel="stylesheet" href="${base}assets/fonts/fonts.css"><link rel="stylesheet" href="${base}styles.css"><link rel="modulepreload" href="${base}catalog.mjs"><link rel="modulepreload" href="${base}cards.mjs"><link rel="preload" href="${base}products.json" as="fetch" crossorigin><link rel="preload" href="${base}assets/fonts/ibm-plex-mono-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin><script type="module" src="${base}app.mjs"></script>`));
 if(fontsCSS){
  document.querySelectorAll('link[href$="assets/fonts/fonts.css"],link[as="font"]').forEach(x=>x.remove());
  const preloads=[400,500,600].flatMap(weight=>['latin','latin-ext','vietnamese'].map(subset=>`<link rel="preload" href="${base}assets/fonts/ibm-plex-mono-${subset}-${weight}-normal.woff2" as="font" type="font/woff2" crossorigin>`)).join('');
  const inlineFonts=fontsCSS.replace(/url\(['"]?\.\/([^)'"\s]+)['"]?\)/g,(_,name)=>`url(${base}assets/fonts/${name})`);
  document.querySelector('link[href$="tokens.css"]').before(...fragment(document,preloads+`<style data-self-hosted-fonts>${inlineFonts}</style>`));
 }
 if(/\[[^\]]+\]/.test(document.body.textContent))throw new Error('Unresolved sample text in '+(p?.id||'home'));
 return document.toString();
}
