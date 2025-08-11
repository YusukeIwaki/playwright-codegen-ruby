#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const cliPath = join(__dirname, '..', 'src', 'cli.tsx');
const args = process.argv.slice(2);

// tsx を使用してTypeScriptファイルを実行
const child = spawn('npx', ['tsx', cliPath, ...args], {
  stdio: 'inherit',
  shell: true
});

child.on('error', (error) => {
  console.error('Failed to start process:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});