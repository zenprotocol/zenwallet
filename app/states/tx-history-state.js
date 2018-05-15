import { observable, action, runInAction } from 'mobx'

import { getTxHistory } from '../services/api-service'

// uncomment when zen node have pagination support for comments
// const BATCH_SIZE = 50

class TxHistoryState {
  @observable transactions = observable.array([])
  @observable skip = 0
  @observable isFetching = false

  @action
  fetch = async () => {
    this.isFetching = true
    const result = await getTxHistory({ skip: 0, take: 999999999 })
    // const result = await getTxHistory({ skip: this.skip, take: BATCH_SIZE })
    runInAction(() => {
      this.transactions.replace(result)
      // use below version when zen node have pagination support
      // if (result.length) {
      // this.skip = this.skip + Math.min(BATCH_SIZE, result.length)
      // this.transactions = this.transactions.concat(result)
      // }
      this.isFetching = false
    })
  }
}

export default TxHistoryState
