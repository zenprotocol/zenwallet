import { observable } from 'mobx'
import { ipcRenderer } from 'electron'

import db from '../services/db'
import { IPC_BLOCKCHAIN_LOGS } from '../ZenNode'

class BlockchainLogsStore {
  @observable logs = []
  pending = []

  constructor() {
    // load logs from DB in case of switching chains
    this.logs = this.logs.concat(db.get('blockchainLogs').value())
    db.set('blockchainLogs', []).write()
    ipcRenderer.on(IPC_BLOCKCHAIN_LOGS, (event, logs) => {
      if (!logs.length) { return }
      this.logs = [...this.logs, ...logs]
    })
  }
}

export default BlockchainLogsStore
