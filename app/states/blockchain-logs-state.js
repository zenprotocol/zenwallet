import { observable, runInAction } from 'mobx'
import { ipcRenderer } from 'electron'

import { IPC_BLOCKCHAIN_LOGS } from '../ZenNode'

class BlockchainLogsState {
  @observable logs = []
  pending = []

  constructor() {
    ipcRenderer.on(IPC_BLOCKCHAIN_LOGS, (event, log) => {
      if (!log) { return }
      this.pending.push(log)
    })

    setInterval(() => {
      runInAction(() => {
        this.logs = this.logs.concat(this.pending).slice(-200)
        this.pending = []
      })
    }, 2000)
  }
}

export default BlockchainLogsState
