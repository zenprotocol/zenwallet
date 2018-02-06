import {observable, computed, action, runInAction} from 'mobx'
import {getBalances} from '../services/api-service'
import {find} from 'lodash'
import db from '../services/store'
import {truncateString} from '../../utils/helpers'

const savedContracts = db.get('savedContracts').value()
const zenAsset = '0000000000000000000000000000000000000000000000000000000000000000'

class BalancesState {
    assets = observable.array([])

    constructor()  {
      this.fetch = this.fetch.bind(this)
    }

    @action
    begin() {
      this.fetch()
      setInterval(this.fetch, 2000);
    }

    @action
    async fetch() {
        let result = await getBalances()

        runInAction(() =>
          this.assets.replace(result))
    }

    @action
    getAssetWithName(asset) {
        const result = find(savedContracts, contract => contract.hash === asset)
        const isZenp = asset === zenAsset

        if (result !== undefined && result.name) {
          return result.name
        } else {
          if (isZenp) { return 'ZENP' }
          return asset
        }
    }

    @computed
    get zen() {
        let result = find(this.assets, asset => asset.asset === zenAsset)
        if (result !== undefined) {
          result = result.balance
        } else {
          result = 0
        }
        return result
    }

}

export default BalancesState
