// @flow
import { observable, action, runInAction } from 'mobx'

import { getWalletInstance } from '../services/wallet'
import PollManager from '../utils/PollManager'

import NetworkStore from './networkStore'

class TxHistoryStore {
  pageSizeOptions = ['5', '10', '20', '100']
  @observable transactions = []
  @observable count = 0
  @observable pageIdx = 0
  @observable pageSize = 5
  @observable isFetchingCount = false
  @observable isFetchingTransactions = false

  networkStore: NetworkStore

  constructor(networkStore: NetworkStore) {
    this.networkStore = networkStore
  }

  fetchPollManager = new PollManager({
    name: 'tx history count fetch',
    fnToPoll: this.fetchCount,
    timeoutInterval: 5000,
  })

  @action
  initPolling() {
    this.fetchPollManager.initPolling()
  }

  @action
  stopPolling() {
    this.fetchPollManager.stopPolling()
  }

  @action
  reset() {
    this.stopPolling()
    this.isFetchingCount = false // goldy note to self: this used to be wrapped in runInAction
  }

  @action.bound
  selectPageSize(nextPageSize: number) {
    this.pageIdx = Math.floor((this.pageSize * this.pageIdx) / nextPageSize)
    this.pageSize = nextPageSize
    this.fetch()
  }

  @action.bound
  onPageChange(nextPageIdx: number) {
    this.pageIdx = nextPageIdx
    this.fetch()
  }

  @action.bound
  async fetch() {
    this.isFetchingTransactions = true
    try {
      const wallet = getWalletInstance(this.networkStore.chain)
      const nextTransactions = await wallet.getTransactions({
        skip: this.skip, take: this.pageSize,
      })
      runInAction(() => {
        this.transactions = nextTransactions
        this.isFetchingTransactions = false
      })
    } catch (error) {
      console.log('error fetching transactions', error)
      this.isFetchingTransactions = false
    }
  }

  @action.bound
  async fetchCount() {
    if (this.isFetchingCount) { return }
    this.isFetchingCount = true
    try {
      const wallet = getWalletInstance(this.networkStore.chain)
      const nextCount = await wallet.getTransactionsCount()
      runInAction(() => {
        if (nextCount > this.count) {
          this.count = nextCount
          // TODO Toast for new transaction, unless it's the first time
          // we fetched the count, to not toast about old transcations when logging in
          // feature idea:
          // show new transactions since user last logged in. we can do that
          // by saving transaction count to DB, and check it on load
        }
        this.isFetchingCount = false
      })
    } catch (error) {
      console.log('error fecthing txHistoryCount', error)
      this.isFetchingCount = false
    }
  }

  get pagesCount() {
    return Math.ceil(this.count / this.pageSize)
  }

  get skip() {
    return this.pageIdx * this.pageSize
  }
}

export default TxHistoryStore
