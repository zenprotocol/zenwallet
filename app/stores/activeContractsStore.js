// @flow
import { observable, computed, action, runInAction } from 'mobx'

import { getActiveContracts } from '../services/api-service'
import PollManager from '../utils/PollManager'
import { getNamefromCodeComment } from '../utils/helpers'

class ActiveContractsStore {
  @observable rawActiveContracts = []
  fetchPollManager = new PollManager({
    name: 'Active contracts fetch',
    fnToPoll: this.fetch,
    timeoutInterval: 3000,
  })

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
    const rawActiveContracts = await getActiveContracts()
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
