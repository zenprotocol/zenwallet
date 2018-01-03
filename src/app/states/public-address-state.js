import {observable, action, runInAction} from 'mobx'
import {get} from 'axios'

class PublicAddressState {
    @observable address = ''

    @action
    async fetch() {
        let result = await get('http://127.0.0.1:31567/wallet/address')
        console.log('result', result)

        runInAction(() => this.address = result.data.address)
    }
}

export default PublicAddressState
