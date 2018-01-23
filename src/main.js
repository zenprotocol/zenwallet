import {app, BrowserWindow, Menu} from 'electron'
import contextMenu from 'electron-context-menu'

import db from './app/services/store'

db.defaults({
  userPreferences: {
    width: 1200, height: 800 }
  }).write()

let mainWindow

contextMenu()

app.on('ready', () => {

  let { width, height } = db.get('userPreferences').value()

  const windowOptions = {
    width: width,
    height: height,
    title: app.getName()
  }

  mainWindow = new BrowserWindow(windowOptions)

  mainWindow.on('resize', () => {
    let { width, height } = mainWindow.getBounds()
    db.get('userPreferences').assign({ width: width, height: height }).write()
  });

  if (process.platform === 'darwin') {
    Menu.setApplicationMenu(Menu.buildFromTemplate([
      {
        label: 'Zen Wallet',
        submenu: [
          {
            label: 'About Zen Wallet',
            role: 'about'
          },
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            click() {
              app.quit()
            }
          },
        ]
      },
      {
        label: "Edit",
        submenu: [
          {label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:"},
          {label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:"},
          {label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:"},
          {label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:"}
        ]
      }]))
    } else {
      mainWindow.setMenu(null)
    }


    mainWindow.loadURL(`file://${__dirname}/app/index.html`)

    mainWindow.on('closed', () => {
      mainWindow = null
    })
  })
