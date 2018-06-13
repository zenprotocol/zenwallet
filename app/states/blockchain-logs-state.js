import { observable, runInAction } from 'mobx'
import { ipcRenderer } from 'electron'

class BlockchainLogsState {
  @observable logs = []
  pending = []

  constructor() {
    ipcRenderer.on('blockchainLogs', (event, log) => {
      if (!log) { return }
      this.pending.push(log)
    })

    setInterval(() => {
      runInAction(() => {
        this.logs = this.logs.concat(this.pending).slice(-100)
        this.pending = []
      })
    }, 1000)
  }
}

export default BlockchainLogsState
