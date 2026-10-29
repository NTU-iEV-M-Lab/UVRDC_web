import { test,expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile,mkdir } from 'node:fs/promises';
const config=JSON.parse(await readFile('.local/generated/build-info.json','utf8'));
const bilingualContent=JSON.parse(await readFile('.local/generated/public-content.json','utf8'));
const content=bilingualContent.zh;
const base=config.base;
const origin=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const retired=['research/','research/rain-fog-perception/','research/localization-integrity/','research/port-autonomy/','research/fiber-optic-gyroscope/','research/robust-uav-control/','research/savlink/'];

test('三十四個公開路徑直連與重新整理，舊研究路徑及未知頁回應404',async({page,request})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 expect(config.routes).toHaveLength(34);
 for(const route of config.routes){
  const res=await page.goto(base+route.slice(1));expect(res?.status()).toBe(200);
  await expect(page.locator('main h1')).toHaveCount(1);await page.reload();await expect(page.locator('main')).toBeVisible();
 }
 expect(errors).toEqual([]);
 for(const route of [...retired,...retired.map(r=>'en/'+r),'missing-page/','en/missing-page/']){
  const res=await request.get(base+route);expect(res.status(),route).toBe(404);expect(await res.text()).toContain(route.startsWith('en/')?'Page not found':'找不到頁面');
 }
 await page.goto(base+'research/');await page.getByRole('link',{name:'返回首頁',exact:true}).click();await expect(page).toHaveURL(origin+base);
});

test('首頁四種寬度及手機七入口、鍵盤焦點與目前頁',async({page})=>{
 await mkdir('.local/screenshots',{recursive:true});
 for(const width of [360,768,1280,1440]){
  await page.setViewportSize({width,height:1000});await page.goto(base);
  await page.locator('.hero-visual img').evaluate((el:HTMLImageElement)=>el.decode());
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  await page.screenshot({path:`.local/screenshots/home-${width}.png`,fullPage:true});
  await page.screenshot({path:`.local/screenshots/home-viewport-${width}.png`});
 }
 await page.setViewportSize({width:360,height:800});await page.goto(base);
 await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'跳至主要內容'})).toBeFocused();
 await page.keyboard.press('Enter');await expect(page.locator('main')).toBeFocused();
 const trigger=page.getByRole('button',{name:'開啟選單'});await trigger.focus();await page.keyboard.press('Enter');
 await expect(page.getByRole('dialog')).toBeVisible();
 const nav=page.getByRole('navigation',{name:'手機導覽'});await expect(nav.getByRole('link')).toHaveCount(7);
 await expect(nav).not.toContainText('研究與成果');
 await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();await expect(trigger).toBeFocused();
 await trigger.click();await nav.getByRole('link',{name:'國際交流'}).click();await expect(page).toHaveURL(new RegExp('/international/$'));
 await page.getByRole('button',{name:'開啟選單'}).click();await expect(nav.locator('a[aria-current="page"]')).toContainText('國際交流');
});

test('交流年份篩選、消息分類空結果重設與共用詳細網址',async({page})=>{
 await page.goto(base+'international/');await expect(page.locator('.exchange-card')).toHaveCount(8);
 await page.getByRole('button',{name:'2024',exact:true}).click();await expect(page.locator('.exchange-card')).toHaveCount(3);
 const forumLink=await page.locator('.exchange-card-link[href$="/news/taiwan-us-unmanned-vehicle-forum-2024/"]').getAttribute('href');
 await page.getByRole('button',{name:'2026',exact:true}).click();await expect(page.locator('.exchange-card')).toHaveCount(4);
 await page.getByRole('button',{name:'全部年份',exact:true}).click();await expect(page.locator('.exchange-card')).toHaveCount(8);
 await page.goto(base+'news/');await expect(page.locator('.news-row')).toHaveCount(8);
 expect(await page.locator(`.news-row a[href="${forumLink}"]`).count()).toBe(2);
 await page.getByRole('button',{name:'中心消息',exact:true}).click();await expect(page.getByText('目前沒有符合的內容')).toBeVisible();
 await page.getByRole('button',{name:'查看全部內容'}).click();await expect(page.locator('.news-row')).toHaveCount(8);
 await expect(page.getByRole('link',{name:'立即報名'})).toHaveCount(0);
});

