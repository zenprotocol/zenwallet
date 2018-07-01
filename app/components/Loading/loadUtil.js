import { getWalletExists } from '../../services/api-service'
import history from '../../services/history'
import { networkState } from '../../states'

const LOADING_INTERVAL = 1000

const load = async () => {
  try {
    networkState.fetch()
    if (!await getWalletExists()) {
      history.push('/welcome-messages')
    } else {
      history.push('/unlock-wallet')
    }
  } catch (error) {
    const errMsg = (error && error.response) ? error.response : error
    console.error('error loading wallet', errMsg)
    setTimeout(load, LOADING_INTERVAL)
  }
}

export default load
