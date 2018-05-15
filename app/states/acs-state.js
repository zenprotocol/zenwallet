// @flow
import { observable, computed, action, runInAction } from 'mobx'

import { getActiveContractSet } from '../services/api-service'
import { getNamefromCodeComment } from '../utils/helpers'

class ActiveContractSetState {
  activeContracts = observable.array([])

  @action
  async fetch() {
    const result = await getActiveContractSet()
    runInAction(() => {
      this.activeContracts.replace(result)
    })
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
