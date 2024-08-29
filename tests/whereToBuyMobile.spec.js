const { test, expect } = require('@playwright/test');

test.describe('Where to Buy Mobile - Automated', () => {
  test.use({ viewport: { width: 375, height: 812 } }); 

  test('Verify the Where to Buy form displays the required elements', async ({ page }) => {
    console.log('Navigating to the Where to Buy page...');
    await page.goto('https://colmet-prd.chltest2.com/where-to-buy');
    
    console.log('Checking the existence of the ZIP code field...');
    const zipCodeField = await page.$('input[id="zipCode"]');
    expect(zipCodeField).not.toBeNull();
    console.log('ZIP code field found.');

    console.log('Checking the existence of the Radius (miles) dropdown...');
    const radiusDropdown = await page.$('select[id="radius"]');
    expect(radiusDropdown).not.toBeNull();
    console.log('Radius (miles) dropdown found.');

    console.log('Clicking the Radius (miles) dropdown...');
    await radiusDropdown.click();
    await page.waitForTimeout(500); 
    const options = await radiusDropdown.$$('option');
    const expectedOptions = ['10 miles', '25 miles', '50 miles', '100 miles'];
    const actualOptions = await Promise.all(options.map(option => option.innerText()));

    expectedOptions.forEach(option => {
      console.log(`Checking for option: ${option}`);
      expect(actualOptions).toContain(option);
    });

    console.log('All expected options found in the Radius (miles) dropdown.');
  });

  test('Verify the ZIP code field is required for form submission', async ({ page }) => {
    console.log('Navigating to the Where to Buy page...');
    await page.goto('https://colmet-prd.chltest2.com/where-to-buy');

    console.log('Clicking the Search button without filling the ZIP code field...');
    const searchButton = await page.$('button[type="submit"].btn');
    await searchButton.click();

    console.log('Checking for validation message...');
    const validationMessage = await page.$eval('input[id="zipCode"]', el => el.validationMessage);
    console.log('Validation message:', validationMessage);
    expect(validationMessage).toBe('Please fill out this field.');

    console.log('Validation message confirmed.');
  });

  test('Verify validation message for invalid ZIP code submission', async ({ page }) => {
    console.log('Navigating to the Where to Buy page...');
    await page.goto('https://colmet-prd.chltest2.com/where-to-buy');

    console.log('Filling the ZIP code field with an invalid ZIP code...');
    const zipCodeField = await page.$('input[id="zipCode"]');
    await zipCodeField.fill('00000');

    console.log('Submitting the form...');
    const searchButton = await page.$('button[type="submit"].btn');
    await searchButton.click();

    console.log('Waiting for "No results found" message to appear...');
    await page.waitForSelector('p:has-text("No results found")', { timeout: 10000 });

    console.log('Checking for "No results found" message...');
    const noResultsMessage = await page.$('p:has-text("No results found")');
    expect(noResultsMessage).not.toBeNull();
    console.log('"No results found" message confirmed.');
  });

  test('Verify that the ZIP code field only accepts numbers and up to 5 characters total', async ({ page }) => {
    console.log('Navigating to the Where to Buy page...');
    await page.goto('https://colmet-prd.chltest2.com/where-to-buy');

    console.log('Filling the ZIP code field with an invalid value "12345a"...');
    const zipCodeField = await page.$('input[id="zipCode"]');
    await zipCodeField.fill('12345a');

    console.log('Submitting the form...');
    const searchButton = await page.$('button[type="submit"].btn');
    await searchButton.click();

    console.log('Checking the ZIP code field value...');
    const zipCodeValue = await zipCodeField.inputValue();
    expect(zipCodeValue).toBe('12345');

    console.log('Filling the ZIP code field with a valid value "12345"...');
    await zipCodeField.fill('12345');

    console.log('Submitting the form...');
    await searchButton.click();

    console.log('Waiting for store addresses or "No results found" message...');
    const storeAddresses = await page.waitForSelector('div.stores div[id^="store-"], p:has-text("No results found")', { timeout: 10000 });

    if (storeAddresses) {
      console.log('Store addresses or "No results found" message found.');
    } else {
      console.log('Neither store addresses nor "No results found" message found.');
    }
  });

  test('Verify store addresses are displayed and clickable for a valid ZIP code', async ({ page }) => {
    console.log('Navigating to the Where to Buy page...');
    await page.goto('https://colmet-prd.chltest2.com/where-to-buy');

    console.log('Filling the ZIP code field with a valid ZIP code...');
    const zipCodeField = await page.$('input[id="zipCode"]');
    await zipCodeField.fill('78260');

    console.log('Setting the radius to 100 miles...');
    const radiusDropdown = await page.$('select[id="radius"]');
    await radiusDropdown.selectOption({ label: '100 miles' });

    console.log('Submitting the form...');
    const searchButton = await page.$('button[type="submit"].btn');
    await searchButton.click();

    console.log('Waiting for store addresses to be displayed...');
    await page.waitForSelector('div.stores div[id^="store-"]', { timeout: 15000 });

    console.log('Checking if store addresses are displayed and clickable...');
    const storeAddresses = await page.$$('div.stores div[id^="store-"] button');

    expect(storeAddresses.length).toBeGreaterThan(0);
    console.log(`Number of store addresses found: ${storeAddresses.length}`);

    for (const storeAddress of storeAddresses) {
      const isVisible = await storeAddress.isVisible();
      console.log(`Checking if store address button is visible: ${isVisible}`);
      expect(isVisible).toBeTruthy();

      const buttonText = await storeAddress.innerText();
      console.log(`Store address button text: ${buttonText}`);
    }

    console.log('All store addresses are displayed and clickable.');
  });

  test('Verify results for each radius selection with a valid ZIP code', async ({ page }) => {
    console.log('Navigating to the Where to Buy page...');
    await page.goto('https://colmet-prd.chltest2.com/where-to-buy');

    const radiusOptions = ['10 miles', '25 miles', '50 miles', '100 miles'];

    for (const radius of radiusOptions) {
      console.log(`Filling the ZIP code field with a valid ZIP code...`);
      const zipCodeField = await page.$('input[id="zipCode"]');
      await zipCodeField.fill('78260');

      console.log(`Setting the radius to ${radius}...`);
      const radiusDropdown = await page.$('select[id="radius"]');
      await radiusDropdown.selectOption({ label: radius });

      console.log('Submitting the form...');
      const searchButton = await page.$('button[type="submit"].btn');
      await searchButton.click();

      console.log('Waiting for store addresses to be displayed...');
      try {
        await page.waitForSelector('div.stores div[id^="store-"]', { timeout: 10000 });
      } catch (e) {
        console.log(`No results found for radius ${radius}. Moving to the next radius option.`);
        continue;
      }

      const storeAddresses = await page.$$('div.stores div[id^="store-"] button');
      if (storeAddresses.length === 0) {
        console.log(`No results found for radius ${radius}. Moving to the next radius option.`);
        continue;
      }

      console.log(`Number of store addresses found for radius ${radius}: ${storeAddresses.length}`);
      for (const storeAddress of storeAddresses) {
        const isVisible = await storeAddress.isVisible();
        console.log(`Checking if store address button is visible for radius ${radius}: ${isVisible}`);
        expect(isVisible).toBeTruthy();

        const buttonText = await storeAddress.innerText();
        console.log(`Store address button text for radius ${radius}: ${buttonText}`);
      }

      console.log(`Results for radius ${radius} confirmed.`);

      await page.goto('https://colmet-prd.chltest2.com/where-to-buy');
      console.log('Returned to the Where to Buy page.');
    }
  });

  test('Verify clicking on an address updates the map', async ({ page }) => {
    console.log('Navigating to the Where to Buy page...');
    await page.goto('https://colmet-prd.chltest2.com/where-to-buy');

    console.log('Filling the ZIP code field with a valid ZIP code...');
    const zipCodeField = await page.$('input[id="zipCode"]');
    await zipCodeField.fill('78260');

    console.log('Setting the radius to 100 miles...');
    const radiusDropdown = await page.$('select[id="radius"]');
    await radiusDropdown.selectOption({ label: '100 miles' });

    console.log('Submitting the form...');
    const searchButton = await page.$('button[type="submit"].btn');
    await searchButton.click();

    console.log('Waiting for store addresses to be displayed...');
    await page.waitForSelector('div.stores div[id^="store-"]', { timeout: 15000 });

    console.log('Clicking the first store address...');
    const firstStoreAddress = await page.$('div.stores div[id^="store-"] button');
    await firstStoreAddress.click();

    console.log('Verifying that the map updates with the location...');
    await page.waitForSelector('.gm-style', { timeout: 10000 });
    const mapVisible = await page.isVisible('.gm-style');

    expect(mapVisible).toBeTruthy();
    console.log('Map updated successfully.');
  });

  test('Verify map and satellite options and display store location', async ({ page }) => {
    console.log('Navigating to the Where to Buy page...');
    await page.goto('https://colmet-prd.chltest2.com/where-to-buy');

    console.log('Filling the ZIP code field with a valid ZIP code...');
    const zipCodeField = await page.$('input[id="zipCode"]');
    await zipCodeField.fill('78260');

    console.log('Setting the radius to 100 miles...');
    const radiusDropdown = await page.$('select[id="radius"]');
    await radiusDropdown.selectOption({ label: '100 miles' });

    console.log('Submitting the form...');
    const searchButton = await page.$('button[type="submit"].btn');
    await searchButton.click();

    console.log('Waiting for store addresses to be displayed...');
    await page.waitForSelector('div.stores div[id^="store-"]', { timeout: 15000 });

    console.log('Clicking the first store address...');
    const firstStoreAddress = await page.$('div.stores div[id^="store-"] button');
    await firstStoreAddress.click();

    console.log('Waiting for map to update with the store location...');
    await page.waitForSelector('.gm-style', { timeout: 10000 });

    console.log('Adding a short wait to ensure the page is fully loaded...');
    await page.waitForTimeout(2000);

    console.log('Verifying "Satellite" button is present and clickable...');
    const satelliteButton = await page.$('button[title="Show satellite imagery"]');
    if (satelliteButton) {
      console.log('Satellite button found.');
      await satelliteButton.click();
      console.log('Waiting for satellite view to load...');
      await page.waitForTimeout(2000);
      const satelliteView = await page.isVisible('.gm-style');
      expect(satelliteView).toBeTruthy();
      console.log('Satellite view loaded successfully.');
    } else {
      console.log('Satellite button not found.');
      const pageContent = await page.content();
      console.log('Page content:', pageContent);
      expect(satelliteButton).not.toBeNull();
    }

    console.log('Verifying "Map" button is present and clickable...');
    const mapButton = await page.$('button[title="Show street map"]');
    if (mapButton) {
      console.log('Map button found.');
      await mapButton.click();
      console.log('Waiting for map view to load...');
      await page.waitForTimeout(2000);
      const mapView = await page.isVisible('.gm-style');
      expect(mapView).toBeTruthy();
      console.log('Map view loaded successfully.');
    } else {
      console.log('Map button not found.');
      const pageContent = await page.content();
      console.log('Page content:', pageContent);
      expect(mapButton).not.toBeNull();
    }
  });

});
