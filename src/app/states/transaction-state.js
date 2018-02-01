import {observable, action} from 'mobx'
import {postTransaction} from '../services/api-service'

class TransactionState {
  @observable asset
  @observable to
  @observable amount

  @action
  init() {}

  @action
  async createTransaction(tx) {
    const response = await postTransaction(tx.asset, tx.to, tx.amount)
    return response
  }

}

export default TransactionState
