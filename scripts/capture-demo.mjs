import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

if (!process.env.CHROME_PATH) throw new Error('Set CHROME_PATH to a Chrome or Chromium executable.');
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH, headless: true });
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 850, deviceScaleFactor: 1 });
  await page.goto(process.env.CAPTURE_URL || 'http://localhost:3015', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });
  await wait(2000);
  const frames = [];
  const times = [];
  for (let i = 0; i < 48; i++) {
    const angle = i / 47 * Math.PI * 2;
    await page.mouse.move(600 + Math.sin(angle) * 330, 530 + Math.cos(angle) * 130);
    await wait(80);
    times.push(Date.now());
    frames.push(await sharp(await page.screenshot()).resize(840).png().toBuffer());
  }
  const delay = times.map((time, i) => i < times.length - 1 ? Math.max(20, times[i + 1] - time) : 150);
  await mkdir('docs/screenshots', { recursive: true });
  await sharp(frames, { join: { animated: true } })
    .gif({ loop: 0, delay, colours: 128, dither: 0.5 })
    .toFile('docs/screenshots/motion-preview.gif');
  const info = await sharp('docs/screenshots/motion-preview.gif', { animated: true }).metadata();
  console.log(JSON.stringify({ frames: info.pages, width: info.width, height: info.pageHeight }));
} finally {
  await browser.close();
}
