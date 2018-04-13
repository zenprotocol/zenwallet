import { observable, action, runInAction } from 'mobx'

import { postTransaction } from '../services/api-service'

class TransactionState {
  @observable asset = ''
  @observable assetType = ''
  @observable to = ''
  @observable amount
  @observable status
  @observable inprogress
  @observable errorMessage
  @observable assetIsValid = false
  @observable assetName = ''

  constructor(secretPhraseState) {
    this.secretPhraseState = secretPhraseState
  }

  @action
  init() {
    this.asset = ''
    this.assetIsValid = false
  }

  @action
  async createTransaction(tx) {
    try {
      this.inprogress = true
      const response = await postTransaction({ ...tx, password: this.secretPhraseState.password })

      runInAction(() => {
        console.log('createTransaction response', response)
        this.resetForm()
        this.status = 'success'
        setTimeout(() => {
          this.status = ''
        }, 15000);
      })
    } catch (error) {
      runInAction(() => {
        console.log('createTransaction error', error)
        this.errorMessage = error.response.data
      })
      this.inprogress = false
      this.status = 'error'
      setTimeout(() => {
        this.status = ''
      }, 15000);
    }
  }

  @action
  resetForm() {
    this.inprogress = false
    this.asset = ''
    this.assetType = ''
    this.assetName = ''
    this.to = ''
    this.amount = ''
    this.status = ''
    this.errorMessage = ''
  }
}

export default TransactionState
