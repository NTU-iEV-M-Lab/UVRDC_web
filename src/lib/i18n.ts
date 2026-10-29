import messages from '../../content/en/messages.json';
import type {Locale} from '../../content/localization';
const extra:Record<string,string>={
 '首頁':'Home','關於中心':'About','教育訓練':'Education','產學合作':'Collaboration','國際交流':'International Exchange','最新消息':'News','聯絡我們':'Contact',
 '找不到頁面':'Page not found','此頁面不存在，請返回中心官網繼續瀏覽。':'This page does not exist. Return to the Center’s website to continue exploring.',
 '網站語言':'Website language','查看{0}':'View {0}',
 '主題一':'Topic 1','主題二':'Topic 2','主題三':'Topic 3','主題四':'Topic 4',
 '美國':'U.S.',
 '歷史議程':'Historical program',
 '中心主辦':'Organized by the Center',
 '中心共同主辦／籌辦':'Co-organized by the Center',
 '主任報告・依議程':'Director’s talk · as scheduled',
 '連結跨院研發、人才培育、產學合作與國際交流，探索無人載具的應用與合作。':'Connecting interdisciplinary research, education, industry collaboration, and international exchange to explore applications of unmanned vehicles.',
 '了解中心的成立背景、三院合作、李綱主任及實驗室設備與研究基礎。':'Learn about the Center, its three-college collaboration, Director Kang Li, and its laboratory research and equipment foundations.',
 '以共同基礎、飛手與工程研發雙軌，連結知識、實作與驗證的人才培育方向。':'Explore education pathways that connect shared foundations, UAV piloting, engineering development, hands-on practice, and validation.',
 '以應用需求為起點，探索共同研究、系統整合、驗證與人才交流的合作機會。':'Explore opportunities for joint research, systems integration, validation, and talent exchange, starting with application needs.',
 '從臺美技術論壇、供應鏈對話與圓桌會議，到跨境學研互訪與共同開發，閱讀中心的國際交流紀錄。':'Read the Center’s international exchanges, from Taiwan–U.S. technology forums and supply-chain discussions to academic visits and collaborative development.',
 '中心的活動交流與消息：查閱日期、議題、中心角色及完整活動回顧。':'Explore the Center’s events and news, including dates, topics, the Center’s role, and detailed event recaps.',
 '國立臺灣大學無人載具研發設計中心的合作與聯絡資訊。':'Collaboration and contact information for the Unmanned Vehicles Research and Development Center, NTU.',
};
const english:Record<string,string>={...messages,...extra};
export function translate(locale:Locale,message:string,...values:Array<string|number>):string{
 let result=message;
 if(locale==='en'){
  if(message in english)result=english[message];
  else if(/\p{Script=Han}/u.test(message))throw new Error(`Missing English UI translation: ${message}`);
 }
 return result.replace(/\{(\d+)\}/g,(_,index)=>String(values[Number(index)]??`{${index}}`));
}
export function countLabel(locale:Locale,count:number,kind:'exchanges'|'entries'|'items'){
 const words={exchanges:['篇交流紀錄','exchange record'],entries:['則內容','entry'],items:['項','item']} as const;
 if(locale==='zh-Hant')return `${count} ${words[kind][0]}`;
 const word=words[kind][1];return `${count} ${count===1?word:kind==='entries'?'entries':word+'s'}`;
}
