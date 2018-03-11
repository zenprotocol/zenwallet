#!/usr/bin/env node

const proc = require('child_process');
const path = require('path');

let wallet;

if (process.argv.indexOf("wipe") > -1) {
  wallet = proc.spawn("npm", ["start", "wipe"], { cwd: path.join(__dirname,'../') });
} else {
  wallet = proc.spawn("npm", ["start"], { cwd: path.join(__dirname,'../') });
}

wallet.stdout.pipe(process.stdout);
wallet.stderr.pipe(process.stderr);

wallet.on('exit', function (code) {
  console.log('child process exited with code ' + code.toString());
  process.exit(code);
});
