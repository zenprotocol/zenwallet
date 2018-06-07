import { observable, action, runInAction } from 'mobx'

import { postTransaction } from '../services/api-service'

class TransactionState {
  @observable asset = ''
  @observable to = ''
  @observable amount = ''
  @observable status = ''
  @observable inprogress = false
  @observable errorMessage = ''

  @action
  async createTransaction(tx, password) {
    try {
      this.inprogress = true
      const data = { ...tx, amount: Number(tx.amount), password }
      const response = await postTransaction(data)

      runInAction(() => {
        console.log('createTransaction response', response)
        this.resetForm()
        this.status = 'success'
        setTimeout(() => {
          this.status = ''
        }, 15000)
      })
    } catch (error) {
      runInAction(() => {
        console.error('createTransaction error', error, error.response)
        this.errorMessage = error.response.data
      })
      this.inprogress = false
      this.status = 'error'
      setTimeout(() => {
        this.status = ''
      }, 15000)
    }
  }

  @action
  updateAsset({ asset }) {
    this.asset = asset
  }

  @action
  resetForm() {
    this.inprogress = false
    this.asset = ''
    this.assetName = ''
    this.to = ''
    this.amount = ''
    this.status = ''
    this.errorMessage = ''
  }
}

export default TransactionState
