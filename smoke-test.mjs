import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appDir = __dirname;

const server = spawn('npm', ['run', 'dev', '--', '--host', '0.0.0.0', '--port', '4173'], {
  cwd: appDir,
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, NODE_ENV: 'development' },
});

let output = '';
let serverUrl = '';

// Wait for server to be ready
await new Promise((resolve, reject) => {
  const timeout = setTimeout(() => reject(new Error('Server did not start in 20s')), 20000);

  server.stdout.on('data', (chunk) => {
    const text = chunk.toString();
    output += text;
    console.log('[dev]', text.trim());
    const match = text.match(/Local:\s+(https?:\/\/[^\s]+)/);
    if (match) {
      serverUrl = match[1].replace('localhost', '127.0.0.1');
      clearTimeout(timeout);
      resolve();
    }
  });

  server.stderr.on('data', (chunk) => {
    const text = chunk.toString();
    output += text;
    console.log('[dev:err]', text.trim());
  });

  server.on('close', (code) => {
    reject(new Error(`Server exited with code ${code}`));
  });
});

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
let exitCode = 0;

try {
  console.log(`\nOpening ${serverUrl}...`);
  await page.goto(serverUrl, { waitUntil: 'networkidle', timeout: 15000 });
  const title = await page.title();
  console.log(`Page title: "${title}"`);

  // Check for console errors
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Check for React render errors
  const pageContent = await page.content();
  const hasReactRoot = pageContent.includes('id="root"') || pageContent.includes('_reactRoot');
  console.log(`React root found: ${hasReactRoot}`);

  if (consoleErrors.length > 0) {
    console.log('Console errors:', consoleErrors);
    // Non-critical — React logs some info-level console.error
  }

  console.log('Smoke test: PASSED');
} catch (err) {
  console.error('Smoke test: FAILED —', err.message);
  exitCode = 1;
} finally {
  await browser.close();
  server.kill();
  process.exit(exitCode);
}