const { test, expect } = require('@playwright/test');

test.describe('Contact Us Form - Required Fields Check', () => {

  test('Verify that required fields are indicated with an asterisk', async ({ page }) => {
    console.log('Navigating to the Contact Us page...');
    await page.goto('https://colmet-prd.chltest2.com/contact-us');

    const requiredFields = [
      { label: 'Name', selector: 'label:has-text("Name") span.text-maroon' },
      { label: 'Email', selector: 'label:has-text("Email") span.text-maroon' },
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

  test('Verify that the Name field name appears to the left of the form field', async ({ page }) => {
    console.log('Navigating to the Contact Us page...');
    await page.goto('https://colmet-prd.chltest2.com/contact-us');

    console.log('Checking that the Name field name appears to the left of the form field...');
    const labelElement = await page.$('label:has-text("Name")');
    const fieldElement = await page.$('input[name="input_1_3"]');

    const labelBoundingBox = await labelElement.boundingBox();
    const fieldBoundingBox = await fieldElement.boundingBox();

    // Allowing a margin of error
    const marginOfError = 5;
    expect(labelBoundingBox.x).toBeLessThan(fieldBoundingBox.x + marginOfError);
    console.log('The Name field name appears to the left of the form field.');
  });

  test('Verify that the form contains validation messages for required fields', async ({ page }) => {
    console.log('Navigating to the Contact Us page...');
    await page.goto('https://colmet-prd.chltest2.com/contact-us');

    console.log('Clicking the Submit button to trigger validation messages...');
    const submitButton = await page.$('button[type="submit"].btn');
    await submitButton.click();

    const validationMessages = [
      { label: 'First Name is required', selector: 'span.text-maroon:has-text("First Name is required")' },
      { label: 'Email is required', selector: 'span.text-maroon:has-text("Email is required")' },
      { label: 'Phone is required', selector: 'span.text-maroon:has-text("Phone is required")' },
      { label: 'Company name is required', selector: 'span.text-maroon:has-text("Company name is required")' },
      { label: 'Select option is required', selector: 'span.text-maroon:has-text("Select option is required")' },
      { label: 'Message is required', selector: 'span.text-maroon:has-text("Message is required")' }
    ];

    for (const message of validationMessages) {
      console.log(`Checking for validation message: ${message.label}...`);
      const validationMessage = await page.$(message.selector);
      expect(validationMessage).not.toBeNull();
      console.log(`Validation message for "${message.label}" is present.`);
    }
  });

  test('Verify that the form can\'t be submitted multiple times by rapid succession of clicks on the Submit button', async ({ page }) => {
    console.log('Navigating to the Contact Us page...');
    await page.goto('https://colmet-prd.chltest2.com/contact-us');

    console.log('Simulating rapid succession of clicks on the Submit button...');
    const submitButton = await page.$('button[type="submit"].btn');

    let formSubmitCount = 0;

    await page.route('**/form-submit-endpoint', route => {
      formSubmitCount++;
      route.continue();
    });

    await Promise.all([
      submitButton.click(),
      submitButton.click(),
      submitButton.click(),
      submitButton.click(),
      submitButton.click()
    ]);

    await page.waitForTimeout(1000);

    console.log('Checking that the form was only submitted once...');
    expect(formSubmitCount).toBeLessThanOrEqual(1);
    console.log('Form submission is prevented after the first click.');
  });

  test('Verify that the form includes a honeypot or a captcha to make the form less susceptible to bots', async ({ page }) => {
    console.log('Navigating to the Contact Us page...');
    await page.goto('https://colmet-prd.chltest2.com/contact-us');

    console.log('Filling in the form fields...');
    await page.fill('input[name="input_1_3"]', 'tester');
    await page.fill('input[name="input_1_6"]', 'mctester');
    await page.fill('input[name="input_3"]', 'tester@gmail.com');
    await page.fill('input[name="input_4"]', '1234567890');
    await page.fill('input[name="input_5"]', 'testclicklabs');

    console.log('Selecting "Homeowner" from the dropdown...');
    await page.selectOption('select[name="input_6"]', 'Homeowner');

    console.log('Filling in the Message field...');
    await page.fill('textarea[name="input_8"]', 'this is a test');

    console.log('Clicking the Submit button...');
    const submitButton = await page.$('button[type="submit"].btn');
    await submitButton.click();

    console.log('Checking for honeypot or captcha...');
    const honeypotField = await page.$('input[name="honeypot_field_name"]'); // Replace with actual honeypot field name if available
    const captcha = await page.$('iframe[src*="recaptcha"]');

    expect(honeypotField || captcha).not.toBeNull();
    console.log('Honeypot or captcha is present, making the form less susceptible to bots.');
  });

  test('Verify that a confirmation message is displayed when the form is submitted', async ({ page }) => {
    console.log('Navigating to the Contact Us page...');
    await page.goto('https://colmet-prd.chltest2.com/contact-us');

    console.log('Filling in the form fields...');
    await page.fill('input[name="input_1_3"]', 'tester');
    await page.fill('input[name="input_1_6"]', 'mctester');
    await page.fill('input[name="input_3"]', 'tester@gmail.com');
    await page.fill('input[name="input_4"]', '1234567890');
    await page.fill('input[name="input_5"]', 'testclicklabs');

    console.log('Selecting "Homeowner" from the dropdown...');
    await page.selectOption('select[name="input_6"]', 'Homeowner');

    console.log('Filling in the Message field...');
    await page.fill('textarea[name="input_8"]', 'this is a test');

    console.log('Clicking the Submit button...');
    const submitButton = await page.$('button[type="submit"].btn');
    await submitButton.click();

    console.log('Waiting for confirmation message to appear...');
    await page.waitForSelector('#gform_confirmation_message_6', { timeout: 10000 });

    console.log('Checking for confirmation message...');
    const confirmationMessage = await page.$('#gform_confirmation_message_6');
    expect(confirmationMessage).not.toBeNull();
    console.log('Confirmation message is displayed successfully.');
  });

  test('Verify form submission is recorded in the CMS', async ({ page }) => {
    console.log('Navigating to the WordPress admin login page...');
    await page.goto('https://colmetweb.wpenginepowered.com/wp-login.php?redirect_to=https%3A%2F%2Fcolmetweb.wpenginepowered.com%2Fwp-admin%2F&reauth=1');

    console.log('Logging into the WordPress admin area...');
    await page.fill('input[name="log"]', 'mherring@clickherelabs.com');
    await page.fill('input[name="pwd"]', '0APbB^qTkQVqCr*)(MSGSM%0');
    await page.click('input[type="submit"]');

    console.log('Clicking on "Forms" in the admin menu...');
    await page.waitForSelector('div.wp-menu-name:has-text("Forms")', { timeout: 10000 });
    await page.click('div.wp-menu-name:has-text("Forms")');

    console.log('Navigating to the "Forms" section...');
    await page.waitForSelector('a.wp-first-item.current[aria-current="page"]', { timeout: 10000 });
    await page.click('a.wp-first-item.current[aria-current="page"]');

    console.log('Selecting the "Contact Us" form...');
    await page.waitForSelector('a[href="?page=gf_edit_forms&id=6"]', { timeout: 10000 });
    await page.click('a[href="?page=gf_edit_forms&id=6"]');

    console.log('Navigating to the "Entries" section...');
    await page.waitForSelector('a[aria-label="View entries generated by this form"]', { timeout: 10000 });
    await page.click('a[aria-label="View entries generated by this form"]');

    console.log('Verifying that the form submission is recorded in the CMS...');
    await page.waitForSelector('tbody#the-list', { timeout: 10000 });
    const submission = await page.$('tbody#the-list td:has-text("tester@gmail.com")');
    expect(submission).not.toBeNull();
    console.log('Form submission is recorded in the CMS.');
  });

});