test('雙語首頁先呈現實績與八筆依據，停用JS仍可閱讀與開啟',async({page,browser})=>{
 test.setTimeout(90000);
 for(const locale of ['zh','en']){
  await page.goto(base+(locale==='en'?'en/':''));
  const impact=page.locator('#center-impact');
  await expect(impact.locator('[data-impact="organized"]')).toHaveText(locale==='en'?'6 events':'6場');
  await expect(impact.locator('[data-impact="records"]')).toHaveText(locale==='en'?'8 records':'8筆');
  await expect(impact.locator('[data-impact="years"]')).toHaveText('2024–2026');
  await expect(impact.locator('.impact-story')).toHaveCount(4);await expect(impact.locator('.impact-evidence-link')).toHaveCount(8);
  await expect(impact.locator('.impact-story>.media img')).toHaveCount(2);
  await expect(impact.locator('#impact-taiwan-europe').locator('..').locator('.media img')).toHaveAttribute('src',base+'assets/event-tdth.webp');
  await expect(impact.locator('#impact-guam').locator('..').locator('.media img')).toHaveAttribute('src',base+'assets/event-guam-2026-uog.webp');
  const law=impact.locator('.impact-evidence-link[href*="ai-law-generative-ai-conference-2024"]');
  await expect(law).toContainText(locale==='en'?'Historical program':'歷史議程');
  expect(await impact.evaluate(e=>Boolean(e.compareDocumentPosition(document.querySelector('.mission-section')!)&Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.getByRole('link',{name:locale==='en'?'See the Center in action':'查看中心實績',exact:true}).click();
  await expect(page).toHaveURL(/#center-impact$/);await expect(impact).toBeInViewport();
  for(const width of [360,768,1280,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(base+(locale==='en'?'en/':''));
   await impact.locator('img').evaluateAll(async images=>{await Promise.all(images.map(image=>{const img=image as HTMLImageElement;img.loading='eager';return img.decode();}));});
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze();expect(audit.violations).toEqual([]);
   const small=await impact.evaluate(element=>{
    const found:string[]=[];const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);let node:Node|null;
    while((node=walker.nextNode())){const parent=node.parentElement;if(!parent||!node.textContent?.trim()||parent.closest('[aria-hidden="true"]')||!parent.getClientRects().length)continue;if(parseFloat(getComputedStyle(parent).fontSize)<14)found.push(node.textContent.trim());}
    return found;
   });expect(small).toEqual([]);
   await page.locator('html').evaluate(element=>{element.style.fontSize='125%';});
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
 }
 const context=await browser.newContext({javaScriptEnabled:false});
 try{
  const staticPage=await context.newPage();await staticPage.goto(origin+base+'en/');
  await expect(staticPage.locator('.impact-evidence-link')).toHaveCount(8);
  await staticPage.locator('.impact-evidence-link[href*="university-of-guam-exchange-2026"]').click();
  await expect(staticPage.locator('main h1')).toHaveText('University of Guam Exchange Visit');
 }finally{await context.close();}
});

test('八篇紀錄都有完整正文、角色、可讀議程與正確活動照片',async({page})=>{
 await mkdir('.local/screenshots',{recursive:true});
 for(const event of content.events){
  await page.goto(base+`news/${event.slug}/`);
  await expect(page.locator('.article-prose>section')).toHaveCount(event.sections.length);
  await expect(page.locator('.event-facts')).toContainText(event.centerRole);
  await expect(page.locator('.event-facts')).toContainText(event.recordType==='program'?'歷史議程':'活動回顧');
  if(event.agenda.length){
   const details=page.locator('.event-agenda details');
   if(await details.getAttribute('open')===null)await details.locator('summary').click();
   await expect(details.locator('li')).toHaveCount(event.agenda.length);await expect(details.locator('li').last()).toBeVisible();
  }
  if(event.image)await expect(page.locator('.event-media img')).toHaveAttribute('src',base+event.image);
  else await expect(page.locator('.event-topic-cover')).toContainText('議題示意');
  await expect(page.locator('.gallery-grid .media')).toHaveCount(event.gallery.length);
 }
 await page.goto(base+'news/university-of-guam-exchange-2026/');
 await expect(page.locator('.article-prose')).toContainText('關島經濟發展局');
 await page.screenshot({path:'.local/screenshots/guam-desktop.png',fullPage:true});
 await page.setViewportSize({width:360,height:900});await page.screenshot({path:'.local/screenshots/guam-mobile.png',fullPage:true});
 await page.goto(base+'news/taiwan-us-unmanned-vehicle-forum-2024/');await expect(page.locator('.gallery-grid')).toContainText('參展單位');
 await page.screenshot({path:'.local/screenshots/forum-mobile.png',fullPage:true});
});

test('課程方向及聯絡信箱可讀可用',async({page})=>{
 for(const language of ['','en/']){
  await page.goto(base+language+'education/');
  await expect(page.locator('.training-tracks .status')).toHaveCount(0);
  await expect(page.locator('main')).not.toContainText(/依公告辦理|計畫書撰寫中|Subject to announcement/);
  const modules=page.locator('.course-details');await expect(modules).toHaveCount(6);
  for(const module of await modules.all()){
   await module.locator('summary').click();await expect(module).toHaveAttribute('open','');
   await expect(module.locator('li')).toHaveCount(3);await expect(module.locator('p').last()).toBeVisible();
   await module.locator('summary').click();await expect(module).not.toHaveAttribute('open','');
  }
 }
 await page.goto(base+'contact/');await expect(page.getByRole('link',{name:'kangli@ntu.edu.tw'})).toHaveAttribute('href','mailto:kangli@ntu.edu.tw');
});

test('新增歷史活動的報告角色、日期與海報呈現正確',async({page})=>{
 await page.goto(base+'international/');await page.getByRole('button',{name:'2024',exact:true}).click();
 const conference=page.locator('.exchange-card').filter({has:page.getByRole('heading',{name:'2024 第七屆人工智慧與法律國際學術研討會',exact:true})});
 await expect(conference).toContainText('主任報告・依議程');await conference.locator('.exchange-card-link').click();
 await expect(page.locator('.event-facts')).toContainText('歷史議程');await expect(page.locator('.event-facts')).not.toContainText('活動回顧');
 await expect(page.locator('.event-facts')).toContainText('中心未列主辦單位');await expect(page.locator('.event-topic-cover')).toContainText('AI & LAW');
 await page.locator('.event-agenda summary').click();await expect(page.locator('.event-agenda li')).toHaveCount(11);
 await expect(page.locator('.event-agenda li').filter({hasText:'10:55–12:20'})).toContainText('李綱主任');
 await page.goto(base+'news/pqc-automotive-cybersecurity-2024/');
 await expect(page.locator('.event-facts')).toContainText('2024.11.07');await expect(page.locator('.event-facts')).toContainText('共同主辦');
 await expect(page.locator('.event-agenda .agenda-time')).toHaveText(['10:00–10:10','10:10–11:00','11:00–11:15','11:15–11:45','11:45–12:15']);
 await expect(page.locator('.event-media figcaption')).toContainText('不代表目前開放報名');
 const poster=page.locator('.event-media img');await expect(poster).toHaveClass(/is-figure/);
 expect(await poster.evaluate(e=>getComputedStyle(e).objectFit)).toBe('contain');expect(await poster.evaluate(e=>getComputedStyle(e).maxHeight)).toBe('none');
 await expect(page.locator('.resources a[href*="accupass"]')).toHaveCount(0);
 await page.locator('.language-switch').getByRole('link',{name:'EN',exact:true}).click();
 await expect(page.locator('.event-media figcaption')).toContainText('historical');
 await page.goto(base+'en/news/ai-law-generative-ai-conference-2024/');await expect(page.locator('.event-facts')).toContainText('Historical program');
});

test('中心主任、組織架構及實體設備來源各自清楚',async({page})=>{
 await page.goto(base+'about/people/');const director=page.getByRole('article',{name:'現任中心主任介紹'});
 await expect(director.getByRole('heading',{name:'李綱',exact:true})).toBeVisible();
 await expect(director).toContainText('加州大學柏克萊分校機械工程博士（2009）');
 await expect(director.getByRole('link',{name:'工學院・115 學年度主管名冊'})).toHaveAttribute('href',/www\.eng\.ntu\.edu\.tw/);
 await expect(page.locator('#organization')).toContainText('目前現任主管為李綱主任');
 await page.goto(base+'about/facilities/');
 await expect(page.locator('#research-foundation')).toContainText('中心目前多數實體設備來自臺大機械工程學系智慧型載具與機電整合實驗室');
 await expect(page.locator('#research-foundation a[href*="/research/"]')).toHaveCount(0);
 for(const language of ['','en/']){
  await page.goto(base+language+'about/people/');
  await expect(page.locator('.director-portrait img')).toHaveAttribute('src',base+'assets/director-kang-li.webp');
  await expect(page.locator('.portrait-credit')).toContainText(language?'provided by the Center':'中心提供');
  await expect(page.locator('.director-experience')).toContainText('Berkeley DeepDrive');
  await expect(page.locator('.director-experience')).toContainText('2019–2023');
  expect(await page.locator('.director-portrait img').evaluate(async(image:HTMLImageElement)=>{image.loading='eager';await image.decode();return image.naturalWidth;})).toBe(492);
  await expect(page.locator('.advisory-current li')).toHaveCount(14);
  const former=page.locator('.advisory-former');await former.locator('summary').click();
  await expect(former.locator('li')).toHaveCount(2);await expect(former).toContainText('2026-06-30');
  expect(await page.locator('main').innerText()).not.toMatch(/@|住址|Email:|簽新聘|簽縮減/);
  await page.goto(base+language+'about/facilities/');
  await expect(page.locator('#equipment-avl img')).toHaveCount(2);
  await expect(page.locator('#equipment-avl')).toContainText('HBM');
  await expect(page.locator('#vehicle-platforms article')).toHaveCount(3);
 }
});

test('中心子頁的桌機鍵盤選單、手機折疊、舊錨點與無JS名冊',async({page,browser})=>{
 for(const language of ['','en/']){
  await page.setViewportSize({width:1440,height:1000});await page.goto(base+language+'about/');
  await expect(page.locator('.about-subnav a')).toHaveCount(3);
  await expect(page.locator('.about-subnav a[aria-current="page"]')).toHaveAttribute('href',base+language+'about/');
  await expect(page.locator('.director-card,#equipment-avl')).toHaveCount(0);
  const trigger=page.locator('.nav-submenu-trigger');await trigger.focus();await page.keyboard.press('Enter');
  const menu=page.locator('.nav-submenu-panel');await expect(menu).toBeVisible();await expect(menu.locator('a')).toHaveCount(3);
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze()).violations).toEqual([]);
  await page.keyboard.press('Tab');await expect(menu.locator('a').first()).toBeFocused();
  await page.keyboard.press('Shift+Tab');await expect(trigger).toBeFocused();
  await page.keyboard.press('ArrowDown');await expect(menu.locator('a').first()).toBeFocused();
  await page.keyboard.press('Escape');await expect(trigger).toBeFocused();await expect(trigger).toHaveAttribute('aria-expanded','false');
  await trigger.hover();await expect(menu).toBeVisible();await menu.locator('a[href$="/about/people/"]').click();
  await expect(page).toHaveURL(origin+base+language+'about/people/');
  await expect(page.locator('.about-subnav a[aria-current="page"]')).toHaveAttribute('href',base+language+'about/people/');
  const member=page.locator('.advisory-current li').first();await member.locator('.advisory-trigger').click();await expect(member.locator('p')).toBeVisible();
  await page.setViewportSize({width:360,height:800});await page.locator('.menu-trigger').click();
  const branch=page.locator('.mobile-about-branch');await branch.locator('button').click();await expect(branch.locator('.mobile-submenu a')).toHaveCount(3);
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze()).violations).toEqual([]);
  await branch.locator('a[href$="/about/facilities/"]').click();await expect(page).toHaveURL(origin+base+language+'about/facilities/');
  await expect(page.getByRole('dialog')).toHaveCount(0);await expect(page.locator('#vehicle-platforms article')).toHaveCount(3);
  await page.goto(base+language+'about/#vehicle-platforms');await expect(page).toHaveURL(origin+base+language+'about/facilities/#vehicle-platforms');
  await page.goto(base+language+'about/#director');await expect(page).toHaveURL(origin+base+language+'about/people/#director');
 }
 const context=await browser.newContext({javaScriptEnabled:false});
 try{
  const staticPage=await context.newPage();
  for(const language of ['','en/']){
   await staticPage.goto(origin+base+language+'about/people/');
   await expect(staticPage.locator('.about-subnav a')).toHaveCount(3);
   const member=staticPage.locator('.advisory-current li').first();await member.locator('summary').click();await expect(member.locator('p')).toBeVisible();
   await staticPage.locator('.about-subnav a[href$="/about/facilities/"]').click();await expect(staticPage.locator('#vehicle-platforms article')).toHaveCount(3);await expect(staticPage.locator('#equipment-avl img')).toHaveCount(2);
  }
 }finally{await context.close();}
});

test('三十四頁WCAG AA與降低動畫設定',async({page})=>{
 test.setTimeout(120000);
 for(const route of config.routes){
  await page.goto(base+route.slice(1));const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze();
  expect(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),route).toEqual([]);
 }
 await page.emulateMedia({reducedMotion:'reduce'});expect(await page.locator('html').evaluate(e=>getComputedStyle(e).scrollBehavior)).toBe('auto');
});

