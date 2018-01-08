import {observable} from 'mobx'
import {getBalances} from '../services/api-service'

class BalanceState {
    assets = observable.array([])

    async fetch() {
        let result = await getBalances()
        this.assets.replace(result)
    }

}

export default BalanceState
