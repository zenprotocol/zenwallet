import { getWalletExists, getWalletResync } from '../../services/api-service'
import db from '../../services/store'
import history from '../../services/history'
import { secretPhraseState } from '../../states'

const { alreadyRedeemedTokens } = db.get('config').value()

export const load = async () => {
  setTimeout(() => {
    go()
    resyncWallet()
  }, 2500)
}

export const go = async () => {
  try {
    if (!await getWalletExists()) {
      history.push('/welcome-messages')
      return
    }
    console.log('account exists')
    if (!secretPhraseState.password) {
      history.push('/unlock-wallet')
      return
    }
    if (!alreadyRedeemedTokens) {
      history.push('/faucet')
      return
    }
    history.push('/portfolio')
  } catch (error) {
    try {
      console.log('response error.response', error.response)
      setTimeout(() => { go() }, 1000)
    } catch (e) {
      console.log('sendContractMessage catch e', e)
    }
  }
}

export const resyncWallet = async () => {
  try {
    const response = await getWalletResync()
  } catch (error) {
    console.log('resync - something went wrong', error)
  }
}
