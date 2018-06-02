import { observable, action, runInAction } from 'mobx'
import bip39 from 'bip39'

import db from '../services/store'
import history from '../services/history'
import { isDev } from '../utils/helpers'
import { getWalletExists, postImportWallet, getWalletResync, postCheckPassword } from '../services/api-service'

const { alreadyRedeemedTokens, autoLogoutMinutes, isMining } = db.get('config').value()
class SecretPhraseState {
  @observable mnemonicPhrase = []
  @observable autoLogoutMinutes = autoLogoutMinutes
  @observable inprogress = false
  @observable password = ''
  @observable importError = ''
  @observable status = ''
  @observable isMining = isMining
  @observable initialIsMining = isMining

  constructor(networkState, balances, activeContractSet) {
    this.networkState = networkState
    this.balances = balances
    this.activeContractSet = activeContractSet
    if (isDev()) {
      this.initDev()
    }
  }

  get isLoggedIn() {
    return !!this.password
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
  toggleMining(_isMining) {
    db.set('config.isMining', _isMining).write()
    this.isMining = _isMining
  }

  get isMiningChangedSinceInit() {
    return this.isMining !== this.initialIsMining
  }

  @action
  logout() {
    this.mnemonicPhrase = []
    this.password = ''
    this.importError = ''
    this.status = ''
    history.push('/loading')
  }

  @action
  initDev() {
    this.password = '1234'
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
