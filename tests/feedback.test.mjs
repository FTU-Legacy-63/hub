import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {parseHTML} from 'linkedom';
import {renderReference} from '../scripts/render-reference.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const catalog=JSON.parse(read('dist/products.json'));
const config=JSON.parse(read('site.config.json'));
const feedback={embedUrl:'https://docs.google.com/forms/d/e/TEST_ONLY/viewform?entry.123=wrong',productEntry:'entry.123'};
test('Real-form rendering prefills all ten product pages, but leaves home unselected',()=>{
 for(const p of [null,...catalog.products]){
  const raw=read(p?'src/templates/product.html':'src/templates/home.html');
  const {document}=parseHTML(renderReference(raw,catalog,{...config,feedback},{p,base:p?'../../':'./'}));
  const frame=document.querySelector('iframe.form-frame'),url=new URL(frame.src);
  assert.equal(url.searchParams.get('embedded'),'true');
  assert.equal(url.searchParams.get('entry.123'),p?p.group+' - '+p.name:null);
  assert.equal(document.querySelector('[data-feedback-preview]'),null);
  const section=document.querySelector('#gop-y,#feedback');
  assert.doesNotMatch(section.textContent,/sắp mở|chưa nhận|sẽ được mở sau/i);
  const open=[...section.querySelectorAll('a')].find(a=>a.textContent.includes('Mở biểu mẫu'));
  // Linkedom's href getter double-encodes percent escapes; test emitted HTML.
  const openUrl=new URL(open.getAttribute('href'));
  assert.equal(openUrl.searchParams.has('embedded'),false);
  assert.equal(openUrl.searchParams.get('entry.123'),p?p.group+' - '+p.name:null);
 }
});
test('Form activation rejects editor URLs, lookalike hosts and absent entry keys',()=>{
 const raw=read('src/templates/home.html');
 for(const embedUrl of ['https://docs.google.com/forms/d/ID/edit','https://docs.google.com.evil.test/forms/d/ID/viewform','http://docs.google.com/forms/d/ID/viewform']){
  assert.throws(()=>renderReference(raw,catalog,{...config,feedback:{...feedback,embedUrl}}),/Invalid published/);
 }
 assert.throws(()=>renderReference(raw,catalog,{...config,feedback:{...feedback,productEntry:null}}),/productEntry/);
});
test('Apps Script creates private storage once, resumes safely and derives Google entry key without submitting',()=>{
 const properties=new Map(),logs=[],items=[];let creates=0,sheets=0,submissions=0,locks=0;
 class Item{
  setTitle(x){this.title=x;return this;}getTitle(){return this.title;}
  setChoiceValues(x){this.names=x;return this;}setRequired(){return this;}
  setBounds(){return this;}setLabels(){return this;}setHelpText(){return this;}
  asListItem(){return this;}asScaleItem(){return this;}asParagraphTextItem(){return this;}
  createResponse(value){return {value};}
 }
 const form={getId:()=> 'form-id',getItems:()=>items,getDestinationId:()=>{if(!form.destination)throw new Error('No destination');return form.destination;},
  getPublishedUrl:()=> 'https://docs.google.com/forms/d/e/REAL_GENERATED/viewform',
  supportsAdvancedResponderPermissions:()=>true,
  setDestination(type,id){form.destination=id;return form;},
  createResponse(){return {withItemResponse(){return this;},toPrefilledUrl(){return 'https://docs.google.com/forms/d/e/REAL_GENERATED/viewform?usp=pp_url&entry.987654=G01';},submit(){submissions++;}};}
 };
 for(const name of ['setDescription','setCollectEmail','setLimitOneResponsePerUser','setPublishingSummary','setShowLinkToRespondAgain','setConfirmationMessage','setPublished','setAcceptingResponses'])form[name]=function(value){this[name+'Value']=value;return this;};
 for(const name of ['addListItem','addScaleItem','addParagraphTextItem'])form[name]=()=>{const item=new Item();items.push(item);return item;};
 const context=vm.createContext({
  LockService:{getScriptLock:()=>({waitLock(){locks++;},releaseLock(){locks--;}})},
  PropertiesService:{getScriptProperties:()=>({getProperty:k=>properties.get(k),setProperty:(k,v)=>properties.set(k,v)})},
  FormApp:{create(){creates++;return form;},openById(id){assert.equal(id,'form-id');return form;},DestinationType:{SPREADSHEET:'sheet'}},
  SpreadsheetApp:{create(){sheets++;return {getId:()=> 'private-sheet'};}},
  Logger:{log:x=>logs.push(x)}
 });
 vm.runInContext(read('setup/create-feedback-form.gs'),context);
 context.createK63FeedbackForm();context.createK63FeedbackForm();
 assert.equal(creates,1);assert.equal(sheets,1);assert.equal(items.length,3);assert.equal(submissions,0);assert.equal(locks,0);
 assert.deepEqual(Array.from(items[0].names),catalog.products.map(p=>p.group+' - '+p.name));
 assert.equal(form.setCollectEmailValue,false);assert.equal(form.setLimitOneResponsePerUserValue,false);assert.equal(form.setPublishingSummaryValue,false);
 assert.equal(JSON.parse(logs[0]).productEntry,'entry.987654');
});
