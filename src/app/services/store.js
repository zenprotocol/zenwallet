import electron from 'electron'
import path from 'path'
import low from 'lowdb'
import fs from 'fs'
import FileSync from 'lowdb/adapters/FileSync'

const electronApp = (electron.app || electron.remote.app)
const fileName = 'zen-wallet-db.json'
const userDataPath = electronApp.getPath('userData')
const appDataPath = electronApp.getPath('appData')
const zenWalletPath = `${appDataPath}/zenwallet`

if (!fs.existsSync(zenWalletPath)) { fs.mkdir(zenWalletPath) }

const zenDataPath = path.join(userDataPath, fileName)

const adapter = new FileSync(zenDataPath)
const db = low(adapter)

export default db
