import {observable} from 'mobx'
import {get} from 'axios'

class BalanceState {
    assets = observable.array([])

    async fetch() {
        let result = await get('http://127.0.0.1:31567/wallet/balance')

        this.assets.replace(result.data)
    }
}

export default BalanceState