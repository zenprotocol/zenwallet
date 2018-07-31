import { getWalletExists } from '../../services/api-service'
import history from '../../services/history'
import routes from '../../constants/routes'
import { networkStore } from '../../stores'

const LOADING_INTERVAL = 1000

export const load = async () => {
  try {
    networkStore.fetch()
    if (!await getWalletExists()) {
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
