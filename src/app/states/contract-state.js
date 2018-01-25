import {observable, action, runInAction} from 'mobx'
import {postActivateContract} from '../services/api-service'

class ContractState {
  @observable fileName
  @observable name
  @observable code
  @observable hash
  @observable address
  @observable status
  @observable inprogress = false
  @observable errorMessage = ''

  @action
  init() {
    this.fileName = ''
    this.name = ''
    this.code = ''
    this.hash = ''
    this.address = ''
    this.status = ''
    this.inprogress = false
    this.errorMessage = ''
  }

  @action
  async activateContract(code) {

    try {
      this.inprogress = true
      this.status = 'inprogress'

      const response = await postActivateContract(code)

      runInAction(() => {
          this.hash = response.hash
          this.address = response.address
          this.status = 'success'
          this.inprogress = false
      })

    } catch (error) {
      this.inprogress = false

      if (error.response && error.response.status === 429) {
          this.rejectTotalAmount = error.response.data.amount
          this.status = 'failed'

      } else {
          console.log('activateContract error', error)
          runInAction(() => {
              this.errorMessage = error
          })
      }
    }
  }

}

export default ContractState
