import {observable, action} from 'mobx'
import {postExecuteContractMessage} from '../services/api-service'

class ContractMessageState {
  @observable asset = '0000000000000000000000000000000000000000000000000000000000000000'
  @observable to = ''
  @observable amount = 23
  @observable command = ''
  @observable data = ''

  @action
  init(asset, to, amount, command, data) {
    this.asset = asset
    this.to = to
    this.amount = amount
    this.command = command
    this.data = data
  }

  @action
  async sendContractMessage(msg) {
    const response = await postExecuteContractMessage(msg.asset, msg.to, msg.amount, msg.command, msg.data)
    return response
  }

}

export default ContractMessageState
