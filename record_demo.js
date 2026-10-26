import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const FRAMES_DIR = '/tmp/starpocket_frames';
if (!fs.existsSync(FRAMES_DIR)) {
  fs.mkdirSync(FRAMES_DIR, { recursive: true });
} else {
  fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
  fs.mkdirSync(FRAMES_DIR, { recursive: true });
}

let frameIndex = 0;
async function capture(page, holdCount = 1) {
  const buf = await page.screenshot({ type: 'png' });
  for (let i = 0; i < holdCount; i++) {
    const filename = path.join(FRAMES_DIR, `frame_${String(frameIndex).padStart(5, '0')}.png`);
    fs.writeFileSync(filename, buf);
    frameIndex++;
  }
}

async function run() {
  console.log('🚀 Launching Chromium...');
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 400, height: 820, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  console.log('📱 Navigating to StarPocket...');
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
  await page.evaluate(() => localStorage.setItem('starpocket_lang', 'en'));
  await page.reload({ waitUntil: 'networkidle2' });

  await new Promise(r => setTimeout(r, 1500));
  console.log('📸 Capturing Home Wallet View...');
  await capture(page, 15);

  // Scroll down slightly
  await page.evaluate(() => window.scrollBy({ top: 150, behavior: 'smooth' }));
  await capture(page, 10);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await capture(page, 5);

  // Click Star Vault Tab
  console.log('📸 Navigating to Vault...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const vaultBtn = buttons.find(b => b.textContent.includes('Vault'));
    if (vaultBtn) vaultBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await capture(page, 20);

  // Click Star Swap Tab
  console.log('📸 Navigating to Swap...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const swapBtn = buttons.find(b => b.textContent.includes('Swap'));
    if (swapBtn) swapBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await capture(page, 20);

  // Click Daily Drop Tab
  console.log('📸 Navigating to Daily Drop...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const dropBtn = buttons.find(b => b.textContent.includes('Daily Drop') || b.textContent.includes('Drop'));
    if (dropBtn) dropBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await capture(page, 20);

  // Language Toggle Demo
  console.log('📸 Toggling Language to JA and back to EN...');
  await page.evaluate(() => {
    const langBtn = document.querySelector('header button');
    if (langBtn) langBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await capture(page, 15);

  await page.evaluate(() => {
    const langBtn = document.querySelector('header button');
    if (langBtn) langBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await capture(page, 15);

  // Back to Wallet
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const wBtn = buttons.find(b => b.textContent.includes('Pocket') || b.textContent.includes('Wallet'));
    if (wBtn) wBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await capture(page, 15);

  await browser.close();
  console.log(`✅ Captured ${frameIndex} frames. Encoding video and gif with ffmpeg...`);

  const outputMp4 = '/home/mizuku/lumendrop/demo.mp4';
  const outputGif = '/home/mizuku/lumendrop/demo.gif';

  // Generate MP4 (10 fps)
  execSync(`ffmpeg -y -framerate 10 -i ${FRAMES_DIR}/frame_%05d.png -c:v libx264 -pix_fmt yuv420p -vf "scale=400:-2" ${outputMp4}`);
  console.log('🎉 Created demo.mp4!');

  // Generate lightweight animated GIF with palettegen
  execSync(`ffmpeg -y -framerate 10 -i ${FRAMES_DIR}/frame_%05d.png -vf "fps=10,scale=360:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" ${outputGif}`);
  console.log('🎉 Created demo.gif!');

  // Cleanup frames
  fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
}

run().catch(err => {
  console.error('Recording error:', err);
  process.exit(1);
});
