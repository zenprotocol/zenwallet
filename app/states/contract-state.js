// @flow
import { observable, action, runInAction } from 'mobx'
import { some } from 'lodash'

import { postActivateContract } from '../services/api-service'
import db from '../services/store'

type SecretPhraseState = {
  password: string
};

const initialDragDropText = 'Drag and drop your contract file here. Only *.fst files will be accepted.'

class ContractState {
  @observable fileName: string
  @observable dragDropText = initialDragDropText
  @observable name = ''
  @observable contractId: string
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
    this.dragDropText = initialDragDropText
  }

  @action
  async activateContract() {
    this.inprogress = true
    this.status = 'inprogress'
    const data = {
      code: this.code,
      numberOfBlocks: Number(this.numberOfBlocks),
      password: this.secretPhraseState.password,
    }
    try {
      const response = await postActivateContract(data)

      runInAction(() => {
        const savedContracts = db.get('savedContracts').value()
        const isInSavedContracts = some(savedContracts, { contractId: response.contractId })

        if (!isInSavedContracts) {
          db.get('savedContracts').push({
            code: this.code,
            name: this.name,
            contractId: response.contractId,
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
      console.error(error.response.data)
      runInAction(() => {
        this.status = 'error'
        this.inprogress = false
        this.errorMessage = error.response.data
      })
    }
  }

  @action
  resetForm() {
    this.name = ''
    this.dragDropText = initialDragDropText
    this.code = ''
    this.contractId = ''
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
