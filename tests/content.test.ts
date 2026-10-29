import test from 'node:test';
import assert from 'node:assert/strict';
import { catalog } from '../content/catalog';
import { validateContent, projectContent } from '../scripts/content';
import { normalizeBase, withBase, localPath } from '../src/lib/paths';
import { getRoutes,resolveRoute } from '../src/lib/routes';
const fresh=()=>structuredClone(catalog);

test('諮詢名冊逐欄投影，聯絡資料與內部簽核不公開',()=>{
 const data=fresh();
 Object.assign(data.advisoryMembers[0],{email:'PRIVATE_ADVISOR_CONTACT_MARKER',address:'PRIVATE_ADVISOR_CONTACT_MARKER',approval:'PRIVATE_ADVISOR_CONTACT_MARKER'});
 Object.assign(data.director.experience[0],{editorialNotes:'PRIVATE_ADVISOR_CONTACT_MARKER'});
 const out=projectContent(data);
 assert.doesNotMatch(JSON.stringify(out),/PRIVATE_ADVISOR_CONTACT_MARKER/);
 assert.equal(out.advisoryMembers.length,16);
 assert.equal(out.advisoryMembers.filter(m=>m.termEnd&&m.termEnd<out.asOf).length,2);
 for(const member of out.advisoryMembers)assert.ok(member.sourceIds.every(id=>out.sources.some(source=>source.id===id)));
});

test('諮詢委員錯誤任期、重複識別與缺少來源拒絕建置',()=>{
 const data=fresh();data.advisoryMembers[0].termEnd='2026-02-30';assert.throws(()=>validateContent(data),/任期日期/);
 delete data.advisoryMembers[0].termEnd;data.advisoryMembers[1].id=data.advisoryMembers[0].id;assert.throws(()=>validateContent(data),/唯一識別/);
 const missing=fresh();missing.advisoryMembers[0].sourceIds=[];assert.throws(()=>validateContent(missing),/來源/);
});
test('有效公開內容可驗證，七主類別、兩子頁與八活動具有獨立路由',()=>{const c=projectContent(fresh());validateContent(c);assert.equal(c.events.length,8);const routes=getRoutes(c);assert.equal(routes.length,17);assert.equal(new Set(routes.map(r=>r.path)).size,17);assert.ok(c.events.every(e=>e.sections.length>=4));});
test('公開內容遺失來源會失敗',()=>{const c=fresh();c.events[0].sourceIds=[];assert.throws(()=>validateContent(c),/來源/);});
test('不存在的日曆日期與日期區間會失敗',()=>{const c=fresh();c.events[0].date='2026-02-30';assert.throws(()=>validateContent(c),/日期/);});
test('重複網址識別會失敗',()=>{const c=fresh();c.events[1].slug=c.events[0].slug;assert.throws(()=>validateContent(c),/slug/);});
test('草稿、舊研究資料與非公開欄位不進入公開投影',()=>{
 const c=Object.assign(fresh(),{research:[{title:'RETIRED_RESEARCH_MARKER'}],papers:[{title:'RETIRED_RESEARCH_MARKER'}],patents:[{title:'RETIRED_RESEARCH_MARKER'}]});
 c.events.push({...c.events[0],slug:'draft-event',publicationState:'draft',title:'SECRET_DRAFT_MARKER'});
 c.events[0].editorialNotes='PRIVATE_NOTE_MARKER';c.sources.push({id:'UNUSED_PRIVATE_SOURCE',title:'PRIVATE_NOTE_MARKER',version:'fixture',accessedAt:'2026-10-27'});
 const out=projectContent(c);assert.equal(out.events.length,8);assert.doesNotMatch(JSON.stringify(out),/SECRET_DRAFT_MARKER|PRIVATE_NOTE_MARKER|RETIRED_RESEARCH_MARKER|editorialNotes|UNUSED_PRIVATE_SOURCE/);
 assert.equal('research' in out,false);assert.equal('papers' in out,false);assert.equal('patents' in out,false);
});
test('公開內容不接受受限 Drive URL',()=>{const c=fresh();c.events[0].resources=[{label:'不可公開',url:'https://drive.google.com/file/d/private/view'}];assert.throws(()=>validateContent(c),/公開資源|受限/);});
test('歷史議程與主任報告角色保留，無效類型拒絕公開',()=>{
 const out=projectContent(fresh()),event=out.events.find(e=>e.slug==='ai-law-generative-ai-conference-2024')!;
 assert.equal(event.recordType,'program');assert.equal(event.participation,'speaker');assert.equal(event.agenda[5].time,'10:55–12:20');
 const wrongRole=fresh();Object.assign(wrongRole.events[0],{participation:'unknown'});assert.throws(()=>validateContent(wrongRole),/角色或紀錄類型/);
 const wrongType=fresh();Object.assign(wrongType.events[0],{recordType:'confirmed-result'});assert.throws(()=>validateContent(wrongType),/角色或紀錄類型/);
});
test('新增有效活動會進入同一條路由與消息投影',()=>{const c=fresh();c.events.push({...c.events[0],slug:'new-event-example',title:'維護範例活動',date:'2026-10-27',endDate:'2026-10-27'});const out=projectContent(c);assert.equal(out.events[0].slug,'new-event-example');assert.equal(out.events.length,9);assert.ok(getRoutes(out).some(r=>r.path==='/news/new-event-example/'));});
test('已撤下的研究列表與詳情不再有可用路由',()=>{for(const path of ['/research/','/research/rain-fog-perception/','/research/localization-integrity/'])assert.equal(resolveRoute(path,projectContent(fresh())).kind,'not-found');});
test('根路徑及子路徑使用一致的連結與網址解析',()=>{assert.equal(normalizeBase('/UVRDC_web'),'/UVRDC_web/');assert.equal(withBase('/news/university-of-guam-exchange-2026/','/UVRDC_web/'),'/UVRDC_web/news/university-of-guam-exchange-2026/');assert.equal(localPath('/UVRDC_web/news/','/UVRDC_web/'),'/news/');assert.equal(localPath('/news/','/UVRDC_web/'),'/404.html');assert.equal(withBase('/404.html','/'),'/404.html');assert.throws(()=>normalizeBase('/../private'));});
