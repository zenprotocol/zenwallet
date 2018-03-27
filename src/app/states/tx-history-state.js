import {observable, computed, action, runInAction} from 'mobx'
import {getTxHistory} from '../services/api-service'

class TxHistoryState {
  transactions = observable.array([])

  @action
  async fetch() {
    let result = await getTxHistory()
    runInAction(() => {
      this.transactions.replace(result)
    })
  }

}

export default TxHistoryState
