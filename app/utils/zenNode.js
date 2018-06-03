import path from 'path'

import _ from 'lodash'
import { ipcMain } from 'electron'
import zenNode from '@zen/zen-node'

import db from '../services/store'

class ZenNode {
  node = {
    stderr: { pipe: _.noop },
    stdout: { pipe: _.noop, on: _.noop },
    on: _.noop,
    kill: _.noop,
  }
  init() {
    console.log('LAUNCHING ZEN NODE')
    try {
      this.node = zenNode(getNodeArgs(), getZenNodePath())
      this.node.stderr.pipe(process.stderr)
      this.node.stdout.pipe(process.stdout)
      this.setupLogFetching()
    } catch (err) {
      console.error('error launching zen node', err.message, err)
    }
  }

  setupLogFetching() {
    ipcMain.on('init-fetch-logs', (event) => {
      this.node.stdout.on('data', (chunk) => {
        const log = chunk.toString('utf8')
        console.log(`Received ${log} bytes of data.`)
        event.sender.send('blockchainLogs', log)
      })
    })
  }
}

export default new ZenNode()


function getZenNodePath() {
  return isInstalledWithInstaller()
    // $FlowFixMe
    ? path.join(process.resourcesPath, 'app/node_modules/@zen/zen-node')
    : undefined
}

function isInstalledWithInstaller() {
  return __dirname.includes('app.asar') // tested on linux. below is an alternative
  // return process.resourcesPath.includes('node_modules/electron/dist')
  // TODO [AdGo] 15/05/2018 - delete these comments after confirming it works
  // on os and windows
}

function getNodeArgs() {
  let args = []
  if (process.env.WIPE || process.argv.indexOf('--wipe') > -1 || process.argv.indexOf('wipe') > -1) {
    console.log('WIPING DB')
    args.push('--wipe')
  }
  if (process.env.WIPEFULL || process.argv.indexOf('--wipe full') > -1 || process.argv.indexOf('wipefull') > -1) {
    console.log('FULLY WIPING DB')
    args = [...args, '--wipe', 'full']
  }
  if (process.env.MINER || process.argv.indexOf('--miner') > -1 || process.argv.indexOf('miner') > -1 || db.get('config.isMining').value()) {
    console.log('RUNNING A MINER')
    args.push('--miner')
  }
  if (process.env.ZEN_LOCAL) {
    console.log('Running locally and mining')
    args = [...args, '--chain', 'local', '--miner']
  }
  console.log('Zen node args', args)
  return args
}
