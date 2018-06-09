// @flow
import { observable, action, runInAction, type IObservableArray } from 'mobx'

import { getTxHistory, type TransactionDelta } from '../services/api-service'

export type ObservableTransactionResponse = {
  txHash: string,
  // $FlowFixMe
  deltas: IObservableArray<TransactionDelta>,
  blockNumber: number
};

const BATCH_SIZE = 20

class TxHistoryState {
  @observable transactions: IObservableArray<ObservableTransactionResponse> = observable.array([])
  @observable skip = 0
  @observable currentPageSize = 0
  @observable isFetching = false

  @action
  fetch = async () => {
    this.isFetching = true
    const result = await getTxHistory({ skip: this.skip, take: this.currentPageSize + BATCH_SIZE })
    runInAction(() => {
      if (result.length) {
        this.currentPageSize = this.currentPageSize + Math.min(BATCH_SIZE, result.length)
        this.transactions.replace(result)
      }
      this.isFetching = false
    })
  }
}

export default TxHistoryState
