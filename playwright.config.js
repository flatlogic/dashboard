const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './test/browser',
  workers: 1,
  use: { channel: 'chrome', baseURL: 'http://127.0.0.1:4322' },
  webServer: [
    { command: 'node test/serve.js', url: 'http://127.0.0.1:4322' },
    { command: 'node server/index.js', url: 'http://localhost:8080/v1/domain' },
  ],
});
