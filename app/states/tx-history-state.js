import { observable, action, runInAction } from 'mobx'

import { getTxHistory } from '../services/api-service'

// import {find} from 'lodash'
// import db from '../services/store'
// import {truncateString} from '../../utils/helpers'
//
// const savedContracts = db.get('savedContracts').value()

class TxHistoryState {
  transactions = observable.array([])

  @action
  async fetch() {
    const result = await getTxHistory()
    runInAction(() => {
      this.transactions.replace(result.reverse())
    })
  }
}

export default TxHistoryState
