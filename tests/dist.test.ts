import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp,writeFile,rm,mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkDist,hasRetiredResearchLink } from '../scripts/dist';

test('官方外部研究資源可連結，站內撤下的研究路徑仍受阻擋',()=>{
 assert.equal(hasRetiredResearchLink('<a href="https://seagrant.uog.edu/research/">Official research</a>'),false);
 for(const href of ['/research/','/UVRDC_web/research/','/UVRDC_web/en/research/','research/localization-integrity/'])assert.equal(hasRetiredResearchLink(`<a href="${href}">Retired</a>`),true);
});
import { projectContent } from '../scripts/content';
import { catalog } from '../content/catalog';
import { releaseConfig } from '../scripts/build';
test('未選定檔案不能作為成功產物發布',async()=>{const dir=await mkdtemp(join(tmpdir(),'uvrdc-artifact-'));try{await writeFile(join(dir,'private.docx'),'fixture');await assert.rejects(()=>checkDist(dir,projectContent(catalog),{base:'/',production:false,site:''}),/不允許的發布檔案/);}finally{await rm(dir,{recursive:true,force:true});}});
test('放入 assets 的未選定 JavaScript 也不能冒充建置輸出',async()=>{const dir=await mkdtemp(join(tmpdir(),'uvrdc-assets-'));try{await mkdir(join(dir,'assets'));await writeFile(join(dir,'assets','unselected.js'),'console.log("fixture")');await assert.rejects(()=>checkDist(dir,projectContent(catalog),{base:'/',production:false,site:''}),/未選定的素材/);}finally{await rm(dir,{recursive:true,force:true});}});
test('撤下的研究 HTML 不得混入產物',async()=>{const dir=await mkdtemp(join(tmpdir(),'uvrdc-retired-'));try{await mkdir(join(dir,'research'));await writeFile(join(dir,'research','index.html'),'<main>Retired fixture</main>');await assert.rejects(()=>checkDist(dir,projectContent(catalog),{base:'/',production:false,site:''}),/未登錄的公開路由/);}finally{await rm(dir,{recursive:true,force:true});}});
test('正式發布需要真實網址及相符 base',()=>{assert.throws(()=>releaseConfig({BUILD_MODE:'production'}),/SITE_URL/);assert.throws(()=>releaseConfig({BUILD_MODE:'production',SITE_URL:'https://example.com'}),/有效/);assert.throws(()=>releaseConfig({BUILD_MODE:'production',SITE_URL:'https://uvrdc.ntu.edu.tw/other/',BASE_PATH:'/center/'}),/不一致/);assert.equal(releaseConfig({BUILD_MODE:'preview'}).production,false);});
