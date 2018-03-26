import {app, BrowserWindow, Menu} from 'electron'
import contextMenu from 'electron-context-menu'
import zenNode from '@zen/zen-node'
import db from './app/services/store'

db.defaults({
  userPreferences: {
    width: 1200, height: 800
  },
  savedContracts: [
    {
      name: 'Jezreel Valley Adumim 2018 Red',
      hash: '99f1aed539e83caa26467a0143024c197421fdab7bc1aff905fce314c48b7f80',
      address: 'tc1qn8c6a4feaq725fjx0gq5xqjvr96zrldt00q6l7g9ln33f3yt07qq2qt6a7'
    }
  ]
}).write()

let mainWindow

contextMenu()

app.on('ready', () => {
  console.log('process.argv', process.argv)

  let args = []

  if (process.argv.indexOf("wipe") > -1) {
    args.push('--wipe')
    console.log('WIPING DB')
  } else {
    console.log('NOT WIPING DB')
  }

  if (process.argv.indexOf("miner") > -1) {
    args.push('--miner')
    console.log('RUNNING A MINER')
  } else {
    console.log('NOT RUNNING A MINER')
  }

  if (process.env.ZEN_LOCAL === 'L1') {
		args.push('-l1')
	}
  if (process.env.ZEN_LOCAL === 'localhost') {
		args.push('--localhost')
	}

	console.log('process args', args)

  let node
  if (process.env.NODE_ENV !== 'localnode') {
    node = zenNode(args)
    node.stderr.pipe(process.stderr)
    node.stdout.pipe(process.stdout)
  }

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
      if (process.env.NODE_ENV !== 'localnode') { node.kill() }
    })
  })
