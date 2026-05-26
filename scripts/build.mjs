#!/usr/bin/env node
import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');

const CLIENT_ID = process.env.CLIENT_ID || 'test-client-id';
const APP_ID = process.env.APP_ID || 'test-app-id';

const isWatch = process.argv.includes('--watch');

// Clean dist
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy static files
fs.copyFileSync(path.join(root, 'index.html'), path.join(distDir, 'index.html'));
fs.copyFileSync(path.join(root, 'styles.css'), path.join(distDir, 'styles.css'));

// Build JS bundle
const buildOptions = {
  entryPoints: [path.join(root, 'src/app.ts')],
  bundle: true,
  platform: 'browser',
  format: 'esm',
  target: 'es2022',
  outfile: path.join(distDir, 'app.js'),
  minify: !isWatch,
  sourcemap: true,
  define: {
    __CLIENT_ID__: JSON.stringify(CLIENT_ID),
    __APP_ID__: JSON.stringify(APP_ID),
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  loader: {
    '.wasm': 'file',
  },
  alias: {
    crypto: path.join(__dirname, 'shims/crypto.js'),
    path: path.join(__dirname, 'shims/path.js'),
    fs: path.join(__dirname, 'shims/fs.js'),
    '@xmldom/xmldom': path.join(__dirname, 'shims/xmldom.js'),
  },
};

if (isWatch) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  const { host, port } = await ctx.serve({
    servedir: distDir,
    port: 8000,
  });
  console.log(`Dev server running at http://${host}:${port}`);
} else {
  await esbuild.build(buildOptions);
  console.log('Build complete');
}
