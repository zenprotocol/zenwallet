import path from 'path'
import fs from 'fs'

import electron from 'electron'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

const electronApp = (electron.app || electron.remote.app)
const fileName = 'zen-wallet-db.json'

const appDataPath = electronApp.getPath('appData')
const userDataPath = path.join(appDataPath, 'zenwallet')
console.log('db userDataPath', userDataPath)

const doesFolderExist = fs.existsSync(userDataPath)

if (!doesFolderExist) { fs.mkdirSync(userDataPath) }

const zenDataPath = path.join(userDataPath, fileName)

const adapter = new FileSync(zenDataPath)
const db = low(adapter)

export default db
