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

import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import logger from 'electron-log'

import ZenNode from './ZenNode'
import db from './services/db'
import MainProcessErrorReporter from './utils/errorReporting/MainProcessErrorReporter'
import prereqCheck from './utils/prereqCheck'
import {
  APP_UPDATE_AVAILABLE,
  APP_QUIT_AND_INSTALL,
  APP_CHECK_FOR_UPDATES,
  APP_DOWNLOAD_PROGRESS,
  APP_CHECKING_FOR_UPDATES,
  APP_UPDATE_DOWNLOADED,
  APP_UPDATE_NOT_AVAILABLE,
  APP_UPDATE_ERROR,
} from './constants/autoUpdate'

const isUiOnly = (process.env.UIONLY || process.argv.indexOf('--uionly') > -1 || process.argv.indexOf('uionly') > -1)

let mainWindow = null

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support')
  sourceMapSupport.install()
}

require('electron-debug')({ enabled: true, showDevTools: process.env.SHOW_DEV_TOOLS })

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

const setupAutoUpdate = ({ webContents }) => {
  logger.transports.file.level = 'debug'
  autoUpdater.logger = logger
  autoUpdater.autoDownload = false

  autoUpdater.on(APP_CHECK_FOR_UPDATES, () => {
    webContents.send(APP_CHECKING_FOR_UPDATES)
  })

  autoUpdater.on(APP_UPDATE_AVAILABLE, (event, info) => {
    webContents.send(APP_UPDATE_AVAILABLE, event, info)
    logger.info('update avaiable')
    logger.info(info)
  })

  autoUpdater.on(APP_UPDATE_NOT_AVAILABLE, () => {
    logger.info(APP_UPDATE_NOT_AVAILABLE)
    webContents.send(APP_UPDATE_NOT_AVAILABLE)
  })

  autoUpdater.on(APP_UPDATE_ERROR, error => {
    webContents.send(APP_UPDATE_ERROR, error)
  })

  autoUpdater.on(APP_UPDATE_DOWNLOADED, (event, info) => {
    webContents.send(APP_UPDATE_DOWNLOADED, event, info)
    logger.info(APP_UPDATE_DOWNLOADED)
  })

  autoUpdater.on(APP_DOWNLOAD_PROGRESS, () => {
    logger.info(APP_DOWNLOAD_PROGRESS)
  })

  if (process.env.NODE_ENV === 'development') {
    autoUpdater.updateConfigPath = path.join(__dirname, '../dev-app-update.yml')
  }

  autoUpdater.checkForUpdates()

  ipcMain.on(APP_QUIT_AND_INSTALL, () => {
    autoUpdater.quitAndInstall()
  })

  ipcMain.on(APP_CHECK_FOR_UPDATES, () => {
    autoUpdater.checkForUpdates()
  })
}

let zenNode

/**
 * Add event listeners...
 */

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions()
  }

  prereqCheck()

  console.log('process.argv', process.argv)

  mainWindow = getMainWindow(app.getName())
  mainWindow.on('resize', saveWindowDimensionsToDb)
  mainWindow.setMenu(null)
  const mainProcessErrorReporter = new MainProcessErrorReporter(mainWindow.webContents)
  mainProcessErrorReporter.init()
  process.on('uncaughtException', registerUncaughtException(mainProcessErrorReporter))
  if (!isUiOnly) {
    zenNode = new ZenNode({
      webContents: mainWindow.webContents,
      onClose: () => { app.quit() },
      onError: mainProcessErrorReporter.report,
    })
    zenNode.init()
  }

  mainWindow.loadURL(`file://${__dirname}/app.html`)

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!isUiOnly) {
      zenNode.onWebContentsFinishLoad()
    }
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined')
    }
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', () => { mainWindow = null })

  process.on('SIGINT', () => {
    console.log('******* [PROCESS SIGINT] *******')
    console.log('Please close zen-wallet by closing the app window. Now calling app.quit() ...')
    app.quit()
  })

  setupAutoUpdate(mainWindow)
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
    zenNode.node.kill()
  }
})

function getMainWindow(title) {
  const { width, height } = db.get('userPreferences').value()
  return new BrowserWindow({
    width,
    height,
    title,
    backgroundColor: '#121212',
  })
}

function saveWindowDimensionsToDb() {
  if (!mainWindow) { return }
  const { width, height } = mainWindow.getBounds()
  db.get('userPreferences').assign({ width, height }).write()
}

// TODO move logic into mainProcessErrorReporter
function registerUncaughtException(mainProcessErrorReporter) {
  return (error) => {
    console.error('main process uncaughtException', error)
    dialog.showErrorBox(
      `${error.message} (We suggest you restart the app)`,
      error.stack,
    )
    mainProcessErrorReporter.report(error)
  }
}
