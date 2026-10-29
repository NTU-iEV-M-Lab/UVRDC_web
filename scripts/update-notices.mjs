import {readFile,readdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

// 維護者在更新依賴後手動執行。一般安裝與建置不需要網路取回授權。
const lock=JSON.parse(await readFile('package-lock.json','utf8'));
const notices=[`THIRD-PARTY SOFTWARE NOTICES

This file preserves licenses for runtime packages included by this project.
Brand marks, research figures and event photographs retain their respective
owners' rights and are not licensed under these software licenses.
`];
for(const [path,entry] of Object.entries(lock.packages)){
  if(!path||entry.dev||entry.link)continue;
  const dir=resolve(path),pkg=JSON.parse(await readFile(resolve(dir,'package.json'),'utf8'));
  const names=(await readdir(dir)).filter(n=>/^licen[sc]e(?:\.|$)/i.test(n));
  notices.push(`\n========== ${pkg.name} ${pkg.version} (${pkg.license||'see license'}) ==========\n`);
  for(const name of names)notices.push(await readFile(resolve(dir,name),'utf8'));
  if(!names.length){
    const repo=typeof pkg.repository==='string'?pkg.repository:pkg.repository?.url;
    const match=repo?.match(/github\.com[/:]([^/]+\/[^/#]+?)(?:\.git)?$/);
    if(!match)throw new Error(`找不到 ${pkg.name} 的授權檔或官方儲存庫。`);
    let license='';
    for(const branch of [`v${pkg.version}`,'master','main']){
      const url=`https://raw.githubusercontent.com/${match[1]}/${branch}/LICENSE`;
      const result=await fetch(url);if(result.ok){license=await result.text();break;}
    }
    if(!license)throw new Error(`請人工補齊 ${pkg.name} 授權`);
    notices.push(license);
  }
}
const response=await fetch('https://raw.githubusercontent.com/shadcn-ui/ui/main/LICENSE.md');
if(!response.ok)throw new Error('無法讀取 shadcn/ui 授權');
notices.push('\n========== shadcn/ui Button adaptation ==========\n'+await response.text());
await writeFile('public/THIRD_PARTY_NOTICES.txt',notices.join('\n'));
console.log('已更新 public/THIRD_PARTY_NOTICES.txt');
