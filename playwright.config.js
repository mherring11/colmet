const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  timeout: 60000,
  testDir: './tests',
  projects: [
    { name: 'Chromium', use: { browserName: 'chromium', headless: true, viewport: { width: 1280, height: 720 } } },
    { name: 'Firefox', use: { browserName: 'firefox', headless: true, viewport: { width: 1280, height: 720 } } },
    { name: 'WebKit', use: { browserName: 'webkit', headless: true, viewport: { width: 1280, height: 720 } } },
  ],
});
