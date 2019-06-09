#!/usr/bin/env node

const proc = require('child_process')
const path = require('path')

let wallet
const argsArray = ['start']

if (process.argv.indexOf('wipe') > -1) { argsArray.push('wipe') }
if (process.argv.indexOf('wipefull') > -1) { argsArray.push('wipefull') }
if (process.argv.indexOf('miner') > -1) { argsArray.push('miner') }
if (process.argv.indexOf('uionly') > -1) { argsArray.push('uionly') }
if (process.argv.indexOf('localnet') > -1) { argsArray.push('--local') }
if (process.argv.indexOf('testnet') > -1) { argsArray.push('--test') }

if (process.platform !== 'win32') {
  wallet = proc.spawn('npm', argsArray, { cwd: path.join(__dirname, '..', 'app') })
} else {
  wallet = proc.spawn('npm', argsArray, { cwd: path.join(__dirname, '..', 'app'), shell: true })
}

wallet.stdout.pipe(process.stdout)
wallet.stderr.pipe(process.stderr)

wallet.on('exit', (code) => {
  console.log(`child process exited with code ${code.toString()}`)
  process.exit(code)
})
