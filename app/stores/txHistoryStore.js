// @flow
import { observable, action, runInAction } from 'mobx'
import { isEmpty } from 'lodash'

import { getWalletInstance } from '../services/wallet'
import PollManager from '../utils/PollManager'

import NetworkStore from './networkStore'

class TxHistoryStore {
  networkStore: NetworkStore;
  @observable batchSize = 100;
  pageSizeOptions = ['5', '10', '20', '100'];
  @observable transactions = [];
  @observable skip = 0;
  @observable currentPageSize = 0;
  @observable snapshotBlock: number;
  @observable isFetching = false;
  fetchPollManager = new PollManager({
    name: 'tx history count fetch',
    fnToPoll: this.fetch,
    timeoutInterval: 5000,
  });
  constructor(networkStore: NetworkStore) {
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
    runInAction(() => {
      this.skip = 0
      this.currentPageSize = 0
      this.transactions = []
      this.isFetching = false
    })
  }

  @action
  fetchSnapshot = async () => {
    const wallet = getWalletInstance(this.networkStore.chain)
    const data = await wallet.getTransactions({ skip: 0, take: 10000000 })
    if (isEmpty(data)) return 0
    const final = data
      .filter(x => x.asset === '00')
      .map(({ amount, confirmations }) => ({
        amount,
        blockNumber: this.networkStore.blocks - confirmations,
      }))
      .filter(item => item.blockNumber <= this.snapshotBlock)
      .map(item => item.amount)
    if (isEmpty(final)) return 0
    return final.reduce((total, n) => total + n)
  };

  @action.bound
  fetch = async () => {
    if (this.isFetching) {
      return
    }
    this.isFetching = true
    try {
      const wallet = getWalletInstance(this.networkStore.chain)
      const result = await wallet.getTransactions({
        skip: this.skip,
        take: this.currentPageSize + this.batchSize,
      })
      runInAction(() => {
        if (result.length) {
          this.currentPageSize = result.length
          this.transactions = result
        }
        this.isFetching = false
      })
    } catch (error) {
      console.log('error fecthing txHistoryCount', error)
      this.isFetching = false
    }
  };
}

export default TxHistoryStore
