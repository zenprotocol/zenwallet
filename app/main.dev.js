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
import { autoUpdater } from 'electron-updater'

import ZenNode from './ZenNode'
import db from './services/store'

const isUiOnly = (process.env.UIONLY || process.argv.indexOf('--uionly') > -1 || process.argv.indexOf('uionly') > -1)

let mainWindow = null

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support')
  sourceMapSupport.install()
}

require('electron-debug')({ enabled: true })

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  const p = path.join(__dirname, '..', 'app', 'node_modules')
  require('module').globalPaths.push(p)
}

// Enable inspect element on right click, force in production with showInspectElement flag
require('electron-context-menu')({ showInspectElement: true })

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

let zenNode

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions()
  }

  console.log('test')

  console.log('process.argv', process.argv)

  mainWindow = getMainWindow(app.getName())
  mainWindow.on('resize', saveWindowDimensionsToDb)
  mainWindow.setMenu(null)

  if (!isUiOnly) {
    zenNode = new ZenNode(mainWindow.webContents)
    zenNode.init()
    zenNode.onClose = app.quit
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

    if (process.env.NODE_ENV === 'development') {
      autoUpdater.updateConfigPath = path.join(__dirname, '../dev-app-update.yml')
    }
    autoUpdater.checkForUpdates()

    ipcMain.on('quitAndInstall', () => {
      autoUpdater.quitAndInstall()
    })
  })

  mainWindow.on('closed', () => { mainWindow = null })

  process.on('SIGINT', () => {
    console.log('******* [PROCESS SIGINT] *******')
    console.log('Please close zen-wallet by closing the app window. Now calling app.quit() ...')
    app.quit()
  })
})

autoUpdater.on('update-downloaded', () => {
  if (mainWindow) {
    mainWindow.webContents.send('updateReady')
  }
})

app.on('window-all-closed', () => {
  console.log('******* [window-all-closed] *******')
  console.log('Calling app.quit because (window-all-closed)')
  app.quit()
})

app.on('will-quit', () => {
  console.log('******* [will-quit] *******')
  if (!isUiOnly) {
    console.log('Gracefully shutting down the zen-node')
    zenNode.node.kill('SIGINT')
  }
})

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
