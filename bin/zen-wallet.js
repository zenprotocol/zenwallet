#!/usr/bin/env node

const proc = require('child_process');
const path = require('path');

const wallet = proc.spawn("npm", ["start"], {
    cwd: path.join(__dirname,'../')
});

wallet.stdout.pipe(process.stdout);
wallet.stderr.pipe(process.stderr);
