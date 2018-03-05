import {observable, computed, action, runInAction} from 'mobx'
import {getBalances} from '../services/api-service'
import {find} from 'lodash'
import db from '../services/store'
import {truncateString} from '../../utils/helpers'

const savedContracts = db.get('savedContracts').value()
const zenAsset = '0000000000000000000000000000000000000000000000000000000000000000'

class BalancesState {
    assets = observable.array([])
    @observable searchQuery = ''

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
    getAssetName(asset) {
        const result = find(savedContracts, contract => contract.hash === asset)
        const isZenp = asset === zenAsset

        if (result !== undefined && result.name) {
          return result.name
        } else {
          if (isZenp) { return 'ZENP' }
          return ''
        }
    }

    @action
    getBalanceFor(asset) {
      let result = find(this.assets, {asset: asset})
      if (result !== undefined) {
        result = result.balance
      } else {
        result = 0
      }
      return result
    }

    @computed
    get assetsWithNames() {
      const assetsWithNamesResult = this.assets.map(asset => {
        const result = find(savedContracts, contract => contract.hash === asset.asset)
        const isZenp = asset.asset === zenAsset

        if (result !== undefined && result.name) { asset['name'] = result.name }
        if (isZenp) { asset['name'] = 'ZENP' }

        return asset
      })
      return assetsWithNamesResult
    }

    @computed
    get filtered() {
      const inputValue = this.searchQuery.trim().toLowerCase()
      const inputLength = inputValue.length
      const assetsWithNames = this.assetsWithNames

      if (inputLength === 0) {
        return assetsWithNames
      } else {
        return assetsWithNames.filter(asset =>
    	    (asset.name.toLowerCase().indexOf(inputValue) > -1) ||
          (asset.asset.toLowerCase().indexOf(inputValue) > -1)
    	  )
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
