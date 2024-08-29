const { test, expect } = require('@playwright/test');

test.describe('Online Store Detail Pages Tests', () => {
  test('Verify Favicon and Page Title', async ({ page }) => {
    const url = 'https://colmet-prd.chltest2.com/product/12-in-tapered-flat-stakes-40-bx';
    console.log(`Navigating to ${url}...`);
    await page.goto(url);

    console.log('Checking for the presence of the favicon...');
    const favicon = await page.$('link[rel="icon"]');
    if (favicon) {
      console.log('Favicon is present.');
    } else {
      console.error('Favicon is missing.');
    }

    console.log('Checking for the page title...');
    const title = await page.title();
    if (title) {
      console.log('Page title is:', title);
    } else {
      console.error('Page title is missing.');
    }
  });

  test('Verify Breadcrumb Links', async ({ page }) => {
    const url = 'https://colmet-prd.chltest2.com/product/12-in-tapered-flat-stakes-40-bx';
    console.log(`Navigating to ${url}...`);
    await page.goto(url);

    console.log('Checking breadcrumb links...');
    const breadcrumbLinkSelector = 'div.component.container p a';
    const breadcrumb = await page.$(breadcrumbLinkSelector);

    if (breadcrumb) {
      const breadcrumbText = await breadcrumb.innerText();
      console.log(`Breadcrumb text is: ${breadcrumbText}`);
      if (breadcrumbText !== 'See All') {
        console.error(`Expected breadcrumb text 'See All', but got '${breadcrumbText}'`);
      }

      const breadcrumbUrl = await breadcrumb.getAttribute('href');
      console.log(`Breadcrumb URL is: ${breadcrumbUrl}`);
      if (breadcrumbUrl !== '/shop') {
        console.error(`Expected breadcrumb URL '/shop', but got '${breadcrumbUrl}'`);
      }

      console.log('Clicking breadcrumb link...');
      await breadcrumb.click();
      await page.waitForLoadState('domcontentloaded');
      if (page.url() !== 'https://colmet-prd.chltest2.com/shop') {
        console.error('Failed to navigate to shop page via breadcrumb.');
      } else {
        console.log('Breadcrumb link navigation confirmed.');
      }

      console.log('Navigating back to the original product page...');
      await page.goBack();
      await page.waitForLoadState('domcontentloaded');
      if (page.url() !== url) {
        console.error('Failed to return to the original product page.');
      } else {
        console.log('Returned to the original product page.');
      }
    } else {
      console.error('Breadcrumb link is missing.');
    }
  });

  test('Verify Color Picker Swatches', async ({ page }) => {
    const url = 'https://colmet-prd.chltest2.com/product/12-in-tapered-flat-stakes-40-bx';
    console.log(`Navigating to ${url}...`);
    await page.goto(url);

    const swatchSelector = '.color-container .relative.cursor-pointer.group.inline-block img';
    const imageSelector = '.product-images .swiper-slide-active img';
    const colorNameSelector = '.color-container p:nth-of-type(1)';

    const expectedColors = [
      { colorName: 'Black', imageSrc: 'https://colmetweb.wpenginepowered.com/wp-content/uploads/2020/11/Stake_Black-Glossy.jpg' },
      { colorName: 'Black Texture', imageSrc: 'https://colmetweb.wpenginepowered.com/wp-content/uploads/2020/11/Stake_Black-Tex.jpg' },
      { colorName: 'Brown', imageSrc: 'https://colmetweb.wpenginepowered.com/wp-content/uploads/2020/11/Stake_Brown-Glossy.jpg' },
      { colorName: 'Brown Texture', imageSrc: 'https://colmetweb.wpenginepowered.com/wp-content/uploads/2020/11/Stake_Brown-Tex.jpg' },
      { colorName: 'Galvanized', imageSrc: 'https://colmetweb.wpenginepowered.com/wp-content/uploads/2020/11/Stake_Galv.jpg' },
      { colorName: 'Green', imageSrc: 'https://colmetweb.wpenginepowered.com/wp-content/uploads/2020/11/Stake_Green-Glossy.jpg' },
      { colorName: 'Green Texture', imageSrc: 'https://colmetweb.wpenginepowered.com/wp-content/uploads/2020/11/Stake_Green-Tex.jpg' },
      { colorName: 'Unpainted', imageSrc: 'https://colmetweb.wpenginepowered.com/wp-content/uploads/2020/11/Stake_Unp.jpg' },
    ];

    for (let i = 0; i < expectedColors.length; i++) {
      const swatches = await page.$$(swatchSelector);
      if (swatches[i]) {
        console.log(`Clicking on color swatch: ${expectedColors[i].colorName}`);
        await swatches[i].click();
        await page.waitForTimeout(1000);

        const displayedColorName = await page.$eval(colorNameSelector, el => el.innerText.trim());
        const displayedImageSrc = await page.getAttribute(imageSelector, 'src');

        console.log(`Displayed color name: ${displayedColorName}`);
        console.log(`Displayed image source: ${displayedImageSrc}`);

        if (displayedColorName !== expectedColors[i].colorName) {
          console.error(`Expected color name '${expectedColors[i].colorName}', but got '${displayedColorName}'`);
        }
        if (displayedImageSrc !== expectedColors[i].imageSrc) {
          console.error(`Expected image source '${expectedColors[i].imageSrc}', but got '${displayedImageSrc}'`);
        }

        console.log(`Color swatch ${expectedColors[i].colorName} verified successfully.`);
      } else {
        console.error(`Swatch for color ${expectedColors[i].colorName} is missing.`);
      }
    }
  });

  test('Verify Arrow Controls for Color Picker', async ({ page }) => {
    const url = 'https://colmet-prd.chltest2.com/product/12-in-tapered-flat-stakes-40-bx';
    console.log(`Navigating to ${url}...`);
    await page.goto(url);

    const nextArrowSelector = '.swiper-button.image-swiper-button-next';
    const prevArrowSelector = '.swiper-button.image-swiper-button-prev';
    const imageSelector = '.swiper-slide.swiper-slide-active img';
    const colorNameSelector = '.color-container p:nth-of-type(1)';

    const expectedColors = [
      { colorName: 'Black', imageSrc: 'https://colmetweb.wpenginepowered.com/wp-content/uploads/2020/11/Stake_Black-Glossy.jpg' },
      { colorName: 'Black Texture', imageSrc: 'https://colmetweb.wpenginepowered.com/wp-content/uploads/2020/11/Stake_Black-Tex.jpg' },
      { colorName: 'Brown', imageSrc: 'https://colmetweb.wpenginepowered.com/wp-content/uploads/2020/11/Stake_Brown-Glossy.jpg' },
      { colorName: 'Brown Texture', imageSrc: 'https://colmetweb.wpenginepowered.com/wp-content/uploads/2020/11/Stake_Brown-Tex.jpg' },
      { colorName: 'Galvanized', imageSrc: 'https://colmetweb.wpenginepowered.com/wp-content/uploads/2020/11/Stake_Galv.jpg' },
      { colorName: 'Green', imageSrc: 'https://colmetweb.wpenginepowered.com/wp-content/uploads/2020/11/Stake_Green-Glossy.jpg' },
      { colorName: 'Green Texture', imageSrc: 'https://colmetweb.wpenginepowered.com/wp-content/uploads/2020/11/Stake_Green-Tex.jpg' },
      { colorName: 'Unpainted', imageSrc: 'https://colmetweb.wpenginepowered.com/wp-content/uploads/2020/11/Stake_Unp.jpg' },
    ];

    for (let i = 0; i < expectedColors.length; i++) {
      console.log(`Verifying next arrow for color: ${expectedColors[i].colorName}`);

      const displayedColorName = await page.$eval(colorNameSelector, el => el.innerText.trim());
      const displayedImageSrc = await page.getAttribute(imageSelector, 'src');

      console.log(`Displayed color name: ${displayedColorName}`);
      console.log(`Displayed image source: ${displayedImageSrc}`);

      if (displayedColorName !== expectedColors[i].colorName) {
        console.error(`Expected color name '${expectedColors[i].colorName}', but got '${displayedColorName}'`);
      }
      if (displayedImageSrc !== expectedColors[i].imageSrc) {
        console.error(`Expected image source '${expectedColors[i].imageSrc}', but got '${displayedImageSrc}'`);
      }

      console.log(`Next arrow verified successfully for ${expectedColors[i].colorName}.`);

      await page.click(nextArrowSelector);
      await page.waitForTimeout(1000);
    }

    for (let i = expectedColors.length - 1; i >= 0; i--) {
      console.log(`Verifying previous arrow for color: ${expectedColors[i].colorName}`);

      const displayedColorName = await page.$eval(colorNameSelector, el => el.innerText.trim());
      const displayedImageSrc = await page.getAttribute(imageSelector, 'src');

      console.log(`Displayed color name: ${displayedColorName}`);
      console.log(`Displayed image source: ${displayedImageSrc}`);

      if (displayedColorName !== expectedColors[i].colorName) {
        console.error(`Expected color name '${expectedColors[i].colorName}', but got '${displayedColorName}'`);
      }
      if (displayedImageSrc !== expectedColors[i].imageSrc) {
        console.error(`Expected image source '${expectedColors[i].imageSrc}', but got '${displayedImageSrc}'`);
      }

      console.log(`Previous arrow verified successfully for ${expectedColors[i].colorName}.`);

      await page.click(prevArrowSelector);
      await page.waitForTimeout(1000);
    }
  });

  test('Verify Product Thumbnails', async ({ page }) => {
    const url = 'https://colmet-prd.chltest2.com/product/12-in-tapered-flat-stakes-40-bx';
    console.log(`Navigating to ${url}...`);
    await page.goto(url);

    const swatchSelector = '.color-container .relative.cursor-pointer.group.inline-block img';
    const imageSelector = '.swiper-slide.swiper-slide-active img';
    const colorNameSelector = '.color-container p.mb-1'; 

    const expectedColors = [
      { colorName: 'Black', imageSrc: 'https://colmetweb.wpenginepowered.com/wp-content/uploads/2020/11/Stake_Black-Glossy.jpg' },
      { colorName: 'Black Texture', imageSrc: 'https://colmetweb.wpenginepowered.com/wp-content/uploads/2020/11/Stake_Black-Tex.jpg' },
      { colorName: 'Brown', imageSrc: 'https://colmetweb.wpenginepowered.com/wp-content/uploads/2020/11/Stake_Brown-Glossy.jpg' },
      { colorName: 'Brown Texture', imageSrc: 'https://colmetweb.wpenginepowered.com/wp-content/uploads/2020/11/Stake_Brown-Tex.jpg' },
      { colorName: 'Galvanized', imageSrc: 'https://colmetweb.wpenginepowered.com/wp-content/uploads/2020/11/Stake_Galv.jpg' },
      { colorName: 'Green', imageSrc: 'https://colmetweb.wpenginepowered.com/wp-content/uploads/2020/11/Stake_Green-Glossy.jpg' },
      { colorName: 'Green Texture', imageSrc: 'https://colmetweb.wpenginepowered.com/wp-content/uploads/2020/11/Stake_Green-Tex.jpg' },
      { colorName: 'Unpainted', imageSrc: 'https://colmetweb.wpenginepowered.com/wp-content/uploads/2020/11/Stake_Unp.jpg' },
    ];

    for (let i = 0; i < expectedColors.length; i++) {
      const swatches = await page.$$(swatchSelector);
      if (swatches[i]) {
        console.log(`Clicking on color swatch: ${expectedColors[i].colorName}`);
        await swatches[i].click();
        await page.waitForTimeout(1000);

        const displayedColorName = await page.$eval(colorNameSelector, el => el.innerText.trim());
        const displayedImageSrc = await page.getAttribute(imageSelector, 'src');

        console.log(`Displayed color name: ${displayedColorName}`);
        console.log(`Displayed image source: ${displayedImageSrc}`);

        if (displayedColorName !== expectedColors[i].colorName) {
          console.error(`Expected color name '${expectedColors[i].colorName}', but got '${displayedColorName}'`);
        }
        if (displayedImageSrc !== expectedColors[i].imageSrc) {
          console.error(`Expected image source '${expectedColors[i].imageSrc}', but got '${displayedImageSrc}'`);
        }

        console.log(`Color swatch ${expectedColors[i].colorName} verified successfully.`);
      } else {
        console.error(`Swatch for color ${expectedColors[i].colorName} is missing.`);
      }
    }
  });

  test('Verify Increment/Decrement, Add to Cart, and Cart Navigation', async ({ page }) => {
    const url = 'https://colmet-prd.chltest2.com/product/12-in-tapered-flat-stakes-40-bx';
    console.log(`Navigating to ${url}...`);
    await page.goto(url);

    const quantityInputSelector = 'input[type="number"]';
    const addToCartButtonSelector = 'button.btn';
    const cartQuantitySelector = 'span.ml-2.text-sm.font-medium.text-yellow.lg\\:text-white.lg\\:group-hover\\:text-white\\/75';
    const cartIconSelector = 'li.hidden.lg\\:flex a[href="/cart"]'; 

    console.log('Incrementing quantity to 3...');
    for (let increment = 1; increment <= 3; increment++) {
      console.log(`Setting quantity to ${increment}...`);
      await page.fill(quantityInputSelector, String(increment));
      const quantityValue = await page.$eval(quantityInputSelector, el => el.value);
      console.log(`Quantity input set to: ${quantityValue}`);
      await page.waitForTimeout(500);
    }

    console.log('Decrementing quantity down to 1...');
    for (let decrement = 3; decrement >= 1; decrement--) {
      console.log(`Setting quantity to ${decrement}...`);
      await page.fill(quantityInputSelector, String(decrement));
      const quantityValue = await page.$eval(quantityInputSelector, el => el.value);
      console.log(`Quantity input set to: ${quantityValue}`);
      await page.waitForTimeout(500);
    }

    console.log('Incrementing quantity back up to 3...');
    for (let increment = 1; increment <= 3; increment++) {
      console.log(`Setting quantity to ${increment}...`);
      await page.fill(quantityInputSelector, String(increment));
      const quantityValue = await page.$eval(quantityInputSelector, el => el.value);
      console.log(`Quantity input set to: ${quantityValue}`);
      await page.waitForTimeout(500);
    }

    console.log('Clicking Add to Cart button...');
    await page.click(addToCartButtonSelector);
    await page.waitForTimeout(1000);

    await page.waitForSelector(cartQuantitySelector);

    const cartQuantity = await page.$eval(cartQuantitySelector, el => el.innerText.trim());
    console.log(`Cart quantity displayed as: ${cartQuantity}`);

    if (parseInt(cartQuantity) !== 3) {
      console.error(`Expected cart quantity '3', but got '${cartQuantity}'`);
    } else {
      console.log(`Cart quantity '${cartQuantity}' matches expected value.`);
    }

    console.log('Clicking the shopping cart icon...');
    await page.click(cartIconSelector);
    await page.waitForLoadState('domcontentloaded');

    const currentUrl = await page.url();
    console.log(`Navigated to URL: ${currentUrl}`);
    expect(currentUrl).toBe('https://colmet-prd.chltest2.com/cart');
    console.log('Successfully navigated to the cart page.');
  });

  test('Verify See Full Description and See Less', async ({ page }) => {
    const url = 'https://colmet-prd.chltest2.com/product/12-in-tapered-flat-stakes-40-bx';
    console.log(`Navigating to ${url}...`);
    await page.goto(url);

    const seeFullDescriptionSelector = 'p.flex.align-items-center.mb-0:has-text("See Full Description")';
    const seeLessSelector = 'p.flex.align-items-center.mb-0:has-text("See Less")';
    const productDetailsSelector = '.product-details div > ul';

    console.log('Clicking See Full Description...');
    await page.click(seeFullDescriptionSelector);
    await page.waitForTimeout(1000);

    const detailsVisible = await page.isVisible(productDetailsSelector);
    console.log(`Product details visible: ${detailsVisible}`);
    expect(detailsVisible).toBe(true);

    console.log('Clicking See Less...');
    await page.click(seeLessSelector);
    await page.waitForTimeout(1000);

    const seeFullDescriptionVisible = await page.isVisible(seeFullDescriptionSelector);
    console.log(`See Full Description link visible: ${seeFullDescriptionVisible}`);
    expect(seeFullDescriptionVisible).toBe(true);
  });

  test('Verify Hover States and Link Navigation', async ({ page }) => {
    const url = 'https://colmet-prd.chltest2.com/product/12-in-tapered-flat-stakes-40-bx';
    console.log(`Navigating to ${url}...`);
    await page.goto(url);

    const links = [
      { selector: 'a[href*="/edging"]', name: 'Edging', url: 'https://colmet-prd.chltest2.com/edging' },
      { selector: 'a[href*="/planters"]', name: 'Planters', url: 'https://colmet-prd.chltest2.com/planters' },
      { selector: 'a[href*="/sign-holders"]', name: 'Sign Holders', url: 'https://colmet-prd.chltest2.com/sign-holders' },
      { selector: 'a[href*="/custom-products"]', name: 'Custom Products', url: 'https://colmet-prd.chltest2.com/custom-products' }
    ];

    for (const link of links) {
      console.log(`Checking the existence of the ${link.name} link...`);
      await page.waitForSelector(link.selector, { timeout: 5000 });
      const linkElement = await page.$(link.selector);
      expect(linkElement).not.toBeNull();
      console.log(`${link.name} link found.`);

      const cursorBeforeHover = await page.evaluate(el => window.getComputedStyle(el).cursor, linkElement);
      console.log(`Cursor style before hover on ${link.name} link:`, cursorBeforeHover);

      await linkElement.hover();
      await page.waitForTimeout(500);

      const cursorAfterHover = await page.evaluate(el => window.getComputedStyle(el).cursor, linkElement);
      console.log(`Cursor style after hover on ${link.name} link:`, cursorAfterHover);

      if (cursorAfterHover === 'pointer') {
        console.log(`Pointer cursor confirmed on hover for ${link.name} link.`);
      } else {
        console.warn(`Expected pointer cursor, but got '${cursorAfterHover}' for ${link.name} link.`);
      }

      console.log(`Clicking the ${link.name} link...`);
      
      await page.click(link.selector);
      await page.waitForLoadState('domcontentloaded');
      expect(page.url()).toBe(link.url);
      console.log(`${link.name} link navigation confirmed.`);

      await page.goBack();
      await page.waitForLoadState('domcontentloaded');
      console.log('Returned to the product page.');
    }
  });

  test('Verify Single Related Product', async ({ page }) => {
    const url = 'https://colmet-prd.chltest2.com/product/12-in-tapered-flat-stakes-40-bx';
    console.log(`Navigating to ${url}...`);
    await page.goto(url);

    const relatedProductLinkSelector = '.product.mb-5 a';

    const expectedProductName = '7 ft. Classic Edging with Tapered Flat Stakes (5-pack)';
    const expectedProductUrl = '/product/7-ft-classic-edging-with-tapered-flat-stakes-5-pack';
    const breadcrumbSelector = 'p > a[href="/shop"] + text'; 

    console.log(`Clicking on related product: ${expectedProductName}`);

    await page.click(relatedProductLinkSelector);
    await page.waitForLoadState('domcontentloaded');

    const breadcrumbText = await page.textContent(breadcrumbSelector);

    console.log(`Breadcrumb text: ${breadcrumbText}`);

    if (breadcrumbText.includes(expectedProductName)) {
      console.log(`Successfully navigated to the expected product page for: ${expectedProductName}`);
    } else {
      console.error(`Failed to navigate to the expected product page for '${expectedProductName}', breadcrumb shows: '${breadcrumbText}'`);
    }

    console.log('Returning to the original product page...');
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');

    const returnedPageUrl = await page.url();
    console.log(`Returned to page: ${returnedPageUrl}`);
});
});