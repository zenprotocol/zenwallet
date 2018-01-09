import {observable, computed, action, runInAction} from 'mobx'
import {getBalances} from '../services/api-service'
import {find} from 'lodash'

const zenAsset = '0000000000000000000000000000000000000000000000000000000000000000'

class BalanceState {
    assets = observable.array([])

    constructor()  {
      this.fetch = this.fetch.bind(this)
    }

    @action
    begin() {
      this.fetch()
      setInterval(this.fetch, 1000);
    }

    @action
    async fetch() {
        let result = await getBalances()

        runInAction(() =>
          this.assets.replace(result))
    }

    @computed
    get zen() {
        let result = find(this.assets, asset => asset.asset === zenAsset)
        if (result !== undefined) {
          result = result.balance
        }
        return result
    }

}

export default BalanceState
