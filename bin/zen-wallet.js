#!/usr/bin/env node

const proc = require('child_process');
const path = require('path');

let wallet;
const argsArray = ['start']

if (process.argv.indexOf('wipe') > -1) { argsArray.push('wipe') }
if (process.argv.indexOf('miner') > -1) { argsArray.push('miner') }

if (process.platform !== 'win32') {
  wallet = proc.spawn('npm', argsArray, { cwd: path.join(__dirname, '../') });
} else {
  wallet = proc.spawn('npm', argsArray, { cwd: path.join(__dirname, '../'), shell: true });
}

wallet.stdout.pipe(process.stdout);
wallet.stderr.pipe(process.stderr);

wallet.on('exit', (code) => {
  console.log(`child process exited with code ${code.toString()}`);
  process.exit(code);
});
