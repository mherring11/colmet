const { test, expect } = require('@playwright/test');

test.describe('Global Navigation Checks - Automated', () => {
  test('Verify Colmet logo links to the homepage', async ({ page }) => {
    await page.goto('https://colmet-prd.chltest2.com/');
    console.log('Navigated to the homepage.');

    console.log('Checking the existence of the header logo...');
    const headerLogo = await page.$('.Header_brand__vpGcL > a');
    expect(headerLogo).not.toBeNull();
    console.log('Header logo found.');

    console.log('Clicking the header logo...');
    await headerLogo.click();
    await page.waitForTimeout(1000);
    expect(page.url()).toBe('https://colmet-prd.chltest2.com/');
    console.log('Header logo navigation to homepage confirmed.');

    await page.goto('https://colmet-prd.chltest2.com/');
    console.log('Navigated back to the homepage.');

    console.log('Checking the existence of the footer logo...');
    const footerLogo = await page.$('.hidden.lg\\:block > a');
    expect(footerLogo).not.toBeNull();
    console.log('Footer logo found.');

    console.log('Clicking the footer logo...');
    await footerLogo.click();
    await page.waitForTimeout(1000);
    expect(page.url()).toBe('https://colmet-prd.chltest2.com/');
    console.log('Footer logo navigation to homepage confirmed.');
  });
});
