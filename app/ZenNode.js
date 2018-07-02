// DO NOT MOVE THIS FILE
// This file must be in the same folder as the main.dev.js
// otherwise packing for npm breaks the path for the zen node
import path from 'path'

import compare from 'semver-compare'
import _ from 'lodash'
import { ipcMain, dialog } from 'electron'
import spwanZenNodeChildProcess from '@zen/zen-node'

import { shout } from './utils/dev'
import db from './services/store'
import { ZEN_NODE_VERSION, WALLET_VERSION } from './constants/versions'

export const IPC_ASK_IF_WIPED_DUE_TO_VERSION = 'askIfWipedDueToVersion'
export const IPC_ANSWER_IF_WIPED_DUE_TO_VERSION = 'answerIfWipedDueToVersion'
export const IPC_RESTART_ZEN_NODE = 'restartZenNode'
export const IPC_BLOCKCHAIN_LOGS = 'blockchainLogs'
export const ZEN_NODE_RESTART_SIGNAL = 'SIGKILL'

class ZenNode {
  static zenNodeVersionRequiredWipe = doesZenNodeVersionRequiredWipe()
  node = {
    stderr: { pipe: _.noop },
    stdout: { pipe: _.noop, on: _.noop },
    on: _.noop,
    kill: _.noop,
  }
  onClose = _.noop
  constructor({ webContents, onClose, onError }) {
    this.webContents = webContents
    this.onClose = onClose
    this.onError = onError
    ipcMain.once(IPC_ASK_IF_WIPED_DUE_TO_VERSION, this.answerIfWipedDueToVersion)
  }

  answerIfWipedDueToVersion = () => {
    this.webContents.send(IPC_ANSWER_IF_WIPED_DUE_TO_VERSION, ZenNode.zenNodeVersionRequiredWipe)
  }

  config = {
    wipe: process.env.WIPE || process.argv.indexOf('--wipe') > -1 || process.argv.indexOf('wipe') > -1 || ZenNode.zenNodeVersionRequiredWipe,
    wipeFull: process.env.WIPEFULL || process.argv.indexOf('--wipe full') > -1 || process.argv.indexOf('wipefull') > -1,
    isMining: getInitialIsMining(),
    net: getInitialNet(),
  }

  init() {
    console.log('[ZEN NODE]: LAUNCHING ZEN NODE')
    try {
      const { error, zenNode } = spwanZenNodeChildProcess(this.zenNodeArgs, getZenNodePath())
      if (error) {
        this.onSpawnError(error)
        return
      }
      this.node = zenNode
      this.node.on('error', this.onNonSpawnError)
      this.node.on('message', this.onMessage)
      if (this.config.wipe || this.config.wipeFull) {
        this.updateLastWipeInDb()
      }
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
      this.onError(err, { errorType: 'launching zen node' })
    }
  }

  onBlockchainLog = (chunk) => {
    const log = chunk.toString('utf8')
    console.log(`[ZEN NODE]: Received ${log} bytes of data.`)
    this.webContents.send(IPC_BLOCKCHAIN_LOGS, log)
  }

  onRestartZenNode = (event, args) => {
    if ('net' in args) {
      this.webContents.send('switchChain', args.net)
    }
    this.config = { ...this.config, ...args }
    this.node.kill(ZEN_NODE_RESTART_SIGNAL)
  }

  onZenNodeExit = (code, signal) => {
    if (signal === ZEN_NODE_RESTART_SIGNAL) {
      shout('[ZEN NODE]: Restart through GUI')
      this.init()
    } else if (code === 1) {
      shout('zen node had uncaught error')
      dialog.showErrorBox('zen node had uncaught error (Wallet will shutdown)', 'we appologize for inconvenience')
      this.onError(new Error('uncaught exception code 1'))
      this.onClose()
    } else {
      console.log('[ZEN NODE]: Closed')
      this.onClose()
    }
  }
  updateLastWipeInDb() {
    db.set('lastWipe', {
      timestamp: Date.now(),
      walletVersion: WALLET_VERSION,
      zenNodeVersion: ZEN_NODE_VERSION,
    }).write()
  }
  onSpawnError = (error) => {
    shout('[ZEN NODE]: init error\n', error)
    dialog.showErrorBox(
      `${error.message} (Wallet will shutdown)`,
      error.stack,
    )
    this.onError(error)
    this.onClose()
  }
  onNonSpawnError = (error) => {
    shout('[ZEN NODE]: uncaught error\n', error)
    dialog.showErrorBox(
      `${error.message} (Wallet will shutdown)`,
      error.stack,
    )
    this.onError(error)
    this.onClose()
  }
  onMessage = (message) => {
    shout('[ZEN NODE]: message:\n', message)
  }
  get zenNodeArgs() {
    const {
      isMining, wipe, wipeFull, net,
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
    if (net) {
      args.push('--chain', net)
    }
    if (process.env.ZEN_NODE_API_PORT) {
      args.push('--api', `127.0.0.1:${process.env.ZEN_NODE_API_PORT}`)
    }


    shout('[ZEN NODE]: Zen node args', args)
    return args
  }
}

export default ZenNode

function getZenNodePath() {
  return isInstalledWithInstaller()
    // $FlowFixMe
    ? path.join(process.resourcesPath, 'node_modules', '@zen', 'zen-node')
    : path.join(__dirname, '..', 'node_modules', '@zen', 'zen-node')
}

function isInstalledWithInstaller() {
  return !process.resourcesPath.includes(path.join('node_modules', 'electron', 'dist'))
}

export function getInitialIsMining() {
  return !!(process.env.MINER || process.argv.indexOf('--miner') > -1 || process.argv.indexOf('miner') > -1 || db.get('config.isMining').value())
}

export function getInitialNet() {
  if (process.env.ZEN_LOCAL_NET) {
    return 'local'
  }
  if (process.env.ZEN_TEST_NET) {
    return 'test'
  }
  return ''
}

function doesZenNodeVersionRequiredWipe() {
  const latestZenNodeVersionRequiringWipe = '0.3.43'
  // first time user installs a version of the wallet with this flag feature,
  // or when user resets his local DB for any reason, we use the mocked version 0.0.0
  // to make sure wipe will happen, in case user has non valid chain
  const mockNoWipeRecordVersion = '0.0.0'
  const lastWipedOnZenNodeVersion = db.get('lastWipe.zenNodeVersion').value() || mockNoWipeRecordVersion
  const isWipeNeeded = compare(latestZenNodeVersionRequiringWipe, lastWipedOnZenNodeVersion) === 1
  console.log(`
********** WIPE DUE TO ZEN NODE VERSION NEEDED? **********
${isWipeNeeded ? 'Yes' : 'No'}
Last version requiring wipe: ${latestZenNodeVersionRequiringWipe}
Last wiped on version: ${lastWipedOnZenNodeVersion === mockNoWipeRecordVersion ? 'no local record of wiping found' : lastWipedOnZenNodeVersion}
********** WIPE DUE TO ZEN NODE VERSION NEEDED? **********
`)
  return isWipeNeeded
}
