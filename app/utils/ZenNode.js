import path from 'path'

import _ from 'lodash'
import { ipcMain } from 'electron'
import zenNode from '@zen/zen-node'

import db from '../services/store'

let isMiningFlag = db.get('config.isMining').value()

class ZenNode {
  node = {
    stderr: { pipe: _.noop },
    stdout: { pipe: _.noop, on: _.noop },
    on: _.noop,
    kill: _.noop,
  }
  onClose = _.noop
  constructor(app, webContents) {
    this.app = app
    this.webContents = webContents
  }
  init() {
    console.log('[ZEN NODE]: LAUNCHING ZEN NODE')
    try {
      this.node = zenNode(getNodeArgs(), getZenNodePath())
      this.node.stderr.pipe(process.stderr)
      this.node.stdout.pipe(process.stdout)
      this.setupLogFetching()
      this.setupRestartListener()
      this.setupOnExit()
    } catch (err) {
      console.error('[ZEN NODE]: launching error', err.message, err)
    }
  }

  setupLogFetching() {
    this.node.stdout.on('data', (chunk) => {
      const log = chunk.toString('utf8')
      console.log(`[ZEN NODE]: Received ${log} bytes of data.`)
      this.webContents.send('blockchainLogs', log)
    })
  }

  setupRestartListener() {
    ipcMain.once('restartZenNode', (event, arg) => {
      if (arg.isMining !== undefined) {
        isMiningFlag = arg.isMining
      }
      this.node.kill('SIGUSR1')
    })
  }

  setupOnExit() {
    this.node.on('exit', (code, signal) => {
      if (signal === 'SIGUSR1') {
        console.log('\n\n\n\n****************')
        console.log('[ZEN NODE]: Restart through GUI')
        console.log('****************\n\n\n\n')
        this.init()
      } else {
        console.log('[ZEN NODE]: Closed')
        this.onClose()
      }
    })
  }
}

export default ZenNode

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
    console.log('[ZEN NODE]: WIPING DB')
    args.push('--wipe')
  }
  if (process.env.WIPEFULL || process.argv.indexOf('--wipe full') > -1 || process.argv.indexOf('wipefull') > -1) {
    console.log('[ZEN NODE]: FULLY WIPING DB')
    args = [...args, '--wipe', 'full']
  }
  if (process.env.MINER || process.argv.indexOf('--miner') > -1 || process.argv.indexOf('miner') > -1 || isMiningFlag) {
    console.log('[ZEN NODE]: RUNNING A MINER')
    args.push('--miner')
  }
  if (process.env.ZEN_LOCAL) {
    console.log('[ZEN NODE]: Running locally and mining')
    args = [...args, '--chain', 'local', '--miner']
  }
  console.log('\n******** Zen node args ********\n', args, '\n******** Zen node args ********\n')
  return args
}
