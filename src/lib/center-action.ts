import type {News} from '../../content/types';

export const centerActionGroups=[
 {id:'taiwan-us',title:'主辦臺美論壇，延伸供應鏈與科技對話',description:'中心於2024年主辦無人載具技術論壇、2025年辦理供應鏈工作坊，並於2026年持續推動AI／半導體及UAV／AAM圓桌交流，涵蓋技術發展、產業需求、展示媒合與專業人才等議題。',slugs:['taiwan-us-unmanned-vehicle-forum-2024','taiwan-us-uas-supply-chain-workshop-2025','taiwan-us-ai-semiconductor-roundtable-2026','taiwan-us-uav-aam-roundtable-2026']},
 {id:'taiwan-europe',title:'共同籌辦三日黑客松，支持臺歐工程協作',description:'中心與 European Defense Tech Hub、國防安全研究院共同籌辦 2026 臺灣國防科技黑客松，協力場地、報到與現場執行。三日活動結合專題分享、工作坊、導師交流、團隊開發與 Demo Day，串連工程社群與安全需求。',slugs:['taiwan-defense-tech-hackathon-2026']},
 {id:'guam',title:'赴關島開展學研與區域交流',description:'李綱主任應關島大學邀請，於2026年10月22日至23日赴關島進行學研交流，並與關島經濟發展局代表交換意見。交流主題涵蓋無人與自主系統研究、師生培育及區域產學合作，相關背景與合作方向詳見活動紀錄。',slugs:['university-of-guam-exchange-2026']},
 {id:'ai-security',title:'無人載具資安與人工智慧治理交流',description:'中心共同主辦 PQC 汽車資安交流，公開議程列李綱主任主持車用與無人載具加密討論；AI 與法律研討會則列主任為生成式 AI 技術模型場次報告人。兩筆紀錄呈現中心主辦工作與主任議程角色的不同面向。',slugs:['pqc-automotive-cybersecurity-2024','ai-law-generative-ai-conference-2024']},
] as const;

/** Historical records only; a program listing is not evidence of an organized event. */
export function summarizeCenterAction(events:readonly News[],asOf:string){
 const records=events.filter(e=>e.publicationState==='published'&&e.endDate<asOf);
 const years=[...new Set(records.map(e=>e.date.slice(0,4)))].sort();
 return {
  records,recordCount:records.length,
  organizedCount:records.filter(e=>e.recordType!=='program'&&(e.participation==='host'||e.participation==='co-organizer')).length,
  firstYear:years[0]??null,lastYear:years.at(-1)??null,
 };
}

export const participationLabels={host:'中心主辦','co-organizer':'中心共同主辦／籌辦',visitor:'中心交流參與',speaker:'主任報告・依議程'} as const;
