// @flow
import history from '../../services/history'
import routes from '../../constants/routes'
import { networkStore } from '../../stores'
import { getWalletInstance } from '../../services/wallet'

const LOADING_INTERVAL = 1000

const load = async () => {
  try {
    networkStore.fetch()
    const wallet = getWalletInstance(networkStore.chain)
    if (!await wallet.exists()) {
      history.push(routes.WELCOME_MESSAGES)
    } else {
      history.push(routes.UNLOCK_WALLET)
    }
  } catch (error) {
    const errMsg = (error && error.response) ? error.response : error
    console.error('error loading wallet', errMsg)
    setTimeout(load, LOADING_INTERVAL)
  }
}

export default load
