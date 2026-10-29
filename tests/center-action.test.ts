import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog} from '../content/catalog';
import {summarizeCenterAction,centerActionGroups} from '../src/lib/center-action';

test('首頁統計涵蓋八筆歷史紀錄，六場中心主辦且每組有對應依據',()=>{
 const summary=summarizeCenterAction(catalog.events,'2026-10-28');
 assert.equal(summary.recordCount,8);assert.equal(summary.organizedCount,6);
 assert.equal(summary.firstYear,'2024');assert.equal(summary.lastYear,'2026');
 const references=centerActionGroups.flatMap(group=>[...group.slugs]);
 assert.equal(new Set(references).size,8);
 for(const slug of references)assert.ok(summary.records.some(event=>event.slug===slug),slug);
});
test('首頁實績計數排除草稿、未來與當日未結束活動，議程不增加主辦數',()=>{
 const base=catalog.events.find(e=>e.participation==='host')!;
 const summary=summarizeCenterAction([...catalog.events,
  {...base,slug:'draft',publicationState:'draft'},
  {...base,slug:'future',date:'2030-01-01',endDate:'2030-01-01'},
  {...base,slug:'today',date:'2026-10-28',endDate:'2026-10-28'},
  {...base,slug:'program-only',recordType:'program'},
 ],'2026-10-28');
 assert.equal(summary.organizedCount,6);assert.equal(summary.recordCount,9);
 assert.equal(summary.lastYear,'2026');
 const empty=summarizeCenterAction(catalog.events,'2020-01-01');
 assert.equal(empty.recordCount,0);assert.equal(empty.firstYear,null);assert.equal(empty.lastYear,null);
});
