import { chromium } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext({ bypassCSP: true });
const page = await context.newPage();

const failedRequests = [];
page.on('requestfailed', (req) => failedRequests.push({ url: req.url(), err: req.failure()?.errorText }));
const consoleErrors = [];
page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

try {
  await page.goto('https://thieuquillabru.github.io/EnergyX/', { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(6000);

  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('=== PAGE CONTENT (first 800 chars) ===');
  console.log(bodyText.substring(0, 800));
  console.log('\n=== CONSOLE ERRORS ===');
  console.log(consoleErrors.length ? consoleErrors.join('\n') : 'NONE');
  console.log('\n=== FAILED REQUESTS ===');
  console.log(failedRequests.length ? JSON.stringify(failedRequests, null, 2) : 'NONE');

  // Check sidebar logo
  const logoSrc = await page.evaluate(() => {
    const img = document.querySelector('aside img');
    return img ? img.src : 'NO IMG FOUND';
  });
  console.log('\n=== SIDEBAR LOGO SRC ===');
  console.log(logoSrc);

  // Check if skeleton is still showing
  const skeleton = await page.locator('.animate-pulse').count();
  console.log(`\nSkeleton elements: ${skeleton}`);

} catch (err) {
  console.log('ERROR:', err.message);
} finally {
  await browser.close();
}
