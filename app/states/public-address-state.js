import { observable, action, runInAction } from 'mobx'

import { getPublicAddress, getPublicPkHash } from '../services/api-service'

class PublicAddressState {
    @observable address = ''
    @observable addressError = ''
    @observable showingPkHash = false
    @observable pkHash = ''
    @observable pkHashError = ''

    @action
    async fetch() {
      try {
        const address = await getPublicAddress()
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
    async fetchPkHash(address) {
      try {
        const pkHash = await getPublicPkHash(address)
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

export default PublicAddressState
