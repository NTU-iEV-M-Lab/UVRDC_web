import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import * as Accordion from '@radix-ui/react-accordion';
import {NavigationMenuRoot} from './components/ui/navigation-menu';
import {aboutNavigation,aboutAnchorTarget} from './lib/about-navigation';
import { ArrowRight, ArrowUpRight, Menu, X, Globe2, ScanLine, Compass, GraduationCap, Workflow, MapPin, Mail, Phone, ChevronRight, Network, Check, ChevronDown, Landmark, Users, FlaskConical } from 'lucide-react';
import content from '@public-content';
import type { News, Section } from '../content/types';
import type { Locale, PublicContent } from '../content/localization';
import { translate, countLabel } from './lib/i18n';
import { contentPath, languagePath, localeFromPath } from './lib/locale';
import { navigation, resolveRoute } from './lib/routes';
import { withBase } from './lib/paths';
import { Button } from './components/ui/button';
import { useReveal } from './lib/use-reveal';
import { centerActionGroups, summarizeCenterAction, participationLabels } from './lib/center-action';
import {relatedLinks} from '../content/related-links';
import {Brand} from './components/Brand';
const publicContent = content as PublicContent;
const SiteContext = createContext({ base: '/', path: '/', locale: 'zh-Hant' as Locale, data: publicContent.zh, t: (message: string, ...values: Array<string | number>) => translate('zh-Hant', message, ...values) });
const useSite = () => useContext(SiteContext);
function Link({ to, children, ...props }: {
    to: string;
    children: ReactNode;
} & Omit<React.ComponentProps<'a'>, 'href'>) { const { t, data, locale } = useSite(); const { base } = useSite(); return <a href={withBase(languagePath(to, locale), base)} {...props}>{children}</a>; }
function Eyebrow({ children, light = false }: {
    children: ReactNode;
    light?: boolean;
}) { const { t, data, locale } = useSite(); return <p className={`eyebrow ${light ? 'light' : ''}`}><span />{children}</p>; }
function SectionTitle({ label, title, children, to, link = '探索更多' }: {
    label: string;
    title: string;
    children?: ReactNode;
    to?: string;
    link?: string;
}) { const { t, data, locale } = useSite(); const ref = useReveal<HTMLDivElement>(); return <div ref={ref} className="section-heading"><div><Eyebrow>{t(label)}</Eyebrow><h2>{title}</h2>{children && <p className="section-lead">{children}</p>}</div>{to && <Link to={to} className="text-link">{t(link)}<ArrowUpRight size={18}/></Link>}</div>; }
function Media({ file, priority = false, className = '', caption = false }: {
    file: string;
    priority?: boolean;
    className?: string;
    caption?: boolean;
}) { const { t, data, locale } = useSite(); const { base } = useSite(); const m = data.media.find(m => m.file === file); return <figure className={`media ${className}`}><img className={`media-image ${m?.kind === 'photo' ? 'is-photo' : 'is-figure'}`} src={withBase(file, base)} alt={m?.alt || t("研究相關影像")} width={m?.width || 1200} height={m?.height || 800} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'}/>{caption && <figcaption>{m?.caption}<a className="media-full-link" href={withBase(file, base)} target="_blank" rel="noreferrer">{t("檢視完整圖片")}<ArrowUpRight size={12}/></a></figcaption>}</figure>; }
function AboutMenuIcon({type}:{type:string}) {
 const Icon=type==='people'?Users:type==='facilities'?FlaskConical:Landmark;
 return <Icon size={22} aria-hidden="true"/>;
}
function Header() {
 const {t,path,locale,base}=useSite();
 const [open,setOpen]=useState(false);
 useEffect(()=>{const query=window.matchMedia('(min-width: 1180px)');const close=()=>{if(query.matches)setOpen(false);};query.addEventListener('change',close);return()=>query.removeEventListener('change',close);},[]);
 const current=(to:string)=>path===to||(to!=='/'&&path.startsWith(to));
 return <>
  <a className="skip-link" href="#main">{t("跳至主要內容")}</a>
  <div className="utility-bar"><div className="container"><a href="https://www.ntu.edu.tw/" target="_blank" rel="noreferrer">NATIONAL TAIWAN UNIVERSITY <ArrowUpRight size={11}/></a><span className="utility-tagline">{t("跨院整合・自主創新")}</span><LanguageSwitch/></div></div>
  <header className="site-header"><div className="container header-inner">
   <Link to="/" className="brand"><Brand locale={locale} base={base} priority/><span className="sr-only">{t("首頁")}</span></Link>
   <NavigationMenuRoot className="desktop-nav" aria-label={t("主要導覽")} delayDuration={150}>
    <NavigationMenu.List className="primary-nav-list">
     <NavigationMenu.Item className="primary-nav-item">
      <NavigationMenu.Trigger className="nav-submenu-trigger" data-current={path.startsWith('/about/')||undefined}>{t("關於中心")}<ChevronDown size={15} aria-hidden="true"/></NavigationMenu.Trigger>
      <NavigationMenu.Content className="nav-submenu-panel"><ul>{aboutNavigation.map(item=><li key={item.path}><NavigationMenu.Link asChild active={path===item.path}><Link to={item.path}><span className="submenu-icon"><AboutMenuIcon type={item.icon}/></span><span><strong>{t(item.label)}</strong><small>{t(item.description)}</small></span><ChevronRight size={16} aria-hidden="true"/></Link></NavigationMenu.Link></li>)}</ul></NavigationMenu.Content>
     </NavigationMenu.Item>
     {navigation.filter(([to])=>!['/','/about/','/contact/'].includes(to)).map(([to,label])=><NavigationMenu.Item key={to}><NavigationMenu.Link asChild active={current(to)}><Link to={to}>{t(label)}</Link></NavigationMenu.Link></NavigationMenu.Item>)}
    </NavigationMenu.List>
   </NavigationMenuRoot>
   <Link to="/contact/" className="header-contact">{t("聯絡我們")}<ArrowUpRight size={16}/></Link>
   <Dialog.Root open={open} onOpenChange={setOpen}><Dialog.Trigger className="menu-trigger" aria-label={t("開啟選單")}><Menu size={25}/></Dialog.Trigger><Dialog.Portal><Dialog.Overlay className="menu-overlay"/><Dialog.Content className="mobile-menu">
    <div className="mobile-menu-top"><Dialog.Title>{t("探索中心")}</Dialog.Title><Dialog.Close className="menu-close" aria-label={t("關閉選單")}><X/></Dialog.Close></div>
    <Dialog.Description className="sr-only">{t("國立臺灣大學無人載具研發設計中心主要頁面導覽")}</Dialog.Description>
    <nav aria-label={t("手機導覽")}>{navigation.map(([to,label],i)=>to==='/about/'?
     <Accordion.Root key={to} type="single" collapsible className="mobile-about-branch"><Accordion.Item value="about"><div className="mobile-branch-heading"><Dialog.Close asChild><Link to={to} aria-current={current(to)?'page':undefined}><span className="nav-number">0{i+1}</span>{t(label)}</Link></Dialog.Close><Accordion.Header><Accordion.Trigger aria-label={t("展開關於中心子選單")}><ChevronDown size={22}/></Accordion.Trigger></Accordion.Header></div><Accordion.Content className="mobile-submenu">{aboutNavigation.map(item=><Dialog.Close key={item.path} asChild><Link to={item.path} aria-current={path===item.path?'page':undefined}><AboutMenuIcon type={item.icon}/>{t(item.label)}<ChevronRight size={16}/></Link></Dialog.Close>)}</Accordion.Content></Accordion.Item></Accordion.Root>:
     <Dialog.Close asChild key={to}><Link to={to} aria-current={current(to)?'page':undefined}><span className="nav-number">0{i+1}</span>{t(label)}<ArrowUpRight size={20}/></Link></Dialog.Close>)}</nav>
    <p className="menu-caption">UNMANNED VEHICLES<br/>RESEARCH AND DEVELOPMENT CENTER</p>
   </Dialog.Content></Dialog.Portal></Dialog.Root>
  </div></header>
 </>;
}
function Footer() {
 const {t,data,locale,base}=useSite();
 return <footer className="site-footer"><div className="container">
  <div className="footer-top">
   <div className="footer-identity"><Link to="/" className="footer-brand"><Brand locale={locale} base={base}/></Link><p>{t("跨域研發整合・自主系統應用")}</p></div>
   <nav className="footer-navigation" aria-label={t("頁尾導覽")}><h2>{t("網站導覽")}</h2><div className="footer-links">{navigation.slice(1).map(([to,label])=><Link to={to} key={to}>{t(label)}<ArrowUpRight size={13} aria-hidden="true"/></Link>)}</div></nav>
   <section className="footer-related" id="related-links" aria-labelledby="related-links-title"><h2 id="related-links-title">{t("相關連結")}</h2><div className="related-link-list">{relatedLinks.map(item=><a className="related-link-card" key={item.id} href={item.url} target="_blank" rel="noreferrer"><strong>{t(item.title)}</strong><span>{t(item.description)}</span><small>{t(item.action)}<ArrowUpRight size={18} aria-hidden="true"/></small></a>)}</div></section>
  </div>
  <div className="footer-bottom"><p>© {data.asOf.slice(0,4)}{' '}{t("國立臺灣大學無人載具研發設計中心")}</p><span>RESEARCH · EDUCATION · COLLABORATION</span><a href="https://www.ntu.edu.tw/" target="_blank" rel="noreferrer">{t("國立臺灣大學")}<ArrowUpRight size={13} aria-hidden="true"/></a></div>
 </div></footer>;
}
function CollaborationBand() { const { t, data, locale } = useSite(); return <section className="collaboration-band"><div className="container"><div><Eyebrow>CONNECT WITH US</Eyebrow><h2>{t("產學研合作與")}<br className="mobile-break"/>{t("技術交流")}</h2><p>{t("結合學術專業與產業需求，研議無人載具技術研發、系統整合與人才培育之合作。")}</p></div><Button asChild><Link to="/collaboration/">{t("合作洽詢")}<ArrowUpRight size={18}/></Link></Button></div></section>; }
function Breadcrumb({ title, section }: {
    title: string;
    section?: string;
}) { const { t, data, locale } = useSite(); const parent = navigation.find(n => n[0] === section); return <nav className="breadcrumb" aria-label={t("麵包屑")}><Link to="/">{t("首頁")}</Link><ChevronRight size={13}/>{parent && t(parent[1]) !== title && <><Link to={parent[0]}>{t(parent[1])}</Link><ChevronRight size={13}/></>}<span aria-current="page">{title}</span></nav>; }
function PageIntro({ label, title, description, section }: {
    label: string;
    title: string;
    description: string;
    section?: string;
}) { const { t, data, locale } = useSite(); return <section className="page-intro"><div className="container"><Breadcrumb title={title} section={section}/><Eyebrow>{t(label)}</Eyebrow><h1>{title}</h1><p>{description}</p></div><span className="intro-orbit" aria-hidden="true"/></section>; }
function EventCard({ item }: {
    item: News;
}) { const { t, data, locale } = useSite(); const ref = useReveal<HTMLElement>(); return <article ref={ref} className="exchange-card"><Link to={`/news/${item.slug}/`} className="exchange-card-link"><div className="exchange-card-visual">{item.image ? <Media file={item.image}/> : <TopicGraphic item={item}/>}<span className="exchange-format">{item.format}</span></div><div className="exchange-card-body"><div className="exchange-card-meta"><time dateTime={item.date}>{displayDate(item.date)}</time><span>{item.region}</span></div><h3>{item.title}</h3><p>{item.summary}</p><div className="exchange-card-foot"><span>{t(participationLabels[item.participation])}</span><ArrowUpRight size={18}/></div></div></Link></article>; }
function TopicGraphic({ item }: {
    item: News;
}) { const { t, data, locale } = useSite(); return <div className="topic-graphic" role="img" aria-label={t("{0}議題示意；非活動實況照片", item.title)}><Network size={68}/><span>{item.slug === 'ai-law-generative-ai-conference-2024' ? 'AI & LAW' : item.slug === 'taiwan-us-uas-supply-chain-workshop-2025' ? 'SUPPLY CHAIN' : 'UAV & AAM'}<small>{item.date.slice(0, 4)} · INTERNATIONAL EXCHANGE</small></span><em>{t("議題示意")}</em></div>; }
function displayDate(date: string) { return date.replaceAll('-', '.'); }
function EventStatus({ item }: {
    item: News;
}) { const { t, data, locale } = useSite(); const [today, setToday] = useState(data.asOf); useEffect(() => { setToday(new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())); }, []); return <span className="status">{item.endDate < today ? t(item.recordType === 'program' ? "歷史議程" : "活動回顧") : t("活動資訊")}</span>; }
function NewsRow({ item }: {
    item: News;
}) { const { t, data, locale } = useSite(); return <article className="news-row"><time dateTime={item.date}>{displayDate(item.date)}</time><Link to={`/news/${item.slug}/`}><div className="news-row-meta"><span>{item.category}</span><EventStatus item={item}/></div><h3>{item.title}</h3><p>{item.summary}</p></Link><Link to={`/news/${item.slug}/`} className="round-link" aria-label={t("閱讀{0}", item.title)}><ArrowUpRight size={22}/></Link></article>; }
function CenterAction() {
 const {t,data}=useSite();
 const summary=summarizeCenterAction(data.events,data.asOf);
 const yearRange=summary.firstYear===summary.lastYear?summary.firstYear:`${summary.firstYear}–${summary.lastYear}`;
 return <section id="center-impact" className="section center-impact" aria-labelledby="center-impact-heading"><div className="container">
  <div className="impact-intro"><div><Eyebrow>CENTER IN ACTION</Eyebrow><h2 id="center-impact-heading">{t("中心業務與國際交流紀錄")}</h2></div><div><p>{t("中心自 {0} 年成立，依跨院合作架構推動無人載具研發、技術論壇、產學交流及國際學研互訪。以下依已收錄之活動紀錄，呈現中心主辦、共同籌辦與交流參與情形。",data.institution.foundingYear)}</p><Link to="/about/" className="text-link">{t("認識中心")}<ArrowUpRight size={18}/></Link></div></div>
  <dl className="impact-metrics" aria-label={t("本站收錄的中心行動概覽")}>
   <div><dt>{t("主辦／共同籌辦活動")}</dt><dd data-impact="organized">{summary.organizedCount}<span>{t("場")}</span></dd></div>
   <div><dt>{t("交流與議程紀錄")}</dt><dd data-impact="records">{summary.recordCount}<span>{t("筆")}</span></dd></div>
   <div><dt>{t("已收錄活動年份")}</dt><dd className="impact-years" data-impact="years">{summary.firstYear?yearRange:'—'}</dd></div>
  </dl>
  <p className="impact-count-note">{t("統計範圍為本站已收錄的歷史紀錄；主辦／共同籌辦按活動回顧計，互訪與歷史議程另列。")}</p>
  <div className="impact-stories">{centerActionGroups.map((group,index)=>{
   const events=summary.records.filter(event=>(group.slugs as readonly string[]).includes(event.slug));
   if(!events.length)return null;
   return <article className="impact-story" key={group.id} aria-labelledby={`impact-${group.id}`}><div className="impact-story-top"><span className="impact-index">0{index+1}</span><span className="impact-period">{[...new Set(events.map(e=>e.date.slice(0,4)))].sort().join(' / ')}</span></div><h3 id={`impact-${group.id}`}>{t(group.title)}</h3><p>{t(group.description)}</p>{group.id==='taiwan-europe'?<Media file="assets/event-tdth.webp" caption/>:group.id==='guam'?<Media file="assets/event-guam-2026-uog.webp" caption/>:null}<ul className="impact-evidence">{events.map(event=><li key={event.slug}><Link to={`/news/${event.slug}/`} className="impact-evidence-link"><div><span className="impact-evidence-meta"><time dateTime={event.date}>{displayDate(event.date)}</time><span>{t(event.recordType==='program'?'歷史議程':participationLabels[event.participation])}</span></span><span className="impact-evidence-title">{event.title}</span></div><ArrowUpRight size={18}/></Link></li>)}</ul></article>;
  })}</div>
 </div></section>;
}

