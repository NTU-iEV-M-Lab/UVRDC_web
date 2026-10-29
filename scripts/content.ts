import type {SiteData,News,AdvisoryMember} from '../content/types';
const forbidden=/drive\.google\.com|docs\.google\.com|oaiusercontent|sediment:|api[_-]?key|bearer\s|SECRET_DRAFT_MARKER|STRICTLY CONFIDENTIAL/i;
function dateValid(v:string){return /^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;}
export function validateContent(data:SiteData,requireMedia=false){
 const errors:string[]=[],sources=new Set(data.sources.map(s=>s.id)),slugs=new Set<string>();
 const sourceCheck=(ids:string[],label:string)=>{if(!ids?.length||ids.some(id=>!sources.has(id)))errors.push(`${label}: 缺少或錯誤的來源`);};
 sourceCheck(data.institution.sourceIds,'中心介紹');sourceCheck(data.director.sourceIds,'中心主任');sourceCheck(data.facilities.sourceIds,'設備與研究基礎');
 if(!data.director.name||!data.director.role||!data.director.education||!data.director.background||!data.director.interests.length)errors.push('中心主任: 必要欄位不完整');
 if(!data.director.experience?.length||data.director.experience.some(section=>!section.title?.trim()||!section.paragraphs?.length||section.paragraphs.some(paragraph=>!paragraph.trim())))errors.push('中心主任: 經歷段落不完整');
 if(!data.facilities.provider||!data.facilities.description)errors.push('設備與研究基礎: 必要欄位不完整');
 const memberIds=new Set<string>();
 for(const member of data.advisoryMembers){
  sourceCheck(member.sourceIds,'諮詢委員 '+member.id);
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(member.id)||memberIds.has(member.id)||!member.name?.trim()||!member.affiliation?.trim())errors.push('諮詢委員: 缺少姓名、單位或唯一識別');
  memberIds.add(member.id);
  if(member.termEnd&&!dateValid(member.termEnd))errors.push('諮詢委員: 任期日期錯誤');
  if(forbidden.test(JSON.stringify({name:member.name,affiliation:member.affiliation,note:member.note})))errors.push('諮詢委員: 公開欄位包含受限資訊');
 }
 for(const r of data.director.resources)if(!r.label||!/^https:\/\//.test(r.url)||forbidden.test(r.url))errors.push('中心主任: 不是可用的公開資源');
 for(const e of data.events.filter(e=>e.publicationState==='published')){
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(e.slug)||slugs.has(e.slug))errors.push(`${e.slug}: 重複或錯誤的 slug`);slugs.add(e.slug);sourceCheck(e.sourceIds,e.slug);
  if(!e.title?.trim()||!e.summary?.trim()||!dateValid(e.updatedAt))errors.push(`${e.slug}: 題名、摘要或更新日期錯誤`);
  if(!dateValid(e.date)||!dateValid(e.endDate)||e.endDate<e.date)errors.push(`${e.slug}: 活動日期錯誤`);
  if(!e.venue||!e.organizers||!e.centerRole||!e.format||!e.region||!e.topics?.length)errors.push(`${e.slug}: 活動必要欄位錯誤`);
  if(!['host','co-organizer','visitor','speaker'].includes(e.participation)||e.recordType!==undefined&&e.recordType!=='program')errors.push(`${e.slug}: 活動角色或紀錄類型錯誤`);
  if(e.sections.length<4||e.sections.some(s=>!s.title||!s.paragraphs.length||s.paragraphs.some(p=>!p.trim())))errors.push(`${e.slug}: 缺少完整內文`);
  if(e.agenda.some(a=>!a.time||!a.title||!a.description))errors.push(`${e.slug}: 議程欄位不完整`);
  for(const r of e.resources)if(!r.label||!/^https:\/\//.test(r.url)||forbidden.test(r.url))errors.push(`${e.slug}: 不是可用的公開資源`);
  if(forbidden.test(JSON.stringify({...e,editorialNotes:undefined})))errors.push(`${e.slug}: 公開內容包含受限位置或測試標記`);
  if(requireMedia)for(const file of [e.image,...e.gallery].filter(Boolean))if(!data.media.some(m=>m.file===file))errors.push(`${e.slug}: 素材未登錄 ${file}`);
 }
 for(const m of data.media)if(!sources.has(m.sourceId)||!m.alt||!m.caption||m.width<=0||m.height<=0||!/^assets\/[a-z0-9-]+\.(png|webp|avif|svg)$/.test(m.file))errors.push(`${m.file}: 素材紀錄錯誤`);
 if(errors.length)throw new Error(errors.join('\n'));
}
export function projectContent(data:SiteData):SiteData{
 validateContent(data);
 const events=data.events.filter(e=>e.publicationState==='published').map((e):News=>({
  kind:'event',slug:e.slug,title:e.title,englishTitle:e.englishTitle,summary:e.summary,publicationState:e.publicationState,updatedAt:e.updatedAt,sourceIds:e.sourceIds,
  category:e.category,international:e.international,date:e.date,endDate:e.endDate,venue:e.venue,organizers:e.organizers,format:e.format,region:e.region,centerRole:e.centerRole,participation:e.participation,recordType:e.recordType,topics:e.topics,featured:e.featured,
  image:e.image,gallery:e.gallery,sections:e.sections,agenda:e.agenda,agendaLabel:e.agendaLabel,resources:e.resources,
 })).sort((a,b)=>b.date.localeCompare(a.date));
 const advisoryMembers=data.advisoryMembers.map((member):AdvisoryMember=>({id:member.id,name:member.name,affiliation:member.affiliation,...member.note?{note:member.note}:{},...member.termEnd?{termEnd:member.termEnd}:{},sourceIds:member.sourceIds}));
 const used=new Set([...data.institution.sourceIds,...data.director.sourceIds,...data.facilities.sourceIds,...advisoryMembers.flatMap(m=>m.sourceIds),...events.flatMap(e=>e.sourceIds),...data.media.map(m=>m.sourceId)]);
 return {
  asOf:data.asOf,
  institution:{name:data.institution.name,shortName:data.institution.shortName,englishName:data.institution.englishName,intro:data.institution.intro,description:data.institution.description,foundingYear:data.institution.foundingYear,sourceIds:data.institution.sourceIds},
  contact:{email:data.contact.email,phone:data.contact.phone,address:data.contact.address,url:data.contact.url},
  director:{name:data.director.name,englishName:data.director.englishName,role:data.director.role,affiliation:data.director.affiliation,education:data.director.education,background:data.director.background,interests:data.director.interests,highlight:data.director.highlight,experience:data.director.experience.map(section=>({title:section.title,paragraphs:[...section.paragraphs]})),sourceIds:data.director.sourceIds,resources:data.director.resources.map(r=>({label:r.label,url:r.url}))},
  facilities:{provider:data.facilities.provider,description:data.facilities.description,areas:data.facilities.areas,sourceIds:data.facilities.sourceIds},
  sources:data.sources.filter(s=>used.has(s.id)).map(s=>({id:s.id,title:s.title,version:s.version,accessedAt:s.accessedAt})),events,advisoryMembers,
  colleges:data.colleges,missions:data.missions,courses:data.courses,collaborations:data.collaborations,
  media:data.media.map(m=>({file:m.file,sourceId:m.sourceId,caption:m.caption,alt:m.alt,width:m.width,height:m.height,kind:m.kind})),
 };
}
