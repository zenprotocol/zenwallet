'use strict';

var _electron = require('electron');

var _electronContextMenu = require('electron-context-menu');

var _electronContextMenu2 = _interopRequireDefault(_electronContextMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _electronContextMenu2.default)();

_electron.app.on('ready', () => {
    const windowOptions = {
        width: 1080,
        minWidth: 680,
        height: 840,
        title: _electron.app.getName()
    };

    let mainWindow = new _electron.BrowserWindow(windowOptions);

    if (process.platform === 'darwin') {
        _electron.Menu.setApplicationMenu(_electron.Menu.buildFromTemplate([{
            label: 'Zen Wallet',
            submenu: [{
                label: 'About Zen Wallet',
                role: 'about'
            }, {
                label: 'Quit',
                accelerator: 'Command+Q',
                click() {
                    _electron.app.quit();
                }
            }]
        }, {
            label: "Edit",
            submenu: [{ label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" }, { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" }, { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" }, { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }]
        }]));
    } else {
        mainWindow.setMenu(null);
    }

    mainWindow.loadURL(`file://${__dirname}/app/index.html`);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});