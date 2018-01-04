import {observable} from 'mobx'
import {get} from 'axios'

import serverAddress from '../config/server-address'

class BalanceState {
    assets = observable.array([])

    async fetch() {
        let result = await get(`${serverAddress}/wallet/balance`)

        this.assets.replace(result.data)
    }
}

export default BalanceState
