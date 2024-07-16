const { test, expect } = require('@playwright/test');

test.describe('Global Navigation Mobile Checks - Automated', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('Verify Colmet logo links to the homepage', async ({ page }) => {
    console.log('Navigating to the homepage...');
    await page.goto('https://colmet-prd.chltest2.com/');
    
    console.log('Checking header logo existence...');
    const headerLogo = await page.$('.Header_brand__vpGcL > a');
    expect(headerLogo).not.toBeNull();
    
    console.log('Clicking the header logo...');
    await headerLogo.click();
    await page.waitForTimeout(1000);
    expect(page.url()).toBe('https://colmet-prd.chltest2.com/');
    
    console.log('Navigating back to the homepage...');
    await page.goto('https://colmet-prd.chltest2.com/');
    
    console.log('Checking footer logo existence...');
    const footerLogo = await page.$('.Footer_logocontainer___KU01 > .component > a');
    expect(footerLogo).not.toBeNull();
    
    console.log('Clicking the footer logo...');
    await footerLogo.click();
    await page.waitForTimeout(1000);
    expect(page.url()).toBe('https://colmet-prd.chltest2.com/');
  });

  test('Verify navigation links hover state, cursor, and URLs', async ({ page }) => {
    console.log('Navigating to the homepage...');
    await page.goto('https://colmet-prd.chltest2.com/');
    
    console.log('Checking header logo existence...');
    const headerLogo = await page.$('.Header_brand__vpGcL > a');
    expect(headerLogo).not.toBeNull();
    
    console.log('Checking header logo hover state...');
    const logoElement = await page.$('.Header_brand__vpGcL > a > img');
    const cursorBeforeHoverLogo = await page.evaluate(el => window.getComputedStyle(el).cursor, logoElement);
    console.log('Cursor style before hover on header logo:', cursorBeforeHoverLogo);
    
    await headerLogo.hover();
    await page.waitForTimeout(500);
    
    const cursorAfterHoverLogo = await page.evaluate(el => window.getComputedStyle(el).cursor, logoElement);
    console.log('Cursor style after hover on header logo:', cursorAfterHoverLogo);
    expect(cursorAfterHoverLogo).toBe('pointer');
    console.log('Pointer cursor confirmed on hover for header logo.');

    console.log('Clicking the navigation toggle button...');
    const navToggleButton = await page.$('.Header_nav-toggle__j4Yq8');
    await navToggleButton.click();
    await page.waitForTimeout(1000);

    const navLinks = [
      { selector: 'li:has-text("About Us") > a', name: 'About Us', url: 'https://colmet-prd.chltest2.com/about' },
      { selector: 'li:has-text("Blog") > a', name: 'Blog', url: 'https://colmet-prd.chltest2.com/blog' },
      { selector: 'li:has-text("Shop") > a', name: 'Shop', url: 'https://colmet-prd.chltest2.com/shop' },
      { selector: 'li:has-text("Contact Us") > a', name: 'Contact Us', url: 'https://colmet-prd.chltest2.com/contact-us' },
      { selector: 'li:has-text("Search") > a', name: 'Search', url: 'search' },
      { selector: 'div.flex.lg\\:hidden > a[href="/cart"]', name: 'Cart', url: 'https://colmet-prd.chltest2.com/cart' },
      { selector: 'li:has-text("Edging") > a', name: 'Edging', url: 'https://colmet-prd.chltest2.com/edging' },
      { selector: 'li:has-text("Planters") > a', name: 'Planters', url: 'https://colmet-prd.chltest2.com/planters' },
      { selector: 'li:has-text("Sign Holders") > a', name: 'Sign Holders', url: 'https://colmet-prd.chltest2.com/sign-holders' },
      { selector: 'li:has-text("Bespoke Products") > a', name: 'Bespoke Products', url: 'https://colmet-prd.chltest2.com/custom-products' }
    ];

    for (const link of navLinks) {
      console.log(`Checking the existence of the ${link.name} link...`);
      const navLink = await page.$(link.selector);
      expect(navLink).not.toBeNull();
      
      const cursorBeforeHoverLink = await page.evaluate(el => window.getComputedStyle(el).cursor, navLink);
      console.log(`Cursor style before hover on ${link.name} link:`, cursorBeforeHoverLink);
      
      await navLink.hover();
      await page.waitForTimeout(500);
      
      const cursorAfterHoverLink = await page.evaluate(el => window.getComputedStyle(el).cursor, navLink);
      console.log(`Cursor style after hover on ${link.name} link:`, cursorAfterHoverLink);
      expect(cursorAfterHoverLink).toBe('pointer');
      console.log(`Pointer cursor confirmed on hover for ${link.name} link.`);

      if (link.name !== 'Search') {
        console.log(`Clicking the ${link.name} link...`);
        await navLink.click();
        await page.waitForTimeout(1000);
        expect(page.url()).toBe(link.url);
        console.log(`${link.name} link navigation confirmed.`);
        await page.goto('https://colmet-prd.chltest2.com/');
        console.log('Returned to the homepage.');
        console.log('Clicking the navigation toggle button...');
        const navToggleButton = await page.$('.Header_nav-toggle__j4Yq8');
        await navToggleButton.click();
        await page.waitForTimeout(1000);
      } else {
        console.log('Clicking the search link...');
        await navLink.click();
        await page.waitForTimeout(1000);
        const searchFormButton = await page.$('button[type="submit"]');
        expect(searchFormButton).not.toBeNull();
        console.log('Search form button found and displayed.');
      }
    }
  });

  test('Verify footer links, social links, and global search', async ({ page }) => {
    console.log('Navigating to the homepage...');
    await page.goto('https://colmet-prd.chltest2.com/');
    
    const footerLinks = [
      { selector: 'ul.FooterNavOne_menu__zSY7M > li:has-text("Edging") > a', name: 'Edging', url: 'https://colmet-prd.chltest2.com/edging' },
      { selector: 'ul.FooterNavOne_menu__zSY7M > li:has-text("Planters") > a', name: 'Planters', url: 'https://colmet-prd.chltest2.com/planters' },
      { selector: 'ul.FooterNavOne_menu__zSY7M > li:has-text("Sign Holders") > a', name: 'Sign Holders', url: 'https://colmet-prd.chltest2.com/sign-holders' },
      { selector: 'ul.FooterNavOne_menu__zSY7M > li:has-text("Custom Products") > a', name: 'Custom Products', url: 'https://colmet-prd.chltest2.com/custom-products' },
      { selector: 'ul.FooterNavOne_menu__zSY7M > li:has-text("Gallery") > a', name: 'Gallery', url: 'https://colmet-prd.chltest2.com/gallery' },
      { selector: 'ul.FooterNavTwo_menu__1MnD0 > li:has-text("About Us") > a', name: 'About Us', url: 'https://colmet-prd.chltest2.com/about' },
      { selector: 'ul.FooterNavTwo_menu__1MnD0 > li:has-text("Search") > a', name: 'Search', url: 'search' },
      { selector: 'ul.FooterNavTwo_menu__1MnD0 > li:has-text("Blog") > a', name: 'Blog', url: 'https://colmet-prd.chltest2.com/blog' },
      { selector: 'ul.FooterNavTwo_menu__1MnD0 > li:has-text("Shop Accessories") > a', name: 'Shop Accessories', url: 'https://colmet-prd.chltest2.com/shop/shop-edging-accessories' },
      { selector: 'ul.Footer_menu___k1RN > li:has-text("Privacy Policy") > a', name: 'Privacy Policy', url: 'https://colmet-prd.chltest2.com/privacy-policy' },
      { selector: 'ul.Footer_menu___k1RN > li:has-text("Terms and Conditions") > a', name: 'Terms and Conditions', url: 'https://colmet-prd.chltest2.com/terms-and-conditions' },
      { selector: 'ul.Footer_menu___k1RN > li:has-text("Intellectual Property") > a', name: 'Intellectual Property', url: 'https://colmet-prd.chltest2.com/intellectual-property' }
    ];

    for (const link of footerLinks) {
      console.log(`Checking the existence of the ${link.name} link...`);
      const footerLink = await page.$(link.selector);
      expect(footerLink).not.toBeNull();
      
      const cursorBeforeHoverLink = await page.evaluate(el => window.getComputedStyle(el).cursor, footerLink);
      console.log(`Cursor style before hover on ${link.name} link:`, cursorBeforeHoverLink);
      
      await footerLink.hover();
      await page.waitForTimeout(500);
      
      const cursorAfterHoverLink = await page.evaluate(el => window.getComputedStyle(el).cursor, footerLink);
      console.log(`Cursor style after hover on ${link.name} link:`, cursorAfterHoverLink);
      expect(cursorAfterHoverLink).toBe('pointer');
      console.log(`Pointer cursor confirmed on hover for ${link.name} link.`);

      if (link.name !== 'Search') {
        console.log(`Clicking the ${link.name} link...`);
        await footerLink.click();
        await page.waitForTimeout(1000);
        expect(page.url()).toBe(link.url);
        console.log(`${link.name} link navigation confirmed.`);
        await page.goto('https://colmet-prd.chltest2.com/');
        console.log('Returned to the homepage.');
      } else {
        console.log('Clicking the search link...');
        await footerLink.click();
        await page.waitForTimeout(1000);
        const searchFormButton = await page.$('button[type="submit"]');
        expect(searchFormButton).not.toBeNull();
        console.log('Search form button found and displayed.');
      }
    }

    const socialLinks = [
      { selector: 'a[href="https://www.facebook.com/colmetsteel/"]', name: 'Facebook', url: 'https://www.facebook.com/colmetsteel/' },
      { selector: 'a[href="https://www.instagram.com/colmetsteel/"]', name: 'Instagram', url: 'https://www.instagram.com/colmetsteel/' },
      { selector: 'a[href="https://x.com/colmetsteel"]', name: 'X', url: 'https://x.com/colmetsteel' },
      { selector: 'a[href="https://www.youtube.com/channel/UCo6_qEF9UlvMWeBxB3OgZvg"]', name: 'YouTube', url: 'https://www.youtube.com/channel/UCo6_qEF9UlvMWeBxB3OgZvg' }
    ];

    for (const socialLink of socialLinks) {
      console.log(`Checking the existence of the ${socialLink.name} link...`);
      const socialMediaLink = await page.$(socialLink.selector);
      expect(socialMediaLink).not.toBeNull();
      
      await page.evaluate(el => el.removeAttribute('target'), socialMediaLink);
      console.log(`Clicking the ${socialLink.name} link...`);
      await socialMediaLink.click();
      await page.waitForTimeout(1000);
      
      expect(page.url()).toBe(socialLink.url);
      console.log(`${socialLink.name} link navigation confirmed.`);
      await page.goto('https://colmet-prd.chltest2.com/');
      console.log('Returned to the homepage.');
    }

    console.log('Clicking the navigation toggle button...');
    const navToggleButton = await page.$('.Header_nav-toggle__j4Yq8');
    await navToggleButton.click();
    await page.waitForTimeout(1000);
    
    console.log('Clicking the search link...');
    const searchLink = await page.$('li:has-text("Search") > a');
    await searchLink.click();
    await page.waitForTimeout(1000);
    
    console.log('Entering search term "edging"...');
    const searchInput = await page.$('input[type="search"]');
    await searchInput.fill('edging');
    
    console.log('Submitting the search form...');
    const searchFormButton = await page.$('button[type="submit"]');
    await searchFormButton.click();
    await page.waitForTimeout(1000);
    
    const searchResultsURL = await page.url();
    expect(searchResultsURL).toContain('search?search_query=edging');
    console.log('Search results page confirmed for term "edging".');
  });
});
