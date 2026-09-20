import puppeteer from 'puppeteer-core';
import { mkdir } from 'node:fs/promises';

const executablePath = process.env.CHROME_PATH;
if (!executablePath) throw new Error('Set CHROME_PATH to your Chrome or Chromium executable.');
const url = process.env.CAPTURE_URL || 'http://localhost:3015';
await mkdir('docs/screenshots', { recursive: true });
const browser = await puppeteer.launch({ executablePath, headless: true });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
try {
  const page = await browser.newPage();
  page.on('pageerror', error => console.error(error.message));
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 120000 });
  await page.evaluate(() => document.fonts.ready);
  // Hide development tooling, leaving the application unchanged.
  await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });
  await delay(2500);
  await page.screenshot({ path: 'docs/screenshots/desktop-home.png' });
  for (const section of ['editorial', 'membership']) {
    await page.$eval(`#${section}`, element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
    await delay(2200);
    await page.evaluate(async () => {
      await Promise.all([...document.images].filter(img => {
        const rect = img.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < innerHeight;
      }).map(img => img.decode().catch(() => {})));
    });
    await page.screenshot({ path: `docs/screenshots/desktop-${section}.png` });
  }
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 120000 });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });
  await delay(2500);
  await page.screenshot({ path: 'docs/screenshots/mobile-home.png' });
  await page.click('[aria-label="Open navigation"]');
  await delay(1000);
  await page.screenshot({ path: 'docs/screenshots/mobile-navigation.png' });
  console.log('Captured five README screenshots.');
} finally {
  await browser.close();
}
