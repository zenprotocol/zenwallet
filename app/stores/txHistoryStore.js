// @flow
import React from 'react'
import { observable, action, runInAction } from 'mobx'
import { toast } from 'react-toastify'

import routes from '../constants/routes'
import ToastLink from '../components/ToastLink'
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
  @observable pageSize = 5
  @observable isFetchingCount = false
  @observable isFetchingTransactions = false
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
    this.didFetchCountAlreadyInThisPoll = false
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
          this.toastNewTx(nextCount)
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

  toastNewTx(nextCount) {
    const NewTxsDelta = nextCount - this.txDbCountInLastLogin
    let msg = NewTxsDelta > 1
      ? `${NewTxsDelta} New transactions`
      : `${NewTxsDelta} New transaction`
    if (this.isFirstFetchCountSinceLastLogin) {
      msg += ' since last login'
    }
    toast.info(<ToastLink to={routes.TX_HISTORY}>{msg}</ToastLink>)
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
