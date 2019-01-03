import path from 'path'
import fs from 'fs'

import electron from 'electron'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

import exampleContractCode from './exampleContractCode'

const electronApp = (electron.app || electron.remote.app)
const fileName = 'zen-wallet-db.json'

const appDataPath = electronApp.getPath('appData')
const userDataPath = path.join(appDataPath, 'zenwallet')

// console.log('db folder:', userDataPath)

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
      name: 'Example Token',
      contractId: '00000000ac577fbf6471203ae3907e8ce53ac78d7dd33c82ce5f1cd2d980089b3babe073',
      address: 'tc1qqqqqqq9v2alm7er3yqaw8yr73njn43ud0hfneqkwtuwd9kvqpzdnh2lqwvghrq3t',
      code: exampleContractCode,
    },
  ],
  config: {
    alreadyRedeemedTokens: false,
    autoLogoutMinutes: 15,
    isMining: false,
    isReportingErrors: false,
    dontAskToReportErrors: false,
  },
  lastWipe: {
    timestamp: null,
    walletVersion: null,
    zenNodeVersion: null,
  },
  blockchainLogs: [],
  'txCountInLastLogin-testnet': 0,
  'txCountInLastLogin-mainnet': 0,
  'txCountInLastVisitToTransactionsRoute-testnet': 0,
  'txCountInLastVisitToTransactionsRoute-mainnet': 0,

}).write()

export default db
