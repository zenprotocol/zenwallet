import { observable, action, runInAction } from 'mobx'
import _ from 'lodash'

import { postRunContractMessage } from '../services/api-service'
import { getNamefromCodeComment } from '../utils/helpers'
import db from '../services/store'

class ContractMessageState {
  @observable address = ''
  @observable contractName = ''
  @observable amount = ''
  @observable command = ''
  @observable data
  @observable status = ''
  @observable inprogress
  @observable asset = ''

  constructor(activeContractSet) {
    this.activeContractSet = activeContractSet
  }

  @action
  async sendContractMessage(password) {
    try {
      this.inprogress = true
      const data = {
        asset: this.asset,
        address: this.address,
        amount: Number(this.amount),
        command: this.command,
        data: this.data,
        password,
      }
      const response = await postRunContractMessage(data)

      runInAction(() => {
        console.log('sendContractMessage response', response)
        this.resetForm()
        this.status = 'success'
        const activeContract =
          this.activeContractSet.activeContracts.find(ac => ac.address === data.address)
        const savedContracts = db.get('savedContracts').value()
        const isInSavedContracts = _.some(savedContracts, { contractId: activeContract.contractId })

        if (!isInSavedContracts) {
          db.get('savedContracts').push({
            code: activeContract.code,
            name: getNamefromCodeComment(activeContract.code),
            contractId: activeContract.contractId,
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
  updateAddress(address) {
    this.address = address
    this.amount = ''
  }

  @action
  resetForm() {
    this.inprogress = false
    this.asset = ''
    this.address = ''
    this.amount = ''
    this.command = ''
    this.data = ''
    this.errorMessage = ''
    this.status = ''
  }
}

export default ContractMessageState
