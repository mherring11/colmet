const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
const sharp = require('sharp');

test('Compare homepage screenshot with provided image', async ({ page }) => {
  // Define paths
  const websiteUrl = 'https://colmet-prd.chltest2.com/';
  const screenshotsDir = path.resolve(__dirname, '..', 'screenshots');
  const providedImagePath = path.resolve(screenshotsDir, 'Homepage.png'); // Corrected to PNG
  const websiteScreenshotPath = path.resolve(screenshotsDir, 'website-homepage.png');
  const diffImagePath = path.resolve(screenshotsDir, 'diff-homepage.png');

  console.log('Provided Image Path:', providedImagePath); // Debug log

  // Ensure the screenshots directory exists
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  // Check if the provided image exists
  if (!fs.existsSync(providedImagePath)) {
    console.log(`Provided image not found at ${providedImagePath}`);
    return;
  }

  // Go to the website and take a screenshot
  await page.goto(websiteUrl);
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.screenshot({ path: websiteScreenshotPath, fullPage: true });

  // Read the provided image
  const providedImage = PNG.sync.read(fs.readFileSync(providedImagePath));
  const { width: providedWidth, height: providedHeight } = providedImage;

  // Resize website screenshot to match provided image dimensions if they are different
  const websiteImageBuffer = fs.readFileSync(websiteScreenshotPath);
  const websiteImageResizedBuffer = await sharp(websiteImageBuffer)
    .resize(providedWidth, providedHeight)
    .toBuffer();
  fs.writeFileSync(websiteScreenshotPath, websiteImageResizedBuffer);

  // Read the resized website screenshot
  const websiteImage = PNG.sync.read(websiteImageResizedBuffer);
  const { width, height } = websiteImage;
  const diff = new PNG({ width, height });

  // Compare the images
  const numDiffPixels = pixelmatch(providedImage.data, websiteImage.data, diff.data, width, height, { threshold: 0.1 });

  // Save the diff image
  fs.writeFileSync(diffImagePath, PNG.sync.write(diff));

  console.log(`Number of different pixels: ${numDiffPixels}`);
});
