#!/usr/bin/env node
import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');

const isWatch = process.argv.includes('--watch');

// Clean dist
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy static files
fs.copyFileSync(path.join(root, 'index.html'), path.join(distDir, 'index.html'));
fs.copyFileSync(path.join(root, 'styles.css'), path.join(distDir, 'styles.css'));

// Copy public/ recursively into dist/
const publicDir = path.join(root, 'public');
if (fs.existsSync(publicDir)) {
  fs.cpSync(publicDir, distDir, { recursive: true });
}

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
  const { port } = await ctx.serve({
    servedir: distDir,
    host: '0.0.0.0',
    port: 8000,
  });
  console.log(`Dev server running on port ${port} (all interfaces)`);
} else {
  await esbuild.build(buildOptions);
  console.log('Build complete');
}
