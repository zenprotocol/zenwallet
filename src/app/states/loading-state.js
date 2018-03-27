import {observable, action, runInAction} from 'mobx'
import {getWalletExists, postImportWallet} from '../services/api-service'
import bip39 from 'bip39'

import db from '../services/store'
import history from '../services/history'

const {alreadyRedeemedTokens} = db.get('config').value()

class LoadingState {
  @observable loaded = false
  @observable walletExists = false
  @observable errorMessage = false
  @observable secretPhrase = []

  @action
  async load() {
    setTimeout(() => { this.go() }, 2500)
  }

  @action
  async go() {

    try {
      const walletExistsResponse = await getWalletExists()

      runInAction(() => {
        this.walletExists = walletExistsResponse["accountExists"]
        if (this.walletExists) {
          if (alreadyRedeemedTokens) {
            history.push('/portfolio')
          } else {
            history.push('/faucet')
          }
        } else {
          this.createWallet()
        }

      })

    } catch (error) {
      runInAction(() => {
        try {
          console.log('walletExistsResponse error.response', error.response)
          this.go()
        } catch (e) {
          console.log('sendContractMessage catch e', e)
        }
      })
    }


  }

  @action
  async createWallet() {

    const newSecretPhrase = bip39.generateMnemonic(128).split(" ")

    console.log('Your new secret phrase. write it down. dont lose it.', newSecretPhrase)

    try {
      const response = await postImportWallet(newSecretPhrase)

      runInAction(() => {
        history.push('/faucet')
      })

    } catch (error) {
      runInAction(() => {
        try {
          this.errorMessage = error.response.data
        } catch (e) {
          this.errorMessage = 'something went wrong'
        }
      })
    }

  }

}

export default LoadingState
