import React from 'react'
import { observable, action, runInAction, computed } from 'mobx'
import _, { isEmpty } from 'lodash'
import { fromYaml, serialize } from '@zen/zenjs/build/src/Data'
import { toast } from 'react-toastify'

import routes from '../constants/routes'
import ToastLink from '../components/ToastLink'
import { postRunContract } from '../services/api-service'
import { getNamefromCodeComment } from '../utils/helpers'
import { zenToKalapas, isZenAsset } from '../utils/zenUtils'
import db from '../services/db'

class RunContractStore {
  @observable address = ''
  @observable amountDisplay = ''
  @observable returnAddress = true
  @observable command = ''
  @observable sign = ''
  @observable messageBody = ''
  @observable status = ''
  @observable inprogress = false
  @observable asset = ''

  constructor(activeContractsStore) {
    this.activeContractsStore = activeContractsStore
  }

  @action
  async run(password) {
    this.inprogress = true
    const payloadData = { ...this.payloadData, password }
    try {
      await postRunContract(payloadData)
      if (!this.isContractSavedToDb(payloadData.address)) {
        this.saveContractToDb(payloadData.address)
      }
      runInAction(() => {
        this.inprogress = false
        this.resetForm()
        this.status = 'success'
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
  updateMessageBody(messageBody) {
    this.messageBody = messageBody
  }

  @action
  toggleReturnAddress = () => {
    this.returnAddress = !this.returnAddress
  }

  @action
  toggleSign = () => {
    if (isEmpty(this.sign)) {
      this.sign = 'm/44\'/258\'/0\'/3/0'
      return true
    }
    this.sign = ''
    return false
  }

  @computed
  get messageBodyError() {
    if (!this.messageBody) {
      return ''
    }
    try {
      fromYaml('main', this.messageBody)
      return ''
    } catch (err) {
      console.error('error parsing message body', err)
      return 'Body must be valid yaml syntax'
    }
  }

  @action
  resetForm = () => {
    this.inprogress = false
    this.asset = ''
    this.address = ''
    this.returnAddress = false
    this.sign = ''
    this.amountDisplay = ''
    this.command = ''
    this.messageBody = ''
    this.errorMessage = ''
    this.status = ''
  }

  get amount() {
    return Number(this.amountDisplay)
  }

  get amountToSend() {
    return isZenAsset(this.asset) ? zenToKalapas(this.amount) : this.amount
  }

  get payloadData() {
    const data = {
      address: this.address,
      options: { returnAddress: this.returnAddress, sign: this.sign },
    }
    if (this.asset) {
      data.spends = [{ asset: this.asset, amount: this.amountToSend }]
    }
    if (this.command) {
      data.command = this.command
    }
    if (this.messageBody) {
      data.messageBody = serialize(fromYaml('main', this.messageBody))
    }
    return data
  }

  isContractSavedToDb(address) {
    const savedContracts = db.get('savedContracts').value()
    const activeContract = this.getActiveContract(address)
    return _.some(savedContracts, { contractId: activeContract.contractId })
  }

  saveContractToDb(address, { shouldToast } = {}) {
    const activeContract = this.getActiveContract(address)
    db.get('savedContracts').push({
      code: activeContract.code,
      name: getNamefromCodeComment(activeContract.code),
      contractId: activeContract.contractId,
      address: activeContract.address,
    }).write()
    if (shouldToast) {
      toast.info(<ToastLink to={routes.SAVED_CONTRACTS}>Contract saved locally</ToastLink>)
    }
  }

  getActiveContract(address) {
    return this.activeContractsStore.activeContracts.find(ac => ac.address === address)
  }
}

export default RunContractStore
