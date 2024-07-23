const { test, expect } = require('@playwright/test');

test.describe('Request a Quote Form - Required Fields Check', () => {

  test('Verify that required fields are indicated with an asterisk', async ({ page }) => {
    console.log('Navigating to the Request a Quote page...');
    await page.goto('https://colmet-prd.chltest2.com/request-a-quote');

    const requiredFields = [
      { label: 'Name', selector: 'label:has-text("Name") span.text-maroon' },
      { label: 'Email', selector: 'label:has-text("Email") span.text-maroon' },
      { label: 'Phone', selector: 'label:has-text("Phone") span.text-maroon' },
      { label: 'Company Name', selector: 'label:has-text("Company Name") span.text-maroon' },
      { label: 'I am a...', selector: 'label:has-text("I am a...") span.text-maroon' },
      { label: 'Message', selector: 'label:has-text("Message") span.text-maroon' }
    ];

    for (const field of requiredFields) {
      console.log(`Checking for asterisk on ${field.label} field...`);
      const asterisk = await page.$(field.selector);
      expect(asterisk).not.toBeNull();
      console.log(`${field.label} field is marked as required.`);
    }
  });

});
