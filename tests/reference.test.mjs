import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {parseHTML} from 'linkedom';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const html=path=>parseHTML(read(path)).document;
const catalog=JSON.parse(read('products.json'));
test('Attempt-2 supplied HTML, tokens and all decoration/icon files retain their exact source bytes',()=>{
 const manifest=JSON.parse(read('docs/ATTEMPT_2_SOURCE.json'));
 assert.equal(manifest.files.length,30);
 for(const item of manifest.files){const hash=createHash('sha256').update(readFileSync(new URL('../'+item.local,import.meta.url))).digest('hex');assert.equal(hash,item.sha256,item.local);}
});
test('Home preserves exact hero, panel, heading, section and decorative-image style values',()=>{
 const source=html('src/templates/home.html'),built=html('dist/index.html');
 for(const id of ['top','du-an','san-pham','feedback'])assert.equal(built.getElementById(id).getAttribute('style'),source.getElementById(id).getAttribute('style'),id);
 for(const selector of ['#top h1','#top > div','#top > div > div'])assert.equal(built.querySelector(selector).getAttribute('style'),source.querySelector(selector).getAttribute('style'),selector);
 for(const image of source.querySelectorAll('img[src^="assets/"]')){const actual=[...built.querySelectorAll('img')].find(x=>x.getAttribute('src')==='./'+image.getAttribute('src'));assert.ok(actual,image.getAttribute('src'));assert.equal(actual.getAttribute('style'),image.getAttribute('style'));}
});
test('Rendered catalog has ten actual products and source-sized narrow carousel cards',()=>{
 const doc=html('dist/index.html'),cards=doc.querySelectorAll('#track > article');assert.equal(cards.length,10);assert.equal(doc.getElementById('chips').children.length,7);
 for(const card of cards)assert.match(card.getAttribute('style'),/flex: 0 0 clamp\(272px, 28vw, 360px\)/);
 assert.equal(doc.getElementById('count').textContent,'10');
 for(const p of catalog.products)assert.ok([...cards].some(c=>c.textContent.includes(p.name)));
});
test('Inlined Vietnamese font URLs use the correct root and deep-page asset bases',()=>{
 for(const [path,base]of [['dist/index.html','./'],['dist/san-pham/g09/index.html','../../']]){const doc=html(path),css=doc.querySelector('style[data-self-hosted-fonts]').textContent;const urls=[...css.matchAll(/url\(([^)]+\.woff2)\)/g)].map(m=>m[1]);assert.equal(urls.length,15);for(const url of urls)assert.ok(url.startsWith(base+'assets/fonts/'),url);}
});
test('All ten static details contain real data, six sections and three source-grounded feature cards',()=>{
 for(const p of catalog.products){const doc=html(`dist/san-pham/${p.id}/index.html`);assert.equal(doc.querySelector('h1').textContent,p.name);for(const id of ['doi-tuong','tinh-nang','loi-ich','hanh-trinh','nhom','gop-y'])assert.ok(doc.getElementById(id),p.id+id);assert.equal(doc.querySelectorAll('[data-feature]').length,p.features.length);assert.equal(doc.querySelectorAll('#doi-tuong article').length,3);assert.equal(doc.querySelectorAll('#hanh-trinh ol li').length,5);assert.doesNotMatch(doc.body.textContent,/\[[^\]]+\]/);assert.doesNotMatch(doc.documentElement.outerHTML,/file:\/\/|href="https:\/\/github\.com\/"|mailto:|fonts\.googleapis\.com/);}
});
test('Deferred feedback is an honest disabled visual preview, without PII fields or fake success',()=>{
 if(JSON.parse(read('site.config.json')).feedback.embedUrl)return;
 for(const path of ['dist/index.html',...catalog.products.map(p=>`dist/san-pham/${p.id}/index.html`)]){const doc=html(path),form=doc.querySelector('[data-feedback-preview]');assert.ok(form,path);assert.match(doc.getElementById('feedback-status').textContent,/Chưa nhận hoặc lưu/);assert.equal(form.querySelectorAll('button[type=submit],input[type=email],input[autocomplete=name]').length,0);assert.equal(doc.querySelectorAll('#fb-sent').length,0);for(const input of form.querySelectorAll('input,select,textarea,button'))assert.ok(input.hasAttribute('disabled'));}
});
