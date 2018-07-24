// @flow
import { observable, action, runInAction } from 'mobx'

import { getTxHistory } from '../services/api-service'
import PollManager from '../utils/PollManager'

class TxHistoryStore {
  @observable batchSize = 100
  @observable transactions = []
  @observable skip = 0
  @observable currentPageSize = 0
  @observable isFetching = false
  fetchPollManager = new PollManager({
    name: 'tx history fetch',
    fnToPoll: this.fetch,
    timeoutInterval: 5000,
  })
  @action
  initPolling() {
    this.fetchPollManager.initPolling()
  }
  @action
  stopPolling() {
    this.fetchPollManager.stopPolling()
  }

  @action
  reset() {
    this.stopPolling()
    runInAction(() => {
      this.skip = 0
      this.currentPageSize = 0
      this.transactions = []
    })
  }

  @action.bound
  fetch = async () => {
    if (this.isFetching) { return }
    this.isFetching = true
    try {
      const result = await getTxHistory({
        skip: this.skip, take: this.currentPageSize + this.batchSize,
      })
      runInAction(() => {
        if (result.length) {
          this.currentPageSize = result.length
          this.transactions = result
        }
        this.isFetching = false
      })
    } catch (error) {
      console.log('error', error)
      this.isFetching = false
    }
  }
}

export default TxHistoryStore
