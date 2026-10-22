// Markup and style values ported verbatim from the supplied attempt-2 home.js.
import {escapeHtml as e,CATEGORIES} from './catalog.mjs';
const root=new URL('./',import.meta.url);
export const detailUrl=p=>new URL('san-pham/'+p.id+'/',root).href;
export const repoUrl=p=>'https://github.com/FTU-Legacy-63/'+p.group;
export const readmeUrl=p=>repoUrl(p)+'/blob/main/'+p.readmePath.split('/').map(encodeURIComponent).join('/');
const chipOn = (chip) => `<button type="button" aria-pressed="true" data-cat="${chip.id}" style="min-height: 44px; padding: 0 18px; border-radius: var(--radius-pill, 999px); border: 1px solid var(--c-white, #FFFFFF); background: var(--c-white, #FFFFFF); color: var(--c-navy, #061235); font: inherit; font-size: 14px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px">${chip.label} <span style="font-weight: 400; opacity: 0.75">${chip.count}</span></button>`;
  const chipOff = (chip) => `<button type="button" aria-pressed="false" data-cat="${chip.id}" style="min-height: 44px; padding: 0 18px; border-radius: var(--radius-pill, 999px); border: 1px solid rgba(255, 255, 255, 0.5); background: rgba(255, 255, 255, 0.08); color: var(--c-white, #FFFFFF); font: inherit; font-size: 14px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px">${chip.label} <span style="opacity: 0.75">${chip.count}</span></button>`;
export function renderChip(id,label,count,selected){return (selected?chipOn:chipOff)({id:e(id),label:e(label),count});}
export function renderCard(p,base=root.href){
 const item={id:e(p.id),cat:e(p.category),catLabel:e(CATEGORIES.find(c=>c[0]===p.category)[1]),group:e('Nhóm '+p.group.slice(1)),name:e(p.name),desc:e(p.shortDesc),demoUrl:e(p.demoUrl||readmeUrl(p)),demoLabel:p.demoUrl?'Dùng thử ↗':'Xem hồ sơ ↗',repoUrl:e(repoUrl(p)),detailUrl:e(base+'san-pham/'+p.id+'/'),cover:e(base+p.cover),coverCaption:e(p.coverCaption),mediaLabel:p.demoUrl?'Bản trải nghiệm':'Hồ sơ dự án'};
 return `<article style="flex: 0 0 clamp(272px, 28vw, 360px); scroll-snap-align: start; display: flex; flex-direction: column; border-radius: 28px; border: 1px solid rgba(255, 255, 255, 0.34); background: linear-gradient(170deg, rgba(255, 255, 255, 0.14) 0%, rgba(8, 22, 70, 0.62) 60%); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); overflow: hidden">
<div style="margin: 12px 12px 0; aspect-ratio: 16 / 10; border-radius: 20px; background: linear-gradient(160deg, var(--c-sky-75, #DCEEFB) 0%, var(--c-sky-300, #8EC2F0) 50%, #2F6FE6 100%); position: relative; display: grid; place-items: center; color: var(--c-navy, #061235)">
<img src="${item.cover}" alt="${item.coverCaption}" width="960" height="600" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top;border-radius:20px">
<span style="position: absolute; left: 12px; bottom: 12px; font-size: 11px; color: var(--c-navy, #061235); background: rgba(255, 255, 255, 0.78); padding: 4px 10px; border-radius: var(--radius-pill, 999px)">${item.mediaLabel}</span>
</div>
<div style="padding: 18px 22px 22px; display: flex; flex-direction: column; gap: 10px; flex: 1">
<div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; font-size: 12px">
<span style="padding: 5px 10px; border-radius: var(--radius-pill, 999px); border: 1px solid rgba(255, 255, 255, 0.45); background: rgba(255, 255, 255, 0.08)">${item.catLabel}</span>
<span style="color: rgba(255, 255, 255, 0.86)">${item.group}</span>
</div>
<h3 style="margin: 4px 0 0; font-size: 20px; font-weight: 600; letter-spacing: 0.03em; text-transform: uppercase">${item.name}</h3>
<p style="margin: 0; font-size: 14px; line-height: 1.6; color: rgba(255, 255, 255, 0.88)">${item.desc}</p>
<div style="margin-top: auto; padding-top: 10px; display: flex; flex-wrap: wrap; gap: 8px">
<a href="${item.detailUrl}" style="display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 16px; border-radius: var(--radius-pill, 999px); background: var(--c-white, #FFFFFF); color: var(--c-navy, #061235); text-decoration: none; font-size: 14px; font-weight: 600">Chi tiết
<svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg></a>
<a href="${item.demoUrl}" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 16px; border-radius: var(--radius-pill, 999px); border: 1px solid rgba(255, 255, 255, 0.55); color: var(--c-white, #FFFFFF); text-decoration: none; font-size: 14px">${item.demoLabel}</a>
<a href="${item.repoUrl}" target="_blank" rel="noopener" aria-label="Mã nguồn trên GitHub" style="width: 44px; height: 44px; border-radius: var(--radius-pill, 999px); border: 1px solid rgba(255, 255, 255, 0.55); color: var(--c-white, #FFFFFF); display: grid; place-items: center">
<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="5" r="2.5"></circle><circle cx="6" cy="19" r="2.5"></circle><circle cx="18" cy="7" r="2.5"></circle><path d="M6 7.5v9"></path><path d="M18 9.5a6 6 0 0 1-6 6H8.5"></path></svg></a>
</div>
</div>
</article>`;
}
