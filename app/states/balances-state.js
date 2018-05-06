import { observable, computed, action, runInAction } from 'mobx'
import { find } from 'lodash'

import { getBalances } from '../services/api-service'
import db from '../services/store'
import { ZEN_ASSET_HASH } from '../../app/constants'

const savedContracts = db.get('savedContracts').value()

class BalancesState {
    @observable assets = []
    @observable searchQuery = ''

    constructor() {
      this.fetch = this.fetch.bind(this)
    }

    @action
    init() {
      this.searchQuery = ''
    }

    @action
    initPolling() {
      this.fetch()
      setInterval(this.fetch, 5000);
    }

    @action
    async fetch() {
      const result = await getBalances()
      runInAction(() =>
        this.assets.replace(result))
    }

    getAssetName(asset) { // eslint-disable-line class-methods-use-this
      if (asset === ZEN_ASSET_HASH) { return 'ZENP' }
      const contractFromDb = savedContracts.find(contract => contract.hash === asset)
      if (contractFromDb && contractFromDb.name) {
        return contractFromDb.name
      }
      return ''
    }

    getBalanceFor(asset) {
      const result = find(this.assets, { asset })
      return result ? result.balance : 0
    }

    @computed
    get assetsWithNames() {
      return this.assets.map(asset => ({ ...asset, name: this.getAssetName(asset.asset) }))
    }

    filteredBalancesWithNames = query => {
      if (!this.assetsWithNames.length) {
        return []
      }
      if (!query) {
        return this.assetsWithNames
      }
      return this.assetsWithNames.filter(asset => (asset.name.indexOf(query) > -1)
        || (asset.asset.indexOf(query) > -1))
    }

    @computed
    get zen() {
      let result = find(this.assets, asset => asset.asset === ZEN_ASSET_HASH)
      if (result !== undefined) {
        result = result.balance
      } else {
        result = 0
      }
      return result
    }
}

export default BalancesState
