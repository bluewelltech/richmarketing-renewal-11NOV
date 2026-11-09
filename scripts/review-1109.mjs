import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const out = 'review/revision-1109';
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const audit = [];
for (const width of [320, 390, 600, 601, 768, 1024, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 1200 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.route('https://connect.facebook.net/**', r => r.abort());
  await page.goto('http://127.0.0.1:5307/?v=revision-1109');
  await page.evaluate(() => document.fonts.ready);
  const layout = await page.evaluate(() => {
    const bounds = selector => {
      const el = document.querySelector(selector);
      const r = el.getBoundingClientRect();
      return { x:r.x, y:r.y, width:r.width, height:r.height, scrollWidth:el.scrollWidth, clientWidth:el.clientWidth };
    };
    const primary = bounds('.product-summary .consult-link');
    const last = bounds('.application .consult-link');
    const price = document.querySelector('.pricing-card--recommended');
    const widths = ['.site-header','.header-brands','.brand','.header-partner','.hero__message','.examples__description','.results-ribbon','.results-chips', '.pricing-grid'].map(selector => ({selector,...bounds(selector)}));
    return {
      pageWidth:innerWidth, scrollWidth:document.documentElement.scrollWidth,
      primaryCenterOffset: primary.x + primary.width/2-innerWidth/2,
      finalCenterOffset:last.x+last.width/2-innerWidth/2,
      widths,
      singleBackground:getComputedStyle(document.querySelector('.pricing-card')).backgroundColor,
      packageBackground:getComputedStyle(price).backgroundImage,
      neonAnimation:getComputedStyle(price,'::after').animationName,
      nav:document.querySelector('.chapter-nav a:last-child').textContent,
      logoLoaded:document.querySelector('.header-partner img').naturalWidth > 0,
    };
  });
  if ([320,390,768,1440].includes(width)) {
    await page.screenshot({path:`${out}/${width}-intro.png`});
    for (const [name, selector] of [['difference','.hero__message'], ['examples','.campaign-story'], ['results','.results-ribbon'], ['pricing','.offer-layout']]) {
      await page.locator(selector).screenshot({path:`${out}/${width}-${name}.png`, animations:'allow'});
    }
  }
  const price = page.locator('.pricing-card--recommended');
  await price.scrollIntoViewIfNeeded();
  const pulse = await price.evaluate(el => {
    const anim=el.getAnimations({subtree:true}).find(a => a.animationName==='package-neon');
    if (!anim) return [];
    anim.pause();
    return [0,1800,3600].map(t => {anim.currentTime=t; return {time:t,opacity:getComputedStyle(el,'::after').opacity};});
  });
  await page.emulateMedia({reducedMotion:'reduce'});
  const reduced=await price.evaluate(el=>getComputedStyle(el,'::after').animationName);
  audit.push({width,layout,pulse,reduced,errors});
  await page.close();
}
await browser.close();
await writeFile(`${out}/layout-audit.json`, JSON.stringify(audit,null,2));
console.log(JSON.stringify(audit.map(({width,layout,pulse,reduced,errors})=>({width,overflow:layout.scrollWidth>width,primaryCenterOffset:layout.primaryCenterOffset,finalCenterOffset:layout.finalCenterOffset,elementOverflow:layout.widths.filter(b=>b.scrollWidth>b.clientWidth+1),logoLoaded:layout.logoLoaded,nav:layout.nav,pulse,reduced,errors})),null,2));
