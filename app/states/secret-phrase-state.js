import { observable, action, runInAction } from 'mobx'
import bip39 from 'bip39'

import { postImportWallet, postWalletResync, postUnlockWallet } from '../services/api-service'

class SecretPhraseState {
  mnemonicPhrase = observable.array([])
  @observable password = ''
  @observable autoLogoutMinutes = 30
  @observable inprogress = ''
  @observable importError = ''
  @observable status = ''

  @action.bound
  generateSeed() {
    this.mnemonicPhrase = observable.array(bip39.generateMnemonic(256).split(' '))
  }

  @action
  async importWallet(contractMessage) {
    const wordsArray = this.mnemonicPhrase.map(word => (word.word))

    try {
      const response = await postImportWallet(wordsArray, this.password)

      runInAction(() => {
        console.log('importWallet response', response)
      })
    } catch (error) {
      runInAction(() => {
        try {
          console.log('importWallet error.response', error.response)
        } catch (e) {
          console.log('importWallet catch e', e)
        }
      })
    }
  }

  @action
  async unlockWallet() {
    try {
      const response = await postUnlockWallet(this.password)

      runInAction(() => {
        console.log('unlockWallet response', response)
      })
    } catch (error) {
      runInAction(() => {
        try {
          console.log('unlockWallet error.response', error.response)
        } catch (e) {
          console.log('unlockWallet catch e', e)
        }
      })
    }
  }

  @action
  async resync() {
    console.log('wallet resync')

    try {
      const response = await postWalletResync()

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
