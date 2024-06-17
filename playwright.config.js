const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  timeout: 60000, // Increase timeout to 60 seconds
  testDir: './tests',
  use: {
    browserName: 'chromium',
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
});
