import path from 'path'

import _ from 'lodash'
import { ipcMain } from 'electron'
import zenNode from '@zen/zen-node'

import db from '../services/store'

export const IPC_RESTART_ZEN_NODE = 'restartZenNode'
export const IPC_BLOCKCHAIN_LOGS = 'blockchainLogs'
export const ZEN_NODE_RESTART_SIGNAL = 'SIGUSR1'

class ZenNode {
  node = {
    stderr: { pipe: _.noop },
    stdout: { pipe: _.noop, on: _.noop },
    on: _.noop,
    kill: _.noop,
  }
  onClose = _.noop
  constructor(webContents) {
    this.webContents = webContents
  }

  config = {
    wipe: process.env.WIPE || process.argv.indexOf('--wipe') > -1 || process.argv.indexOf('wipe') > -1,
    wipeFull: process.env.WIPEFULL || process.argv.indexOf('--wipe full') > -1 || process.argv.indexOf('wipefull') > -1,
    isMining: getInitialIsMining(),
    isLocalZenNode: process.env.ZEN_LOCAL,
  }

  init() {
    console.log('[ZEN NODE]: LAUNCHING ZEN NODE')
    try {
      this.node = zenNode(this.zenNodeArgs, getZenNodePath())
      // reset wipe/wipefull args in case node was restarted with them
      this.config.wipe = false
      this.config.wipeFull = false
      this.node.stderr.pipe(process.stderr)
      this.node.stdout.pipe(process.stdout)
      this.node.stdout.on('data', this.onBlockchainLog)
      ipcMain.once(IPC_RESTART_ZEN_NODE, this.onRestartZenNode)
      this.node.on('exit', this.onZenNodeExit)
    } catch (err) {
      console.error('[ZEN NODE]: launching error', err.message, err)
    }
  }

  onBlockchainLog = (chunk) => {
    const log = chunk.toString('utf8')
    console.log(`[ZEN NODE]: Received ${log} bytes of data.`)
    this.webContents.send(IPC_BLOCKCHAIN_LOGS, log)
  }

  onRestartZenNode = (event, args) => {
    this.config = { ...this.config, ...args }
    this.node.kill(ZEN_NODE_RESTART_SIGNAL)
  }

  onZenNodeExit = (code, signal) => {
    if (signal === ZEN_NODE_RESTART_SIGNAL) {
      console.log('\n\n\n\n****************')
      console.log('[ZEN NODE]: Restart through GUI')
      console.log('****************\n\n\n\n')
      this.init()
    } else {
      console.log('[ZEN NODE]: Closed')
      this.onClose()
    }
  }

  get zenNodeArgs() {
    const {
      isMining, wipe, wipeFull, isLocalZenNode,
    } = this.config
    const args = []
    if (wipe) {
      args.push('--wipe')
    } else if (wipeFull) {
      args.push('--wipe', 'full')
    }
    if (isMining) {
      args.push('--miner')
    }
    if (isLocalZenNode) {
      args.push('--chain', 'local')
    }
    console.log('[ZEN NODE]:\n******** Zen node args ********\n', args, '\n******** Zen node args ********\n')
    return args
  }
}

export default ZenNode

function getZenNodePath() {
  return isInstalledWithInstaller()
    // $FlowFixMe
    ? path.join(process.resourcesPath, '/node_modules/@zen/zen-node')
    : path.join(__dirname, '../../node_modules/@zen/zen-node')
}

function isInstalledWithInstaller() {
  return !process.resourcesPath.includes('node_modules/electron/dist')
}

export function getInitialIsMining() {
  return process.env.ZEN_LOCAL || process.env.MINER || process.argv.indexOf('--miner') > -1 || process.argv.indexOf('miner') > -1 || db.get('config.isMining').value()
}
