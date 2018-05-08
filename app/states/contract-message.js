import { observable, action, runInAction } from 'mobx'
import _ from 'lodash'

import { postRunContractMessage } from '../services/api-service'
import { getNamefromCodeComment } from '../utils/helpers'
import db from '../services/store'

class ContractMessageState {
  @observable to = ''
  @observable contractName = ''
  @observable amount
  @observable command = ''
  @observable data
  @observable status
  @observable inprogress
  @observable asset = ''
  @observable assetIsValid = false
  @observable assetName = ''
  @observable assetBalance

  constructor(secretPhraseState, activeContractSet) {
    this.secretPhraseState = secretPhraseState
    this.activeContractSet = activeContractSet
  }

  @action
  init() {
    this.asset = ''
    this.assetIsValid = false
  }

  @action
  async sendContractMessage() {
    try {
      this.inprogress = true
      const data = {
        asset: this.asset,
        to: this.to,
        amount: Number(this.amount),
        command: this.command,
        data: this.data,
        password: this.secretPhraseState.password,
      }
      const response = await postRunContractMessage(data)

      runInAction(() => {
        console.log('sendContractMessage response', response)
        this.resetForm()
        this.status = 'success'
        const activeContract =
          this.activeContractSet.activeContracts.find(ac => ac.address === data.to)
        const savedContracts = db.get('savedContracts').value()
        const isInSavedContracts = _.some(savedContracts, { hash: activeContract.contractId })

        if (!isInSavedContracts) {
          db.get('savedContracts').push({
            code: activeContract.code,
            name: getNamefromCodeComment(activeContract.code),
            hash: activeContract.contractId,
            address: activeContract.address,
          }).write()
        }
        setTimeout(() => {
          this.status = ''
        }, 15000)
      })
    } catch (err) {
      console.error('err', err.message, err)
      runInAction(() => {
        this.inprogress = false
        this.status = 'error'
        // TODO :: refactor after API responses are stable
        if (err && err.response && err.response.data) {
          this.errorMessage = err.response.data
        }
        setTimeout(() => {
          this.status = ''
        }, 15000)
      })
    }
  }

  @action
  resetForm() {
    this.inprogress = false
    this.asset = ''
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
