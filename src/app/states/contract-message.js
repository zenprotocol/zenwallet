import {observable, action, runInAction} from 'mobx'
import {postRunContractMessage} from '../services/api-service'

class ContractMessageState {
  @observable asset = ''
  @observable to = ''
  @observable amount
  @observable command
  @observable data
  @observable status
  @observable inprogress

  @action
  init() {
    this.asset = ''
  }
  
  @action
  async sendContractMessage(msg) {

    try {
      this.inprogress = true
      const response = await postRunContractMessage(msg.asset, msg.to, msg.amount, msg.command, msg.data)

      runInAction(() => {
        console.log('sendContractMessage response', response)
        this.resetForm()
        this.status = 'success'
      })

    } catch (error) {
      runInAction(() => {
        console.log('sendContractMessage error', error.response.data)
        this.errorMessage = error.response.data
      })
      this.inprogress = false
      this.status = 'error'
      setTimeout(() => {
        this.status = ''
      }, 15000);
    }

  }

  @action
  resetForm() {
    this.inprogress = false
    this.asset = ''
    this.to = ''
    this.amount = ''
    this.command = ''
    this.data = ''
    this.errorMessage = ''
    this.status = ''
  }

}

export default ContractMessageState
