#!/usr/bin/env node

const { spawn } = require('child_process');

// Get port from command line arguments or environment variable or default to 3000
const args = process.argv.slice(2);
let port = process.env.PORT || '3000';

// Check if port is specified in command line arguments
const portIndex = args.findIndex(arg => arg === '-p' || arg === '--port');
if (portIndex !== -1 && args[portIndex + 1]) {
  port = args[portIndex + 1];
  // Remove port arguments from args array
  args.splice(portIndex, 2);
}

// Check if port is specified as a flag (e.g., --port=3001)
const portFlagIndex = args.findIndex(arg => arg.startsWith('--port='));
if (portFlagIndex !== -1) {
  port = args[portFlagIndex].split('=')[1];
  args.splice(portFlagIndex, 1);
}

// Validate port
const portNum = parseInt(port);
if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
  console.error(`❌ Invalid port: ${port}. Port must be a number between 1 and 65535.`);
  process.exit(1);
}

console.log(`🚀 Starting CFO Dashboard on port ${port}...`);

// Set environment variables
process.env.PORT = port;
process.env.NEXT_PUBLIC_APP_URL = `http://localhost:${port}`;

// Determine if we're in development or production
const isDev = process.env.NODE_ENV !== 'production';
const command = process.platform === 'win32' ? 'next.cmd' : 'next';
const commandArgs = isDev ? ['dev', '-p', port] : ['start', '-p', port];

console.log(`🔧 Mode: ${isDev ? 'Development' : 'Production'}`);
console.log(`🌐 URL: http://localhost:${port}`);

// Spawn the Next.js process
const nextProcess = spawn(command, commandArgs, {
  stdio: 'inherit',
  env: { ...process.env },
  shell: true
});

nextProcess.on('close', (code) => {
  if (code !== 0) {
    console.log(`❌ Next.js process exited with code ${code}`);
  }
  process.exit(code);
});

nextProcess.on('error', (err) => {
  console.error('❌ Failed to start Next.js:', err.message);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down CFO Dashboard...');
  nextProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down CFO Dashboard...');
  nextProcess.kill('SIGTERM');
});
