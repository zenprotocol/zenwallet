// @flow
import { observable, computed, action, runInAction } from 'mobx'

import { getActiveContractSet } from '../services/api-service'
import { getNamefromCodeComment } from '../utils/helpers'

class ActiveContractSetState {
  activeContracts = observable.array([])
  isPolling = false
  pollTimeout = null

  @action.bound
  async fetch() {
    const result = await getActiveContractSet()
    runInAction(() => {
      this.activeContracts.replace(result)
    })
    if (this.isPolling) {
      this.pollTimeout = setTimeout(this.fetch, 3000)
    }
  }

  @computed
  get activeContractsWithNames(): * {
    return this.activeContracts.map(contract => {
      const name = getNamefromCodeComment(contract.code) || ''
      return { ...contract, name }
    })
  }

  initPolling() {
    this.isPolling = true
    this.fetch()
  }

  stopPolling() {
    // $FlowFixMe
    clearTimeout(this.pollTimeout)
    this.isPolling = false
  }
}

export default ActiveContractSetState
