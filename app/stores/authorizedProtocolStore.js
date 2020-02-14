// @flow
import { observable, action, runInAction, toJS, computed } from 'mobx'
import { Data, Wallet } from '@zen/zenjs'
import { isEmpty } from 'lodash'

import {
  getContractHistory,
  postWalletMnemonicphrase,
  getCurrentInterval,
  getCandidates,
  getNextInterval,
} from '../services/api-service'
import { MAINNET } from '../constants/constants'
import PollManager from '../utils/PollManager'
import { hashVoteData, payloadData } from '../utils/helpers'

class AuthorizedProtocolStore {
  @observable inprogress = false
  @observable commit = ''
  @observable interval = 1
  @observable status = ''
  @observable errorMessage = ''
  @observable snapshotBalance = 0.1
  @observable snapshotBlock = 0
  @observable nextSnapshotBlock = 0
  @observable tallyBlock = 0
  @observable contractId = 'czen1qqqqqqq8rzylch7w03dmym9zad7vuvs4akp5azdaa6hm7gnc7wk287k9qgs7409ea'
  @observable phase = ''
  @observable isVotingInterval = undefined
  @observable isBeforeSnapshot = undefined
  // @observable isAfterSnapshot = undefined
  @observable isBetweenInterval = false
  @observable candidates = []
  /* @observable popularCandidatesItems = [{ commitId: '', zpAmount: 0 }]
  @observable fetching = {
    popularCandidates: false,
  } */
  fetchPollManager = new PollManager({
    name: 'tx history fetch',
    fnToPoll: this.fetch,
    timeoutInterval: 5000,
  })

  constructor(publicAddressStore, networkStore, txHistoryStore, runContractStore) {
    this.publicAddressStore = publicAddressStore
    this.networkStore = networkStore
    this.txHistoryStore = txHistoryStore
    this.runContractStore = runContractStore
  }

  async getSnapshotBalance() {
    this.snapshotBalance = await this.txHistoryStore.fetchSnapshot(this.snapshotBlock)
  }

  @action
  initPolling() {
    this.fetchPollManager.initPolling()
  }
  @action
  stopPolling() {
    this.fetchPollManager.stopPolling()
  }

  @computed
  get isCandidate() {
    return this.phase === 'Candidate'
  }

  @action
  submitVote = async (confirmedPassword: string) => {
    const message = hashVoteData(this.commit, this.interval, this.phase)
    await this.publicAddressStore.getKeys(confirmedPassword)
    const arrayPromise = toJS(this.publicAddressStore.publicKeys).map(async item => {
      const { publicKey, path } = item
      const signature =
        await this.signMessage(message, path, confirmedPassword)
      return [publicKey, new Data.Signature(signature)]
    })
    const data = await Promise.all(arrayPromise)
      .then((signatures) => new Data.DataList([
        new Data.String(this.commit),
        new Data.Dictionary(signatures)]))
      .catch(error => console.log(error))
    await this.runContractStore.run(
      confirmedPassword,
      payloadData(this.contractId, data, this.commit),
    )
  }

  @action.bound
  fetch = async () => Promise.all([
    this.fetchCurrentInterval(),
    this.fetchNextSnapshot(),
    this.fetchCandidates(),
  ])


  @action.bound
  fetchCurrentInterval = async () => {
    this.contractId = this.networkStore.chain === MAINNET ?
      'czen1qqqqqqq8rzylch7w03dmym9zad7vuvs4akp5azdaa6hm7gnc7wk287k9qgs7409ea' :
      'ctzn1qqqqqqq8rzylch7w03dmym9zad7vuvs4akp5azdaa6hm7gnc7wk287k9qgssqskgv'
    if (this.isFetching) { return }
    this.isFetching = true
    try {
      const result = await getCurrentInterval(this.networkStore.chain)
      const {
        beginHeight: resultBeginHeight, endHeight: resultEndHeight, phase, interval,
      } = result
      runInAction(() => {
        this.snapshotBlock = resultBeginHeight
        this.tallyBlock = resultEndHeight
        this.phase = phase
        this.interval = interval
        this.isVotingInterval =
          this.networkStore.headers >= resultBeginHeight
          && this.networkStore.headers < resultEndHeight
        this.isBeforeSnapshot = this.networkStore.headers < resultBeginHeight
        this.isFetching = false
      })
    } catch (error) {
      console.log('error', error)
      this.isFetching = false
    }
  }

  @action.bound
  fetchNextSnapshot = async () => {
    this.isFetching = true
    if (this.phase === 'Contestant') {
      try {
        const result = await getNextInterval(this.networkStore.chain)
        const {
          beginHeight: resultBeginHeight,
        } = result
        if (result) {
          runInAction(() => {
            this.nextSnapshotBlock = resultBeginHeight
            this.isBetweenInterval =
              this.networkStore.headers >= this.tallyBlock
              && this.networkStore.headers < resultBeginHeight
            this.isFetching = false
          })
        } else {
          this.nextSnapshotBlock = 0
          this.isBetweenInterval = this.tallyBlock < this.snapshotBlock
        }
      } catch (error) {
        this.isBetweenInterval = false
        this.nextSnapshotBlock = this.snapshotBlock
        console.log('No new semester yet...')
        this.isFetching = false
      }
    }
  }

  @action.bound
  fetchCandidates = async () => {
    this.isFetching = true
    try {
      const result = await getCandidates(this.networkStore.chain)
      if (result) {
        runInAction(() => {
          this.candidates = result
          this.isFetching = false
        })
      }
    } catch (error) {
      console.log('error', error)
      this.isFetching = false
    }
  }

  @action
  async getVote() {
    await this.txHistoryStore.fetch()
    const internalTx = this.txHistoryStore.transactions.map(t => t.txHash)
    const transactions = await getContractHistory(this.networkStore.chain, '00000000e3113f8bf9cf8b764d945d6f99c642bdb069d137bdd5f7e44f1e75947f58a044', 0, 10000000)
    if (isEmpty(this.txHistoryStore.transactions)) return false
    const tx = transactions
      .filter(t => this.networkStore.headers - t.confirmations
        >= Number(this.snapshotBlock))
      .map(t => t.txHash)
      .filter(e => internalTx.includes(e))
    if (isEmpty(tx)) return false
    if (tx) {
      const voteCommand = transactions.filter(t => t.txHash === tx[0])[0]
      this.votedCommit = !voteCommand ? this.commit : voteCommand.command
      return true
    }
    return !isEmpty(tx)
  }

  async signMessage(message: Buffer, path: Wallet.Path, password) {
    const seedString = await postWalletMnemonicphrase(password)
    const account = Wallet.fromMnemonic(seedString, this.networkStore.chainUnformatted === MAINNET ? 'main' : this.networkStore.chain.slice(0, -3), new Wallet.RemoteNodeWalletActions(this.networkStore.chainUnformatted === MAINNET ? 'https://remote-node.zp.io' : 'https://testnet-remote-node.zp.io'))
    try {
      this.inprogress = true
      const response = account.signMessage(message, path)
      runInAction(() => {
        this.status = 'success'
        setTimeout(() => {
          this.status = ''
        }, 15000)
      })
      this.inprogress = false
      return response
    } catch (error) {
      console.log(error)
    }
  }

  @action
  updateIntervalDisplay(interval) {
    this.interval = interval
  }

  @action
  updateCommitDisplay(commit) {
    this.commit = commit
  }

  @action
  updateContractIdDisplay(contractId) {
    this.contractId = contractId
  }
}

export default AuthorizedProtocolStore
