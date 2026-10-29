import test from 'node:test';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
import {catalog} from '../content/catalog';
import {getRoutes,resolveRoute} from '../src/lib/routes';
import {metadata} from '../scripts/metadata';

test('所有正式頁的 canonical、分享圖片與描述依同一網站根網址產生',()=>{
 // 僅供函式測試，不建置或發布此保留測試網域。
 for(const base of ['', '/UVRDC_web']){
  const site='https://metadata.fixture.invalid'+base;
  const titles=new Set<string>();
  for(const route of getRoutes(catalog)){
   const m=metadata(route,catalog,{site,production:true});const $=load(m.head);
   assert.ok(!titles.has(m.title));titles.add(m.title);
   assert.equal($('link[rel=canonical]').attr('href'),site+route.path);
   assert.equal($('meta[property="og:url"]').attr('content'),site+route.path);
   const image=route.kind==='event'?catalog.events.find(e=>e.slug===route.slug)?.image:'assets/event-forum-2024-main.webp';
   assert.equal($('meta[property="og:image"]').attr('content'),image?site+'/'+image:undefined);
   assert.equal($('meta[name=description]').attr('content'),route.description);
   assert.equal($('meta[name=robots]').attr('content'),'index,follow');
  }
 }
});
test('預覽和 404 永不使用正式 canonical、404 不索引',()=>{
 for(const production of [false,true]){
  const $=load(metadata(resolveRoute('/missing/',catalog),catalog,{production,site:'https://metadata.fixture.invalid'}).head);
  assert.equal($('link[rel=canonical]').length,0);assert.equal($('meta[name=robots]').attr('content'),'noindex,nofollow');
 }
 const $=load(metadata(getRoutes(catalog)[0],catalog,{production:false,site:''}).head);
 assert.equal($('link[rel=canonical]').length,0);
});
