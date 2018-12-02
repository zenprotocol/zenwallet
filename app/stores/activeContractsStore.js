// @flow
import { observable, computed, action, runInAction } from 'mobx'

import PollManager from '../utils/PollManager'
import { getNamefromCodeComment } from '../utils/helpers'
import { getWalletInstance } from '../services/wallet'

import NetworkStore from './networkStore'


class ActiveContractsStore {
  networkStore: NetworkStore

  @observable rawActiveContracts = []
  fetchPollManager = new PollManager({
    name: 'Active contracts fetch',
    fnToPoll: this.fetch,
    timeoutInterval: 3000,
  })

  constructor(networkStore: NetworkStore) {
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
    const rawActiveContracts = await wallet.getActiveContracts()
    runInAction(() => {
      this.rawActiveContracts = rawActiveContracts
    })
  }

  @computed
  get activeContracts(): * {
    return this.rawActiveContracts.map(contract => {
      const name = getNamefromCodeComment(contract.code) || ''
      return { ...contract, name }
    })
  }
}

export default ActiveContractsStore
