import { createServer } from 'node:http';
import { readFile,stat } from 'node:fs/promises';
import { resolve,extname } from 'node:path';
import { normalizeBase } from '../src/lib/paths';
import {localeFromPath} from '../src/lib/locale';
let base=process.env.BASE_PATH||'/';try{base=JSON.parse(await readFile('.local/generated/build-info.json','utf8')).base;}catch{}
base=normalizeBase(base);const root=resolve('dist');const port=Number(process.env.PORT||4173);
const types:Record<string,string>={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.png':'image/png','.avif':'image/avif','.svg':'image/svg+xml','.xml':'application/xml','.txt':'text/plain; charset=utf-8'};
const server=createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url||'/', 'http://localhost').pathname);
  if(base!=='/'&&pathname===base.slice(0,-1)){res.writeHead(301,{Location:base});res.end();return;}
  if(!pathname.startsWith(base))throw new Error('outside base');
  let file=resolve(root,pathname.slice(base.length));if(file!==root&&!file.startsWith(root+'/')&&!file.startsWith(root+'\\'))throw new Error('outside root');
  if((await stat(file)).isDirectory())file=resolve(file,'index.html');
  res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'});res.end(await readFile(file));
 }catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});let language='zh-Hant';try{const path=new URL(req.url||'/','http://localhost').pathname;language=localeFromPath('/'+path.slice(base.length));}catch{}res.end(await readFile(resolve(root,language==='en'?'en/404.html':'404.html')).catch(()=>Buffer.from('Not found')));}
});
server.listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}${base} (static; no SPA fallback)`));
for(const signal of ['SIGINT','SIGTERM'] as const)process.on(signal,()=>server.close(()=>process.exit(0)));
