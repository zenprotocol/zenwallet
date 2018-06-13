import { observable, action, runInAction } from 'mobx'
import bip39 from 'bip39'
import { ipcRenderer } from 'electron'

import db from '../services/store'
import history from '../services/history'
import { isDev } from '../utils/helpers'
import { IPC_RESTART_ZEN_NODE, getInitialIsMining } from '../utils/ZenNode'
import { getWalletExists, postImportWallet, getWalletResync, postCheckPassword } from '../services/api-service'

class SecretPhraseState {
  @observable mnemonicPhrase = []
  @observable isLoggedIn = false
  @observable autoLogoutMinutes = db.get('config.autoLogoutMinutes').value()
  @observable inprogress = false
  @observable importError = ''
  @observable status = ''
  @observable isMining = getInitialIsMining()

  constructor(networkState, balances, activeContractSet) {
    this.networkState = networkState
    this.balances = balances
    this.activeContractSet = activeContractSet
    if (isDev()) {
      this.initDev()
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
          this.isLoggedIn = true
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
        console.error(error.response)
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
        this.isLoggedIn = true
        this.balances.initPolling()
        this.networkState.initPolling()
        const alreadyRedeemedTokens = db.get('config.alreadyRedeemedTokens').value()
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
      console.log('resync response', response)
    } catch (err) {
      if (err && err.response) {
        console.log('resync err', err.response)
      } else {
        console.log('resync err', err)
      }
    }
  }

  @action
  setAutoLogoutMinutes(minutes) {
    minutes = Number(minutes)
    if (minutes < 1) { minutes = 1 }
    if (minutes > 120) { minutes = 120 }
    this.autoLogoutMinutes = minutes
    db.set('config.autoLogoutMinutes', minutes).write()
  }

  @action.bound
  toggleMining(isMining) {
    db.set('config.isMining', isMining).write()
    this.isMining = isMining
    ipcRenderer.send(IPC_RESTART_ZEN_NODE, { isMining })
  }

  @action
  logout() {
    this.mnemonicPhrase = []
    this.importError = ''
    this.status = ''
    this.isLoggedIn = false
    // TODO: stop polling
    history.push('/unlock-wallet')
  }

  @action
  initDev() {
    getWalletExists()
      .then(doesWalletExists => {
        // eslint-disable-next-line promise/always-return
        if (doesWalletExists) {
          this.balances.initPolling()
          this.networkState.initPolling()
          this.activeContractSet.fetch()
        }
      })
      .catch(err => console.error(err))
  }
}

export default SecretPhraseState
