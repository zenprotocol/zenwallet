import { observable, action, runInAction } from 'mobx'
import bip39 from 'bip39'
import { ipcRenderer } from 'electron'
import swal from 'sweetalert'

import { BUG_REPORT_EMAIL, MAINNET } from '../constants'
import db from '../services/store'
import history from '../services/history'
import { isDev } from '../utils/helpers'
import { logApiError } from '../utils/apiUtils'
import { IPC_RESTART_ZEN_NODE, getInitialIsMining } from '../ZenNode'
import { getWalletExists, postImportWallet, getWalletResync, postCheckPassword } from '../services/api-service'

class SecretPhraseState {
  @observable mnemonicPhrase = []
  @observable isLoggedIn = false
  @observable autoLogoutMinutes = db.get('config.autoLogoutMinutes').value()
  @observable inprogress = false
  @observable isImporting = false
  @observable unlockWalletError = ''
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
    this.isImporting = true
    try {
      const response = await postImportWallet(this.mnemonicPhrase, password)
      console.log('importWallet response', response)
      runInAction(() => {
        this.isImporting = false
        if (response.status !== 200) {
          logApiError('importWallet status !== 200', response)
          errorSwalForImportWallet()
          return
        }
        this.isLoggedIn = true
        this.balances.initPolling()
        this.networkState.initPolling()
        this.activeContractSet.fetch()
        this.resync()
        this.mnemonicPhrase = []
        history.push('/terms-of-service')
      })
    } catch (err) {
      logApiError('importWallet catch', err)
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
        if (!isPasswordCorrect) {
          this.inprogress = false
          this.unlockWalletError = 'Password is incorrect'
          return
        }
        this.isLoggedIn = true
        this.balances.initPolling()
        this.networkState.initPolling()
        if (this.shouldRedeemNonMainnetTokens) {
          history.push('/faucet')
        } else {
          history.push('/portfolio')
        }
      })
    } catch (err) {
      logApiError('unlock wallet', err)
      runInAction(() => {
        this.inprogress = false
        this.unlockWalletError = (err && err.message) || 'Unknown error'
      })
    }
  }

  @action
  unlockWalletResetError() {
    this.unlockWalletError = ''
  }

  @action
  async resync() {
    try {
      const response = await getWalletResync()
      console.log('resync success', response)
    } catch (err) {
      logApiError('resync', err)
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
    this.reset()
    history.push('/unlock-wallet')
  }

  @action
  reset() {
    this.mnemonicPhrase = []
    this.isLoggedIn = false
    this.networkState.stopPolling()
    this.balances.stopPolling()
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

  get shouldRedeemNonMainnetTokens() {
    const alreadyRedeemedTokens = db.get('config.alreadyRedeemedTokens').value()
    return this.networkState.chain !== MAINNET && !alreadyRedeemedTokens
  }
}

export default SecretPhraseState

function errorSwalForImportWallet() {
  swal('Error importing wallet', `please try again, and if the error persists, email us at ${BUG_REPORT_EMAIL}`, 'error')
}
