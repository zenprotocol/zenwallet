import { observable, action, runInAction, computed } from 'mobx'
import { some } from 'lodash'

import { postActivateContract } from '../services/api-service'
import db from '../services/store'

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

  constructor(secretPhraseState) {
    this.secretPhraseState = secretPhraseState
  }

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
      const data = { ...this, password: this.secretPhraseState.password }
      const response = await postActivateContract(data)

      runInAction(() => {
        const savedContracts = db.get('savedContracts').value()
        const isInSavedContracts = some(savedContracts, { hash: response.hash })

        if (!isInSavedContracts) {
          db.get('savedContracts').push({
            code: this.code,
            name: this.name,
            hash: response.hash,
            address: response.address,
          }).write()
        }

        this.resetForm()
        this.status = 'success'
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
