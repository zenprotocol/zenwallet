import { observable, action, runInAction } from 'mobx'
import _ from 'lodash'

import { postRunContract } from '../services/api-service'
import { getNamefromCodeComment } from '../utils/helpers'
import { zenToKalapas, isZenAsset } from '../utils/zenUtils'
import db from '../services/store'

class RunContractState {
  @observable address = ''
  @observable contractName = ''
  @observable amountDisplay = ''
  @observable command = ''
  @observable data
  @observable status = ''
  @observable inprogress
  @observable asset = ''

  constructor(activeContractSet) {
    this.activeContractSet = activeContractSet
  }

  @action
  async run(password) {
    try {
      this.inprogress = true
      const data = {
        asset: this.asset,
        address: this.address,
        amount: isZenAsset(this.asset) ? zenToKalapas(this.amount) : this.amount,
        command: this.command,
        data: this.data,
        password,
      }
      const response = await postRunContract(data)

      runInAction(() => {
        console.log('run response', response)
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
    this.amountDisplay = ''
  }

  @action
  updateAmountDisplay(amountDisplay) {
    this.amountDisplay = amountDisplay
  }

  @action
  resetForm = () => {
    this.inprogress = false
    this.asset = ''
    this.address = ''
    this.amountDisplay = ''
    this.command = ''
    this.data = ''
    this.errorMessage = ''
    this.status = ''
  }

  get amount() {
    return Number(this.amountDisplay)
  }
}

export default RunContractState
