// @flow
import { observable, action, runInAction, type IObservableArray } from 'mobx'

import { getTxHistory, type TransactionDelta } from '../services/api-service'
import PollManager from '../utils/PollManager'

export type ObservableTransactionResponse = {
  txHash: string,
  asset: string,
  amount: number,
  confirmations: number
};

const BATCH_SIZE = 100

class TxHistoryState {
  @observable transactions: IObservableArray<ObservableTransactionResponse> = observable.array([])
  @observable skip = 0
  @observable currentPageSize = 0
  @observable isFetching = false
  fetchPollManager: PollManager

  constructor() {
    this.fetchPollManager = new PollManager({
      name: 'ACS fetch',
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
    console.log('this.isFetching', this.isFetching)
    if (this.isFetching) { return }
    this.isFetching = true
    try {
      const result = await getTxHistory({
        skip: this.skip, take: this.currentPageSize + BATCH_SIZE,
      })
      runInAction(() => {
        console.log('result', result)
        if (result.length) {
          this.currentPageSize = result.length
          this.transactions.replace(result)
        }
        this.isFetching = false
      })
    } catch (error) {
      console.log('error', error)
      this.isFetching = false
    }
  }
}

export default TxHistoryState
