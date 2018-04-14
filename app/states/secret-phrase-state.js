import { observable, action, runInAction } from 'mobx'
import bip39 from 'bip39'
import swal from 'sweetalert'

import db from '../services/store'
import history from '../services/history'
import { postImportWallet, getWalletResync, postCheckPassword } from '../services/api-service'

const { alreadyRedeemedTokens } = db.get('config').value()

class SecretPhraseState {
  @observable mnemonicPhrase = []
  @observable autoLogoutMinutes = 30
  @observable inprogress = false
  @observable password = ''
  @observable importError = ''
  @observable status = ''

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
        this.resync()
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
          this.password = ''
          // swal('password is not correct')
          return
        }
        this.password = password
        if (alreadyRedeemedTokens) {
          history.push('/portfolio')
        } else {
          history.push('/faucet')
        }
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
  unlockWalletClearForm() {
    console.log('unlockWalletClearForm')
    this.inprogress = false
    this.status = ''
  }

  @action
  async resync() {
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
