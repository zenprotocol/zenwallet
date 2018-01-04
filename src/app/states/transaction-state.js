import {observable, action} from 'mobx'
import {post} from 'axios'

import serverAddress from '../config/server-address'

class TransactionState {
    @observable asset = '0000000000000000000000000000000000000000000000000000000000000000'
    @observable to = 'tz1qlg6c8nh5gtknpdyssmwlwmtvjgw22j0j474r47fva0tklnu7ka6s4ytquw'
    @observable amount = 1

    @action
    init(asset, to, amount) {
        this.asset = '0000000000000000000000000000000000000000000000000000000000000000'
        this.to = 'tz1qlg6c8nh5gtknpdyssmwlwmtvjgw22j0j474r47fva0tklnu7ka6s4ytquw'
        this.amount = 1
    }

    @action
    async createTransaction(tx) {

      const data = {
        "asset" : tx.asset,
        "to" : tx.to,
        "amount" : tx.amount
      }

        const response = await post(`${serverAddress}/wallet/transaction/send`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return response.data
    }

}

export default TransactionState
