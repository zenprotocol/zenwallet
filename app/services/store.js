import path from 'path'
import fs from 'fs'

import electron from 'electron'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

import jezreelContractCode from './jezreelContractCode'

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

db.defaults({
  userPreferences: {
    width: 1200,
    height: 800,
  },
  savedContracts: [
    {
      name: 'Jezreel Valley Adumim 2018 Red',
      contractId: '99f1aed539e83caa26467a0143024c197421fdab7bc1aff905fce314c48b7f80',
      address: 'tc1qn8c6a4feaq725fjx0gq5xqjvr96zrldt00q6l7g9ln33f3yt07qq2qt6a7',
      code: jezreelContractCode,
    },
  ],
  config: {
    alreadyRedeemedTokens: false,
    autoLogoutMinutes: 30,
    isMining: false,
  },
}).write()

export default db
