const { test, expect } = require('@playwright/test');

test.use({ viewport: { width: 375, height: 812 } }); // iPhone X dimensions

test.describe('Project Estimator - Form Check', () => {
  test('Verify that the project estimator can be accessed globally by clicking the Project Estimator button', async ({ page }) => {
    console.log('Navigating to the home page...');
    await page.goto('https://colmet-prd.chltest2.com/');

    console.log('Clicking the navigation toggle button...');
    await page.click('button.Header_nav-toggle__j4Yq8');

    console.log('Clicking the Project Estimator button...');
    await page.click('.estimator-btn-container .btn');

    console.log('Waiting for the project estimator to become visible...');
    await page.waitForSelector('h5.text-midnight:has-text("Estimator")', { state: 'visible', timeout: 5000 });

    console.log('Verifying that the project estimator is visible...');
    const projectEstimatorVisible = await page.isVisible('h5.text-midnight:has-text("Estimator")');
    expect(projectEstimatorVisible).toBe(true);
    console.log('Project estimator is visible.');
  });

  test('Verify that the product selector drop-down contains the required options', async ({ page }) => {
    console.log('Navigating to the home page...');
    await page.goto('https://colmet-prd.chltest2.com/');

    console.log('Clicking the navigation toggle button...');
    await page.click('button.Header_nav-toggle__j4Yq8');

    console.log('Clicking the Project Estimator button...');
    await page.click('.estimator-btn-container .btn');

    console.log('Waiting for the project estimator to become visible...');
    await page.waitForSelector('h5.text-midnight:has-text("Estimator")', { state: 'visible', timeout: 5000 });

    console.log('Opening the product selector drop-down...');
    const productSelector = await page.$('select[name="product"]');
    await productSelector.click();

    console.log('Verifying the product selector options...');
    const options = await page.$$('select[name="product"] option');
    const expectedOptions = [
      '— Select Product —',
      'Attached Stake Edging',
      'Classic Roll-Top Steel Edging',
      'Classic Steel Edging',
      'Quicklock Edging'
    ];

    for (const [index, option] of options.entries()) {
      const optionText = await option.textContent();
      expect(optionText.trim()).toBe(expectedOptions[index]);
      console.log(`Verified option: ${optionText.trim()}`);
    }
  });

  test('Verify that the third selector drop-down enables site visitors to select "Project distance (in feet)"', async ({ page }) => {
    console.log('Navigating to the home page...');
    await page.goto('https://colmet-prd.chltest2.com/');

    console.log('Clicking the navigation toggle button...');
    await page.click('button.Header_nav-toggle__j4Yq8');

    console.log('Clicking the Project Estimator button...');
    await page.click('.estimator-btn-container .btn');

    console.log('Waiting for the project estimator to become visible...');
    await page.waitForSelector('h5.text-midnight:has-text("Estimator")', { state: 'visible', timeout: 5000 });

    console.log('Verifying the presence of the project distance input field...');
    const distanceInputField = await page.$('input[name="distance"]');
    expect(distanceInputField).not.toBeNull();
    console.log('Project distance input field is present.');

    console.log('Verifying the label of the project distance input field...');
    const distanceLabel = await page.$('label[for="distance"]');
    const labelText = await distanceLabel.textContent();
    expect(labelText.trim()).toBe('Project distance (in feet)');
    console.log('Project distance input field label is correct.');
  });

  test('Verify that the Calculate button is enabled when the project distance is populated', async ({ page }) => {
    console.log('Navigating to the home page...');
    await page.goto('https://colmet-prd.chltest2.com/');

    console.log('Clicking the navigation toggle button...');
    await page.click('button.Header_nav-toggle__j4Yq8');

    console.log('Clicking the Project Estimator button...');
    await page.click('.estimator-btn-container .btn');

    console.log('Waiting for the project estimator to become visible...');
    await page.waitForSelector('h5.text-midnight:has-text("Estimator")', { state: 'visible', timeout: 5000 });

    console.log('Randomly selecting a product...');
    const productOptions = [
      'Attached Stake Edging',
      'Classic Roll-Top Steel Edging',
      'Classic Steel Edging',
      'Quicklock Edging'
    ];
    const randomProduct = productOptions[Math.floor(Math.random() * productOptions.length)];
    await page.selectOption('select[name="product"]', { label: randomProduct });

    console.log('Entering a project distance...');
    await page.fill('input[name="distance"]', String(Math.floor(Math.random() * 10) + 1));

    console.log('Verifying that the Calculate button is enabled...');
    const calculateButton = await page.$('div > button[type="submit"].btn');
    const isDisabled = await calculateButton.isDisabled();
    expect(isDisabled).toBe(false);

    console.log('Clicking the Calculate button...');
    await calculateButton.click();

    console.log('Verifying that the calculation result is displayed...');
    const resultVisible = await page.isVisible('div.mb-5 > h5.text-midnight');
    expect(resultVisible).toBe(true);
    console.log('Calculation result is displayed.');

    const resultText = await page.textContent('div.mb-5 > h5.text-midnight');
    console.log(`Calculation result: ${resultText.trim()}`);
  });

  test('Verify that the Calculate function yields valid results for each product selection', async ({ page }) => {
    console.log('Navigating to the home page...');
    await page.goto('https://colmet-prd.chltest2.com/');

    console.log('Clicking the navigation toggle button...');
    await page.click('button.Header_nav-toggle__j4Yq8');

    console.log('Clicking the Project Estimator button...');
    await page.click('.estimator-btn-container .btn');

    console.log('Waiting for the project estimator to become visible...');
    await page.waitForSelector('h5.text-midnight:has-text("Estimator")', { state: 'visible', timeout: 5000 });

    const productOptions = [
      'Attached Stake Edging',
      'Classic Roll-Top Steel Edging',
      'Classic Steel Edging',
      'Quicklock Edging'
    ];

    for (const product of productOptions) {
      console.log(`Selecting product: ${product}...`);
      await page.selectOption('select[name="product"]', { label: product });

      console.log('Entering a project distance...');
      await page.fill('input[name="distance"]', String(Math.floor(Math.random() * 10) + 1));

      console.log('Clicking the Calculate button...');
      const calculateButton = await page.$('div > button[type="submit"].btn');
      await calculateButton.click();

      console.log('Verifying that the calculation result is displayed...');
      const resultVisible = await page.isVisible('div.mb-5 > h5.text-midnight');
      expect(resultVisible).toBe(true);
      console.log('Calculation result is displayed.');

      const resultText = await page.textContent('div.mb-5 > h5.text-midnight');
      console.log(`Calculation result for ${product}: ${resultText.trim()}`);

      console.log('Clearing the project distance input for the next iteration...');
      await page.fill('input[name="distance"]', '');
    }
  });

  test('Verify that the Project Estimator modal can be closed by clicking the X button', async ({ page }) => {
    console.log('Navigating to the home page...');
    await page.goto('https://colmet-prd.chltest2.com/');

    console.log('Clicking the navigation toggle button...');
    await page.click('button.Header_nav-toggle__j4Yq8');

    console.log('Clicking the Project Estimator button...');
    await page.click('.estimator-btn-container .btn');

    console.log('Waiting for the project estimator to become visible...');
    await page.waitForSelector('h5.text-midnight:has-text("Estimator")', { state: 'visible', timeout: 5000 });

    console.log('Clicking the X button to close the Project Estimator...');
    await page.click('div.absolute.right-0.top-0.pr-4.pt-4.block > button');

    console.log('Verifying that the project estimator is not visible...');
    const projectEstimatorVisible = await page.isVisible('h5.text-midnight:has-text("Estimator")');
    expect(projectEstimatorVisible).toBe(false);
    console.log('Project estimator is not visible.');
  });
});
