import { observable, action, runInAction } from 'mobx'

import { getNetworkStatus, getNetworkConnections } from '../services/api-service'

class NetworkState {
  @observable chain = ''
  @observable blocks = 0
  @observable headers = 0
  @observable difficulty = 0
  @observable medianTime = 0
  @observable connections = 0
  @observable initialBlockDownload = true
  @observable connectedToNode = false

  constructor() {
    this.fetch = this.fetch.bind(this)
  }

  @action
  initPolling() {
    this.fetch()
    setInterval(this.fetch, 2500)
  }

  @action
  async fetch() {
    try {
      const result = await getNetworkStatus()
      runInAction(() => {
        this.chain = result.chain
        this.blocks = result.blocks
        this.headers = result.headers
        this.difficulty = result.difficulty
        this.medianTime = result.medianTime
        this.initialBlockDownload = result.initialBlockDownload
        this.connectedToNode = true
      })
    } catch (error) {
      runInAction(() => {
        this.connectedToNode = false
      })
    }

    const networkConnectionsResult = await getNetworkConnections()
    runInAction(() => {
      this.connections = networkConnectionsResult
    })
  }
}

export default NetworkState
