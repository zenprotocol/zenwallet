import {app, BrowserWindow, Menu} from 'electron'
import contextMenu from 'electron-context-menu'

contextMenu()

app.on('ready', () => {
    const windowOptions = {
        width: 1080,
        minWidth: 680,
        height: 840,
        title: app.getName()
    }

    let mainWindow = new BrowserWindow(windowOptions)

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