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
  @observable didFetchCountSinceLastLogin = false
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
        // check if there are new transactions
        if (nextCount === this.count
          || nextCount === this.txCountInDb) {
          this.count = nextCount
          this.didFetchCountSinceLastLogin = true
          this.isFetchingCount = false
          return
        }
        const deltaOfNewTransactions = nextCount - this.txCountInDb
        this.count = nextCount
        if (!this.didFetchCountSinceLastLogin) {
          this.toastNewOfflineTxs(deltaOfNewTransactions)
        } else {
          toast.info(<ToastLink to={routes.TX_HISTORY}>New transaction</ToastLink>)
        }
        this.count = nextCount
        this.didFetchCountSinceLastLogin = true
        this.isFetchingCount = false
        db.set(this.txCountInDbKey, nextCount).write()
      })
    } catch (error) {
      console.log('error fecthing txHistoryCount', error)
      this.isFetchingCount = false
    }
  }

  toastNewOfflineTxs(deltaOfNewTransactions) {
    const msg = deltaOfNewTransactions > 1
      ? `${deltaOfNewTransactions} New transactions since last login`
      : `${deltaOfNewTransactions} New transaction since last login`
    toast.info(<ToastLink to={routes.TX_HISTORY}>{msg}</ToastLink>)
  }

  get txCountInDb() {
    return db.get(this.txCountInDbKey).value()
  }

  get txCountInDbKey() {
    return `transactionCount-${this.networkStore.chain}`
  }

  get pagesCount() {
    return Math.ceil(this.count / this.pageSize)
  }

  get skip() {
    return this.pageIdx * this.pageSize
  }
}

export default TxHistoryStore
