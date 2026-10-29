import { build } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';
import { prepareContent } from './prepare-content';
import { getAllRoutes,notFoundRoute } from '../src/lib/routes';
import { normalizeBase, withBase } from '../src/lib/paths';
import { checkDist } from './dist';
import { metadata,escapeHtml as escape } from './metadata';
export function releaseConfig(env:NodeJS.ProcessEnv) {
 const base=normalizeBase(env.BASE_PATH||'/'); const production=env.BUILD_MODE==='production';
 const site=(env.SITE_URL||'').replace(/\/$/,'');
 if(production){
   if(!site)throw new Error('正式發布需要 SITE_URL');
   const url=new URL(site);if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash||/localhost|\.test$|\.invalid$|\.example$|example\.com$/i.test(url.hostname))throw new Error('正式發布需要有效 HTTPS 網址');
   if(normalizeBase(url.pathname)!==base)throw new Error('SITE_URL 與 BASE_PATH 不一致');
 }
 return {base,production,site};
}
export async function buildSite(){
 const {base,production,site}=releaseConfig(process.env);
 const data=await prepareContent(true);
 if(production&&!Object.values(data.zh.contact).some(Boolean))throw new Error('正式發布前需要至少一個有效的公開聯絡入口');
 const client=await build({base});
 const outputs=Array.isArray(client)?client:[client];
 const generatedAssets=outputs.flatMap(result=>'output' in result?result.output.map(file=>file.fileName):[]).filter(name=>/\.(js|css)$/.test(name));
 await build({base,build:{ssr:'src/entry-server.tsx',outDir:'.local/ssg',emptyOutDir:true}});
 const {render}=await import(pathToFileURL(resolve('.local/ssg/entry-server.js')).href);
 const template=await readFile('dist/index.html','utf8');
 const routes=getAllRoutes(data);
 for(const route of [...routes,notFoundRoute(),notFoundRoute('en')]){
  const {title,head}=metadata(route,data[route.locale==='en'?'en':'zh'],{production,site});
  const html=template.replace('<html lang="zh-Hant">',`<html lang="${route.locale}">`).replace('<div id="root">',`<div id="root" data-rendered-path="${escape(route.path)}">`).replace(/<title>.*?<\/title>/s,`<title>${title}</title>`).replace('<!--site-head-->',head).replace('<!--site-content-->',()=>render(route.path,base));
  const file=route.kind==='not-found'?resolve('dist',`.${route.path}`):resolve('dist',`.${route.path}`,'index.html');
  await mkdir(dirname(file),{recursive:true});await writeFile(file,html);
 }
 await writeFile('dist/robots.txt',production?`User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n');
 if(production)await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(r=>`<url><loc>${escape(site+r.path)}</loc></url>`).join('')}</urlset>`);
 await writeFile('.local/generated/build-info.json',JSON.stringify({base,production,site,generatedAssets,routes:routes.map(r=>r.path)},null,2));
 await checkDist('dist',data,{base,production,site,generatedAssets});
 console.log(`靜態建置完成：${routes.length} 個內容頁 + 中英 404；${production?'正式':'預覽'}模式；base=${base}`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await buildSite();
