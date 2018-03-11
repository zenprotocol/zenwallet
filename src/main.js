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
      name: 'ZENP Faucet',
      hash: '5221fb6b756e67dc53dcdc296f3bbdc58ae7d4356ee738b68c98126e0390b046',
      address: 'tc1q2kpzsa5nra7uncpyyzheett46qyxvs8lgva0agmp0kw50q63h39qy49v6g'
    },
    {
      name: 'Jezreel Valley Adumim 2020 Red',
      hash: '3cb6b7179971d7af7f1747926ffea22c40dda652a20d1dd059bd0a37df298795',
      address: 'tc1q8jmtw9uew8t67lchg7fxll4z93qdmfjj5gx3m5zeh59r0hefs72sdydgsq'
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

  console.log('process args', args)

  if (process.env.ZEN_LOCAL === 'L1')
    args.push('-l1')
  else if (process.env.ZEN_LOCAL === 'localhost')
    args.push('--localhost')

  const node = zenNode(args)
  node.stderr.pipe(process.stderr)
  node.stdout.pipe(process.stdout)

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
      node.kill()
    })
  })
