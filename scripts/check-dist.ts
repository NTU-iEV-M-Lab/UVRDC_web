import { readFile } from 'node:fs/promises';
import { checkDist } from './dist';
const data=JSON.parse(await readFile('.local/generated/public-content.json','utf8'));
const config=JSON.parse(await readFile('.local/generated/build-info.json','utf8'));
await checkDist('dist',data,config);
