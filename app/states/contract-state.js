// @flow
import { observable, action, runInAction } from 'mobx'
import { some } from 'lodash'

import { postActivateContract } from '../services/api-service'
import db from '../services/store'

type SecretPhraseState = {
  password: string
};

// TODO [AdGo] 06/05/19 - change to initialDropTextPlaceholder
const dropTextPlaceholder = 'Drag and drop your contract file here. Only *.fst files will be accepted.'

class ContractState {
  @observable fileName: string
  @observable dragDropText = dropTextPlaceholder
  @observable name = ''
  @observable hash: string
  @observable address: string
  @observable code = ''
  @observable numberOfBlocks = ''
  @observable activationCost = ''
  @observable blockAmountHasError = false
  @observable status: string
  @observable inprogress = false
  @observable errorMessage = ''
  @observable acceptedFiles = []
  @observable rejectedFiles = []

  secretPhraseState: SecretPhraseState

  constructor(secretPhraseState: SecretPhraseState) {
    this.secretPhraseState = secretPhraseState
  }

  @action
  init(placeholder: string) {
    this.dragDropText = placeholder
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
