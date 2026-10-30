import {readFile,writeFile,mkdir,cp,copyFile,readdir} from 'node:fs/promises';
import {validateCatalog} from '../src/catalog.mjs';
import {renderReference} from './render-reference.mjs';
const data=JSON.parse(await readFile('products.json','utf8')),config=JSON.parse(await readFile('site.config.json','utf8'));
validateCatalog(data.products);
const evidence=JSON.parse(await readFile('research/repositories.json','utf8'));
for(const p of data.products){const s=evidence.repos.find(r=>r.group===p.group);p.updated=s.pushedAt.slice(0,10);p.sourceSha=s.sha;}
await mkdir('dist/assets/fonts',{recursive:true});
await cp('assets','dist/assets',{recursive:true,filter:path=>!path.split('/').some(part=>part==='.DS_Store'||part.startsWith('Icon'))});
let fonts='';
for(const [weight,style] of [[300,'normal'],[400,'normal'],[500,'normal'],[600,'normal'],[400,'italic']]){
 const css=await readFile(`node_modules/@fontsource/ibm-plex-mono/${weight}${style==='italic'?'-italic':''}.css`,'utf8');
 for(const face of css.match(/@font-face\s*\{[^}]+\}/g)||[]){
  const name=face.match(/url\(\.\/files\/([^)]*\.woff2)\)/)?.[1];
  if(!name||!['latin','latin-ext','vietnamese'].some(s=>name===`ibm-plex-mono-${s}-${weight}-${style}.woff2`))continue;
  await copyFile(`node_modules/@fontsource/ibm-plex-mono/files/${name}`,`dist/assets/fonts/${name}`);
  fonts+=face.replace(/, url\([^)]*\.woff\) format\('woff'\)/,'').replaceAll('./files/','./')+'\n';
 }
}
await writeFile('dist/assets/fonts/fonts.css',fonts);
await copyFile('node_modules/@fontsource/ibm-plex-mono/LICENSE','dist/assets/fonts/LICENSE.txt');
for(const f of ['app.mjs','catalog.mjs','cards.mjs','styles.css','tokens.css'])await copyFile(`src/${f}`,`dist/${f}`);
await writeFile('dist/products.json',JSON.stringify(data,null,2)+'\n');
await copyFile('site.config.json','dist/site.config.json');
const homeTemplate=await readFile('src/templates/home.html','utf8'),productTemplate=await readFile('src/templates/product.html','utf8');
await writeFile('dist/index.html',renderReference(homeTemplate,data,config,{fontsCSS:fonts}));
for(const p of data.products){await mkdir(`dist/san-pham/${p.id}`,{recursive:true});const page=renderReference(productTemplate,data,config,{p,base:'../../',fontsCSS:fonts});await writeFile(`dist/san-pham/${p.id}/index.html`,page.replaceAll('../../index.html#','../../legacy.html#'));}
function router(base,page){return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Sản phẩm | FTU Legacy K63</title><link rel="stylesheet" href="${base}tokens.css"><link rel="stylesheet" href="${base}assets/fonts/fonts.css"><link rel="stylesheet" href="${base}styles.css"><script type="module" src="${base}app.mjs"></script></head><body data-page="${page}"><main id="main" class="router-panel"><h1>Đang mở sản phẩm…</h1><a href="${base}index.html#san-pham">Về danh sách sản phẩm</a></main></body></html>`;}
await writeFile('dist/product.html',router('./','router'));
await writeFile('dist/404.html',router(config.url,'not-found'));
await writeFile('dist/.nojekyll','');
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[config.url,...data.products.map(p=>`${config.url}san-pham/${p.id}/`)].map(url=>`<url><loc>${url}</loc></url>`).join('')}</urlset>`);
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${config.url}sitemap.xml\n`);
// Keep the existing, shareable detail pages while using the supplied 3D world as the new entrance.
await copyFile('dist/index.html','dist/legacy.html');
await cp('src/world','dist',{recursive:true});
const colors=['#4C6FFF','#22C3E6','#8B6CFF','#EEA35D','#E36E86','#44C7A2','#E7BB51','#B17CDB','#52B789','#E2825E'];
const categories={game:'Trò chơi tài chính',invest:'Đầu tư',edu:'Giáo dục tài chính',analytics:'Phân tích tài chính',career:'Nghề nghiệp'};
const groups=await Promise.all(data.products.map(async (p,i)=>{
 const folder=`assets/world-groups/${p.id}`;
 const files=await readdir(folder);
 const image=prefix=>files.find(f=>f.startsWith(prefix)) ? `${folder}/${files.find(f=>f.startsWith(prefix))}` : '';
 const features=p.features.map(f=>({title:f.title,text:f.desc}));
 return {id:i+1,name:p.name,tagline:p.shortDesc,category:categories[p.category]||p.category,accent:colors[i],
  images:{product:image('product.'),group:image('group.')},highlights:features.slice(0,3),
  members:p.members.map(m=>({name:m.name,role:m.role,photo:'',leader:p.lead?.name===m.name})),motto:'',
  demoUrl:p.demoUrl||'',repoUrl:`https://github.com/FTU-Legacy-63/${p.group}`,dossierUrl:`san-pham/${p.id}/`,
  details:{problem:p.rationale,solution:p.shortDesc,users:p.users.map(u=>({name:u.title,desc:u.desc,needs:[],pains:[]})),features,
   journey:p.journey.map((s,n)=>({phase:`${String(n+1).padStart(2,'0')}`,title:'',text:s})),tech:p.tech,
   gallery:files.filter(f=>/^screen-[1-6]\./.test(f)).sort().map(f=>`${folder}/${f}`)}};
}));
const worldConfig={cohort:'K63',program:'CTTT Tài chính – Ngân hàng',course:'NHA408E',courseName:'Ứng dụng công nghệ thông tin trong tài chính ngân hàng',term:'Năm học 2026–2027',lecturer:config.instructor,githubUrl:config.organizationUrl,k62Url:'https://ftu-legacy-62.github.io/hub/'};
await writeFile('dist/js/data.js',`window.FTU_CONFIG = ${JSON.stringify(worldConfig,null,2)};\nwindow.FTU_GROUPS = ${JSON.stringify(groups,null,2)};\n`);
console.log(`Built 3D showcase and ${data.products.length} existing product detail pages.`);
