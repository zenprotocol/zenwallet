import {observable, action, runInAction} from 'mobx'
import {getWalletExists, postImportWallet} from '../services/api-service'

import bip39 from 'bip39'

import history from '../services/history'

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
    console.log('LoadingState go')

    try {
      const walletExistsResponse = await getWalletExists()

      runInAction(() => {
        console.log('walletExistsResponse', walletExistsResponse)
        this.walletExists = walletExistsResponse["accountExists"]
        if (this.walletExists) {
          console.log('walletExists')
          // IF ALREADY REDEEMED CROWDSALE TOKENS GO TO BALANCES
          history.push('/faucet')
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
    console.log('newSecretPhrase', newSecretPhrase)

    try {
      const response = await postImportWallet(newSecretPhrase)

      runInAction(() => {
        history.push('/faucet')
      })

    } catch (error) {
      runInAction(() => {
        try {
          console.log('postImportWallet error.response', error.response.data)
          this.errorMessage = error.response.data
        } catch (e) {
          console.log('sendContractMessage catch e', e)
          this.errorMessage = 'something went wrong'
        }
      })
    }

  }

}

export default LoadingState
