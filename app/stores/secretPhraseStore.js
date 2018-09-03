import { observable, action, runInAction } from 'mobx'
import bip39 from 'bip39'
import { ipcRenderer } from 'electron'
import swal from 'sweetalert'

import routes from '../constants/routes'
import { BUG_BOUNTY_URL } from '../constants'
import db from '../services/db'
import history from '../services/history'
import { isDev } from '../utils/helpers'
import { IPC_RESTART_ZEN_NODE, getInitialIsMining } from '../ZenNode'
import { getWalletExists, postImportWallet, getWalletResync, postCheckPassword } from '../services/api-service'

class secretPhraseStore {
  @observable mnemonicPhrase = []
  @observable isLoggedIn = false
  @observable autoLogoutMinutes = db.get('config.autoLogoutMinutes').value()
  @observable inprogress = false
  @observable isImporting = false
  @observable importError = ''
  @observable status = ''
  @observable isMining = getInitialIsMining()

  constructor(networkStore, portfolioStore, activeContractsStore, redeemTokensStore) {
    this.networkStore = networkStore
    this.portfolioStore = portfolioStore
    this.activeContractsStore = activeContractsStore
    this.redeemTokensStore = redeemTokensStore
    if (isDev()) {
      this.initDev()
    }
  }

  @action.bound
  generateSeed() {
    this.mnemonicPhrase = bip39.generateMnemonic(256).split(' ')
  }

  @action
  setMnemonicToImport(userInputWords) {
    this.mnemonicPhrase = userInputWords
    history.push(routes.SET_PASSWORD)
  }

  @action
  async importWallet(password) {
    this.isImporting = true
    try {
      const response = await postImportWallet(this.mnemonicPhrase, password)
      runInAction(() => {
        console.log('importWallet response')
        this.isImporting = false
        if (response.status === 200) {
          console.log('importWallet set password')
          this.isLoggedIn = true
          this.portfolioStore.initPolling()
          this.networkStore.initPolling()
          this.activeContractsStore.fetch()
          this.resync()
          this.mnemonicPhrase = []
          history.push(routes.TERMS_OF_SERVICE)
        } else {
          console.log('importWallet response error', response)
          errorSwalForImportWallet()
        }
      })
    } catch (error) {
      console.error(error)
      if (error && error.response) {
        console.error(error.response)
      }
      runInAction(() => {
        this.isImporting = false
      })
      errorSwalForImportWallet()
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
          return
        }
        this.isLoggedIn = true
        this.portfolioStore.initPolling()
        this.networkStore.initPolling()
        if (this.redeemTokensStore.shouldRedeemNonMainnetTokens) {
          history.push(routes.FAUCET)
        } else {
          history.push(routes.PORTFOLIO)
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
    this.setMining(isMining)
    ipcRenderer.send(IPC_RESTART_ZEN_NODE, { isMining })
  }

  @action
  setMining(isMining) {
    db.set('config.isMining', isMining).write()
    this.isMining = isMining
  }

  @action
  logout() {
    this.reset()
    history.push(routes.UNLOCK_WALLET)
  }

  @action
  reset() {
    this.mnemonicPhrase = []
    this.importError = ''
    this.status = ''
    this.isLoggedIn = false
    this.networkStore.stopPolling()
    this.portfolioStore.stopPolling()
  }

  @action
  initDev() {
    getWalletExists()
      .then(doesWalletExists => {
        // eslint-disable-next-line promise/always-return
        if (doesWalletExists) {
          this.portfolioStore.initPolling()
          this.networkStore.initPolling()
          this.activeContractsStore.fetch()
        }
      })
      .catch(err => console.error(err))
  }
}

export default secretPhraseStore

function errorSwalForImportWallet() {
  swal('Error importing wallet', `please try again, and if the error persists, follow the steps at ${BUG_BOUNTY_URL}`, 'error')
}
