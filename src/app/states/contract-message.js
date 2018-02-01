import {observable, action} from 'mobx'
import {postRunContractMessage} from '../services/api-service'

class ContractMessageState {
  @observable asset
  @observable to
  @observable amount
  @observable command
  @observable data

  @action
  init() {}

  @action
  async sendContractMessage(msg) {
    const response = await postRunContractMessage(msg.asset, msg.to, msg.amount, msg.command, msg.data)
    return response
  }

  @action
  resetForm() {
    this.asset = null
    this.to = null
    this.amount = null
    this.command = null
    this.data = null
  }

}

export default ContractMessageState
