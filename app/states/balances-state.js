import { observable, computed, action, runInAction } from 'mobx'
import { find } from 'lodash'

import PollManager from '../utils/PollManager'
import { zenBalanceDisplay, kalapasToZen, isZenAsset } from '../utils/zenUtils'
import { numberWithCommas } from '../utils/helpers'
import { getBalances } from '../services/api-service'
import db from '../services/store'
import { ZEN_ASSET_NAME, ZEN_ASSET_HASH } from '../../app/constants'

const savedContracts = db.get('savedContracts').value()

class BalancesState {
    @observable rawAssets = []
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
      const rawAssets = await getBalances()
      runInAction(() => this.rawAssets.replace(rawAssets))
      // if there's a balance without asset name, check ACS if matching contract exists
      // if it does, save it to DB
      rawAssets.filter(asset => !this.getAssetName(asset.asset))
        .forEach(asset => {
          const matchingActiveContract =
            this.acsState.activeContractsWithNames.find(ac => ac.contractId === asset.asset)
          if (matchingActiveContract) {
            db.get('savedContracts').push(matchingActiveContract).write()
          }
        })
    }

    getAssetName(asset) { // eslint-disable-line class-methods-use-this
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

    get assets() {
      return this.rawAssets.map(asset => ({
        ...asset,
        name: this.getAssetName(asset.asset),
        balance: isZenAsset(asset.asset) ? kalapasToZen(asset.balance) : asset.balance,
        balanceDisplay: isZenAsset(asset.asset)
          ? zenBalanceDisplay(asset.balance)
          : numberWithCommas(asset.balance),
      }))
    }

    filteredBalances = query => {
      if (!this.assets.length) {
        return []
      }
      if (!query) {
        return this.assets
      }
      return this.assets.filter(asset => (asset.name.indexOf(query) > -1)
        || (asset.asset.indexOf(query) > -1))
    }

    @computed
    get zenDisplay() {
      return this.zen ? this.zen.balanceDisplay : '0'
    }
    @computed
    get zenBalance() {
      return this.zen ? this.zen.balance : 0
    }
    @computed
    get zen() {
      return this.assets.find(asset => asset.asset === ZEN_ASSET_HASH)
    }
}

export default BalancesState
