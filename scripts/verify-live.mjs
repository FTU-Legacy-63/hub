// Read-only deployment check. Build first, then compare published bytes with dist.
import {readdir,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const config=JSON.parse(await readFile('site.config.json','utf8'));
const base=new URL(config.url),stamp=Date.now();
if(base.protocol!=='https:')throw new Error('Published URL must use HTTPS.');
async function files(directory,prefix=''){
 const entries=await readdir(directory,{withFileTypes:true}),result=[];
 for(const entry of entries){
  if(entry.name.startsWith('.')||entry.name.startsWith('Icon'))continue;
  const path=prefix+entry.name;
  if(entry.isDirectory())result.push(...await files(directory+'/'+entry.name,path+'/'));
  else if(entry.isFile())result.push(path);
 }
 return result;
}
const paths=await files('dist'),digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const errors=[];let checked=0;
async function verify(path){
 const expected=digest(await readFile('dist/'+path)),url=new URL(path,base);
 url.searchParams.set('release-check',String(stamp));
 for(let attempt=0;attempt<2;attempt++){
  try{
   const response=await fetch(url,{signal:AbortSignal.timeout(25_000),cache:'no-store'});
   if(!response.ok)throw new Error(`HTTP ${response.status}`);
   if(digest(Buffer.from(await response.arrayBuffer()))!==expected)throw new Error('Published content differs from local build');
   checked++;return;
  }catch(error){if(attempt===1)errors.push(`${path}: ${error.message}`);}
 }
}
const queue=[...paths];
await Promise.all(Array.from({length:4},async()=>{while(queue.length)await verify(queue.shift());}));
console.log(`${checked}/${paths.length} published files match the local build at ${base.href}`);
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
