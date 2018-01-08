import {observable, action, runInAction} from 'mobx'
import {getPublicAddress} from '../services/api-service'

class PublicAddressState {
    @observable address = ''

    @action
    async fetch() {
        let address = await getPublicAddress()
        runInAction(() => this.address = address)
    }
}

export default PublicAddressState
