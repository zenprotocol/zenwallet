import { observable, action, runInAction } from 'mobx'

import PollManager from '../utils/PollManager'
import { getNetworkStatus, getNetworkConnections } from '../services/api-service'

class NetworkState {
  @observable chain = ''
  @observable blocks = 0
  @observable headers = 0
  @observable difficulty = 0
  @observable medianTime = 0
  @observable connections = 0
  @observable isSynced = true
  @observable connectedToNode = false
  fetchPollManager: PollManager

  constructor() {
    this.fetchPollManager = new PollManager({
      name: 'Network fetch',
      fnToPoll: this.fetch,
      timeoutInterval: 2500,
    })
  }

  @action
  initPolling() {
    this.fetchPollManager.initPolling()
  }
  @action
  stopPolling() {
    this.fetchPollManager.stopPolling()
  }

  @action.bound
  async fetch() {
    try {
      const result = await getNetworkStatus()
      runInAction(() => {
        this.chain = result.chain
        this.blocks = result.blocks
        this.headers = result.headers
        this.difficulty = result.difficulty
        this.medianTime = result.medianTime
        this.isSynced = !result.initialBlockDownload
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

  get isSyncing() {
    return !this.isSynced || (this.blocks < this.headers)
  }
}

export default NetworkState
