import {observable, computed, action, runInAction} from 'mobx'
import {getActiveContractSet} from '../services/api-service'
import {find} from 'lodash'
import db from '../services/store'
import {truncateString} from '../../utils/helpers'

const savedContracts = db.get('savedContracts').value()

class ActiveContractSetState {
  activeContracts = observable.array([])

  @action
  async fetch() {
    let result = await getActiveContractSet()
    runInAction(() => {
      this.activeContracts.replace(result)
    })
  }

  @computed
  get contractsWithNames() {
    const contractsWithNamesResult = this.activeContracts.map(activeContract => {
      const result = find(savedContracts, contract => contract.hash === activeContract.contractHash)
      console.log('result', result)
      activeContract['name'] = (result === undefined ? '' : result.name)
      return activeContract
    })
    return contractsWithNamesResult
  }

}

export default ActiveContractSetState
