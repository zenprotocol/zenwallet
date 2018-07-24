// @flow
import { observable, action, runInAction, computed } from 'mobx'
import { some } from 'lodash'

import { postDeployContract } from '../services/api-service'
import db from '../services/db'

const initialDragDropText = 'Drag and drop your contract file here. Only *.fst files will be accepted.'

class DeployContractStore {
  @observable fileName = ''
  @observable dragDropText = initialDragDropText
  @observable name = ''
  @observable contractId = ''
  @observable address = ''
  @observable code = ''
  @observable blocksAmountDisplay = ''
  @observable activationCost = ''
  @observable blockAmountHasError = false
  @observable status: 'inprogress' | 'success' | 'error' | '' = ''
  @observable inprogress = false
  @observable errorMessage = ''

  @action
  init(placeholder: string) {
    this.dragDropText = placeholder
    this.inprogress = false
  }

  @action
  async deploy(password: string) {
    this.inprogress = true
    this.status = 'inprogress'
    const data = {
      code: this.code,
      numberOfBlocks: this.blocksAmount,
      password,
    }
    try {
      const { address, contractId } = await postDeployContract(data)
      this.saveDeployedContractToDb({
        address, contractId, code: this.code, name: this.name,
      })
      runInAction(() => {
        this.resetForm()
        this.status = 'success'
        this.address = address
        this.contractId = contractId
        setTimeout(() => {
          this.status = ''
          this.address = ''
          this.contractId = ''
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

  // when user clicks "upload contract" from saved contracts route
  @action
  prepareToUploadSavedContract(name: string, code: string) {
    this.name = name
    this.code = code
  }

  get formIsDirty(): boolean {
    return !!(this.name || this.code || this.blocksAmountDisplay)
  }

  @action.bound
  resetForm() {
    this.name = ''
    this.dragDropText = initialDragDropText
    this.code = ''
    this.contractId = ''
    this.address = ''
    this.blocksAmountDisplay = ''
    this.status = ''
    this.inprogress = false
    this.blockAmountHasError = false
    this.errorMessage = ''
  }

  @computed
  get blocksAmount() {
    return Number(this.blocksAmountDisplay)
  }

  updateBlocksAmountDisplay(blocksAmountDisplay: string) {
    this.blocksAmountDisplay = blocksAmountDisplay
  }

  // $FlowFixMe
  saveDeployedContractToDb({
    code, name, contractId, address,
  }) {
    const savedContracts = db.get('savedContracts').value()
    const isInSavedContracts = some(savedContracts, { contractId })
    if (isInSavedContracts) {
      return
    }
    db.get('savedContracts').push({
      code, name, contractId, address,
    }).write()
  }
}

export default DeployContractStore
