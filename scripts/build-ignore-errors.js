#!/usr/bin/env node

/**
 * Build script that ignores TypeScript errors
 * Usage: node scripts/build-ignore-errors.js
 */

const { spawn } = require('child_process');

console.log('🚀 Building with TypeScript error ignoring...\n');

// Set environment variable to skip type checking
process.env.DISABLE_ESLINT_PLUGIN = 'true';
process.env.TSC_COMPILE_ON_ERROR = 'true';

const buildProcess = spawn('npm', ['run', 'build'], {
  stdio: 'inherit',
  shell: true
});

buildProcess.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Build completed successfully (with ignored TypeScript errors)');
  } else {
    console.log('\n❌ Build failed with exit code:', code);
    process.exit(code);
  }
});

buildProcess.on('error', (error) => {
  console.error('❌ Build error:', error);
  process.exit(1);
});
