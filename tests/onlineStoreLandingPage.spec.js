const { test, expect } = require('@playwright/test');

test.describe('Online Store Landing Page Tests', () => {

  test('Favicon and Title Check', async ({ page }) => {
    console.log('Navigating to the online store landing page...');
    await page.goto('https://colmet-prd.chltest2.com/shop');

    console.log('Checking for the presence of the favicon...');
    const favicon = await page.$('link[rel="icon"]');
    expect(favicon).not.toBeNull();
    console.log('Favicon is present.');

    console.log('Checking for the page title...');
    const title = await page.title();
    expect(title).not.toBe('');
    console.log('Page title is:', title);
  });

  test('Product Categories Filter and Sorting Check', async ({ page }) => {
    console.log('Navigating to the online store landing page...');
    await page.goto('https://colmet-prd.chltest2.com/shop');

    console.log('Selecting the Edging category...');
    await page.check('input[name="edging[]"][value="64"]');
    await page.waitForTimeout(1000);

    console.log('Verifying that only Edging products are displayed...');
    let edgingProducts = await page.$$eval('.product-info p strong', products =>
      products.map(product => product.textContent.trim())
    );
    expect(edgingProducts).toEqual(expect.arrayContaining([
      '4 ft. Classic Edging with Tapered Flat Stakes (5-pack)',
      '4 ft. QuickLock™ Edging with V Stakes (5-pack)',
      '7 ft. Classic Edging with Tapered Flat Stakes (5-pack)',
      '7 ft. QuickLock™ Edging with V Stakes (5-pack)'
    ]));
    console.log('Edging products are correctly displayed.');

    console.log('Unselecting the Edging category...');
    await page.uncheck('input[name="edging[]"][value="64"]');
    await page.waitForTimeout(1000);

    console.log('Selecting the Planters category...');
    await page.check('input[name="planters[]"][value="31"]');
    await page.waitForTimeout(1000);

    console.log('Verifying that only Planters products are displayed...');
    let plantersProducts = await page.$$eval('.product-info p strong', products =>
      products.map(product => product.textContent.trim())
    );
    expect(plantersProducts).toEqual(expect.arrayContaining([
      'FloraForm™ Steel Planters - Colmet® 14 in. x 14 in. x 14 in. 490 Planter - Stainless Steel',
      'FloraForm™ Steel Planters - Colmet® 14 in. x 14 in. x 22 in. 490 Planter - Oxide Patina',
      'FloraForm™ Steel Planters - Colmet® 14 in. x 14 in. x 28 in. 490 Planter - Black Texture',
      'FloraForm™ Steel Planters - Colmet® 16 in. x 16 in. x 16 in. 845 Planter - Stainless Steel',
      'FloraForm™ Steel Planters - Colmet® 16 in. x 16 in. x 24 in. 845 Planter - Oxide Patina',
      'FloraForm™ Steel Planters - Colmet® 16 in. x 16 in. x 32 in. 845 Planter - Black Texture'
    ]));
    console.log('Planters products are correctly displayed.');

    console.log('Unselecting the Planters category...');
    await page.uncheck('input[name="planters[]"][value="31"]');
    await page.waitForTimeout(1000);

    console.log('Selecting the Edging Accessories category...');
    await page.check('input[name="edging-accessories[]"][value="26"]');
    await page.waitForTimeout(1000);

    console.log('Verifying that only Edging Accessories products are displayed...');
    let edgingAccessoriesProducts = await page.$$eval('.product-info p strong', products =>
      products.map(product => product.textContent.trim())
    );
    expect(edgingAccessoriesProducts).toEqual(expect.arrayContaining([
      '12 in. Tapered Flat Stakes - 40/bx',
      'Corner Stake - 5/box',
      'End Piece w/2 attached stakes',
      'Splicing Stake - 5/box',
      'Tree Ring Section - 10/bx',
      'Vinyl Trim Cap - 25\' Roll'
    ]));
    console.log('Edging Accessories products are correctly displayed.');

    console.log('Unselecting the Edging Accessories category...');
    await page.uncheck('input[name="edging-accessories[]"][value="26"]');
    await page.waitForTimeout(1000);

    console.log('Verifying that the products are sorted alphabetically (default ascending)...');
    let alphabeticalProducts = await page.$$eval('.product-info p strong', products =>
      products.map(product => product.textContent.trim())
    );
    expect(alphabeticalProducts).toEqual(expect.arrayContaining([
      '12 in. Tapered Flat Stakes - 40/bx',
      '4 ft. Classic Edging with Tapered Flat Stakes (5-pack)',
      '4 ft. QuickLock™ Edging with V Stakes (5-pack)',
      '7 ft. Classic Edging with Tapered Flat Stakes (5-pack)',
      '7 ft. QuickLock™ Edging with V Stakes (5-pack)',
      'Corner Stake - 5/box',
      'End Piece w/2 attached stakes',
      'FloraForm™ Steel Planters - Colmet® 14 in. x 14 in. x 14 in. 490 Planter - Stainless Steel',
      'FloraForm™ Steel Planters - Colmet® 14 in. x 14 in. x 22 in. 490 Planter - Oxide Patina',
      'FloraForm™ Steel Planters - Colmet® 14 in. x 14 in. x 28 in. 490 Planter - Black Texture',
      'FloraForm™ Steel Planters - Colmet® 16 in. x 16 in. x 16 in. 845 Planter - Stainless Steel',
      'FloraForm™ Steel Planters - Colmet® 16 in. x 16 in. x 24 in. 845 Planter - Oxide Patina',
      'FloraForm™ Steel Planters - Colmet® 16 in. x 16 in. x 32 in. 845 Planter - Black Texture',
      'Splicing Stake - 5/box',
      'Tree Ring Section - 10/bx',
      'Vinyl Trim Cap - 25\' Roll'
    ]));
    console.log('Products are correctly sorted alphabetically (ascending).');

    console.log('Selecting the Ascending direction...');
    await page.check('input#ascending');
    await page.waitForTimeout(1000);

    console.log('Verifying that the products are sorted in ascending order...');
    let ascendingProducts = await page.$$eval('.product-info p strong', products =>
      products.map(product => product.textContent.trim())
    );
    expect(ascendingProducts).toEqual([
      '12 in. Tapered Flat Stakes - 40/bx',
      '4 ft. Classic Edging with Tapered Flat Stakes (5-pack)',
      '4 ft. QuickLock™ Edging with V Stakes (5-pack)',
      '7 ft. Classic Edging with Tapered Flat Stakes (5-pack)',
      '7 ft. QuickLock™ Edging with V Stakes (5-pack)',
      'Corner Stake - 5/box',
      'End Piece w/2 attached stakes',
      'FloraForm™ Steel Planters - Colmet® 14 in. x 14 in. x 14 in. 490 Planter - Stainless Steel',
      'FloraForm™ Steel Planters - Colmet® 14 in. x 14 in. x 22 in. 490 Planter - Oxide Patina',
      'FloraForm™ Steel Planters - Colmet® 14 in. x 14 in. x 28 in. 490 Planter - Black Texture',
      'FloraForm™ Steel Planters - Colmet® 16 in. x 16 in. x 16 in. 845 Planter - Stainless Steel',
      'FloraForm™ Steel Planters - Colmet® 16 in. x 16 in. x 24 in. 845 Planter - Oxide Patina',
      'FloraForm™ Steel Planters - Colmet® 16 in. x 16 in. x 32 in. 845 Planter - Black Texture',
      'Splicing Stake - 5/box',
      'Tree Ring Section - 10/bx',
      'Vinyl Trim Cap - 25\' Roll'
    ]);
    console.log('Products are correctly sorted in ascending order.');

    console.log('Selecting the Descending direction...');
    await page.check('input#descending');
    await page.waitForTimeout(1000);

    console.log('Verifying that the products are sorted in descending order...');
    let descendingProducts = await page.$$eval('.product-info p strong', products =>
      products.map(product => product.textContent.trim())
    );
    expect(descendingProducts).toEqual([
      'Vinyl Trim Cap - 25\' Roll',
      'Tree Ring Section - 10/bx',
      'Splicing Stake - 5/box',
      'FloraForm™ Steel Planters - Colmet® 16 in. x 16 in. x 32 in. 845 Planter - Black Texture',
      'FloraForm™ Steel Planters - Colmet® 16 in. x 16 in. x 24 in. 845 Planter - Oxide Patina',
      'FloraForm™ Steel Planters - Colmet® 16 in. x 16 in. x 16 in. 845 Planter - Stainless Steel',
      'FloraForm™ Steel Planters - Colmet® 14 in. x 14 in. x 28 in. 490 Planter - Black Texture',
      'FloraForm™ Steel Planters - Colmet® 14 in. x 14 in. x 22 in. 490 Planter - Oxide Patina',
      'FloraForm™ Steel Planters - Colmet® 14 in. x 14 in. x 14 in. 490 Planter - Stainless Steel',
      'End Piece w/2 attached stakes',
      'Corner Stake - 5/box',
      '7 ft. QuickLock™ Edging with V Stakes (5-pack)',
      '7 ft. Classic Edging with Tapered Flat Stakes (5-pack)',
      '4 ft. QuickLock™ Edging with V Stakes (5-pack)',
      '4 ft. Classic Edging with Tapered Flat Stakes (5-pack)',
      '12 in. Tapered Flat Stakes - 40/bx'
    ]);
    console.log('Products are correctly sorted in descending order.');
  });

  test('Verify Hover States and Links in the Body', async ({ page }) => {
    console.log('Navigating to the shop page...');
    await page.goto('https://colmet-prd.chltest2.com/shop');

    const buttons = [
      { selector: 'a[href="/edging"]', name: 'See our Steel Edging', url: 'https://colmet-prd.chltest2.com/edging' },
      { selector: 'a[href="/planters"]', name: 'See Our Steel Planters', url: 'https://colmet-prd.chltest2.com/planters' },
      { selector: 'a[href="/sign-holders"]', name: 'See Our Steel Sign Holders', url: 'https://colmet-prd.chltest2.com/sign-holders' },
      { selector: 'a[href="/custom-products"]', name: 'See Our Custom Products', url: 'https://colmet-prd.chltest2.com/custom-products' }
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

      await page.goto('https://colmet-prd.chltest2.com/shop');
      console.log('Returned to the shop page.');
    }
  });
});
