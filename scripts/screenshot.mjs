#!/usr/bin/env node
/**
 * Generate a screenshot of the unlock screen for Marketplace listing.
 * Requires: npm i -D playwright && npx playwright install chromium
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outputPath = join(root, 'public/marketplace/screenshot-unlock.png');

// Standalone unlock screen HTML
const unlockHTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>KeeDrive - Unlock</title>
  <style>
:root {
  --bg: #ffffff;
  --fg: #1a1a1a;
  --border: #d0d0d0;
  --input-bg: #f5f5f5;
  --accent: #0066cc;
  --accent-hover: #0052a3;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: var(--bg);
  color: var(--fg);
  line-height: 1.6;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

#app {
  max-width: 800px;
  width: 100%;
  padding: 2rem 1rem;
}

.unlock {
  text-align: center;
  padding: 3rem 1rem;
}

.unlock h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
}

form {
  max-width: 400px;
  margin: 2rem auto;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

input[type='password'],
input[type='file'] {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--input-bg);
  color: var(--fg);
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}
  </style>
</head>
<body>
  <div id="app">
    <div class="unlock">
      <h2>Unlock vault.kdbx</h2>
      <form>
        <label>
          Password
          <input type="password" placeholder="Enter your password" />
        </label>
        <label>
          Key File (optional)
          <input type="file" />
        </label>
        <button type="button">Unlock</button>
      </form>
    </div>
  </div>
</body>
</html>`;

async function main() {
  console.log('Launching browser...');
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
  });

  console.log('Loading unlock screen...');
  await page.setContent(unlockHTML);

  console.log('Taking screenshot...');
  await page.screenshot({ path: outputPath });

  await browser.close();
  console.log(`Screenshot saved to ${outputPath}`);
}

main().catch((err) => {
  console.error('Failed to generate screenshot:', err.message);
  process.exit(1);
});
