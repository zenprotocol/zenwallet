import { observable, runInAction } from 'mobx'
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
    ipcRenderer.on(IPC_BLOCKCHAIN_LOGS, (event, log) => {
      if (!log) { return }
      this.pending.push(log)
    })

    setInterval(() => {
      runInAction(() => {
        this.logs = this.logs.concat(this.pending)
        this.pending = []
      })
    }, 2000)
  }
}

export default BlockchainLogsStore
