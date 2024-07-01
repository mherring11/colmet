const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test('Take screenshots of images from the mobile view', async ({ page }) => {
  const htmlPath = path.resolve(__dirname, '..', 'index_mobile.html');
  const fileUrl = `file://${htmlPath}`;

  const screenshotsDir = path.resolve(__dirname, '..', 'mobile_screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

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
      console.log(`Screenshot of ${name} captured.`);
    } else {
      console.log(`Element with selector ${selector} not found.`);
    }
  }
});
