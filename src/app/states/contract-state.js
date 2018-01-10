import {observable, action} from 'mobx'
import {postActivateContract} from '../services/api-service'

class ContractState {
  @observable name = ''
  @observable code = ''

  @action
  init(code) {
    this.name = name
    this.code = code
  }

  @action
  async activateContract(code) {
    const response = await postActivateContract(code)
    return response
  }

}

export default ContractState
