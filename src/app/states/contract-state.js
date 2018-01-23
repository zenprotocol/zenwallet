import {observable, action} from 'mobx'
import {postActivateContract} from '../services/api-service'

class ContractState {
  @observable fileName
  @observable name
  @observable code
  @observable hash
  @observable address

  @action
  init() {
    this.fileName = ''
    this.name = ''
    this.code = ''
    this.hash = ''
    this.address = ''
  }

  @action
  async activateContract(code) {
    const response = await postActivateContract(code)
    // DOTO - set contract hash and address
    return response
  }

}

export default ContractState
