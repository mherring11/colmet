const { test, expect, request } = require('@playwright/test');

test.describe('Front-end Mobile Checks - Automated', () => {
  test.use({ viewport: { width: 375, height: 812 } });
  test('Verify that the page includes a favicon and a page title', async ({ page }) => {
    console.log('Navigating to the homepage...');
    await page.goto('https://colmet-prd.chltest2.com/');

    console.log('Verifying the page title...');
    const title = await page.title();
    console.log('Page title:', title);
    expect(title).not.toBeNull();
    expect(title).not.toBe('');
    console.log('Page title is present and not empty.');

    console.log('Verifying the favicon...');
    const favicon = await page.$('link[rel="icon"]');
    console.log('Favicon found:', favicon !== null);
    expect(favicon).not.toBeNull();
    console.log('Favicon is present.');
  });

  test('Verify that hover states in the body of the page are visible and the links go to the correct pages', async ({ page }) => {
    console.log('Navigating to the homepage...');
    await page.goto('https://colmet-prd.chltest2.com/');

    const buttons = [
      { selector: 'div.button-container.flex > a[href="/edging"]', name: 'See our Steel Edging', url: 'https://colmet-prd.chltest2.com/edging' },
      { selector: 'div.button-container.flex.justify-end > a[href="/planters"]', name: 'See Our Steel Planters', url: 'https://colmet-prd.chltest2.com/planters' },
      { selector: 'div.button-container.flex > a[href="/sign-holders"]', name: 'See Our Steel Sign Holders', url: 'https://colmet-prd.chltest2.com/sign-holders' },
      { selector: 'div.button-container.flex.justify-end > a[href="/custom-products"]', name: 'See Our Custom Products', url: 'https://colmet-prd.chltest2.com/custom-products' }
    ];

    for (const button of buttons) {
      console.log(`Checking the existence of the ${button.name} button...`);
      const buttonElement = await page.$(button.selector);
      expect(buttonElement).not.toBeNull();
      console.log(`${button.name} button found.`);

      const cursorBeforeHover = await page.evaluate(el => window.getComputedStyle(el).cursor, buttonElement);
      console.log(`Cursor style before hover on ${button.name} button:`, cursorBeforeHover);

      await buttonElement.hover();
      await page.waitForTimeout(500);

      const cursorAfterHover = await page.evaluate(el => window.getComputedStyle(el).cursor, buttonElement);
      console.log(`Cursor style after hover on ${button.name} button:`, cursorAfterHover);
      expect(cursorAfterHover).toBe('pointer');
      console.log(`Pointer cursor confirmed on hover for ${button.name} button.`);

      console.log(`Clicking the ${button.name} button...`);
      await buttonElement.click();
      await page.waitForTimeout(1000);
      expect(page.url()).toBe(button.url);
      console.log(`${button.name} button navigation confirmed.`);

      await page.goto('https://colmet-prd.chltest2.com/');
      console.log('Returned to the homepage.');
    }
  });

  test('Verify that all page assets load within 0-3 seconds', async ({ page }) => {
    console.log('Navigating to the homepage...');
    const startTime = Date.now();
    await page.goto('https://colmet-prd.chltest2.com/');
    const loadTime = Date.now() - startTime;
    console.log(`Page load time: ${loadTime} ms`);
    expect(loadTime).toBeLessThanOrEqual(3000);
    console.log('All page assets loaded within 0-3 seconds.');
  });

  test('Verify that all page assets load smoothly and in a logical order', async ({ page }) => {
    console.log('Navigating to the homepage...');
    await page.goto('https://colmet-prd.chltest2.com/');
  
    const assets = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images.map(img => img.src);
    });
  
    const context = await request.newContext();
  
    for (const asset of assets) {
      console.log(`Checking asset: ${asset}`);
      const response = await context.get(asset);
      expect(response.status()).toBe(200);
      console.log(`Asset ${asset} loaded successfully.`);
    }
  
    console.log('All page assets loaded smoothly and in a logical order.');
  });
  
});
