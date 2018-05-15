import { observable, action, runInAction } from 'mobx'
import bip39 from 'bip39'

import db from '../services/store'
import history from '../services/history'
import { isDev } from '../utils/helpers'
import { postImportWallet, getWalletResync, postCheckPassword } from '../services/api-service'

const { alreadyRedeemedTokens } = db.get('config').value()

class SecretPhraseState {
  @observable mnemonicPhrase = []
  @observable autoLogoutMinutes = 30
  @observable inprogress = false
  @observable password = isDev() ? '1234' : ''
  @observable importError = ''
  @observable status = ''

  constructor(networkState, balances, activeContractSet) {
    this.networkState = networkState
    this.balances = balances
    this.activeContractSet = activeContractSet
    if (isDev()) {
      this.balances.initPolling()
      this.networkState.initPolling()
      this.activeContractSet.fetch()
    }
  }

  @action.bound
  generateSeed() {
    this.mnemonicPhrase = observable.array(bip39.generateMnemonic(256).split(' '))
  }

  @action
  async importWallet(password) {
    try {
      const response = await postImportWallet(this.mnemonicPhrase, password)

      runInAction(() => {
        console.log('importWallet response', response)
        if (response.status === 200) {
          console.log('importWallet set password', password)
          this.password = password
          this.balances.initPolling()
          this.networkState.initPolling()
          this.activeContractSet.fetch()
          this.resync()
        } else {
          console.log('importWallet response error', response)
        }
      })
    } catch (error) {
      console.error(error)
      if (error && error.response) {
        console.errror(error.response)
      }
    }
  }

  @action
  async unlockWallet(password) {
    this.inprogress = true

    try {
      const isPasswordCorrect = await postCheckPassword(password)

      runInAction(() => {
        this.inprogress = false
        console.log('isPasswordCorrect', isPasswordCorrect)
        if (!isPasswordCorrect) {
          this.inprogress = false
          this.status = 'error'
          console.log('isPasswordCorrect this', this)
          return
        }
        this.password = password
        this.balances.initPolling()
        this.networkState.initPolling()
        if (alreadyRedeemedTokens) {
          history.push('/portfolio')
        } else {
          history.push('/faucet')
        }
      })
    } catch (error) {
      runInAction(() => {
        this.inprogress = false
        try {
          console.log('unlockWallet error.response', error.response)
        } catch (e) {
          console.log('unlockWallet catch e', e)
        }
      })
    }
  }

  @action
  unlockWalletClearForm() {
    this.status = ''
  }

  @action
  async resync() { // eslint-disable-line class-methods-use-this
    console.log('wallet resync')

    try {
      const response = await getWalletResync()

      runInAction(() => {
        console.log('resync response', response)
      })
    } catch (error) {
      runInAction(() => {
        try {
          console.log('resync error.response', error.response)
        } catch (e) {
          console.log('resync catch e', e)
        }
      })
    }
  }
}

export default SecretPhraseState
