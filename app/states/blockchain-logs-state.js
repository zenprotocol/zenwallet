import { observable } from 'mobx'
import { ipcRenderer } from 'electron'

class BlockchainLogsState {
  @observable logs = []

  constructor() {
    ipcRenderer.send('init-fetch-logs', null)
    ipcRenderer.on('blockchainLogs', (event, log) => {
      console.log(log) // prints "pong"
      this.logs.push(log)
    })
  }
}

export default BlockchainLogsState
