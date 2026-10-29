import type {SiteData} from '../../content/types';
import type {Locale,PublicContent} from '../../content/localization';
import {languagePath,localeFromPath} from './locale';
import {translate} from './i18n';
import {aboutNavigation} from './about-navigation';
export type Route={path:string;title:string;description:string;section:string;kind:'page'|'event'|'not-found';slug?:string;locale:Locale};
export const navigation=[['/','首頁'],['/about/','關於中心'],['/education/','教育訓練'],['/collaboration/','產學合作'],['/international/','國際交流'],['/news/','最新消息'],['/contact/','聯絡我們']] as const;
const descriptions:Record<string,string>={
 '/':'連結跨院研發、人才培育、產學合作與國際交流，探索無人載具的應用與合作。',
 '/about/':'了解中心的成立背景、三院合作、李綱主任及實驗室設備與研究基礎。',
 '/about/people/':'認識中心主任、跨院組織與提供專業建議的諮詢委員。',
 '/about/facilities/':'從地面到空中的系統整合，了解實驗室研究基礎與 AVL 動力測試設備。',
 '/education/':'以共同基礎、飛手與工程研發雙軌，連結知識、實作與驗證的人才培育方向。',
 '/collaboration/':'以應用需求為起點，探索共同研究、系統整合、驗證與人才交流的合作機會。',
 '/international/':'從臺美技術論壇、供應鏈對話與圓桌會議，到跨境學研互訪與共同開發，閱讀中心的國際交流紀錄。',
 '/news/':'中心的活動交流與消息：查閱日期、議題、中心角色及完整活動回顧。',
 '/contact/':'國立臺灣大學無人載具研發設計中心的合作與聯絡資訊。',
};
export function getRoutes(data:SiteData,locale:Locale='zh-Hant'):Route[]{return [
 ...navigation.map(([path,title]):Route=>({path:languagePath(path,locale),title:translate(locale,title),description:translate(locale,descriptions[path]),section:languagePath(path,locale),kind:'page',locale})),
 ...aboutNavigation.slice(1).map(({path,label}):Route=>({path:languagePath(path,locale),title:translate(locale,label),description:translate(locale,descriptions[path]),section:languagePath('/about/',locale),kind:'page',locale})),
 ...data.events.map(e=>({path:languagePath(`/news/${e.slug}/`,locale),title:e.title,description:e.summary,section:languagePath('/news/',locale),kind:'event' as const,slug:e.slug,locale})),
];}
export function getAllRoutes(data:PublicContent):Route[]{return [...getRoutes(data.zh),...getRoutes(data.en,'en')];}
export function notFoundRoute(locale:Locale='zh-Hant'):Route{return {path:languagePath('/404.html',locale),title:translate(locale,'找不到頁面'),description:translate(locale,'此頁面不存在，請返回中心官網繼續瀏覽。'),section:'',kind:'not-found',locale};}
export function resolveRoute(path:string,data:SiteData,locale:Locale=localeFromPath(path)):Route{return getRoutes(data,locale).find(r=>r.path===path)||notFoundRoute(locale);}
