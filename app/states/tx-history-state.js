import { observable, action, runInAction } from 'mobx'

import { getTxHistory } from '../services/api-service'

// import {find} from 'lodash'
// import db from '../services/store'
// import {truncateString} from '../utils/helpers'
//
// const savedContracts = db.get('savedContracts').value()

const BATCH_SIZE = 1000

class TxHistoryState {
  @observable transactions = observable.array([])
  @observable skip = 0
  @observable isFetching = false

  @action
  fetch = async () => {
    this.isFetching = true
    const result = await getTxHistory({ skip: this.skip, take: BATCH_SIZE })
    runInAction(() => {
      if (result.length) {
        this.skip = this.skip + Math.min(BATCH_SIZE, result.length)
        this.transactions = this.transactions.concat(result)
      }
      this.isFetching = false
    })
  }
}

export default TxHistoryState
