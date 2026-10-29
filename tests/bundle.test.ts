import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'vite';
import { catalog } from '../content/catalog';
import { projectContent } from '../scripts/content';
import {localizeEnglish} from '../scripts/localize';

test('實際 React client bundle 不包含草稿與編輯註記',async()=>{
  const input=structuredClone(catalog);
  Object.assign(input.advisoryMembers[0],{email:'PRIVATE_ADVISOR_CONTACT_MARKER',address:'PRIVATE_ADVISOR_CONTACT_MARKER'});
  input.events.push({...input.events[0],slug:'boundary-test-draft',title:'SECRET_DRAFT_MARKER',publicationState:'draft'});
  input.events[0].editorialNotes='PRIVATE_NOTE_MARKER';
  Object.assign(input,{research:[{title:'RETIRED_RESEARCH_MARKER'}],papers:[{title:'RETIRED_RESEARCH_MARKER'}],patents:[{title:'RETIRED_RESEARCH_MARKER'}]});
  const zh=projectContent(input);const projected=JSON.stringify({zh,en:localizeEnglish(zh)});
  let injected=false;
  const result=await build({logLevel:'silent',plugins:[{
    name:'public-content-boundary-fixture',enforce:'pre',
    load(id){if(id.replaceAll('\\','/').endsWith('/.local/generated/public-content.json')){injected=true;return projected;}},
  }],build:{write:false,minify:true}});
  const outputs=Array.isArray(result)?result:[result];
  const text=outputs.flatMap(r=>'output' in r?r.output.map(o=>o.type==='chunk'?o.code:String(o.source)):[]).join('\n');
  assert.equal(injected,true,'必須確實以含草稿的來源投影替換 client 資料');
  assert.match(text,/國際無人載具科技及應用論壇/);
  assert.match(text,/University of Guam Exchange Visit/);
  assert.doesNotMatch(text,/PRIVATE_ADVISOR_CONTACT_MARKER|SECRET_DRAFT_MARKER|PRIVATE_NOTE_MARKER|RETIRED_RESEARCH_MARKER|boundary-test-draft|editorialNotes|rain-fog-perception/);
});
