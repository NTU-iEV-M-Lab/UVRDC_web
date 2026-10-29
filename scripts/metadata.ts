import type { SiteData } from '../content/types';
import type { Route } from '../src/lib/routes';
import {contentPath,languagePath} from '../src/lib/locale';
export const escapeHtml=(v:string)=>v.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function metadata(route:Route,data:SiteData,config:{production:boolean;site:string}){
 const title=contentPath(route.path)==='/'?data.institution.name:`${route.title} | ${data.institution.shortName}`;
 const indexable=config.production&&route.kind!=='not-found';
 let head=`<meta name="description" content="${escapeHtml(route.description)}" /><meta name="robots" content="${indexable?'index,follow':'noindex,nofollow'}" /><meta property="og:locale" content="${route.locale==='en'?'en_US':'zh_TW'}" /><meta property="og:locale:alternate" content="${route.locale==='en'?'zh_TW':'en_US'}" /><meta property="og:type" content="${route.kind==='page'?'website':'article'}" /><meta property="og:title" content="${escapeHtml(title)}" /><meta property="og:description" content="${escapeHtml(route.description)}" />`;
 if(indexable){
  const url=escapeHtml(config.site+route.path);
  head+=`<link rel="canonical" href="${url}" /><meta property="og:url" content="${url}" />`;
  for(const language of ['zh-Hant','en'] as const)head+=`<link rel="alternate" hreflang="${language}" href="${escapeHtml(config.site+languagePath(route.path,language))}" />`;
  head+=`<link rel="alternate" hreflang="x-default" href="${escapeHtml(config.site+languagePath(route.path,'zh-Hant'))}" />`;
  const image=route.kind==='event'?data.events.find(e=>e.slug===route.slug)?.image:'assets/event-forum-2024-main.webp';
  if(image)head+=`<meta property="og:image" content="${escapeHtml(config.site+'/'+image)}" />`;
 }
 return {title:escapeHtml(title),head};
}
