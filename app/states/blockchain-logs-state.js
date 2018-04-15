import { observable } from 'mobx'
import { ipcRenderer } from 'electron'

class BlockchainLogsState {
  @observable logs = []

  constructor() {
    ipcRenderer.send('init-fetch-logs', null)
    ipcRenderer.on('blockchainLogs', (event, log) => {
      if (!log) { return }
      this.logs = this.logs.concat(log).slice(-50)
    })
  }
}

export default BlockchainLogsState
