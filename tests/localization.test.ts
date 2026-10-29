import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog} from '../content/catalog';
import {projectContent} from '../scripts/content';
import {localizeEnglish} from '../scripts/localize';
import {englishCenter} from '../content/en/center';
import {englishEvents} from '../content/en/events';
import {getAllRoutes,getRoutes,resolveRoute} from '../src/lib/routes';
import {languagePath,contentPath} from '../src/lib/locale';
import {metadata} from '../scripts/metadata';
import {load} from 'cheerio';

test('中英名冊共用識別、任期與來源，缺少委員翻譯拒絕建置',()=>{
 const zh=projectContent(catalog),en=localizeEnglish(zh);
 for(const member of zh.advisoryMembers){
  const translated=en.advisoryMembers.find(m=>m.id===member.id)!;
  assert.equal(translated.termEnd,member.termEnd);assert.deepEqual(translated.sourceIds,member.sourceIds);
  assert.doesNotMatch(translated.name+translated.affiliation+(translated.note||''),/\p{Script=Han}/u);
 }
 const missing=structuredClone(englishCenter);delete missing.advisoryMembers[zh.advisoryMembers[0].id];
 assert.throws(()=>localizeEnglish(zh,missing),/Missing English advisory member/);
 const missingNote=structuredClone(englishCenter);delete missingNote.advisoryMembers['ho-shu-ping'].note;
 assert.throws(()=>localizeEnglish(zh,missingNote),/Missing English advisory note/);
 const extra=structuredClone(englishCenter);Object.assign(extra.advisoryMembers['xiao-xuewen'],{termEnd:'2099-12-31',sourceIds:['UNTRUSTED']});
 const protectedMember=localizeEnglish(zh,extra).advisoryMembers.find(m=>m.id==='xiao-xuewen')!;
 assert.equal(protectedMember.termEnd,'2026-06-30');assert.deepEqual(protectedMember.sourceIds,['S32']);
});

test('中英共用日期、照片、slug與來源，產生34個內容網址',()=>{
 const zh=projectContent(catalog),en=localizeEnglish(zh);
 assert.equal(getAllRoutes({zh,en}).length,34);
 for(const original of zh.events){
  const translated=en.events.find(e=>e.slug===original.slug)!;
  for(const field of ['date','endDate','image','sourceIds','gallery','participation','recordType'] as const)assert.deepEqual(translated[field],original[field]);
  assert.equal(translated.sections.length,original.sections.length);original.agenda.forEach((a,i)=>{if(/^\d/.test(a.time))assert.equal(translated.agenda[i].time,a.time);});
  assert.doesNotMatch(JSON.stringify({title:translated.title,sections:translated.sections,agenda:translated.agenda}),/\p{Script=Han}/u);
 }
});
test('公開活動缺譯、遺漏議程或留有中文都拒絕建置',()=>{
 const zh=projectContent(catalog),missing=structuredClone(englishEvents);delete missing[zh.events[0].slug];
 assert.throws(()=>localizeEnglish(zh,englishCenter,missing),/Missing English event/);
 const agenda=structuredClone(englishEvents);agenda[zh.events.find(e=>e.agenda.length)!.slug].agenda.pop();
 assert.throws(()=>localizeEnglish(zh,englishCenter,agenda),/structure mismatch/);
 const untranslated=structuredClone(englishCenter);untranslated.facilities.description='尚未翻譯';
 assert.throws(()=>localizeEnglish(zh,untranslated),/untranslated English/);
 const missingExperience=structuredClone(englishCenter);missingExperience.director.experience.pop();
 assert.throws(()=>localizeEnglish(zh,missingExperience),/director experience/);
 const missingParagraph=structuredClone(englishCenter);missingParagraph.director.experience[1].paragraphs.pop();
 assert.throws(()=>localizeEnglish(zh,missingParagraph),/director experience paragraphs/);
});
test('語言切換對應同頁並保留片段，舊英文研究網址404',()=>{
 const en=localizeEnglish(projectContent(catalog));
 assert.equal(languagePath('/news/university-of-guam-exchange-2026/#gallery','en'),'/en/news/university-of-guam-exchange-2026/#gallery');
 assert.equal(languagePath('/en/about/','zh-Hant'),'/about/');assert.equal(contentPath('/en/'),'/');
 assert.equal(resolveRoute('/en/research/',en).kind,'not-found');
});
test('正式雙語metadata有各自canonical、互指hreflang與正確locale',()=>{
 const zh=projectContent(catalog),en=localizeEnglish(zh);
 for(const base of ['', '/UVRDC_web'])for(const route of getAllRoutes({zh,en})){
  const site='https://metadata.fixture.invalid'+base;
  const $=load(metadata(route,route.locale==='en'?en:zh,{production:true,site}).head);
  assert.equal($('link[rel=canonical]').attr('href'),site+route.path);
  for(const locale of ['zh-Hant','en'] as const)assert.equal($(`link[hreflang="${locale}"]`).attr('href'),site+languagePath(route.path,locale));
  assert.equal($('meta[property="og:locale"]').attr('content'),route.locale==='en'?'en_US':'zh_TW');
 }
});
