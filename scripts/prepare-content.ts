import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { catalog } from '../content/catalog';
import { projectContent, validateContent } from './content';
import type { Media } from '../content/types';
import {localizeEnglish} from './localize';
export async function prepareContent(requireMedia=false) {
  let media:Media[]=[];
  try {media=JSON.parse(await readFile('content/media.json','utf8'));} catch(e) {if((e as NodeJS.ErrnoException).code!=='ENOENT') throw e;}
  const asOf=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const content={...catalog,asOf,media}; validateContent(content,requireMedia);
  const zh=projectContent(content);const projected={zh,en:localizeEnglish(zh)}; await mkdir('.local/generated',{recursive:true});
  await writeFile('.local/generated/public-content.json',JSON.stringify(projected,null,2)+'\n');
  return projected;
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  const data=await prepareContent(); console.log(`公開內容：繁中／English，各 ${data.zh.events.length} 篇活動交流`);
}
