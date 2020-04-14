// @flow
import { observable, action, runInAction } from 'mobx'
import { isEmpty } from 'lodash'


import db from '../services/db'
import { getTxHistory, getTxHistoryCount } from '../services/api-service'
import PollManager from '../utils/PollManager'

class TxHistoryStore {
  pageSizeOptions = ['5', '10', '20', '100']
  @observable isFirstFetchCountSinceLastLogin = true
  @observable newTxsCountSinceUserVisitedTransactionsPage = 0
  @observable transactions = []
  @observable count = 0
  @observable pageIdx = 0
  @observable pageSize = 20
  @observable isFetchingCount = false
  @observable isFetchingTransactions = false
  @observable lastBlockVoted = ''
  fetchPollManager = new PollManager({
    name: 'tx history count fetch',
    fnToPoll: this.fetchCount,
    timeoutInterval: 5000,
  })
  constructor({ networkStore }) {
    this.networkStore = networkStore
  }
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

  @action
  fetchSnapshot = async (snapshotBlock) => {
    const data = await getTxHistory({ skip: 0, take: 10000000 })
    if (isEmpty(data)) return 0
    const final = data
      .filter(x => x.asset === '00')
      .map(({ amount, confirmations }) => ({
        amount,
        blockNumber: this.networkStore.blocks - confirmations,
      }))
      .filter(item => item.blockNumber < snapshotBlock)
      .map(item => item.amount)
    if (isEmpty(final)) return 0
    return final.reduce((total, n) => total + n)
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
    // cuurently not used, left here to support loading indicator for the UI
    this.isFetchingTransactions = true
    try {
      const nextTransactions = await getTxHistory({ skip: this.skip, take: this.pageSize })
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
      const nextCount = await getTxHistoryCount()
      runInAction(() => {
        this.isFetchingCount = false
        if (nextCount === this.count) {
          this.isFirstFetchCountSinceLastLogin = false
          return
        }
        this.count = nextCount
        if (nextCount > this.txDbCountInLastLogin) {
          db.set(this.txDbCountInLastLoginKey, nextCount).write()
        }
        // think about db and store data
        if (nextCount > this.txDbCountInLastUserVisitToTransactionsRoute) {
          this.newTxsCountSinceUserVisitedTransactionsPage =
            nextCount - this.txDbCountInLastUserVisitToTransactionsRoute
        }
        this.isFirstFetchCountSinceLastLogin = false
      })
    } catch (error) {
      console.log('error fecthing txHistoryCount', error)
      this.isFetchingCount = false
    }
  }

  @action
  resetNewTxsCountSinceUserVisitedTransactionsPage() {
    db.set(this.txDbCountInLastUserVisitToTransactionsRouteKey, this.count).write()
    this.newTxsCountSinceUserVisitedTransactionsPage = 0
  }

  get txDbCountInLastLogin() {
    return db.get(this.txDbCountInLastLoginKey).value()
  }

  get txDbCountInLastLoginKey() {
    return `txCountInLastLogin-${this.networkStore.chain}`
  }

  get txDbCountInLastUserVisitToTransactionsRoute() {
    return db.get(this.txDbCountInLastUserVisitToTransactionsRouteKey).value()
  }

  get txDbCountInLastUserVisitToTransactionsRouteKey() {
    return `txCountInLastVisitToTransactionsRoute-${this.networkStore.chain}`
  }

  get pagesCount() {
    return Math.ceil(this.count / this.pageSize)
  }

  get skip() {
    return this.pageIdx * this.pageSize
  }
}

export default TxHistoryStore
