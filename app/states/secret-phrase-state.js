import { observable, action, runInAction } from 'mobx'
import bip39 from 'bip39'
import swal from 'sweetalert'

import db from '../services/store'
import history from '../services/history'
import { postImportWallet, postWalletResync, postCheckPassword } from '../services/api-service'

const { alreadyRedeemedTokens } = db.get('config').value()

class SecretPhraseState {
  @observable mnemonicPhrase = []
  @observable autoLogoutMinutes = 30
  @observable password = ''
  @observable inprogress = ''
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
    try {
      const isPasswordCorrect = await postCheckPassword(password)

      runInAction(() => {
        console.log('isPasswordCorrect', isPasswordCorrect)
        if (!isPasswordCorrect) {
          swal('password is not correct')
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
  async resync() { // eslint-disable-line class-methods-use-this
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
