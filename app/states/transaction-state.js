import { observable, action, runInAction } from 'mobx'

import { postTransaction } from '../services/api-service'
import { logApiError } from '../utils/apiUtils'

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
      console.log('createTransaction response', response)
      runInAction(() => {
        this.resetForm()
        this.status = 'success'
        setTimeout(() => {
          this.status = ''
        }, 15000)
      })
    } catch (err) {
      logApiError('create transaction', err)
      runInAction(() => {
        this.errorMessage = (err && err.response && err.response.data) || 'Unknown erorr'
        this.inprogress = false
        this.status = 'error'
        setTimeout(() => {
          this.status = ''
        }, 15000)
      })
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
