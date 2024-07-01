const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const pagesToCapture = [
  { url: 'https://colmet-prd.chltest2.com/', name: 'Homepage' },
  { url: 'https://colmet-prd.chltest2.com/about', name: 'About_Us' },
  { url: 'https://colmet-prd.chltest2.com/blog', name: 'Blog_List' },
];

const mobileViewports = [
  { width: 375, height: 667, name: 'iPhone_SE' },
  { width: 414, height: 896, name: 'iPhone_XR' },
  { width: 360, height: 640, name: 'Pixel_2' }
];

test.describe('Capture screenshots of pre-prod pages in mobile view', () => {
  for (const pageInfo of pagesToCapture) {
    for (const viewport of mobileViewports) {
      test(`Capture screenshot of ${pageInfo.name} at ${viewport.name} size`, async ({ page }) => {
        const baseDir = path.resolve(__dirname, '..', 'mobile_screenshots');
        const screenshotsDir = path.resolve(baseDir, `${pageInfo.name}_${viewport.name}`);
        if (!fs.existsSync(baseDir)) {
          fs.mkdirSync(baseDir, { recursive: true });
        }
        if (!fs.existsSync(screenshotsDir)) {
          fs.mkdirSync(screenshotsDir, { recursive: true });
        }

        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(pageInfo.url);

        await page.waitForTimeout(2000);

        const screenshotPath = path.resolve(screenshotsDir, `${pageInfo.name}_${viewport.name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`Captured screenshot of ${pageInfo.name} at ${viewport.name} size`);
      });
    }
  }
});
