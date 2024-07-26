const { test, expect } = require('@playwright/test');

test.describe('Project Estimator - Access Check', () => {
  test('Verify that the project estimator can be accessed globally by clicking the Project Estimator button', async ({ page }) => {
    console.log('Navigating to the home page...');
    await page.goto('https://colmet-prd.chltest2.com/');

    console.log('Clicking the Project Estimator button...');
    await page.click('.estimator-btn-container .btn');

    console.log('Waiting for the project estimator to become visible...');
    await page.waitForSelector('h5.text-midnight:has-text("Estimator")', { state: 'visible', timeout: 5000 });

    console.log('Verifying that the project estimator is visible...');
    const projectEstimatorVisible = await page.isVisible('h5.text-midnight:has-text("Estimator")');
    expect(projectEstimatorVisible).toBe(true);
    console.log('Project estimator is visible.');
  });
});
