import {readFile,writeFile,mkdir,cp,copyFile} from 'node:fs/promises';
import {validateCatalog,escapeHtml} from '../src/catalog.mjs';
const data=JSON.parse(await readFile('products.json','utf8')),config=JSON.parse(await readFile('site.config.json','utf8'));
validateCatalog(data.products);
const evidence=JSON.parse(await readFile('research/repositories.json','utf8'));
for(const p of data.products){const s=evidence.repos.find(r=>r.group===p.group);p.updated=s.pushedAt.slice(0,10);p.sourceSha=s.sha;}
await mkdir('dist/assets/fonts',{recursive:true});
await cp('assets','dist/assets',{recursive:true,filter:path=>!path.split('/').some(part=>part==='.DS_Store'||part.startsWith('Icon'))});
let fonts='';
for(const weight of [300,400,500,600]){
 const css=await readFile(`node_modules/@fontsource/ibm-plex-mono/${weight}.css`,'utf8');
 for(const face of css.match(/@font-face\s*\{[^}]+\}/g)||[]){
  const name=face.match(/url\(\.\/files\/([^)]*\.woff2)\)/)?.[1];
  if(!name||!['latin','latin-ext','vietnamese'].some(s=>name===`ibm-plex-mono-${s}-${weight}-normal.woff2`))continue;
  await copyFile(`node_modules/@fontsource/ibm-plex-mono/files/${name}`,`dist/assets/fonts/${name}`);
  fonts+=face.replace(/, url\([^)]*\.woff\) format\('woff'\)/,'').replaceAll('./files/','./')+'\n';
 }
}
await writeFile('dist/assets/fonts/fonts.css',fonts);
await copyFile('node_modules/@fontsource/ibm-plex-mono/LICENSE','dist/assets/fonts/LICENSE.txt');
for(const f of ['app.mjs','catalog.mjs','styles.css'])await copyFile(`src/${f}`,`dist/${f}`);
await writeFile('dist/products.json',JSON.stringify(data,null,2)+'\n');
await copyFile('site.config.json','dist/site.config.json');
const template=await readFile('src/index.html','utf8');
function render(title,desc,url,base,product=''){return template.replaceAll('{{TITLE}}',escapeHtml(title)).replaceAll('{{DESCRIPTION}}',escapeHtml(desc)).replaceAll('{{URL}}',escapeHtml(url)).replaceAll('{{BASE}}',base).replaceAll('{{PRODUCT}}',product);}
const description='Khám phá 10 sản phẩm học tập của sinh viên K63, CTTT Tài chính - Ngân hàng, Trường Đại học Ngoại thương. Thử ứng dụng và tìm hiểu hành trình phát triển.';
await writeFile('dist/index.html',render('FTU Legacy K63 | Ý tưởng tài chính thành sản phẩm',description,config.url,'./'));
await writeFile('dist/product.html',render('Sản phẩm | FTU Legacy K63',description,config.url+'product.html','./'));
for(const p of data.products){await mkdir(`dist/san-pham/${p.id}`,{recursive:true});await writeFile(`dist/san-pham/${p.id}/index.html`,render(`${p.name} | FTU Legacy K63`,p.shortDesc,`${config.url}san-pham/${p.id}/`,'../../',p.id));}
await writeFile('dist/404.html',render('Không tìm thấy trang | FTU Legacy K63',description,config.url,config.url,'not-found'));
await writeFile('dist/.nojekyll','');
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[config.url,...data.products.map(p=>`${config.url}san-pham/${p.id}/`)].map(url=>`<url><loc>${url}</loc></url>`).join('')}</urlset>`);
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${config.url}sitemap.xml\n`);
console.log(`Built home, shared template, ${data.products.length} static product detail pages and local Vietnamese fonts.`);
