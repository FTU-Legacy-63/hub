import {execFileSync} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
const api=path=>JSON.parse(execFileSync('gh',['api',path],{encoding:'utf8',maxBuffer:20_000_000}));
const repos=await Promise.all(Array.from({length:10},(_,i)=>`G${String(i+1).padStart(2,'0')}`).map(async name=>{
  const info=api(`repos/FTU-Legacy-63/${name}`);
  const tree=api(`repos/FTU-Legacy-63/${name}/git/trees/${info.default_branch}?recursive=1`);
  let readme;
  try {readme=api(name==='G04'?`repos/FTU-Legacy-63/${name}/contents/Week%201/README.md`:`repos/FTU-Legacy-63/${name}/readme`);}catch{
    readme=api(`repos/FTU-Legacy-63/${name}/contents/Week%201/README.md`);
  }
  return {group:name,repo:info.html_url,branch:info.default_branch,sha:tree.sha,pushedAt:info.pushed_at,
    readmePath:readme.path,
    files:tree.tree.map(f=>f.path)};
}));
await mkdir('research',{recursive:true});
await writeFile('research/repositories.json',JSON.stringify({checkedAt:new Date().toISOString(),repos},null,2)+'\n');
console.log(`Saved public repository evidence for ${repos.length} groups. No credentials collected.`);
