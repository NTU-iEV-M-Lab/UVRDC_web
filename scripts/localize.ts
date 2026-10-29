import type {SiteData,News} from '../content/types';
import type {CenterTranslation,EventTranslation} from '../content/localization';
import {englishCenter} from '../content/en/center';
import {englishEvents} from '../content/en/events';
import {translate} from '../src/lib/i18n';
import {projectContent} from './content';
function sameLength(a:unknown[],b:unknown[]|undefined,label:string){if(!b||a.length!==b.length)throw new Error(`English translation structure mismatch: ${label}`);}
function englishText(value:unknown,label:string){if(value==null||typeof value==='string'&&(!value.trim()||/\p{Script=Han}/u.test(value)))throw new Error(`Missing or untranslated English content: ${label}`);if(Array.isArray(value))value.forEach((v,i)=>englishText(v,`${label}[${i}]`));else if(value&&typeof value==='object')Object.entries(value).forEach(([k,v])=>englishText(v,`${label}.${k}`));}
export function localizeEnglish(zh:SiteData,center:CenterTranslation=englishCenter,eventTranslations:Record<string,EventTranslation>=englishEvents):SiteData{
 englishText(center,'center');
 sameLength(zh.colleges,center.colleges,'colleges');sameLength(zh.missions,center.missions,'missions');sameLength(zh.courses,center.courses,'courses');sameLength(zh.collaborations,center.collaborations,'collaborations');sameLength(zh.director.resources,center.director.resourceLabels,'director resources');
 sameLength(zh.director.experience,center.director.experience,'director experience');zh.director.experience.forEach((section,index)=>sameLength(section.paragraphs,center.director.experience[index]?.paragraphs,`director experience paragraphs ${index}`));
 zh.courses.forEach((course,index)=>sameLength(course.focus,center.courses[index]?.focus,`course focus ${index}`));
 const events=zh.events.map((event):News=>{
  const en=eventTranslations[event.slug];if(!en)throw new Error(`Missing English event translation: ${event.slug}`);englishText(en,event.slug);
  sameLength(event.sections,en.sections,`${event.slug} sections`);event.sections.forEach((s,i)=>sameLength(s.paragraphs,en.sections[i]?.paragraphs,`${event.slug} paragraphs ${i}`));
  sameLength(event.agenda,en.agenda,`${event.slug} agenda`);sameLength(event.resources,en.resourceLabels,`${event.slug} resources`);sameLength(event.topics,en.topics,`${event.slug} topics`);
  return {...event,...en,englishTitle:undefined,category:translate('en',event.category),
   agenda:event.agenda.map((item,i)=>({...item,...en.agenda[i],time:translate('en',item.time)})),
   resources:event.resources.map((resource,i)=>({...resource,label:en.resourceLabels[i]})),
  };
 });
 const media=zh.media.map(item=>{const en=center.media[item.file];if(!en)throw new Error(`Missing English media translation: ${item.file}`);return {...item,...en};});
 const advisoryMembers=zh.advisoryMembers.map(member=>{
  const en=center.advisoryMembers[member.id];if(!en)throw new Error(`Missing English advisory member: ${member.id}`);
  if(member.note&&!en.note?.trim())throw new Error(`Missing English advisory note: ${member.id}`);
  return {...member,name:en.name,affiliation:en.affiliation,...en.note?{note:en.note}:{note:undefined}};
 });
 const result=projectContent({...zh,
  institution:{...zh.institution,...center.institution},
  director:{...zh.director,...center.director,resources:zh.director.resources.map((r,i)=>({...r,label:center.director.resourceLabels[i]}))},
  facilities:{...zh.facilities,...center.facilities},advisoryMembers,colleges:center.colleges,missions:center.missions,courses:center.courses,collaborations:center.collaborations,events,media,
 });
 englishText({
  institution:{name:result.institution.name,shortName:result.institution.shortName,intro:result.institution.intro,description:result.institution.description},
  director:{name:result.director.name,role:result.director.role,education:result.director.education,affiliation:result.director.affiliation,background:result.director.background,interests:result.director.interests,highlight:result.director.highlight,experience:result.director.experience,resources:result.director.resources.map(r=>r.label)},
  facilities:{provider:result.facilities.provider,description:result.facilities.description,areas:result.facilities.areas},
  events:result.events.map(e=>({title:e.title,summary:e.summary,venue:e.venue,organizers:e.organizers,centerRole:e.centerRole,format:e.format,region:e.region,topics:e.topics,sections:e.sections,agenda:e.agenda,...e.agendaLabel?{agendaLabel:e.agendaLabel}:{},resources:e.resources.map(r=>r.label)})),
  advisoryMembers:result.advisoryMembers.map(m=>({name:m.name,affiliation:m.affiliation,...m.note?{note:m.note}:{}})),
  media:result.media.map(m=>({alt:m.alt,caption:m.caption})),colleges:result.colleges,missions:result.missions,courses:result.courses,collaborations:result.collaborations,
 },'public English');
 return result;
}
