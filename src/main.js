import {app, BrowserWindow, Menu} from 'electron'
import contextMenu from 'electron-context-menu'

import path from 'path'
import Store from './app/services/store'

let mainWindow

const store = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'user-preferences',
  defaults: {
    // 800x600 is the default size of our window
    windowBounds: { width: 1200, height: 800 }
  }
})

contextMenu()

app.on('ready', () => {

    let { width, height } = store.get('windowBounds')

    const windowOptions = {
        width: width,
        height: height,
        title: app.getName()
    }

    mainWindow = new BrowserWindow(windowOptions)

    mainWindow.on('resize', () => {
      // The event doesn't pass us the window size, so we call the `getBounds` method which returns an object with
      // the height, width, and x and y coordinates.
      let { width, height } = mainWindow.getBounds()
      // Now that we have them, save them using the `set` method.
      store.set('windowBounds', { width, height })
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
