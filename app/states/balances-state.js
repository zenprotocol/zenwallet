import { observable, computed, action, runInAction } from 'mobx'
import { find } from 'lodash'

import PollManager from '../utils/PollManager'
import { getBalances } from '../services/api-service'
import { logApiError } from '../utils/apiUtils'
import db from '../services/store'
import { ZEN_ASSET_NAME, ZEN_ASSET_HASH } from '../../app/constants'

const savedContracts = db.get('savedContracts').value()

class BalancesState {
    @observable assets = []
    @observable searchQuery = ''
    fetchPollManager: PollManager

    constructor(acsState) {
      this.acsState = acsState
      this.fetchPollManager = new PollManager({
        name: 'Balances fetch',
        fnToPoll: this.fetch,
        timeoutInterval: 5000,
      })
    }

    @action
    init() {
      this.searchQuery = ''
    }

    @action
    initPolling() {
      this.fetchPollManager.initPolling()
    }
    @action
    stopPolling() {
      this.fetchPollManager.stopPolling()
    }

    @action.bound
    async fetch() {
      try {
        const assets = await getBalances()
        runInAction(() => this.assets.replace(assets))
        // if there's a balance without asset name, check ACS if matching contract exists
        // if it does, save it to DB
        assets.filter(asset => !this.getAssetName(asset.asset))
          .forEach(asset => {
            const matchingActiveContract =
              this.acsState.activeContractsWithNames.find(ac => ac.contractId === asset.asset)
            if (matchingActiveContract) {
              db.get('savedContracts').push(matchingActiveContract).write()
            }
          })
      } catch (err) {
        logApiError('fetch balances', err)
      }
    }

    getAssetName(asset) {
      if (asset === ZEN_ASSET_HASH) { return ZEN_ASSET_NAME }
      const contractFromDb = savedContracts.find(contract => contract.contractId === asset)
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
