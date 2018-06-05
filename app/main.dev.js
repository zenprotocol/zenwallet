/* eslint global-require: 0, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import path from 'path'

import { app, BrowserWindow, ipcMain } from 'electron'
import zenNode from '@zen/zen-node'
import _ from 'lodash'

import db from './services/store'
import MenuBuilder from './menu'

const isUiOnly = (process.env.UIONLY || process.argv.indexOf('--uionly') > -1 || process.argv.indexOf('uionly') > -1)

let mainWindow = null

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support')
  sourceMapSupport.install()
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')()
  const p = path.join(__dirname, '..', 'app', 'node_modules')
  require('module').globalPaths.push(p)
} else {
  require('electron-context-menu')()
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer')
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS',
    'MOBX_DEVTOOLS',
  ]

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log)
}


/**
 * Add event listeners...
 */

let node = {
  stderr: { pipe: _.noop },
  stdout: { pipe: _.noop, on: _.noop },
  on: _.noop,
  kill: _.noop,
}

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions()
  }

  console.log('test')

  console.log('process.argv', process.argv)

  mainWindow = getMainWindow(app.getName())
  mainWindow.on('resize', saveWindowDimensionsToDb)

  if (!isUiOnly) {
    console.log('LAUNCHING ZEN NODE')
    try {
      node = zenNode(getZenNodeArgs(), getZenNodePath())
      node.stderr.pipe(process.stderr)
      node.stdout.pipe(process.stdout)
      setupLogFetching()
      node.on('exit', () => {
        console.log('Closed')
        app.quit()
      })
    } catch (err) {
      console.error('error launching zen node', err.message, err)
    }
  }

  mainWindow.loadURL(`file://${__dirname}/app.html`)

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined')
    }
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', () => { mainWindow = null })

  buildElectronMenu()

  process.on('SIGINT', () => {
    console.log('Please close zen-wallet by closing the app window')
    app.quit()
    // this might be redundant, this scenario only happens when it's not UiOnly
    if (!isUiOnly) {
      console.log('Gracefully shutting down the zen-node via the command line')
      node.kill('SIGINT')
    }
  })
})

app.on('window-all-closed', () => {
  app.quit()
  if (!isUiOnly) {
    console.log('Gracefully shutting down the zen-node by clicking the close button')
    node.kill('SIGINT')
  }
})

function getZenNodePath() {
  return isInstalledWithInstaller()
    // $FlowFixMe
    ? path.join(process.resourcesPath, '/node_modules/@zen/zen-node')
    : path.join(__dirname, '../node_modules/@zen/zen-node')
}

function isInstalledWithInstaller() {
  return !process.resourcesPath.includes('node_modules/electron/dist')

  //return __dirname.includes('app.asar') // tested on linux. below is an alternative
  // TODO [AdGo] 15/05/2018 - delete these comments after confirming it works
  // on os and windows
}

function getMainWindow(title) {
  const { width, height } = db.get('userPreferences').value()
  return new BrowserWindow({
    width,
    height,
    title,
  })
}

function saveWindowDimensionsToDb() {
  if (!mainWindow) { return }
  const { width, height } = mainWindow.getBounds()
  db.get('userPreferences').assign({ width, height }).write()
}

function getZenNodeArgs() {
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

function setupLogFetching() {
  ipcMain.on('init-fetch-logs', (event) => {
    node.stdout.on('data', (chunk) => {
      const log = chunk.toString('utf8')
      console.log(`Received ${log} bytes of data.`)
      event.sender.send('blockchainLogs', log)
    })
  })
}

function buildElectronMenu() {
  const menuBuilder = new MenuBuilder(mainWindow)
  menuBuilder.buildMenu()
}
