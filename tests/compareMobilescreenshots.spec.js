const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
const sharp = require('sharp');
const jpeg = require('jpeg-js');

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
