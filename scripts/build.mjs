import {readFile,writeFile,mkdir,cp,copyFile} from 'node:fs/promises';
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
for(const p of data.products){await mkdir(`dist/san-pham/${p.id}`,{recursive:true});await writeFile(`dist/san-pham/${p.id}/index.html`,renderReference(productTemplate,data,config,{p,base:'../../',fontsCSS:fonts}));}
function router(base,page){return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Sản phẩm | FTU Legacy K63</title><link rel="stylesheet" href="${base}tokens.css"><link rel="stylesheet" href="${base}assets/fonts/fonts.css"><link rel="stylesheet" href="${base}styles.css"><script type="module" src="${base}app.mjs"></script></head><body data-page="${page}"><main id="main" class="router-panel"><h1>Đang mở sản phẩm…</h1><a href="${base}index.html#san-pham">Về danh sách sản phẩm</a></main></body></html>`;}
await writeFile('dist/product.html',router('./','router'));
await writeFile('dist/404.html',router(config.url,'not-found'));
await writeFile('dist/.nojekyll','');
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[config.url,...data.products.map(p=>`${config.url}san-pham/${p.id}/`)].map(url=>`<url><loc>${url}</loc></url>`).join('')}</urlset>`);
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${config.url}sitemap.xml\n`);
console.log(`Built home, shared template, ${data.products.length} static product detail pages and local Vietnamese fonts.`);
