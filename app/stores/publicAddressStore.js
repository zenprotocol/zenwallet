// @flow
import { observable, action, runInAction } from 'mobx'

import {
  getPublicAddress,
  getPublicPkHash,
  postWalletKeys,
} from '../services/api-service'
import { getWalletInstance } from '../services/wallet'

import NetworkStore from './networkStore'

class PublicAddressStore {
    @observable address = ''
    @observable publicKeys = []
    @observable addressError = ''
    @observable showingPkHash = false
    @observable pkHash = ''
    @observable pkHashError = ''

    networkStore: NetworkStore

    constructor(networkStore: NetworkStore) {
      this.networkStore = networkStore
    }

    @action
    async fetch() {
      try {
        const wallet = getWalletInstance(this.networkStore.chain)
        const address = await wallet.getAddress()
        runInAction(() => {
          this.fetchPkHash(address)
          this.address = address
          this.addressError = ''
        })
      } catch (err) {
        console.error('error getting public address', err)
        runInAction(() => { this.addressError = 'Error getting public address' })
      }
    }

    @action.bound
    async getKeys(password) {
      try {
        const walletKeys = await postWalletKeys(password)
        runInAction(() => {
          this.publicKeys = walletKeys.map(item => {
            const { publicKey, path } = item
            return { publicKey, path: path.slice(-3) }
          })
          this.addressError = ''
        })
      } catch (err) {
        console.error('error getting public keys', err)
        runInAction(() => { this.addressError = 'Error getting public keys' })
      }
    }

    @action
    async fetchPkHash(address: string) {
      try {
        const wallet = getWalletInstance(this.networkStore.chain)
        const pkHash = await wallet.getPublicKeyHash(address)
        runInAction(() => {
          this.pkHash = pkHash
          this.pkHashError = ''
        })
      } catch (err) {
        console.error('error getting pkHash', err)
        runInAction(() => { this.pkHashError = 'Error getting PkHash' })
      }
    }

    @action
    toggleShowPkHash = () => {
      this.showingPkHash = !this.showingPkHash
    }
}

export default PublicAddressStore
