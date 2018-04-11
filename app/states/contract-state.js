import { observable, action, runInAction } from 'mobx'
import { postActivateContract } from '../services/api-service'
import db from '../services/store'
import { some } from 'lodash'

const dropTextPlaceholder = 'Drag and drop your contract file here. Only *.fst files will be accepted.'

class ContractState {
  @observable fileName
  @observable dragDropText = dropTextPlaceholder
  @observable name = ''
  @observable hash
  @observable address
  @observable code = ''
  @observable numberOfBlocks = ''
  @observable activationCost = ''
  @observable blockAmountHasError = false
  @observable status
  @observable inprogress = false
  @observable errorMessage = ''
  @observable acceptedFiles = []
  @observable rejectedFiles = []

  @action
  init(dropTextPlaceholder) {
    this.dragDropText = dropTextPlaceholder
    this.inprogress = false
  }

  @action
  resetDragDropText() {
    this.dragDropText = dropTextPlaceholder
  }

  @action
  async activateContract() {
    try {
      this.inprogress = true
      this.status = 'inprogress'

      const response = await postActivateContract(this)

      runInAction(() => {
        const savedContracts = db.get('savedContracts').value()
        const isInSavedContracts = some(savedContracts, { hash: response.hash })

        if (!isInSavedContracts) {
          db.get('savedContracts').push({
            name: this.name,
            hash: response.hash,
            address: response.address,
          }).write()
        }

        this.name = ''
        this.dragDropText = dropTextPlaceholder
        this.hash = response.hash
        this.address = response.address
        this.status = 'success'
        this.inprogress = false
        this.acceptedFiles = []
        this.rejectedFiles = []
        setTimeout(() => {
          this.status = ''
        }, 15000)
      })
    } catch (error) {
      this.status = 'error'
      this.inprogress = false
      runInAction(() => {
        this.errorMessage = error.response.data
      })
    }
  }

  @action
  resetForm() {
    this.name = ''
    this.dragDropText = dropTextPlaceholder
    this.code = ''
    this.hash = ''
    this.address = ''
    this.numberOfBlocks = ''
    this.activationCost = ''
    this.status = ''
    this.inprogress = false
    this.blockAmountHasError = false
    this.errorMessage = ''
    this.acceptedFiles = []
    this.rejectedFiles = []
  }
}

export default ContractState
