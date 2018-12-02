// @flow
import { observable, computed, action, runInAction } from 'mobx'
import { find } from 'lodash'

import PollManager from '../utils/PollManager'
import { zenBalanceDisplay, kalapasToZen, isZenAsset } from '../utils/zenUtils'
import { numberWithCommas } from '../utils/helpers'
import type { Asset } from '../services/api-service'
import db from '../services/db'
import { ZEN_ASSET_NAME, ZEN_ASSET_HASH } from '../../app/constants'
import { getWalletInstance } from '../services/wallet'

import ActiveContractStore from './activeContractsStore'
import NetworkStore from './networkStore'

const savedContracts = db.get('savedContracts').value()

class PortfolioStore {
    activeContractsStore: ActiveContractStore
    networkStore: NetworkStore

    @observable rawAssets: Asset[] = []
    @observable searchQuery = ''
    fetchPollManager = new PollManager({
      name: 'Balances fetch',
      fnToPoll: this.fetch,
      timeoutInterval: 5000,
    })

    constructor(activeContractsStore: ActiveContractStore, networkStore: NetworkStore) {
      this.activeContractsStore = activeContractsStore
      this.networkStore = networkStore
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
      const wallet = getWalletInstance(this.networkStore.chain)
      const rawAssets = await wallet.getBalances()
      runInAction(() => this.rawAssets.replace(rawAssets))
      // if there's a balance without asset name, check ACS if matching contract exists
      // if it does, save it to DB
      rawAssets.filter(asset => !this.getAssetName(asset.asset))
        .forEach(asset => {
          const matchingActiveContract =
            this.activeContractsStore.activeContracts.find(ac => ac.contractId === asset.asset)
          if (matchingActiveContract) {
            db.get('savedContracts').push(matchingActiveContract).write()
          }
        })
    }

    getAssetName(asset: string) { // eslint-disable-line class-methods-use-this
      if (asset === ZEN_ASSET_HASH) { return ZEN_ASSET_NAME }
      const contractId = asset.substring(0, 64 + 8)
      const contractFromDb = savedContracts.find(contract => contract.contractId === contractId)
      if (contractFromDb && contractFromDb.name) {
        // eslint-disable-next-line prefer-destructuring
        const name = contractFromDb.name

        const subType = asset.substring(64 + 8)

        if (subType) {
          const buffer = Buffer.from(subType, 'hex')

          // is a number candidate?
          if (buffer[0] === 0) {
            let isNumber = true

            // eslint-disable-next-line no-plusplus
            for (let i = 5; i < 32; i++) {
              if (buffer[i] !== 0) {
                isNumber = false
                break
              }
            }

            if (isNumber) {
              const number = buffer.readInt32BE(1)

              return `${name} - #${number}`
            }
          } else {
            let isZero = false
            let isStringCandidate = true
            let stringLength = 0

            // Check if buffer is padded with zeros up to the end
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < 32; i++) {
              if (!isZero && buffer[i] === 0) {
                isZero = true
                stringLength = i
              } else if (isZero && buffer[i] !== 0) {
                isStringCandidate = false
                break
              } else if (!isZero) {
                stringLength = i
              }
            }

            if (isStringCandidate && stringLength > 0) {
              const subTypeName = buffer.slice(0, stringLength)

              // eslint-disable-next-line no-control-regex
              if (/^[\x00-\x7F]*$/.test(subTypeName)) {
                return `${name} - ${subTypeName}`
              }
            }
          }

          return ''
        }
        return name
      }
      return ''
    }

    getBalanceFor(asset: string) {
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

export default PortfolioStore
