import { getWalletExists } from '../../services/api-service'
import { logApiError } from '../../utils/apiUtils'
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
  } catch (err) {
    logApiError('load wallet', err)
    setTimeout(load, LOADING_INTERVAL)
  }
}

export default load
