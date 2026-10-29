import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, extname, relative } from 'node:path';
import { load } from 'cheerio';
import type { SiteData } from '../content/types';
import type {PublicContent} from '../content/localization';
import { getRoutes,getAllRoutes,notFoundRoute } from '../src/lib/routes';
import { withBase } from '../src/lib/paths';
export function hasRetiredResearchLink(text:string){return /(?:href|src)=["'](?!https?:\/\/)(?:[^"']*\/)?research\//.test(text);}
export async function filesUnder(dir:string):Promise<string[]>{const entries=await readdir(dir,{withFileTypes:true});return(await Promise.all(entries.map(e=>e.isDirectory()?filesUnder(resolve(dir,e.name)):Promise.resolve([resolve(dir,e.name)])))).flat();}
export async function checkDist(dir:string,input:SiteData|PublicContent,config:{base:string;production:boolean;site:string;generatedAssets?:string[]}){
 const bilingual='zh' in input,data=bilingual?input.zh:input;
 const pageRoutes=bilingual?getAllRoutes(input):getRoutes(data);
 const allRoutes=[...pageRoutes,notFoundRoute(),...(bilingual?[notFoundRoute('en')]:[])];
 const root=resolve(dir),files=await filesUnder(root),allowed=new Set([...data.media.map(m=>m.file),...config.generatedAssets||[]]);const errors:string[]=[];
 const routeFiles=new Set(allRoutes.map(r=>r.kind==='not-found'?r.path.slice(1):r.path.slice(1)+'index.html'));
 for(const file of files){
  const name=relative(root,file).replaceAll('\\','/');
  if(name.startsWith('assets/')&&!allowed.has(name))errors.push(`未選定的素材: ${name}`);
  if(!/^(assets\/[a-zA-Z0-9_.-]+\.(js|css|webp|avif|png|svg)|(?:[a-z0-9-]+\/)*index\.html|(?:en\/)?404\.html|robots\.txt|sitemap\.xml|THIRD_PARTY_NOTICES\.txt)$/.test(name))errors.push(`不允許的發布檔案: ${name}`);
  if(name.endsWith('.html')&&!routeFiles.has(name))errors.push(`未登錄的公開路由: ${name}`);
  if(/\.(html|js|css|txt|xml)$/.test(file)){
   const text=await readFile(file,'utf8');if(/drive\.google\.com|docs\.google\.com|oaiusercontent|sediment:|SECRET_DRAFT_MARKER|PRIVATE_NOTE_MARKER|RETIRED_RESEARCH_MARKER|STRICTLY CONFIDENTIAL/.test(text))errors.push(`產物含非公開資訊: ${name}`);
   if(hasRetiredResearchLink(text))errors.push(`產物仍含撤下的研究連結: ${name}`);
  }
 }
 if(errors.length)throw new Error(errors.join('\n'));
 const routes=allRoutes.map(r=>r.path);
 const titles=new Set<string>();
 for(const route of routes){
  const registered=allRoutes.find(r=>r.path===route)!;
  const file=registered.kind==='not-found'?resolve(root,`.${route}`):resolve(root,`.${route}`,'index.html');const $=load(await readFile(file,'utf8'));
  const title=$('title').text();if(!title||titles.has(title))errors.push(`題名不唯一: ${route}`);titles.add(title);
  if($('h1').length!==1||$('main').text().trim().length<(registered.kind==='not-found'?20:40))errors.push(`缺少靜態正文: ${route}`);
  if($('html').attr('lang')!==registered.locale||!$('meta[name=description]').attr('content'))errors.push(`缺少頁面資訊: ${route}`);
  if(config.production&&registered.kind!=='not-found'&&$('link[rel=canonical]').attr('href')!==config.site+route)errors.push(`canonical 錯誤: ${route}`);
  if(!config.production&&$('link[rel=canonical]').length)errors.push(`預覽不可輸出正式 canonical: ${route}`);
  for(const el of $('a[href],img[src],script[src],link[href]').toArray()){
   const url=$(el).attr('href')||$(el).attr('src')||'';
   if(!url||/^(https?:|mailto:|tel:|#|data:)/.test(url))continue;
   if(!url.startsWith(config.base)){errors.push(`連結離開 base: ${route} ${url}`);continue;}
   const local=decodeURIComponent(url.slice(config.base.length).split(/[?#]/)[0]);let target=resolve(root,local||'.');
   if(target!==root&&!target.startsWith(root+'/')&&!target.startsWith(root+'\\')){errors.push(`越界路徑: ${url}`);continue;}
   if(!extname(target))target=resolve(target,'index.html');
   try{await stat(target);}catch{errors.push(`連結或資源不存在: ${route} ${url}`);}
  }
 }
 if(errors.length)throw new Error(errors.join('\n'));
 console.log(`產物檢查通過：${routes.length} 條路徑、${files.length} 個檔案，base=${config.base}`);
}
