const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test('Take screenshots of images from the desktop', async ({ page }) => {
  const htmlPath = path.resolve(__dirname, '..', 'index.html');
  const fileUrl = `file://${htmlPath}`;

  const screenshotsDir = path.resolve(__dirname, '..', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  await page.setViewportSize({ width: 1920, height: 1080 });

  await page.goto(fileUrl);

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
});
