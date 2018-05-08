// @flow
import { observable, computed, action, runInAction } from 'mobx'
import { find } from 'lodash'

import { getActiveContractSet } from '../services/api-service'
import db from '../services/store'

const savedContracts: Array<{hash: string, name: string}> = db.get('savedContracts').value()

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
  get contractsWithNames(): * {
    const contractsWithNamesResult = this.activeContracts.map(activeContract => {
      const result = find(savedContracts, contract => contract.hash === activeContract.contractId)
      const name = (result === undefined ? '' : result.name)
      return { ...activeContract, name }
    })
    return contractsWithNamesResult
  }
}

export default ActiveContractSetState
