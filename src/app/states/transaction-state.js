import {observable, action} from 'mobx'
import {postTransaction} from '../services/api-service'

class TransactionState {
    @observable asset = '0000000000000000000000000000000000000000000000000000000000000000'
    @observable to = ''
    @observable amount = 23

    @action
    init(asset, to, amount) {
        this.asset = asset
        this.to = ''
        this.amount = amount
    }

    @action
    async createTransaction(tx) {
        const response = await postTransaction(tx.asset, tx.to, tx.amount)
        return response
    }

}

export default TransactionState
