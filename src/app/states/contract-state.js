import {observable, action, runInAction} from 'mobx'
import {postActivateContract} from '../services/api-service'
import db from '../services/store'
import {some} from 'lodash'

const dropTextPlaceholder = 'Drag and drop your contract file here. Only *.txt files will be accepted.'

class ContractState {
  @observable fileName
  @observable dragDropText = dropTextPlaceholder
  @observable name
  @observable code
  @observable hash
  @observable address
  @observable status
  @observable inprogress = false
  @observable errorMessage = ''

  @action
  init(dropTextPlaceholder) {
    this.dragDropText = dropTextPlaceholder
    this.inprogress = false
  }

  @action
  clearForm() {
    this.name = ''
    this.dragDropText = dropTextPlaceholder
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
        const savedContracts = db.get('savedContracts').value()
        const isInSavedContracts = some(savedContracts, {hash: response.hash})

        if (!isInSavedContracts) {
          db.get('savedContracts').push({
            name: this.name,
            hash: response.hash,
            address: response.address
          }).write()
        }

          this.name = ''
          this.dragDropText = dropTextPlaceholder
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