for(const width of [360,768,1280,1440])test(`三十四頁於 ${width}px 無橫向溢出且圖片正常`,async({page})=>{
 test.setTimeout(90000);await page.setViewportSize({width,height:900});
 for(const route of config.routes){
  await page.goto(base+route.slice(1));expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),route).toBe(true);
  await page.locator('img').evaluateAll(async imgs=>{await Promise.all(imgs.map(el=>{const img=el as HTMLImageElement;img.loading='eager';return img.decode();}));});
  expect(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>(i as HTMLImageElement).naturalWidth>0)),route).toBe(true);
 }
 await mkdir('.local/screenshots',{recursive:true});await page.goto(base+'international/');
 await page.locator('img').evaluateAll(async imgs=>{await Promise.all(imgs.map(el=>{const img=el as HTMLImageElement;img.loading='eager';return img.decode();}));});
 await page.screenshot({path:`.local/screenshots/international-${width}.png`,fullPage:true});
});

test('沒有JavaScript仍能閱讀活動、展開議程與查看完整照片',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});
 try{
  const page=await context.newPage();await page.goto(origin+base+'news/taiwan-us-unmanned-vehicle-forum-2024/');
 await expect(page.getByRole('heading',{level:1})).toContainText('2024 台美國際無人載具科技及應用論壇');
  await expect(page.locator('.article-prose>section')).toHaveCount(4);
  await expect(page.locator('.event-agenda li').last()).toBeVisible();
  await expect(page.locator('.event-media').getByRole('link',{name:'檢視完整圖片'})).toHaveAttribute('href',base+'assets/event-forum-2024-main.webp');
  await page.goto(origin+base+'news/taiwan-defense-tech-hackathon-2026/');
  await page.locator('.event-agenda summary').click();await expect(page.locator('.event-agenda li')).toHaveCount(17);
  for(const language of ['','en/']){
   await page.goto(origin+base+language+'education/');
   await expect(page.locator('.course-grid article')).toHaveCount(6);
   const module=page.locator('.course-details').first();await module.locator('summary').click();
   await expect(module.locator('li')).toHaveCount(3);await expect(module.locator('p').last()).toBeVisible();
   await expect(page.locator('.learning-path>li')).toHaveCount(3);
   await page.goto(origin+base+language+'collaboration/');
   await page.locator('.reading-actions a[href$="/contact/#inquiry"]').click();
   await expect(page).toHaveURL(origin+base+language+'contact/#inquiry');
   await expect(page.locator('.preparation-grid>li')).toHaveCount(4);
   const question=page.locator('.contact-faq details').first();
   await question.locator('summary').click();await expect(question).toHaveAttribute('open','');
   await expect(question.locator('p')).toBeVisible();
   await expect(page.locator('.contact-details a[href="mailto:kangli@ntu.edu.tw"]')).toBeVisible();
  }
 }finally{await context.close();}
});

