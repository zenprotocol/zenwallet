import { observable, action, runInAction } from 'mobx'

import { logApiError } from '../utils/apiUtils'
import { getPublicAddress } from '../services/api-service'

class PublicAddressState {
    @observable address = ''

    @action
    async fetch() {
      try {
        const address = await getPublicAddress()
        runInAction(() => { this.address = address })
      } catch (err) {
        logApiError('fetch public address', err)
      }
    }
}

export default PublicAddressState
