// @flow
import { observable, action, runInAction } from 'mobx'

import { getWalletInstance } from '../services/wallet'

import NetworkStore from './networkStore'

class PublicAddressStore {
    @observable address = ''
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
