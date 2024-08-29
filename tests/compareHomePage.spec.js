const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
const sharp = require('sharp');

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

test.describe('Compare existing screenshots with provided images', () => {
  for (const pageInfo of pagesToCompare) {
    test(`Compare ${pageInfo.name} screenshot with provided image`, async () => {
      
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

      
      const numDiffPixels = pixelmatch(providedImage.data, websiteImage.data, diff.data, width, height, { threshold: 0.1 });

      
      fs.writeFileSync(diffImagePath, PNG.sync.write(diff));

      console.log(`Number of different pixels for ${pageInfo.name}: ${numDiffPixels}`);
    });
  }
});
