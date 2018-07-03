// @flow
import { observable, action, runInAction, type IObservableArray } from 'mobx'

import { getTxHistory } from '../services/api-service'
import PollManager from '../utils/PollManager'
import { logApiError } from '../utils/apiUtils'

export type ObservableTransactionResponse = {
  txHash: string,
  asset: string,
  amount: number,
  confirmations: number
};

class TxHistoryState {
  @observable batchSize = 100
  @observable transactions: IObservableArray<ObservableTransactionResponse> = observable.array([])
  @observable skip = 0
  @observable currentPageSize = 0
  @observable isFetching = false
  fetchPollManager: PollManager

  constructor() {
    this.fetchPollManager = new PollManager({
      name: 'tx history fetch',
      fnToPoll: this.fetch,
      timeoutInterval: 5000,
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

  @action
  reset() {
    this.stopPolling()
    runInAction(() => {
      this.skip = 0
      this.currentPageSize = 0
      this.isFetching = false
      this.transactions.replace([])
    })
  }

  @action.bound
  fetch = async () => {
    if (this.isFetching) {
      return
    }
    this.isFetching = true
    try {
      const result = await getTxHistory({
        skip: this.skip, take: this.currentPageSize + this.batchSize,
      })
      runInAction(() => {
        console.log('result', result)
        if (result.length) {
          this.currentPageSize = result.length
          this.transactions.replace(result)
        }
        this.isFetching = false
      })
    } catch (err) {
      logApiError('fetch transactions', err)
      this.isFetching = false
    }
  }
}

export default TxHistoryState
