// @flow
import { observable, action, runInAction } from 'mobx'

import { zenToKalapas, isZenAsset } from '../utils/zenUtils'
import { getWalletInstance } from '../services/wallet'

import NetworkStore from './networkStore'

class SendTxStore {
  assetName: string

  @observable asset = ''
  @observable to = ''
  @observable amountDisplay = ''
  @observable status = ''
  @observable inprogress = false
  @observable errorMessage = ''
  @observable responseOffline = ''

  networkStore: NetworkStore

  constructor(networkStore: NetworkStore) {
    this.networkStore = networkStore
  }

  @action
  async createTransaction(password: string) {
    try {
      this.inprogress = true
      const wallet = getWalletInstance(this.networkStore.chain)
      const data = {
        amount: isZenAsset(this.asset) ? zenToKalapas(this.amount) : this.amount,
        asset: this.asset,
        to: this.to,
        password,
      }
      const response = await wallet.sendTransaction(data)

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
  async createRawTransaction(password: string) {
    try {
      this.inprogress = true
      const data = {
        amount: isZenAsset(this.asset) ? zenToKalapas(this.amount) : this.amount,
        asset: this.asset,
        to: this.to,
        password,
      }
      const wallet = getWalletInstance(this.networkStore.chain)
      this.responseOffline = await wallet.createRawTransaction(data)
      runInAction(() => {
        console.log('createRawTransaction response', this.responseOffline)
        this.inprogress = false
        this.status = 'success'
        setTimeout(() => {
          this.status = ''
        }, 15000)
        return this.responseOffline
      })
    } catch (error) {
      runInAction(() => {
        console.log('ERROR')
        console.error('createTransaction error', error, error.responseOffline)
        this.errorMessage = error.responseOffline.data
      })
      this.inprogress = false
      this.status = 'error'
      setTimeout(() => {
        this.status = ''
      }, 15000)
    }
  }

  @action
  updateAsset({ asset }: { asset: string }) {
    this.asset = asset
  }

  @action
  updateAssetFromSuggestions(asset: string) {
    this.asset = asset
    this.amountDisplay = ''
  }

  @action
  updateAmountDisplay(amountDisplay: string) {
    this.amountDisplay = amountDisplay
  }

  @action
  resetForm() {
    this.inprogress = false
    this.asset = ''
    this.assetName = ''
    this.to = ''
    this.amountDisplay = ''
    this.status = ''
    this.errorMessage = ''
  }

  get amount() {
    return Number(this.amountDisplay)
  }
  get offlineResponse() {
    return this.responseOffline
  }
}

export default SendTxStore
