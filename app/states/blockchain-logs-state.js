import { observable, runInAction } from 'mobx'
import { ipcRenderer } from 'electron'

class BlockchainLogsState {
  @observable logs = []
  pending = []

  constructor() {
    ipcRenderer.send('init-fetch-logs', null)
    ipcRenderer.on('blockchainLogs', (event, log) => {
      if (!log) { return }
      this.pending.push(log)
    })

    setInterval(() => {
      runInAction(() => {
        this.logs = this.logs.concat(this.pending).slice(-250)
        this.pending = []
      })
    }, 500)
  }
}

export default BlockchainLogsState
