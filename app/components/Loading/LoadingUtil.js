import { getWalletExists, getIsAccountLocked, postImportWallet, postUnlockWallet } from '../../services/api-service'

import db from '../../services/store'
import history from '../../services/history'

const { alreadyRedeemedTokens } = db.get('config').value()

export const load = async() => {
  setTimeout(() => { go() }, 2500)
}

export const go = async() => {
  try {
    const response = await getWalletExists()

    if (response.accountExists) {
      console.log('account exists')
      isAccountLocked()
    } else {
      history.push('/welcome-messages')
    }

  } catch (error) {
    
    try {
      console.log('response error.response', error.response)
      setTimeout(() => { this.go() }, 1000)
    } catch (e) {
      console.log('sendContractMessage catch e', e)
    }

  }
}

export const isAccountLocked = async() => {
  try {
    const response = await getIsAccountLocked()

    if (response.accountLocked) {
      console.log('account locked')
      history.push('/unlock-wallet')
    } else {
      console.log('account is unlocked')
      history.push('/portfolio')
    }

  } catch (error) {

    try {
      console.log('isAccountLocked error.response', error.response)
    } catch (e) {
      console.log('sendContractMessage catch e', e)
    }

  }
}

export const unlockWallet = async(password) => {
  try {
    const response = await postUnlockWallet(password)

    console.log('unlockWallet response.status', response.status)

    if (alreadyRedeemedTokens) {
      history.push('/portfolio')
    } else {
      history.push('/faucet')
    }

  } catch (error) {
      
    try {
      console.log('unlockWallet error.response', error.response)
    } catch (e) {
      console.log('unlockWallet catch e', e)
    }
  }
}