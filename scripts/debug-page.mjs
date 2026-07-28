import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

const consoleErrors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});

const pageErrors = [];
page.on('pageerror', (err) => pageErrors.push(err.message));

const failedRequests = [];
page.on('requestfailed', (req) => {
  failedRequests.push({ url: req.url(), failure: req.failure() });
});

try {
  await page.goto('https://thieuquillabru.github.io/EnergyX/', {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  await page.waitForTimeout(5000);

  const bodyText = await page.evaluate(() => document.body.innerText);

  console.log('=== BODY TEXT (first 1000 chars) ===');
  console.log(bodyText.substring(0, 1000));
  console.log('\n=== CONSOLE ERRORS ===');
  console.log(consoleErrors.length ? consoleErrors.join('\n') : 'NONE');
  console.log('\n=== PAGE ERRORS ===');
  console.log(pageErrors.length ? pageErrors.join('\n') : 'NONE');
  console.log('\n=== FAILED REQUESTS ===');
  console.log(failedRequests.length ? JSON.stringify(failedRequests, null, 2) : 'NONE');

  const hasSkeleton = await page.locator('.animate-pulse').count();
  const hasLoadingText = await page.locator('text=Chargement').count();
  console.log(`\nSkeleton elements: ${hasSkeleton}`);
  console.log(`Loading text elements: ${hasLoadingText}`);

} catch (err) {
  console.log('NAVIGATION ERROR:', err.message);
} finally {
  await browser.close();
}