function Home() {
    const { t, data, locale } = useSite();
    const copy = useReveal<HTMLDivElement>();
    const visual = useReveal<HTMLDivElement>();
    return <>
 <section className="hero"><div className="hero-grid container"><div ref={copy} className="hero-copy"><Eyebrow>NTU · ACTION & EXCHANGE</Eyebrow><h1>{t("無人載具研發")}<br /><span>{t("跨域技術整合")}<br className="hero-heading-break"/>{locale==='en'?' ':null}{t("與國際合作")}</span></h1><p className="hero-lead">{t("國立臺灣大學無人載具研發設計中心")}</p><p className="hero-description">{t("中心整合跨院研究資源，推動無人載具技術研發、專業人才培育及國際合作；透過臺美技術論壇、供應鏈交流、臺歐工程協作及關島學研互訪，拓展研究與應用連結。")}</p><div className="hero-actions"><Button asChild><a href="#center-impact">{t("查看中心實績")}<ArrowUpRight size={18}/></a></Button><Link to="/international/" className="text-link">{t("所有交流紀錄")}<ArrowRight size={18}/></Link></div><div className="hero-colleges"><span>{t("跨院合作平台")}</span><p>{data.colleges.map(college=><span key={college}>{college}</span>)}</p></div></div><div ref={visual} className="hero-visual"><div className="hero-visual-header"><span><i /> GLOBAL EXCHANGE</span><span>2024 / TAIPEI</span></div><Media file="assets/event-forum-2024-main.webp" priority/><div className="hero-visual-footer"><div><span>{t("臺美無人載具技術與產學交流")}</span><small>{t("2024 臺美國際無人載具論壇實況")}</small></div><Globe2 size={32}/></div><div className="visual-coordinate" aria-hidden="true">EXCHANGE / COLLABORATION / TALENT</div></div></div><div className="hero-bottom container"><span>CONNECTING KNOWLEDGE WITH PEOPLE.</span><a href="#center-impact" className="scroll-link">{t("向下探索")}<span>↓</span></a></div></section>
 <CenterAction />
 <section className="section soft-section"><div className="container"><SectionTitle label="GLOBAL CONNECTIONS" title={t("國際交流與合作動態")} to="/international/" link={t("所有國際交流")}>{t("彙整國際技術論壇、供應鏈交流及校際互訪紀錄，說明活動背景、中心角色、交流議題與後續合作方向。")}</SectionTitle><div className="exchange-grid home-exchanges bento-exchanges">{data.events.filter(e => e.featured).slice(0, 3).map(e => <EventCard item={e} key={e.slug}/>)}</div></div></section>
 <section className="section mission-section"><div className="container mission-layout"><div><Eyebrow light>WHAT WE DO</Eyebrow><h2>{t("跨院研究整合")}<br />{t("與技術應用")}</h2><p>{t("以應用研究、教育訓練、產學合作及國際交流為核心，推動無人載具技術與人才發展。")}</p><span className="mission-decoration" aria-hidden="true"><Network size={100}/></span></div><div className="mission-list">{data.missions.map((m, i) => <Link key={m.title} to={['/about/facilities/#research-foundation', '/education/', '/collaboration/', '/international/'][i]}><span className="mission-index">0{i + 1}</span><div><small>{m.english}</small><h3>{m.title}</h3><p>{m.text}</p></div><ArrowUpRight size={22}/></Link>)}</div></div></section>
 <section className="section"><div className="container"><SectionTitle label="NEWS & EXCHANGES" title={t("近期交流與活動")} to="/news/" link={t("所有最新消息")}>{t("彙整中心主辦、共同籌辦及參與之研討會、工作坊與學研互訪，提供各項活動之議題、角色與紀錄。")}</SectionTitle>{data.events.slice(0, 3).map(e => <NewsRow item={e} key={e.slug}/>)}</div></section>
 <section className="education-teaser"><div className="container education-teaser-inner"><div className="education-graphic" aria-hidden="true"><span className="graphic-ring"/><GraduationCap size={58}/><span className="graphic-label a">KNOWLEDGE</span><span className="graphic-label b">PRACTICE</span><span className="graphic-label c">VALIDATION</span></div><div><Eyebrow>EDUCATION & TALENT</Eyebrow><h2>{t("無人載具專業培育")}<br />{t("與工程實作")}</h2><p>{t("以共同基礎、飛手操作及工程研發雙軌建構培育架構，課程涵蓋載具設計、飛行控制、感測通訊與應用軟體。透過任務實作、系統整合與分階段驗證，培養需求分析、操作判斷及測試資料判讀能力。")}</p><Link to="/education/" className="text-link">{t("了解人才培育方向")}<ArrowUpRight size={18}/></Link></div></div></section><CollaborationBand />
 </>;
}
function AboutSubnav() {
 const {t,path}=useSite();
 return <nav className="about-subnav" aria-label={t("關於中心次導覽")}><div className="container">{aboutNavigation.map(item=><Link key={item.path} to={item.path} aria-current={path===item.path?'page':undefined}><AboutMenuIcon type={item.icon}/><span>{t(item.label)}</span></Link>)}</div></nav>;
}
function AboutFrame({label,title,description,children}:{label:string;title:string;description:string;children:ReactNode}) {
 return <div className="about-page"><PageIntro label={label} title={title} description={description} section="/about/"/><AboutSubnav/>{children}</div>;
}
function About() {
 const {t,data,base,locale}=useSite();
 useEffect(()=>{const target=aboutAnchorTarget(window.location.hash);if(target)window.location.replace(withBase(languagePath(target,locale),base));},[base,locale]);
 return <AboutFrame label="ABOUT THE CENTER" title={t("中心簡介")} description={data.institution.intro}>
 <section className="section"><div className="container about-grid">
  <aside className="side-label">{t("01 / 中心簡介")}</aside>
  <div className="prose"><h2>{t("中心設立與發展定位")}</h2><p>{data.institution.description}</p>
   <p>{t("中心於 2020 年成立，整合三院及校內相關系所的研究能量與設備，促進前瞻性、實用性的無人載具系統研究，並以跨領域交流連結不同專業。")}</p>
   <div className="college-grid">{data.colleges.map((c, i) => <div key={c}><span>0{i + 1}</span><h3>{c}</h3></div>)}</div>
   <h2>{t("跨院研發與人才培育任務")}</h2><p>{t("中心任務涵蓋研究交流、無人載具系統研發與應用、政策諮詢及人才培育。透過應用研究、教育訓練、產學合作與國際交流，推進校內外合作。")}</p>
   <p>{t("無人載具系統整合涉及環境感知、定位導航、任務規劃、運動控制及機電介面等技術。中心依設置辦法所涵蓋之人工智慧、通訊網路、自動化科技與應用服務，促進跨領域研究合作，探討軟硬體配置、系統性能與應用條件之關聯。")}</p>
  </div>
 </div></section>
 <section className="section soft-section"><div className="container">
  <SectionTitle label="OUR MISSION" title={t("核心業務")}/>
  <div className="four-grid">{data.missions.map((m, i) => <article className="numbered-block" key={m.title}><span>0{i + 1}</span><small>{m.english}</small><h3>{m.title}</h3><p>{m.text}</p></article>)}</div>
 </div></section>

 <section className="section"><div className="container about-entry-grid">{aboutNavigation.slice(1).map(item=><Link to={item.path} className="about-entry-card" key={item.path}><span className="about-entry-icon"><AboutMenuIcon type={item.icon}/></span><div><h2>{t(item.label)}</h2><p>{t(item.description)}</p></div><ArrowUpRight size={22}/></Link>)}</div></section>
 </AboutFrame>;
}
function People() {
 const {t,data}=useSite();const director=data.director;
 return <AboutFrame label="PEOPLE & ORGANIZATION" title={t("組織人員")} description={t("認識中心主任、跨院組織與提供專業建議的諮詢委員。")}> <section className="section" id="director"><div className="container">
  <SectionTitle label="CENTER DIRECTOR" title={t("中心主任")}/>
  <article className="director-card" aria-label={t("現任中心主任介紹")}>
   <div className="director-identity"><span className="director-label">{t("現任主管")}</span><div className="director-portrait"><Media file="assets/director-kang-li.webp"/><p className="portrait-credit">{t("照片：中心提供")}</p></div><h3>{director.name}</h3><p className="director-english">{director.englishName}</p><div className="director-rule"/><p>{director.role}</p><p>{director.affiliation}</p></div>
   <div className="director-details"><h3>{t("學歷與研究背景")}</h3><p className="director-education">{director.education}</p><p>{director.background}</p>
    <h3>{t("研究專長")}</h3><div className="tags">{director.interests.map(t => <span key={t}>{t}</span>)}</div>
    <div className="director-highlight"><span>{t("研究與應用經歷")}</span><p>{director.highlight}</p></div>
    <div className="director-resources">{director.resources.map(r => <a key={r.url} href={r.url} target="_blank" rel="noreferrer">{r.label}<ArrowUpRight size={15}/></a>)}</div>
   </div>
  </article>
  <div className="director-experience">{director.experience.map(section=><article key={section.title}><h3>{section.title}</h3>{section.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}</article>)}</div>
 </div></section>
 <section className="section soft-section" id="organization"><div className="container about-grid">
  <aside className="side-label">{t("02 / 組織人員")}</aside>
  <div className="prose"><h2>{t("以跨院合作，支持中心發展")}</h2>
   <p>{t("依中心設置辦法，中心由三院共同參與，諮詢委員會負責發展方針、工作規劃及業務監督，由主任統籌業務推動。")}</p>
   <div className="org-chart governance-chart" aria-label={t("依設置辦法呈現的組織架構")}><div><small>{t("跨院基礎")}</small><strong>{t("三院合作平台")}</strong></div><ChevronRight aria-hidden="true"/><div><small>{t("諮詢與監督")}</small><strong>{t("諮詢委員會")}</strong></div><ChevronRight aria-hidden="true"/><div><small>{t("業務推動")}</small><strong>{t("主任・")}{director.name}</strong></div></div>
   <p>{t("設置辦法另保留依業務需要設置副主任、執行長及應用研究、教育訓練、產學合作、國際交流等功能性分組的彈性。目前現任主管為李綱主任。")}</p>
   <a className="text-link" href={t("https://eecs.ntu.edu.tw/uploads/archive_file_multiple/file/5e5609791d41c8661400000b/無人載具研發設計中心設置辦法-3059次行政會議通過.pdf")} target="_blank" rel="noreferrer">{t("中心設置辦法")}<ArrowUpRight size={16}/></a>
  </div>
 </div></section>
 <CommitteeRoster/>
</AboutFrame>;
}
function Facilities() {
 const {t,data}=useSite();
 return <AboutFrame label="FACILITIES & PLATFORMS" title={t("載具平台與設備資源")} description={t("從地面到空中的系統整合，了解實驗室研究基礎與 AVL 動力測試設備。")}> <section className="section" id="research-foundation"><div className="container">
  <SectionTitle label="RESEARCH FOUNDATION" title={t("設備與研究基礎")}/>
  <div className="facility-grid"><div className="prose"><h3>{data.facilities.provider}</h3><p>{data.facilities.description}</p><p>{t("從感測與控制研究，到載具整合及驗證，透過實驗室的研究基礎，連結中心的跨領域合作。")}</p>
   <div className="facility-areas">{data.facilities.areas.map(t => <span key={t}><Check size={16}/>{t}</span>)}</div>
   <Link className="text-link" to="/collaboration/">{t("討論研究合作")}<ArrowUpRight size={17}/></Link>
  </div><Media file="assets/facility-uav.webp" className="facility-photo" caption/></div>
  <VehiclePlatforms/>
 </div></section>

 <section className="section soft-section" id="equipment-avl"><div className="container">
  <SectionTitle label="EQUIPMENT & INTEGRATION" title={t("AVL 動力測試設備與安裝治具")}>{t("設備配置涵蓋待測件固定、軸系連接及扭力量測介面，支援動力元件於明確安裝條件下之整合測試。")}</SectionTitle>
  <div className="equipment-photos"><Media file="assets/facility-avl-front.webp" caption/><Media file="assets/facility-avl-side.webp" caption/></div>
  <div className="equipment-features">
   <article><h3>{t("待測件固定與定位")}</h3><p>{t("以支撐治具與轉接盤界定待測件的安裝位置。不同元件的固定方式、安裝空間及介面條件，是測試準備時需要先釐清的項目。")}</p></article>
   <article><h3>{t("傳動與扭力量測介面")}</h3><p>{t("轉接軸與法蘭介面連接待測件及 HBM 扭力計。從機構配置到量測端的銜接，可作為討論載具動力元件整合與測試需求的基礎。")}</p></article>
   <article><h3>{t("由測試需求開始評估")}</h3><p>{t("若有設備合作需求，可先提供待測元件、安裝介面、希望量測的項目與測試條件，再由中心評估適用的配置與合作方式。")}</p></article>
  </div>
  <Link to="/contact/#inquiry" className="text-link">{t("洽詢設備與測試合作")}<ArrowUpRight size={18}/></Link>
 </div></section>
</AboutFrame>;
}
function VehiclePlatforms() {
 const {t}=useSite();
 const platforms=[
  {id:'amr',image:'assets/platform-amr-concept.webp',label:'GROUND AUTONOMY',type:'模型示意',title:'自主移動機器人（AMR）',description:'地面載具的任務需要連結環境感知、定位建圖與路徑規劃，再由運動控制完成移動。以 AMR 的系統構成為例，可討論感測資料、導航流程與底盤介面如何整合。'},
  {id:'bus',image:'assets/platform-autonomous-bus.webp',label:'VEHICLE INTEGRATION',type:'實車照片',title:'自駕巴士',description:'自駕巴士將感測器、定位資訊、路徑規劃與車輛控制整合到實車。從感測器配置到車輛介面，可進一步討論訊號如何傳遞，以及模擬情境與實車測試如何相互對照。'},
  {id:'uav',image:'assets/platform-uav-concept.webp',label:'AERIAL CONTROL',type:'機型示意',title:'無人機',description:'空中載具需要同時考量姿態、位置與任務航線。研究基礎涵蓋飛行控制、感測通訊及風擾下的運動反應，透過模擬與實驗情境，討論控制方法與系統整合。'},
 ];
 return <section className="vehicle-platforms" id="vehicle-platforms" aria-labelledby="platforms-heading">
  <div className="platforms-heading"><Eyebrow>VEHICLE PLATFORMS</Eyebrow><h3 id="platforms-heading">{t("從地面到空中，理解載具系統整合")}</h3><p>{t("不同載具的運動方式與任務環境各異，但都需要串接感測、決策與控制。以實驗室簡報中的三類平台，說明系統整合時關注的問題。")}</p></div>
  <div className="vehicle-platform-grid">{platforms.map(platform=><article className="platform-card" key={platform.id} data-platform={platform.id}>
   <Media file={platform.image} caption/>
   <div className="platform-copy"><span className="platform-type">{t(platform.type)}</span><p className="platform-label">{platform.label}</p><h4>{t(platform.title)}</h4><p>{t(platform.description)}</p></div>
  </article>)}</div>
  <div className="platforms-followup"><p>{t("圖像採自 2024 年實驗室介紹簡報，呈現載具平台與機型概念。研究合作可從任務情境、現有系統與希望驗證的問題開始討論。")}</p><Link className="text-link" to="/collaboration/">{t("討論載具整合與驗證")}<ArrowUpRight size={17}/></Link></div>
 </section>;
}
function CommitteeRoster() {
 const {t,data}=useSite();
 const [enhanced,setEnhanced]=useState(false);
 useEffect(()=>setEnhanced(true),[]);
 const listed=data.advisoryMembers.filter(member=>!member.termEnd||member.termEnd>=data.asOf);
 const former=data.advisoryMembers.filter(member=>member.termEnd&&member.termEnd<data.asOf);
 const details=(member:typeof listed[number])=><><p>{member.affiliation}</p>{member.note&&<span className="advisory-note">{member.note}</span>}{member.termEnd&&<span className="advisory-note">{t("任期至 {0}",member.termEnd)}</span>}</>;
 const cards=(members:typeof listed)=>{
  if(!enhanced)return <ul className="advisory-list">{members.map(member=><li key={member.id} data-member={member.id}><details className="advisory-native"><summary><h3>{member.name}<ChevronDown size={18}/></h3></summary><div className="advisory-content">{details(member)}</div></details></li>)}</ul>;
  return <Accordion.Root type="multiple" asChild><ul className="advisory-list">{members.map(member=><Accordion.Item value={member.id} key={member.id} asChild><li data-member={member.id}><Accordion.Header asChild><h3><Accordion.Trigger className="advisory-trigger">{member.name}<ChevronDown size={18} aria-hidden="true"/></Accordion.Trigger></h3></Accordion.Header><Accordion.Content className="advisory-content" forceMount>{details(member)}</Accordion.Content></li></Accordion.Item>)}</ul></Accordion.Root>;
 };
 return <section className="section" id="advisory-committee"><div className="container">
  <SectionTitle label="ADVISORY COMMITTEE" title={t("諮詢委員")}>{t("諮詢委員為中心發展方針、工作規劃與業務推動提供專業建議。以下依115年名冊呈現，職稱與所屬單位沿用名冊記載。")}</SectionTitle>
  <p className="roster-help">{t("點選姓名查看名冊所列單位與職稱。")}</p>
  <div className="advisory-current">{cards(listed)}</div>
  <details className="advisory-former"><summary>{t("任期已屆委員紀錄（{0} 位）",former.length)}</summary>{cards(former)}</details>
 </div></section>;
}
function Sections({sections}:{sections:Section[]}) {
 return <div className="prose article-prose">{sections.map((section,index)=><section key={section.title} id={`event-section-${index}`}><span className="article-number">0{index+1}</span><h2>{section.title}</h2>{section.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}</section>)}</div>;
}
function InquiryPreparation() {
 const {t}=useSite();
 return <div className="inquiry-preparation">
  <SectionTitle label="BEFORE WE TALK" title={t("合作洽詢應備資訊")}>{t("為利初步評估，請提供應用需求、既有系統、驗證目標及合作窗口等資訊，作為後續技術交流與範圍研議之依據。")}</SectionTitle>
  <ol className="preparation-grid"><li><span className="step-number" aria-hidden="true">01</span><div><h3>{t("應用情境與問題")}</h3><p>{t("說明預定應用場域、使用對象、任務目的及現行限制，並列出擬改善之技術項目與預期成效。")}</p></div></li>
<li><span className="step-number" aria-hidden="true">02</span><div><h3>{t("現有系統與資源")}</h3><p>{t("提供載具構型、感測器配置、軟體架構及可供分析之資料；概念驗證階段可先提出需求規格與已知條件。")}</p></div></li>
<li><span className="step-number" aria-hidden="true">03</span><div><h3>{t("驗證目標與時程")}</h3><p>{t("列明階段目標、評估指標、可用測試條件及重要時程，以利研擬合作範圍與驗證方式。")}</p></div></li>
<li><span className="step-number" aria-hidden="true">04</span><div><h3>{t("合作構想與聯絡窗口")}</h3><p>{t("註明共同研究、系統整合、人才培育或國際交流等合作類型，並提供參與單位、聯絡人及聯繫方式。")}</p></div></li></ol>
 </div>;
}
function Education() {
 const {t,data}=useSite();
 return <>
  <PageIntro label="EDUCATION & TALENT" title={t("無人載具人才培育")} description={t("以共同基礎與雙軌培育架構，涵蓋飛行原理、任務操作、載具設計、飛控及感測整合，強化工程實作與驗證能力。")}/>
  <section className="section"><div className="container">
   <div className="education-intro"><div><Eyebrow>TALENT DEVELOPMENT</Eyebrow><h2>{t("培育架構與專業能力")}</h2></div><div>
    <p className="muted">{t("人才培育以操作能力與工程分析並重，涵蓋任務條件評估、系統狀態判讀、載具設計及整合驗證。共同基礎銜接飛手操作與工程研發兩軌，使不同專業背景之學習者能依任務需求進行技術分工，並以操作紀錄及實驗資料檢視系統性能。")}</p>
   </div></div>
   <div className="training-tracks"><article><span className="track-icon"><Compass size={31}/></span><small>TRACK 01</small><h3>{t("飛手操作與任務應用")}</h3>
    <p>{t("飛手操作軌著重任務準備、飛行操作與異常處置。透過模擬訓練及任務情境，研習姿態與航線控制、航點設定、返航及人工接管；並配合操作紀錄分析，建立航跡偏差、通訊異常及任務中止之判斷能力，支援操作與研發團隊之技術回饋。")}</p></article>
    <article><span className="track-icon"><Workflow size={31}/></span><small>TRACK 02</small><h3>{t("工程研發與系統整合")}</h3>
    <p>{t("工程研發軌著重需求規格、系統設計與整合驗證。依酬載、重量、供電及介面需求，研習飛控、定位、通訊與應用軟體之配置；透過模擬、資料回放及分階段測試，分析誤差與故障原因，並以設計文件、系統配置及測試報告呈現技術成果。")}</p></article></div>
  </div></section>
  <section className="section soft-section"><div className="container">
   <SectionTitle label="LEARNING MODULES" title={t("課程模組與實作內容")}>{t("課程架構分為六個模組，依專題需求組合系統基礎、操作訓練及研發實作。各模組列明技術重點、實作項目與工程紀錄，供學習者了解專業範圍及實作要求。")}</SectionTitle>
   <div className="course-grid">{data.courses.map((course,i)=>{const introduction=course.text.match(/^.*?[。.!?]/u)?.[0]||course.text;const explanation=course.text.slice(introduction.length).trim();return <article key={course.title}><span>0{i+1}</span><h3>{course.title}</h3><p>{introduction}</p><details className="course-details"><summary>{t("學習重點與實作內容")}<ChevronDown size={18} aria-hidden="true"/></summary><div>{explanation&&<p className="course-explanation">{explanation}</p>}<h4>{t("技術重點")}</h4><ul>{course.focus.map(point=><li key={point}>{point}</li>)}</ul><h4>{t("實作項目")}</h4><p>{course.exercise}</p></div></details></article>})}</div>
  </div></section>
  <section className="section"><div className="container">
   <SectionTitle label="LEARN · BUILD · VALIDATE" title={t("分階段實作與驗證")}>{t("驗證流程依任務需求、酬載配置及操作環境設定測試條件，分階段檢視定位精度、路徑追蹤、通訊品質與任務完成情形。各項性能指標應與環境條件、參數配置及測試紀錄交互比對。")}</SectionTitle>
   <ol className="learning-path"><li><span className="step-number" aria-hidden="true">01</span><div><h3>{t("模擬與需求分析")}</h3><p>{t("依任務範圍、酬載及操作限制建立需求規格，選定比較基準與評估指標。運用一致之資料集或模擬情境比較不同設定，保留參數、操作條件及測試結果，作為後續驗證依據。")}</p></div></li>
<li><span className="step-number" aria-hidden="true">02</span><div><h3>{t("地面整合與檢查")}</h3><p>{t("逐項檢查機構固定、供電、感測器校正、座標與時間同步，以及地面站指令回饋。先用地面測試確認介面與異常處理，再進入完整任務驗證。")}</p></div></li>
<li><span className="step-number" aria-hidden="true">03</span><div><h3>{t("實機測試與改善")}</h3><p>{t("在符合安全與場域條件的測試中，記錄軌跡、控制反應、通訊狀態與任務結果。將誤差和異常對照環境、參數及操作紀錄，區分改善效果與仍未解決的限制。")}</p></div></li></ol>
   <div className="learning-records"><h3>{t("專題文件與成果紀錄")}</h3><p>{t("專題文件涵蓋需求規格與評估標準、設計及介面配置、操作或程式流程，以及測試資料與修正前後比較。系統方塊圖、接線圖、參數表、航跡曲線及異常紀錄，作為技術審閱、重複驗證與後續改良之依據。")}</p></div>
   <div className="reading-actions"><Link to="/news/" className="text-link">{t("查看活動與交流紀錄")}<ArrowUpRight size={18}/></Link><Link to="/contact/" className="text-link">{t("洽詢人才培育與交流")}<ArrowRight size={18}/></Link></div>
  </div></section><CollaborationBand/>
 </>;
}
function Collaboration() {
 const {t,data}=useSite();
 const process=[
  [t("需求交流"),t("先說明任務情境、現有系統與目前限制，討論希望解決的問題，以及什麼樣的進展對使用者有意義。")],
  [t("共同評估"),t("對照可取得的資料、設備與人力，釐清技術可行性、合作範圍及驗證條件；必要的保密與成果歸屬一併討論。")],
  [t("研發與整合"),t("依雙方確認的內容安排研究、設計或系統整合，釐清介面、分工、階段目標及需要保留的工程紀錄。")],
  [t("驗證與回饋"),t("依約定的情境與指標檢視測試資料，整理達成情形、限制與改善方向，作為後續合作是否延伸的依據。")],
 ];
 return <><PageIntro label="INDUSTRY & ACADEMIC COLLABORATION" title={t("產學研合作")} description={t("從應用情境、現有系統與驗證需求切入，討論共同研究、工程整合及人才交流的合作方向。")}/>
  <section className="section"><div className="container">
   <div className="collaboration-overview prose"><h2>{t("合作範圍與技術評估")}</h2><p>{t("合作評估涵蓋載具本體、感測與控制、通訊介面及任務流程之整合需求。依應用情境、既有系統架構與測試資料，分析技術瓶頸、研究方法及驗證條件，並研議工作範圍、分工及階段成果。")}</p></div>
   <div className="collaboration-list">{data.collaborations.map((item,i)=><article key={item.title}><span className="large-index">0{i+1}</span><div><h2>{item.title}</h2><p>{item.text}</p><div className="tags">{item.areas.map(area=><span key={area}>{area}</span>)}</div></div><Link to="/contact/#inquiry" className="round-link" aria-label={t("洽詢{0}",item.title)}><ArrowUpRight/></Link></article>)}</div>
  </div></section>
  <section className="section soft-section"><div className="container">
   <SectionTitle label="WORKING TOGETHER" title={t("合作研議與執行程序")}>{t("合作研議分為需求交流、技術評估、研發整合及驗證回饋四個環節，實際工作內容與進度依個案共同確認。")}</SectionTitle>
   <ol className="process-grid">{process.map(([title,body],i)=><li key={title}><span className="step-number" aria-hidden="true">0{i+1}</span><div><h3>{title}</h3><p>{body}</p></div></li>)}</ol>
   <p className="information-note">{t("合作形式、經費、時程、場域使用、資料處理及智慧財產條件，需經雙方討論及相關程序確認。")}</p>
  </div></section>
  <section className="section"><div className="container"><InquiryPreparation/><div className="reading-actions"><Button asChild><Link to="/contact/#inquiry">{t("聯繫中心")}<ArrowUpRight size={18}/></Link></Button><Link to="/international/" className="text-link">{t("相關國際交流紀錄")}<ArrowRight size={18}/></Link></div></div></section>
 </>;
}
function International() {
    const { t, data, locale } = useSite();
    const [year, setYear] = useState(t("全部年份"));
    const all = data.events.filter(e => e.international);
    const years = [...new Set(all.map(e => e.date.slice(0, 4)))];
    const list = year === t("全部年份") ? all : all.filter(e => e.date.startsWith(year));
    return <>
 <PageIntro label="GLOBAL CONNECTIONS" title={t("國際交流")} description={t("推動無人載具技術、產業供應鏈與專業人才之國際交流，促進跨國研究及應用合作。")}/>
 <section className="section"><div className="container international-intro"><div className="world-graphic exchange-orbit" aria-hidden="true"><span className="orbit-ring orbit-one"/><span className="orbit-ring orbit-two"/><Globe2 size={130}/><span className="orbit-place place-taiwan">{t("臺灣")}<br /><small>TAIWAN</small></span><span className="orbit-place place-us">{t("美國")}<br /><small>UNITED STATES</small></span><span className="orbit-place place-europe">{t("歐洲")}<br /><small>EUROPE</small></span><span className="orbit-caption">{t("從臺大，連結世界")}</span></div><div className="prose"><h2>{t("國際學研合作")}<br />{t("與技術交流")}</h2><p>{t("中心透過國際論壇、專題工作坊、圓桌會議與學研互訪，串連研究者、產業夥伴與公共部門。交流從各方的技術能力與應用需求出發，逐步釐清研發、測試、供應鏈與人才培育的共同議題。")}</p><p>{t("下列紀錄涵蓋臺美技術論壇、無人機供應鏈對話、AI 治理與載具資安、佛州 UAV／AAM 交流、臺歐共同開發及關島學研互訪。每篇保留活動背景、中心角色、議程與交流內容，方便持續追蹤。")}</p></div></div></section>
 <section className="section soft-section"><div className="container"><SectionTitle label="EXCHANGE RECORDS" title={t("交流活動紀錄")}/><div className="filter-bar" role="group" aria-label={t("交流年份")}>{[t("全部年份"), ...years].map(y => <button key={y} aria-pressed={year === y} onClick={() => setYear(y)}>{y}</button>)}</div><p className="result-count" aria-live="polite">{countLabel(locale, list.length, 'exchanges')}</p>{list.length ? <div className="exchange-timeline">{years.filter(y => list.some(e => e.date.startsWith(y))).map(y => <section className="timeline-group" key={y} aria-labelledby={`year-${y}`}><div className="timeline-year"><span className="timeline-dot"/><h3 id={`year-${y}`}>{y}</h3><span>{t("交流紀錄")}</span></div><div className="timeline-cards">{list.filter(e => e.date.startsWith(y)).map(e => <EventCard item={e} key={e.slug}/>)}</div></section>)}</div> : <Empty reset={() => setYear(t("全部年份"))}/>}</div></section><CollaborationBand />
 </>;
}
function Empty({ reset }: {
    reset: () => void;
}) { const { t, data, locale } = useSite(); return <div className="empty-state"><ScanLine size={35}/><h3>{t("目前沒有符合的內容")}</h3><p>{t("歡迎查看其他主題，或回到全部內容。")}</p><Button variant="outline" onClick={reset}>{t("查看全部內容")}<ArrowRight size={16}/></Button></div>; }
function NewsPage() { const { t, data, locale } = useSite(); const [category, setCategory] = useState(t("全部消息")); const list = category === t("全部消息") ? data.events : data.events.filter(e => e.category === category); return <><PageIntro label="NEWS & EVENTS" title={t("最新消息與活動紀錄")} description={t("中心的活動交流與最新消息。從日期、議題與活動紀錄，了解合作與人才交流的足跡。")}/><section className="section"><div className="container"><div className="filter-bar" role="group" aria-label={t("消息分類")}>{[t("全部消息"), t("活動交流"), t("中心消息")].map(c => <button key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>)}</div><p className="result-count" aria-live="polite">{countLabel(locale, list.length, 'entries')}</p>{list.length ? list.map(e => <NewsRow key={e.slug} item={e}/>) : <Empty reset={() => setCategory(t("全部消息"))}/>}</div></section></>; }
function EventDetail({ item }: {
    item: News;
}) {
    const { t, data, locale } = useSite();
    return <>
 <PageIntro label={`${item.format} / EXCHANGE & EVENTS`} title={item.title} description={item.summary} section="/news/"/>
 <section className="section detail-section"><div className="container">{locale === 'zh-Hant' && item.englishTitle && <p className="event-english">{item.englishTitle}</p>}
 <dl className="event-facts"><div><dt>{t("活動日期")}</dt><dd>{displayDate(item.date)}{item.endDate !== item.date && ` — ${displayDate(item.endDate)}`}<EventStatus item={item}/></dd></div><div><dt>{t("活動地點")}</dt><dd>{item.venue}</dd></div><div><dt>{t("中心角色")}</dt><dd>{item.centerRole}</dd></div><div><dt>{t("主辦與合作單位")}</dt><dd>{item.organizers}</dd></div></dl>
 {item.image ? <Media file={item.image} className="detail-media event-media" caption/> : <div className="event-topic-cover"><TopicGraphic item={item}/></div>}
 <div className="article-layout exchange-article"><aside><span className="side-label">{t("本次交流重點")}</span><ul className="article-topics">{item.topics.map(t => <li key={t}>{t}</li>)}</ul><nav className="article-toc" aria-label={t("本文目錄")}>{item.sections.map((s, i) => <a href={`#event-section-${i}`} key={s.title}>{s.title}<ArrowUpRight size={12}/></a>)}{item.agenda.length > 0 && <a href="#agenda">{item.agendaLabel || t("活動議程")}<ArrowUpRight size={12}/></a>}{item.gallery.length > 0 && <a href="#gallery">{t("活動影像")}<ArrowUpRight size={12}/></a>}</nav><Link to="/international/" className="text-link">{t("返回國際交流")}<ArrowRight size={16}/></Link></aside>
 <div><Sections sections={item.sections}/>
 {item.agenda.length > 0 && <section className="event-agenda" id="agenda"><h2>{item.agendaLabel || t("活動議程")}</h2><details open={item.agenda.length <= 8}><summary>{t(t("查看{0}"), item.agendaLabel || t(t("完整議程")))}<span>{countLabel(locale, item.agenda.length, 'items')}<ChevronRight size={15}/></span></summary><ol>{item.agenda.map((a, i) => <li key={i}><span className="agenda-time">{a.time}</span><div><h3>{a.title}</h3><p>{a.description}</p></div></li>)}</ol></details></section>}
 {item.resources.length > 0 && <div className="resources"><h2>{t("延伸閱讀")}</h2>{item.resources.map(r => <a href={r.url} key={r.url} target="_blank" rel="noreferrer">{r.label}<ArrowUpRight size={19}/></a>)}</div>}
 </div></div>
 {item.gallery.length > 0 && <section className="event-gallery" id="gallery"><SectionTitle label="IN PICTURES" title={t("交流影像")}/><div className="gallery-grid">{item.gallery.map(file => <Media key={file} file={file} caption/>)}</div></section>}
 <div className="event-return"><Link to="/international/" className="text-link"><ArrowRight className="back-arrow" size={17}/>{t("所有國際交流")}</Link><Link to="/contact/" className="text-link">{t("聯絡中心")}<ArrowUpRight size={17}/></Link></div>
 </div></section><CollaborationBand />
 </>;
}
function Contact() {
 const {t,data}=useSite();const c=data.contact;
 const questions=[
  [t("合作構想尚未定案時，如何提出洽詢？"),t("可先提供應用情境、技術問題、既有資源及預期目標之摘要；如已有系統配置或測試資料，請一併說明，以利進行初步技術評估。")],
  [t("如何詢問課程或專題合作？"),t("請提供學習背景、培育主題及可參與時程；專題或團體合作請另附任務構想、現有設備與所需支援，以利研議適用模組及合作方式。")],
  [t("設備與場域使用如何洽詢？"),t("設備與場域使用須依研究需求、資源配置及相關使用條件評估。請提供載具規格、任務內容、測試需求及驗證目標，以利個案研議；目前未設線上預約服務。")],
  [t("合作範圍與成果歸屬如何確認？"),t("合作項目之工作範圍、分工、時程、經費、保密及智慧財產條件，須於洽談階段共同研議，並依雙方確認內容及相關程序辦理。")],
 ];
 return <><PageIntro label="GET IN TOUCH" title={t("合作洽詢與聯絡資訊")} description={t("研究合作、系統整合、人才培育及國際交流等事項，請透過下列公開信箱洽詢，並提供需求與聯絡資訊。")}/>
  <section className="section" id="inquiry"><div className="container contact-grid"><div><Eyebrow>NTU UVR&D CENTER</Eyebrow><h2>{t("國立臺灣大學")}<br/>{t("無人載具研發設計中心")}</h2><p className="muted">{t("洽詢時請提供單位名稱、應用情境、技術需求與聯絡方式，並參照下列項目檢附初步資訊，以利後續評估。")}</p>
   <div className="contact-details">{c.email&&<a href={'mailto:'+c.email}><Mail size={21}/>{c.email}<ArrowUpRight size={15}/></a>}{c.phone&&<a href={'tel:'+c.phone.replace(/\s/g,'')}><Phone size={21}/>{c.phone}</a>}{c.address&&<a href={'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(c.address)} target="_blank" rel="noreferrer"><MapPin size={21}/>{c.address}<ArrowUpRight size={15}/></a>}{c.url&&<a href={c.url} target="_blank" rel="noreferrer"><Globe2 size={21}/>{t("正式聯絡入口")}<ArrowUpRight size={15}/></a>}{!c.email&&!c.phone&&!c.url&&<div className="contact-pending"><Mail size={25}/><h3>{t("對外聯絡資訊更新中")}</h3><p>{t("中心的公開信箱、電話與聯絡窗口將於確認後更新。")}</p></div>}</div>
   {c.email&&<p className="information-note">{t("洽詢信件建議以「合作洽詢／單位名稱／討論主題」為主旨，並附需求摘要及聯絡資訊。")}</p>}
  </div><div className="contact-panel"><span className="panel-number">COLLABORATION<br/>ENQUIRIES</span><h3>{t("合作洽詢項目")}</h3>{[t("共同研究與技術研發"),t("系統整合與驗證"),t("人才培育與技術交流"),t("國際學研與產業合作")].map(label=><p key={label}><Check size={16}/>{label}</p>)}<Link to="/collaboration/" className="text-link">{t("合作範圍與程序")}<ArrowRight size={17}/></Link></div></div></section>
  <section className="section soft-section"><div className="container"><InquiryPreparation/></div></section>
  <section className="section"><div className="container faq-layout"><div><Eyebrow>QUESTIONS & ANSWERS</Eyebrow><h2>{t("洽詢事項說明")}</h2></div><div className="contact-faq">{questions.map(([question,answer])=><details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div></section>
 </>;
}
function NotFound() { const { t, data, locale } = useSite(); return <section className="section not-found container"><span className="error-number">404</span><h1>{t("找不到頁面")}</h1><p>{t("您所查詢的頁面不存在或網址已變更，請返回首頁繼續瀏覽。")}</p><Button asChild><Link to="/">{t("返回首頁")}<ArrowRight size={18}/></Link></Button></section>; }
export function App({ base = '/', path = '/' }: {
    base?: string;
    path?: string;
}) {
    const locale = localeFromPath(path), pagePath = contentPath(path), data = publicContent[locale === 'en' ? 'en' : 'zh'];
    const t = (message: string, ...values: Array<string | number>) => translate(locale, message, ...values);
    const route = resolveRoute(path, data, locale);
    let page: ReactNode;
    useEffect(() => { document.documentElement.lang = locale; if (route.kind === 'not-found')
        document.title = t(t("找不到頁面")) + ' | ' + data.institution.shortName; }, [locale, route.kind]);
    if (route.kind === 'event')
        page = <EventDetail item={data.events.find(r => r.slug === route.slug)!}/>;
    else if (route.kind === 'not-found')
        page = <NotFound />;
    else
        page = ({ '/': <Home />, '/about/': <About />, '/about/people/': <People />, '/about/facilities/': <Facilities />, '/education/': <Education />, '/collaboration/': <Collaboration />, '/international/': <International />, '/news/': <NewsPage />, '/contact/': <Contact /> } as Record<string, ReactNode>)[pagePath];
    return <SiteContext.Provider value={{ base, path: pagePath, locale, data, t }}><Header /><main id="main" tabIndex={-1}>{page}</main><Footer /></SiteContext.Provider>;
}

function LanguageSwitch(){
 const {locale,path,base,t}=useSite();
 return <nav className="language-switch" aria-label={t('網站語言')}>
 {(['zh-Hant','en'] as const).map(language=><a key={language} lang={language} hrefLang={language} aria-current={locale===language?'page':undefined} href={withBase(languagePath(path,language),base)} onClick={event=>{if(window.location.hash)event.currentTarget.href+=window.location.hash;}}>{language==='en'?'EN':'繁中'}</a>)}
 </nav>;
}
