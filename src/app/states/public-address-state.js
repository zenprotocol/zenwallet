import {observable, action, runInAction} from 'mobx'
import {get} from 'axios'

import serverAddress from '../config/server-address'

class PublicAddressState {
    @observable address = ''

    @action
    async fetch() {
        let result = await get(`${serverAddress}/wallet/address`)
        console.log('result', result)

        runInAction(() => this.address = result.data.address)
    }
}

export default PublicAddressState
