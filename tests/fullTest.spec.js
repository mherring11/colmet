const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
const sharp = require('sharp');

async function takeDesktopScreenshots(page) {
  const htmlPath = path.resolve(__dirname, '..', 'index.html');
  const fileUrl = `file://${htmlPath}`;

  const screenshotsDir = path.resolve(__dirname, '..', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  await page.setViewportSize({ width: 1920, height: 1080 });

  await page.goto(fileUrl);
  await page.waitForTimeout(2000);

  const imageSelectors = [
    { selector: '#Homepage', name: 'Homepage' },
    { selector: '#Category_Landing_Page', name: 'Category_Landing_Page' },
    { selector: '#Product_Page', name: 'Product_Page' },
    { selector: '#Product_Page_New', name: 'Product_Page_New' },
    { selector: '#About_Us', name: 'About_Us' },
    { selector: '#Blog_List', name: 'Blog_List' },
    { selector: '#Blog_Post', name: 'Blog_Post' },
    { selector: '#Search_Results', name: 'Search_Results' },
    { selector: '#Photo_Gallery', name: 'Photo_Gallery' },
    { selector: '#Privacy_Patents_Terms', name: 'Privacy_Patents_Terms' },
    { selector: '#Estimator_Bot', name: 'Estimator_Bot' },
    { selector: '#Estimator_Bot_Modal', name: 'Estimator_Bot_Modal' },
    { selector: '#Filter', name: 'Filter' },
    { selector: '#Product', name: 'Product' },
    { selector: '#Cart', name: 'Cart' },
    { selector: '#Checkout', name: 'Checkout' },
    { selector: '#Confirmation', name: 'Confirmation' },
    { selector: '#Order_Status', name: 'Order_Status' },
  ];

  for (let i = 0; i < imageSelectors.length; i++) {
    const { selector, name } = imageSelectors[i];
    const element = await page.$(selector);
    if (element) {
      await element.screenshot({ path: path.resolve(screenshotsDir, `${name}.png`) });
      console.log(`Screenshot of ${name} captured.`);
    } else {
      console.log(`Element with selector ${selector} not found.`);
    }
  }
}

async function capturePreProdScreenshots(page) {
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

  for (const pageInfo of pagesToCapture) {
    for (const viewport of viewports) {
      const screenshotsDir = path.resolve(__dirname, '..', 'screenshots', `${pageInfo.name}_${viewport.name}`);
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }

      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(pageInfo.url);
      await page.waitForTimeout(2000); 

      const screenshotPath = path.resolve(screenshotsDir, `${pageInfo.name}_${viewport.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Captured screenshot of ${pageInfo.name} at ${viewport.name} size`);
    }
  }
}

async function compareScreenshotsWithProvidedImages() {
  const pagesToCompare = [
    {
      name: 'Homepage',
      providedImageFolder: 'Homepage_Desktop',
      providedImageFile: 'Homepage_Desktop.png',
      websiteImageFile: 'Homepage.png',
      diffImageFile: 'diff-homepage.png',
    },
    {
      name: 'About Us',
      providedImageFolder: 'About_Us_Desktop',
      providedImageFile: 'About_Us_Desktop.png',
      websiteImageFile: 'About_Us.png',
      diffImageFile: 'diff-about-us.png',
    },
    {
      name: 'Blog List',
      providedImageFolder: 'Blog_List_Desktop',
      providedImageFile: 'Blog_List_Desktop.png',
      websiteImageFile: 'Blog_List.png',
      diffImageFile: 'diff-blog-list.png',
    },
  ];

  for (const pageInfo of pagesToCompare) {
    const screenshotsDir = path.resolve(__dirname, '..', 'screenshots');
    const diffsDir = path.resolve(screenshotsDir, 'diffs');
    const providedImagePath = path.resolve(screenshotsDir, pageInfo.providedImageFolder, pageInfo.providedImageFile);
    const websiteScreenshotPath = path.resolve(screenshotsDir, pageInfo.websiteImageFile);
    const diffImagePath = path.resolve(diffsDir, pageInfo.diffImageFile);

    console.log('Provided Image Path:', providedImagePath);
    console.log('Website Screenshot Path:', websiteScreenshotPath);

    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir);
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

    const providedImage = PNG.sync.read(fs.readFileSync(providedImagePath));
    const { width: providedWidth, height: providedHeight } = providedImage;

    const websiteImageBuffer = fs.readFileSync(websiteScreenshotPath);
    const websiteImageResizedBuffer = await sharp(websiteImageBuffer)
      .resize(providedWidth, providedHeight)
      .toBuffer();
    const websiteImage = PNG.sync.read(websiteImageResizedBuffer);
    const { width, height } = websiteImage;
    const diff = new PNG({ width, height });

    console.log(`Provided Image Size: ${providedWidth}x${providedHeight}`);
    console.log(`Website Image Size: ${width}x${height}`);

    const numDiffPixels = pixelmatch(providedImage.data, websiteImage.data, diff.data, width, height, { threshold: 0.05 });

    fs.writeFileSync(diffImagePath, PNG.sync.write(diff));

    console.log(`Number of different pixels for ${pageInfo.name}: ${numDiffPixels}`);
  }
}

test.describe('Combined Test Suite', () => {
  test('Run full test sequence', async ({ page }) => {
    console.log('Running desktop screenshot tests...');
    await takeDesktopScreenshots(page);

    console.log('Running pre-prod screenshot tests...');
    await capturePreProdScreenshots(page);

    console.log('Running screenshot comparison tests...');
    await compareScreenshotsWithProvidedImages();
  });
});
