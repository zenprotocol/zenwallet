// @flow
import { observable, computed, action, runInAction } from 'mobx'

import { logApiError } from '../utils/apiUtils'
import { getActiveContractSet } from '../services/api-service'
import PollManager from '../utils/PollManager'
import { getNamefromCodeComment } from '../utils/helpers'

class ActiveContractSetState {
  activeContracts = observable.array([])
  fetchPollManager: PollManager

  constructor() {
    this.fetchPollManager = new PollManager({
      name: 'ACS fetch',
      fnToPoll: this.fetch,
      timeoutInterval: 3000,
    })
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
      const result = await getActiveContractSet()
      runInAction(() => {
        this.activeContracts.replace(result)
      })
    } catch (err) {
      logApiError('fetch active contracts', err)
    }
  }

  @computed
  get activeContractsWithNames(): * {
    return this.activeContracts.map(contract => {
      const name = getNamefromCodeComment(contract.code) || ''
      return { ...contract, name }
    })
  }
}

export default ActiveContractSetState
