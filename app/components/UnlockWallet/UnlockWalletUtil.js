import { observable, action, runInAction } from 'mobx'
import { postUnlockWallet } from '../../services/api-service'
import db from '../../services/store'
import history from '../../services/history'

export const unlockWallet = async(password) => {
  try {
    const response = await postUnlockWallet(password)

    console.log('unlockWallet response.status', response.status)
    
    const { alreadyRedeemedTokens } = db.get('config').value()
    
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

