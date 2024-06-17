const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const pagesToCapture = [
  { url: 'https://colmet-prd.chltest2.com/', name: 'Homepage' },
  { url: 'https://colmet-prd.chltest2.com/about', name: 'About_Us' },
  { url: 'https://colmet-prd.chltest2.com/blog', name: 'Blog_List' },
];

const viewports = [
  { width: 1920, height: 1080, name: 'Desktop' },
  { width: 1024, height: 768, name: 'iPad_Landscape' },
  { width: 768, height: 1024, name: 'iPad_Portrait' }
];

test.describe('Capture screenshots of pre-prod pages', () => {
  for (const pageInfo of pagesToCapture) {
    for (const viewport of viewports) {
      test(`Capture screenshot of ${pageInfo.name} at ${viewport.name} size`, async ({ page }) => {
        const screenshotsDir = path.resolve(__dirname, '..', 'screenshots', `${pageInfo.name}_${viewport.name}`);
        if (!fs.existsSync(screenshotsDir)) {
          fs.mkdirSync(screenshotsDir, { recursive: true });
        }

        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(pageInfo.url);

        const screenshotPath = path.resolve(screenshotsDir, `${pageInfo.name}_${viewport.name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`Captured screenshot of ${pageInfo.name} at ${viewport.name} size`);
      });
    }
  }
});
