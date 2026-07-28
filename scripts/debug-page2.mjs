import { chromium } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext({
  bypassCSP: true,
  serviceWorkers: 'block',
});

const page = await context.newPage();

// Intercept and log all requests
const allRequests = [];
const failedRequests = [];
page.on('request', (req) => allRequests.push(req.url()));
page.on('requestfailed', (req) => failedRequests.push({ url: req.url(), failure: req.failure()?.errorText }));

const consoleErrors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});

const pageErrors = [];
page.on('pageerror', (err) => pageErrors.push(err.message));

try {
  // Navigate with cache bypass
  await page.goto('https://thieuquillabru.github.io/EnergyX/', {
    waitUntil: 'networkidle',
    timeout: 45000
  });

  // Wait for React hydration
  await page.waitForTimeout(8000);

  const bodyText = await page.evaluate(() => document.body.innerText);
  const hasSkeleton = await page.locator('.animate-pulse').count();

  console.log('=== BODY TEXT (first 1500 chars) ===');
  console.log(bodyText.substring(0, 1500));
  console.log('\n=== CONSOLE ERRORS ===');
  console.log(consoleErrors.length ? consoleErrors.join('\n') : 'NONE');
  console.log('\n=== PAGE ERRORS ===');
  console.log(pageErrors.length ? pageErrors.join('\n') : 'NONE');
  console.log('\n=== FAILED REQUESTS ===');
  console.log(failedRequests.length ? JSON.stringify(failedRequests, null, 2) : 'NONE');
  console.log(`\nSkeleton elements: ${hasSkeleton}`);

  // Check if any energyx (lowercase) request was made
  const lowercaseReqs = allRequests.filter(u => u.includes('/energyx/'));
  if (lowercaseReqs.length) {
    console.log('\n=== LOWERCASE URL REQUESTS (should be 0) ===');
    lowercaseReqs.forEach(u => console.log(u));
  }

} catch (err) {
  console.log('ERROR:', err.message);
} finally {
  await browser.close();
}
