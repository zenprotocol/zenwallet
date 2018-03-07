import {observable, action, runInAction} from 'mobx'
import {postRunContractMessage} from '../services/api-service'

class ContractMessageState {
  @observable to = ''
  @observable contractName = ''
  @observable amount
  @observable command
  @observable data
  @observable status
  @observable inprogress
  @observable asset = ''
  @observable assetType = ''
  @observable assetIsValid = false
  @observable assetName = ''
  @observable assetBalance

  @action
  init() {
    this.asset = ''
    this.assetIsValid = false
  }

  @action
  async sendContractMessage(contractMessage) {

    try {
      this.inprogress = true
      const response = await postRunContractMessage(contractMessage)

      runInAction(() => {
        console.log('sendContractMessage response', response)
        this.resetForm()
        this.status = 'success'
        setTimeout(() => {
          this.status = ''
        }, 15000)
      })

    } catch (error) {
      runInAction(() => {
        try {
          console.log('sendContractMessage error.response', error.response.data)
          this.errorMessage = error.response.data
        } catch (e) {
          console.log('sendContractMessage catch e', e)
          this.errorMessage = 'something went wrong'
        }
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
    this.assetType = ''
    this.assetName = ''
    this.assetBalance = ''
    this.assetIsValid = false
    this.to = ''
    this.contractName = ''
    this.amount = ''
    this.command = ''
    this.data = ''
    this.errorMessage = ''
    this.status = ''
  }

}

export default ContractMessageState
