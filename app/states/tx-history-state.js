// @flow
import { observable, action, runInAction, type IObservableArray } from 'mobx'

import { getTxHistory, type TransactionDelta } from '../services/api-service'

export type ObservableTransactionResponse = {
  txHash: string,
  asset: string,
  amount: number,
  confirmations: number
};

const BATCH_SIZE = 20
const POLLING_INTERVAL = 5000
let intervalId = -1

class TxHistoryState {
  @observable transactions: IObservableArray<ObservableTransactionResponse> = observable.array([])
  @observable skip = 0
  @observable currentPageSize = 0
  @observable isFetching = false

  @action
  initPolling() {
    this.fetch()
    intervalId = window.setInterval(this.fetch, POLLING_INTERVAL)
  }

  @action
  reset() {
    window.clearInterval(intervalId)
    runInAction(() => {
      this.skip = 0
      this.currentPageSize = 0
      this.isFetching = false
      this.transactions.replace([])
    })
  }

  @action
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