test('全站可見文字至少14px，主要正文與字級放大後仍可閱讀',async({page})=>{
 test.setTimeout(90000);
 for(const width of [360,1440]){
  await page.setViewportSize({width,height:1000});
  for(const route of config.routes){
   await page.goto(base+route.slice(1));
   const small=await page.evaluate(()=>{
    const found:string[]=[];const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    let node:Node|null;
    while((node=walker.nextNode())){
     const parent=node.parentElement;
     if(!parent||!node.textContent?.trim()||parent.closest('[aria-hidden="true"],.sr-only,script,style'))continue;
     const style=getComputedStyle(parent);
     if(style.visibility==='hidden'||!parent.getClientRects().length)continue;
     if(parseFloat(style.fontSize)<14)found.push(`${parent.tagName}.${parent.className}: ${style.fontSize}: ${node.textContent.trim().slice(0,35)}`);
    }
    return found;
   });
   expect(small,`${width}px ${route}`).toEqual([]);
   const paragraphs=page.locator('.prose p,.exchange-card-body>p,.news-row p,.hero-description,.training-tracks p,.course-grid p,.collaboration-list p,.learning-path p,.learning-records p,.process-grid p,.preparation-grid p,.contact-grid .muted,.contact-faq p,.advisory-list p,.equipment-features p');
   expect(await paragraphs.evaluateAll(nodes=>nodes.every(n=>parseFloat(getComputedStyle(n).fontSize)>=Number(innerWidth<=600?18:20))),`${width}px ${route} 正文`).toBe(true);
  }
 }
 for(const width of [360,1440]){
  await page.setViewportSize({width,height:1000});
  for(const route of ['/','/international/','/news/university-of-guam-exchange-2026/','/education/','/collaboration/','/contact/','/en/','/en/international/','/en/news/university-of-guam-exchange-2026/','/en/education/','/en/collaboration/','/en/contact/']){
   await page.goto(base+route.slice(1));
   const before=await page.locator('main p').first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize));
   await page.locator('html').evaluate(e=>{e.style.fontSize='125%';});
   expect(await page.locator('main p').first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThan(before);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width}px ${route} 125% 字級`).toBe(true);
  }
 }
});

test('時間軸與進場動畫尊重降低動畫，卡片仍可操作',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+'international/');
 await expect(page.locator('.timeline-year h3')).toHaveText(['2026','2025','2024']);
 await expect(page.locator('.exchange-card')).toHaveCount(8);
 const animationCount=await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length);
 expect(animationCount).toBe(0);
 await page.getByRole('button',{name:'2025',exact:true}).click();
 await page.locator('.exchange-card-link').click();await expect(page.locator('main h1')).toContainText('供應鏈');
});

test('十七組中英頁面切換保留同頁，英文正文無漏譯',async({page})=>{
 test.setTimeout(90000);
 for(const route of config.routes.filter((p:string)=>!p.startsWith('/en/'))){
  await page.goto(base+route.slice(1));
  await page.locator('.language-switch').getByRole('link',{name:'EN',exact:true}).click();
  await expect(page).toHaveURL(origin+base+'en'+route);
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  expect(await page.locator('main').innerText(),route).not.toMatch(/\p{Script=Han}/u);
  await page.locator('.language-switch').getByRole('link',{name:'繁中',exact:true}).click();
  await expect(page).toHaveURL(origin+base+route.slice(1));
 }
 await page.goto(base+'en/news/university-of-guam-exchange-2026/#gallery');
 await page.locator('.language-switch').getByRole('link',{name:'繁中',exact:true}).click();
 await expect(page).toHaveURL(origin+base+'news/university-of-guam-exchange-2026/#gallery');
 await page.goto(base+'en/');await page.locator('.desktop-nav').getByRole('link',{name:'International Exchange',exact:true}).click();
 await expect(page).toHaveURL(origin+base+'en/international/');
 await page.getByRole('button',{name:'2025',exact:true}).click();await expect(page.locator('.exchange-card')).toHaveCount(1);
 await page.locator('.exchange-card-link').click();await expect(page.locator('main')).toContainText('Betsy Shieh');
 await expect(page.locator('.agenda-time')).toHaveText(['Topic 1','Topic 2','Topic 3','Topic 4']);
});

test('英文手機選單與無JS完整專文可閱讀',async({page,browser})=>{
 await page.setViewportSize({width:360,height:900});await page.goto(base+'en/');
 await page.getByRole('button',{name:'Open menu'}).click();
 const nav=page.getByRole('navigation',{name:'Mobile navigation'});await expect(nav.getByRole('link')).toHaveCount(7);
 await nav.getByRole('link',{name:'Education'}).click();await expect(page).toHaveURL(origin+base+'en/education/');
 const context=await browser.newContext({javaScriptEnabled:false});
 try{
  const staticPage=await context.newPage();await staticPage.goto(origin+base+'en/news/university-of-guam-exchange-2026/');
  await expect(staticPage.locator('html')).toHaveAttribute('lang','en');await expect(staticPage.locator('.article-prose>section')).toHaveCount(bilingualContent.en.events.find((event:{slug:string})=>event.slug==='university-of-guam-exchange-2026').sections.length);
  await expect(staticPage.locator('.brand .center-brand__copy')).toContainText('Unmanned Vehicles');
  await expect(staticPage.locator('.brand img')).toHaveAttribute('src',base+'assets/center-icon.png');
  await expect(staticPage.locator('.resources a')).toHaveCount(4);
  await expect(staticPage.locator('main')).toContainText('Guam Economic Development Authority');
  expect(await staticPage.locator('main').innerText()).not.toMatch(/\p{Script=Han}/u);
  await staticPage.locator('.language-switch').getByRole('link',{name:'繁中',exact:true}).click();await expect(staticPage).toHaveURL(origin+base+'news/university-of-guam-exchange-2026/');
 }finally{await context.close();}
});

test('GitHub根404回應英文未知路徑時安全接管',async({page,request})=>{
 const fallback=await(await request.get(base+'404.html')).text();
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error'&&/hydrat|Minified React|did not match/i.test(m.text()))errors.push(m.text());});
 await page.route('**/en/unknown-language-page/',route=>route.fulfill({status:404,contentType:'text/html',body:fallback}));
 await page.goto(base+'en/unknown-language-page/');await expect(page.locator('html')).toHaveAttribute('lang','en');
 await expect(page.locator('main h1')).toHaveText('Page not found');expect(errors).toEqual([]);
 await page.getByRole('link',{name:'Back to home',exact:true}).click();await expect(page).toHaveURL(origin+base+'en/');
});
