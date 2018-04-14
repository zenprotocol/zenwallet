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
    const wordsArray = this.mnemonicPhrase.map((word) => word.word)

    try {
      const response = await postImportWallet(wordsArray, password)

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
