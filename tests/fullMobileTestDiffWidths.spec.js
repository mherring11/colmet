const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
const sharp = require('sharp');
const jpeg = require('jpeg-js');

const browserWidths = [320, 480, 768, 1024, 1366, 1440];

// Test 1: Take screenshots of images from the mobile view
test.describe('Full Mobile Test Suite - Varying Widths', () => {
  test('Take screenshots of images from the mobile view', async ({ page }) => {
    const htmlPath = path.resolve(__dirname, '..', 'index_mobile.html');
    const fileUrl = `file://${htmlPath}`;

    for (const width of browserWidths) {
      const screenshotsDir = path.resolve(__dirname, '..', 'mobile_screenshots', `width_${width}`);
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }

      await page.setViewportSize({ width, height: 667 });
      await page.goto(fileUrl);

      const imageSelectors = [
        { selector: '#Homepage', name: 'Homepage_mobile' },
        { selector: '#Category_Landing_Page', name: 'Category_Landing_Page_mobile' },
        { selector: '#Product_Page', name: 'Product_mobile' },
        { selector: '#Product_Page_New', name: 'Product_Page_New_mobile' },
        { selector: '#About_Us', name: 'About_Us_mobile' },
        { selector: '#Blog_List', name: 'Blog_List_mobile' },
        { selector: '#Blog_Post', name: 'Blog_Post_mobile' },
        { selector: '#Search_Results', name: 'Search_Results_mobile' },
        { selector: '#Photo_Gallery', name: 'Photo_Gallery_mobile' },
        { selector: '#Privacy_Patents_Terms', name: 'Privacy_Patents_Terms_mobile' },
        { selector: '#Estimator_Bot', name: 'Estimator_Bot_mobile' },
        { selector: '#Estimator_Bot_Modal', name: 'Estimator_Bot_Modal_mobile' },
        { selector: '#Filter', name: 'Filter_mobile' },
        { selector: '#Product', name: 'Product_mobile' },
        { selector: '#Cart', name: 'Cart_mobile' },
        { selector: '#Checkout', name: 'Checkout_mobile' },
        { selector: '#Confirmation', name: 'Confirmation_mobile' },
        { selector: '#Order_Status', name: 'Order_Status_mobile' },
      ];

      for (let i = 0; i < imageSelectors.length; i++) {
        const { selector, name } = imageSelectors[i];
        const element = await page.$(selector);
        if (element) {
          await element.screenshot({ path: path.resolve(screenshotsDir, `${name}.png`) });
          console.log(`Screenshot of ${name} at width ${width} captured.`);
        } else {
          console.log(`Element with selector ${selector} not found.`);
        }
      }
    }
  });

  // Test 2: Capture screenshots of pre-prod pages in mobile view
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
        for (const width of browserWidths) {
          test(`Capture screenshot of ${pageInfo.name} at ${viewport.name} size and width ${width}`, async ({ page }) => {
            const baseDir = path.resolve(__dirname, '..', 'mobile_screenshots', `width_${width}`);
            const screenshotsDir = path.resolve(baseDir, `${pageInfo.name}_${viewport.name}`);
            if (!fs.existsSync(baseDir)) {
              fs.mkdirSync(baseDir, { recursive: true });
            }
            if (!fs.existsSync(screenshotsDir)) {
              fs.mkdirSync(screenshotsDir, { recursive: true });
            }

            await page.setViewportSize({ width, height: viewport.height });
            await page.goto(pageInfo.url);

            await page.waitForTimeout(2000);

            const screenshotPath = path.resolve(screenshotsDir, `${pageInfo.name}_${viewport.name}.png`);
            await page.screenshot({ path: screenshotPath, fullPage: true });
            console.log(`Captured screenshot of ${pageInfo.name} at ${viewport.name} size and width ${width}`);
          });
        }
      }
    }
  });

  // Test 3: Compare mobile screenshots with provided mobile images
  const pagesToCompare = [
    {
      name: 'Homepage',
      providedImageFolder: 'mobile_jpg',
      providedImageFile: 'Homepage_mobile.jpg',
      websiteImageFolder: 'Homepage_iPhone_XR',
      websiteImageFile: 'Homepage_iPhone_XR.png',
      diffImageFile: 'diff-homepage-mobile.png',
    },
    {
      name: 'About_Us',
      providedImageFolder: 'mobile_jpg',
      providedImageFile: 'About_Us_mobile.jpg',
      websiteImageFolder: 'About_Us_iPhone_XR',
      websiteImageFile: 'About_Us_iPhone_XR.png',
      diffImageFile: 'diff-about-us-mobile.png',
    },
    {
      name: 'Blog_List',
      providedImageFolder: 'mobile_jpg',
      providedImageFile: 'Blog_List_mobile.jpg',
      websiteImageFolder: 'Blog_List_iPhone_XR',
      websiteImageFile: 'Blog_List_iPhone_XR.png',
      diffImageFile: 'diff-blog-list-mobile.png',
    },
  ];

  function readImage(filePath) {
    const fileData = fs.readFileSync(filePath);
    if (filePath.endsWith('.png')) {
      return PNG.sync.read(fileData);
    } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      return jpeg.decode(fileData, { useTArray: true });
    }
    throw new Error('Unsupported image format');
  }

  test.describe('Compare mobile screenshots with provided mobile images', () => {
    for (const pageInfo of pagesToCompare) {
      test(`Compare ${pageInfo.name} screenshot with provided image`, async () => {
        
        const baseDir = path.resolve(__dirname, '..', 'mobile_screenshots');
        const websiteScreenshotsDir = path.resolve(baseDir, pageInfo.websiteImageFolder);
        const diffsDir = path.resolve(baseDir, 'diffs');
        const providedImagePath = path.resolve(__dirname, '..', pageInfo.providedImageFolder, pageInfo.providedImageFile);
        const websiteScreenshotPath = path.resolve(websiteScreenshotsDir, pageInfo.websiteImageFile);
        const diffImagePath = path.resolve(diffsDir, pageInfo.diffImageFile);

        console.log('Provided Image Path:', providedImagePath);
        console.log('Website Screenshot Path:', websiteScreenshotPath);

        // Ensure the screenshots and diffs directories exist
        if (!fs.existsSync(baseDir)) {
          fs.mkdirSync(baseDir);
        }
        if (!fs.existsSync(diffsDir)) {
          fs.mkdirSync(diffsDir);
        }

        if (!fs.existsSync(providedImagePath)) {
          console.log(`Provided image not found at ${providedImagePath}`);
          return;
        }
        if (!fs.existsSync(websiteScreenshotPath)) {
          console.log(`Website screenshot not found at ${websiteScreenshotPath}`);
          return;
        }

        const providedImage = readImage(providedImagePath);
        const { width: providedWidth, height: providedHeight } = providedImage;

        const websiteImageBuffer = fs.readFileSync(websiteScreenshotPath);
        const websiteImageResizedBuffer = await sharp(websiteImageBuffer)
          .resize(providedWidth, providedHeight)
          .toBuffer();
        const websiteImage = PNG.sync.read(websiteImageResizedBuffer);
        const { width, height } = websiteImage;
        const diff = new PNG({ width, height });

        const numDiffPixels = pixelmatch(providedImage.data, websiteImage.data, diff.data, width, height, { threshold: 0.1 });

        fs.writeFileSync(diffImagePath, PNG.sync.write(diff));

        console.log(`Number of different pixels for ${pageInfo.name}: ${numDiffPixels}`);
      });
    }
  });
});
