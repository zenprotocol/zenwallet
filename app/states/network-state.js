import { observable, action, runInAction, computed } from 'mobx'

import PollManager from '../utils/PollManager'
import { LOCALNET, TESTNET, MAINNET } from '../constants'
import { getNetworkStatus, getNetworkConnections } from '../services/api-service'

const initialState = getInitialState()

class NetworkState {
  @observable chain = initialState.chain
  @observable blocks = initialState.blocks
  @observable headers = initialState.headers
  @observable difficulty = initialState.difficulty
  @observable medianTime = initialState.medianTime
  @observable connections = initialState.connections
  @observable initialBlockDownload = initialState.initialBlockDownload
  @observable connectedToNode = initialState.connectedToNode
  fetchPollManager: PollManager

  constructor() {
    this.fetchPollManager = new PollManager({
      name: 'Network fetch',
      fnToPoll: this.fetch,
      timeoutInterval: 2500,
    })
  }

  @action
  initPolling() {
    this.fetchPollManager.initPolling()
  }
  @action
  stopPolling() {
    this.fetchPollManager.stopPolling()
  }

  @action.bound
  async fetch() {
    try {
      const result = this.protectResult(await getNetworkStatus())
      runInAction(() => {
        // since the API returns 'main' for mainnet but 'testnet' for testnet, we
        // normalize the value we save on this.chain, for consistency in the UI
        this.chain = this.formatChainResult(result.chain)
        this.blocks = result.blocks
        this.headers = result.headers
        this.difficulty = result.difficulty
        this.medianTime = result.medianTime
        this.initialBlockDownload = result.initialBlockDownload
        this.connectedToNode = true
      })
    } catch (error) {
      runInAction(() => {
        this.connectedToNode = false
      })
    }

    const networkConnectionsResult = await getNetworkConnections()
    runInAction(() => {
      this.connections = networkConnectionsResult
    })
  }

  get isSyncing() {
    return !this.isSynced || (this.blocks < this.headers)
  }

  get isSynced() {
    return !this.initialBlockDownload
  }

  protectResult(result) {
    this.expectedNonUndefinedKeys.forEach(key => {
      if (result[key] === undefined) {
        console.warn(`network response is undefined for key - ${key}. This is unexpected. Falling back to default value ${initialState[key]}`)
        result[key] = initialState[key]
      }
    })
    return result
  }
  @computed
  get expectedNonUndefinedKeys() {
    return ['blocks', 'chain', 'difficulty', 'headers', 'initialBlockDownload', 'medianTime', 'tip']
  }
  get otherChain() {
    return this.chain === TESTNET ? MAINNET : TESTNET
  }

  @computed
  get gigaHashRate() {
    return this.difficulty / 55
  }

  @computed
  get hashrateByUnit() {
    if (this.gigaHashRate < 1) {
      return this.gigaHashRate * 1000
    } else if (this.gigaHashRate > 1000) {
      return this.gigaHashRate / 1000
    }
    return this.gigaHashRate
  }

  @computed
  get hashrateUnit() {
    if (this.gigaHashRate < 1) {
      return 'MH/s'
    } else if (this.gigaHashRate > 1000) {
      return 'TH/s'
    }
    return 'GH/s'
  }


  formatChainResult(chainResult) {
    if (chainResult === 'main') {
      return MAINNET
    }
    if (chainResult === 'local') {
      return LOCALNET
    }
    if (chainResult === 'testnet') {
      return TESTNET
    }
  }
}

export default NetworkState

function getInitialState() {
  return {
    chain: 'main',
    blocks: 0,
    headers: 0,
    difficulty: 0,
    medianTime: 0,
    connections: 0,
    initialBlockDownload: false,
    connectedToNode: false,
  }
}
