import {observable, computed, action, runInAction} from 'mobx'
import {getNetworkStatus} from '../services/api-service'

class NetworkState {
  @observable chain = ''
  @observable blocks = 0
  @observable headers = 0
  @observable difficulty = 0
  @observable medianTime = 0

  constructor()  {
    this.fetch = this.fetch.bind(this)
  }

  @action
  begin() {
    this.fetch()
    setInterval(this.fetch, 2000);
  }

  @action
  async fetch() {
    let result = await getNetworkStatus()
    runInAction(() => {
      this.chain = result.chain
      this.blocks = result.blocks
      this.headers = result.headers
      this.difficulty = result.difficulty
      this.medianTime = result.medianTime
    })
  }

}

export default NetworkState
