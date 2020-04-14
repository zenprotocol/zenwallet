/* eslint-disable no-mixed-operators */
// @flow
import { action, autorun, computed, observable, reaction, runInAction, toJS } from 'mobx'
import { find, findIndex, isEmpty, isEqual, keys, last, reduce, has, set, get } from 'lodash'
import { Decimal } from 'decimal.js'
import BigInteger from 'bigi'
import { Data } from '@zen/zenjs/build/src/Components/Contracts/Data'
import { Hash } from '@zen/zenjs/build/src/Consensus/Types/Hash'
import { Allocation } from '@zen/zenjs/build/src/Consensus/Types/Allocation'
import { Ballot } from '@zen/zenjs/build/src/Consensus/Types/Ballot'
import { ContractId } from '@zen/zenjs/build/src/Consensus/Types/ContractId'
import Address from '@zen/zenjs/build/src/Components/Wallet/Address'

import { MAINNET, ZEN_TO_KALAPA_RATIO } from '../constants/constants'
import {
  checkBallot,
  convertPercentageToZP,
  convertZPtoPercentage,
  format,
  getAddress,
  isValidAddress,
  payloadData,
  snapshotBalance,
  toPayout,
} from '../utils/helpers'
import {
  kalapasToZen,
  zenBalanceDisplay,
  zenKalapasBalanceDisplay,
  zenToKalapas,
} from '../utils/zenUtils'
import PollManager from '../utils/PollManager'
import {
  getCandidates,
  getCgp,
  getCgpPopularBallotsFromExplorer,
  getCgpVotesFromExplorer,
  getContractHistory,
  getContractTXHistory,
  getUtxo,
} from '../services/api-service'

class CGPStore {
  constructor(publicStore, networkStore, txHistoryStore, portfolioStore, authStore, runStore) {
    this.publicAddressStore = publicStore
    this.portfolioStore = portfolioStore
    this.networkStore = networkStore
    this.txHistoryStore = txHistoryStore
    this.authorizedProtocolStore = authStore
    this.runContractStore = runStore

    /**
     * poll for the vote right after it was made
     * The votes are supposed to be found very quickly, hence the short timeout
     */
    this.fetchAllocationVotePollManager = new PollManager({
      name: 'New CGP allocation vote fetch',
      fnToPoll: (() => {
        let count = 0
        const maxFetchTimes = 100
        return () => {
          if (this.allocationVoteFetchStatus.fetched || count >= maxFetchTimes) {
            runInAction(() => {
              this.allocationVoteFetchStatus.fetching = false
            })
            this.fetchAllocationVotePollManager.stopPolling()
          } else {
            count += 1
            this.fetchVotedDetails({ allocation: true })
          }
        }
      })(),
      timeoutInterval: 500,
    })
    this.fetchPayoutVotePollManager = new PollManager({
      name: 'New CGP payout vote fetch',
      fnToPoll: (() => {
        let count = 0
        const maxFetchTimes = 100
        return () => {
          if (this.payoutVoteFetchStatus.fetched || count >= maxFetchTimes) {
            runInAction(() => {
              this.payoutVoteFetchStatus.fetching = false
            })
            this.fetchPayoutVotePollManager.stopPolling()
          } else {
            count += 1
            this.fetchVotedDetails({ payout: true })
          }
        }
      })(),
      timeoutInterval: 500,
    })
    this.fetchNominationVotePollManager = new PollManager({
      name: 'New CGP nomination vote fetch',
      fnToPoll: (() => {
        let count = 0
        const maxFetchTimes = 100
        return () => {
          if (this.nominationVoteFetchStatus.fetched || count >= maxFetchTimes) {
            runInAction(() => {
              this.nominationVoteFetchStatus.fetching = false
            })
            this.fetchNominationVotePollManager.stopPolling()
          } else {
            count += 1
            this.fetchVotedDetails({ payout: true })
          }
        }
      })(),
      timeoutInterval: 500,
    })

    autorun(() => {
      if (this.ballotId) {
        this.deserializeBallotIdOnChange()
      }
      if (!this.isNomination && this.ballotId === '') {
        this.resetPayout()
      }
    })

    // reaction ensures running only on the right change
    reaction(
      () =>
        !isEqual(this.address, this.ballotDeserialized.address) ||
        !isEqual(this.assetAmountsPure, this.ballotDeserialized.spends),
      () => this.removeBallotIdOnDetailsChange(),
    )
  }

  @observable snapshotBalanceAcc = 0
  @observable snapshotBalanceAccLoad = { loading: false, loaded: false }
  @observable assetCGP = []
  @observable cgpCurrentBalance = {} // { [s: string]: number }
  @observable cgpCurrentZPBalance = 0
  @observable cgpCurrentAllocation = 0
  @observable cgpCurrentPayout = 0
  @observable prevIntervalTxs = 0
  @observable prevIntervalZpVoted = 0
  @observable allocation = this.cgpCurrentAllocation
  @observable ballotId = ''
  @observable ballotDeserialized = {}
  @observable ballotIdValid = false
  @observable allocationVoted = false
  @observable payoutVoted = false
  @observable nominationVoted = false
  @observable pastAllocation = 0
  @observable pastBallotId = ''
  @observable pastNomination = ''
  @observable popularBallots = { count: 0, items: [] }
  @observable popularBallotsCurrentAmount = 10
  @observable candidates = { count: 0, items: [] }
  @observable candidatesCurrentAmount = 10
  @observable fetching = {
    popularBallots: false,
    votes: false,
    candidates: false,
  }
  @observable address = ''
  @observable assetAmounts = [{ asset: '', amount: 0, id: this.getUniqueId() }]
  @observable statusAllocation = {} // { status: 'success/error', errorMessage: '...' }
  @observable statusPayout = {} // { status: 'success/error', errorMessage: '...' }
  @observable statusNomination = {} // { status: 'success/error', errorMessage: '...' }
  @observable initialVotesFetchDone = false
  @observable allocationVoteFetchStatus = {
    fetching: false,
    fetched: false,
  }
  @observable payoutVoteFetchStatus = {
    fetching: false,
    fetched: false,
  }
  @observable nominationVoteFetchStatus = {
    fetching: false,
    fetched: false,
  }

  // TODO: Change to event
  fetchPollManager = new PollManager({
    name: 'CGP fetch',
    fnToPoll: this.fetch,
    timeoutInterval: 2500,
  })

  @action
  initPolling() {
    this.fetchPollManager.initPolling()
  }
  @action
  stopPolling() {
    this.fetchPollManager.stopPolling()
  }

  @computed
  get contractIdCgp() {
    return this.networkStore.chainUnformatted === MAINNET ?
      '00000000e2e56687e040718fa75210195a2ecbed6d5b2f9d53431b8ce3cba57588191b6a' :
      '00000000eac6c58bed912ff310df9f6960e8ed5c28aac83b8a98964224bab1e06c779b93'
  }

  @computed
  get contractIdVote() {
    return this.networkStore.chainUnformatted === MAINNET ?
      '00000000abbf8805a203197e4ad548e4eaa2b16f683c013e31d316f387ecf7adc65b3fb2' :
      '00000000e89738718a802a7d217941882efe8e585e20b20901391bc37af25fac2f22c8ab'
  }

  @computed
  get addressCGP() {
    return Address.getPublicKeyHashAddress(
      this.networkStore.chainUnformatted,
      ContractId.fromString(this.contractIdCgp),
    )
  }

  @computed
  get addressVote() {
    return Address.getPublicKeyHashAddress(
      this.networkStore.chainUnformatted,
      ContractId.fromString(this.contractIdVote),
    )
  }

  getBalanceFor(asset) {
    const result = find(this.assets, { asset })
    return result ? result.balance : 0
  }

  @action.bound
  async fetch() {
    await this.fetchCandidates()
    return Promise.all([
      this.fetchCgp(),
      this.fetchAssets(),
      this.fetchPrevIntervalVoteCount(),
      (() => {
        if (this.popularBallots.items.length === 0) {
          return this.fetchPopularBallots()
        }
      })(),
    ])
  }

  @action
  async fetchCgp() {
    const [cgpCurrent] = await Promise.all([
      getCgp(),
    ])
    runInAction(() => {
      this.cgpCurrentAllocation = cgpCurrent.allocation
      this.cgpCurrentPayout = cgpCurrent.payout
    })
    const contractUTxo = await getUtxo(
      this.networkStore.chainUnformatted,
      this.addressCGP,
    )
    const balanceZP = reduce(contractUTxo, (balance, pointedOutput) => {
      const { asset, amount } = pointedOutput.spend

      if (has(balance, asset)) {
        const accumulatedAmount = get(balance, asset)
        return set(balance, asset, accumulatedAmount + amount)
      }
      return set(balance, asset, amount)
    }, {})

    runInAction(() => {
      this.cgpCurrentZPBalance = format(get(balanceZP, '00'))
      this.cgpCurrentBalance = balanceZP
    })
  }

  @action
  async fetchPrevIntervalVoteCount() {
    if (this.currentInterval > 1) {
      const [responsePayout, responseAllocation] = await Promise.all([
        getCgpVotesFromExplorer({
          chain: this.networkStore.chain,
          interval: this.currentInterval - 1,
          type: 'payout',
        }),
        getCgpVotesFromExplorer({
          chain: this.networkStore.chain,
          interval: this.currentInterval - 1,
          type: 'allocation',
        }),
        getCgpVotesFromExplorer({
          chain: this.networkStore.chain,
          interval: this.currentInterval - 1,
          type: 'nomination',
        }),
      ])
      runInAction(() => {
        if (responsePayout.success && responseAllocation.success) {
          this.prevIntervalTxs = responsePayout.data.count + responseAllocation.data.count
        }
      })
    }
  }

  @action
  async getVote(command, snapshotBlock) {
    const internalTx = this.txHistoryStore.transactions.map(t => t.txHash)
    const transactions = await getContractHistory(
      this.networkStore.chain,
      this.contractIdVote,
      0,
      10000000,
    )
    if (isEmpty(this.txHistoryStore.transactions) || isEmpty(transactions)) return []
    const tx = transactions
      .filter(t => t.command === command
        && this.networkStore.headers - t.confirmations >= Number(snapshotBlock))
      .map(t => t.txHash)
      .filter(e => internalTx.includes(e))
    return tx
  }

  async voted(command, snapshotBlock) {
    const votes = await this.getVote(command, snapshotBlock)
    const vote = votes[0]
    if (isEmpty(vote)) return
    const transactions = await getContractHistory(
      this.networkStore.chain,
      this.contractIdVote,
      0,
      10000000,
    )
    const tx = transactions.find(t => t.txHash === vote)
    if (!tx) return
    const serialized = tx.messageBody.dict.find(txs => txs[0] === command)[1].string
    switch (command) {
      case 'Allocation':
        runInAction(() => {
          this.allocationVoteFetchStatus.fetched = true
          this.pastAllocation =
            convertPercentageToZP(Ballot.fromHex(serialized).getData().allocation)
          this.allocationVoted = true
        })
        break
      case 'Payout':
        runInAction(() => {
          this.payoutVoteFetchStatus.fetched = true
          this.pastBallotId = serialized
          this.payoutVoted = true
        })
        break
      case 'Nomination':
        runInAction(() => {
          this.nominationVoteFetchStatus.fetched = true
          this.pastBallotId = serialized
          this.nominationVoted = true
        })
        break
      default:
        break
    }
  }

  @action
  async fetchAssets() {
    if (this.snapshotBlock <= 0) return

    this.snapshotBalanceAccLoad.loading = true

    const snapshotBalanceAcc = await this.txHistoryStore.fetchSnapshot(this.snapshotBlock)
    runInAction(() => {
      this.snapshotBalanceAcc = snapshotBalanceAcc
      this.snapshotBalanceAccLoad = {
        loading: false,
        loaded: true,
      }
    })
    runInAction(() => {
      this.fetching.votes = true
    })
    await this.fetchVotedDetails({ allocation: true, payout: true })
    runInAction(() => {
      // one time indicator for the first fetch
      this.initialVotesFetchDone = true
      this.fetching.votes = false
    })

    const transactions = await getContractTXHistory(
      this.networkStore.chain,
      this.addressCGP,
      0,
      65535,
    )
    runInAction(() =>
      this.assetCGP
        .replace(snapshotBalance(transactions, this.snapshotBlock, this.networkStore.blocks)))
  }

  @action
  async fetchVotedDetails({ allocation = false, payout = false } = {}) {
    if (this.snapshotBlock <= 0) return

    if (this.isNomination) {
      // fetch must be called before Promise.all to prevent a reset in the middle
      await this.txHistoryStore.fetch()
      return Promise.all([
        payout ? this.voted('Nomination', this.snapshotBlock) : null,
      ])
    }

    if (this.isVotingInterval) {
      // fetch must be called before Promise.all to prevent a reset in the middle
      await this.txHistoryStore.fetch()
      return Promise.all([
        allocation ? this.voted('Allocation', this.snapshotBlock) : null,
        payout ? this.voted('Payout', this.snapshotBlock) : null,
      ])
    }
  }

  @action
  async fetchPopularBallots() {
    if (
      this.fetching.popularBallots ||
      (this.popularBallots.items.length &&
        this.popularBallots.items.length >= this.popularBallots.count)
    ) {
      return
    }

    this.fetching.popularBallots = true
    const response = await getCgpPopularBallotsFromExplorer({
      chain: this.networkStore.chain,
      pageSize: this.popularBallotsCurrentAmount,
      page: 0,
      currentInterval: this.currentInterval,
      type: this.isNomination ? 'nomination' : 'payout',
    })
    runInAction(() => {
      if (response.success) {
        this.popularBallots.count = response.data.count
        this.popularBallots.items.replace(response.data.items)
        this.popularBallotsCurrentAmount += 10
      }
      this.fetching.popularBallots = false
    })
  }

  @action
  async fetchCandidates() {
    if (
      this.fetching.candidates ||
      (this.candidates.items.length &&
        this.candidates.items.length >= this.candidates.count)
    ) {
      return
    }

    this.fetching.candidates = true
    try {
      const response = await getCandidates(this.currentInterval)
      const data = response.map(d => {
        const ballot =
          new Ballot(toPayout(this.networkStore.chainUnformatted, d.recipient, d.spendlist)).toHex()
        const zpAmount = 0
        return { ballot, zpAmount }
      })
      runInAction(() => {
        this.candidates.count = response.length
        this.candidates.items.replace(data)
        this.candidatesCurrentAmount += 10
      })
    } catch (e) {
      console.error(e)
      this.fetching.candidates = false
    }
  }

  @computed
  get assets() {
    return this.assetCGP.filter(asset => asset.balance > 0).map(asset => ({
      ...asset,
      name: this.portfolioStore.getAssetName(asset.asset),
      balance: kalapasToZen(asset.balance),
      balanceDisplay: zenBalanceDisplay(asset.balance),
    }))
  }

  filteredBalances = query => {
    if (!this.assets.length) {
      return []
    }
    if (!query) {
      return this.assets
    }
    return this.assets
      .filter(asset => asset.name.indexOf(query) > -1 || asset.asset.indexOf(query) > -1)
  }

  @computed
  get intervalLength() {
    return this.networkStore.chain === MAINNET ? 10000 : 100
  }

  @computed
  get votingIntervalLength() {
    return this.intervalLength / 10
  }

  @computed
  get isVotingInterval() {
    return (
      this.networkStore.headers >= this.nominationBlock
      && this.networkStore.headers < this.tallyBlock
    )
  }

  @computed
  get currentInterval() {
    return Math.ceil((this.networkStore.headers + 1) / this.intervalLength)
  }

  @computed
  get snapshotBlock() {
    return (this.currentInterval - 1) * this.intervalLength + this.intervalLength * 0.9
  }

  @computed
  get tallyBlock() {
    return this.currentInterval * this.intervalLength
  }

  @computed
  get nominationBlock() {
    return this.snapshotBlock + 10 / 2
  }

  @computed
  get isNomination() {
    return this.networkStore.headers >= this.snapshotBlock
      && this.networkStore.headers < this.nominationBlock
  }

  @computed
  get isPayoutBlock() {
    const interval = (this.networkStore.headers + 1) % this.intervalLength
    if (this.networkStore.chainUnformatted !== MAINNET) {
      return interval === 10
    }
    return interval === 100
  }

  @computed
  get allocationZpMin() {
    if (this.cgpCurrentAllocation === null) return 0
    const minerAmount = 100 - (100 - this.cgpCurrentAllocation) * 100 / 85
    return minerAmount > 0 ? convertPercentageToZP(minerAmount) : 0
  }

  @computed
  get allocationZpMax() {
    if (this.cgpCurrentAllocation === null) return 7.5
    const minerAmount = 100 - (100 - this.cgpCurrentAllocation) * 0.85
    return minerAmount < 100 ? convertPercentageToZP(minerAmount) : 50
  }

  @computed
  get aggregatedAssetAmounts() {
    return this.assetAmounts.reduce((aggregated, cur) => {
      if (typeof aggregated[cur.asset] === 'undefined') {
        aggregated[cur.asset] = 0
      }
      aggregated[cur.asset] = Decimal.add(aggregated[cur.asset], cur.amount).toNumber()
      return aggregated
    }, {})
  }

  @computed
  get payoutHasData() {
    const lastAssetAmount = last(this.assetAmounts)
    return !!this.address || (lastAssetAmount && (lastAssetAmount.asset || lastAssetAmount.amount))
  }

  @computed
  get payoutAmountGraterThenZero() {
    return this.assetAmounts.filter(item => item.amount > 0).length !== this.assetAmounts.length
  }

  @computed
  get assetAmountsValid() {
    return findIndex(this.assetAmounts, item => !item.asset || !item.amount) === -1
  }

  @computed
  get lastAssetAmountValid() {
    const lastAssetAmount = last(this.assetAmounts)
    return !!lastAssetAmount.asset && !!lastAssetAmount.amount
  }

  @computed
  get allocationValid() {
    return this.allocation >= this.allocationZpMin && this.allocation <= this.allocationZpMax
  }

  @computed
  get payoutValid() {
    const allAmountsNotExceedingBalance = keys(this.aggregatedAssetAmounts).reduce(
      (valid, asset) =>
        Decimal.sub(
          this.getBalanceFor(asset),
          this.aggregatedAssetAmounts[asset],
        ).greaterThanOrEqualTo(0),
      true,
    )

    return (
      isValidAddress(this.address, this.networkStore.chain) &&
      this.assetAmountsValid &&
      allAmountsNotExceedingBalance
    )
  }

  /**
   * An array of {asset, amount} pairs
   */
  @computed
  get assetAmountsPure() {
    return this.assetAmounts.map(item => ({ asset: item.asset, amount: zenToKalapas(item.amount) }))
  }

  @computed
  get cgpCurrentAllocationZP() {
    return convertPercentageToZP(this.cgpCurrentAllocation)
  }

  @action
  resetStatuses() {
    this.statusAllocation = {}
    this.statusPayout = {}
  }

  @action
  resetPayout() {
    this.ballotId = ''
    this.address = ''
    this.assetAmounts = [{ asset: '', amount: 0, id: this.getUniqueId() }]
    this.statusPayout = {}
  }

  @action
  updateAllocation(value) {
    this.allocation = value
  }

  @action
  updateAddress(value) {
    this.ballotId = ''
    this.address = value
  }

  @action
  updateBallotId(value) {
    this.ballotId = value
  }

  removeBallotIdOnDetailsChange() {
    if (
      !isEqual(this.address, this.ballotDeserialized.address) ||
      !isEqual(this.assetAmountsPure, this.ballotDeserialized.spends)
    ) {
      runInAction(() => {
        this.ballotId = ''
        this.ballotDeserialized = {}
        this.ballotIdValid = false
      })
    }
  }

  deserializeBallotIdOnChange() {
    if (checkBallot(this.ballotId)) {
      runInAction(() => {
        this.ballotIdValid = true
        const { data: payout } = Ballot.fromHex(this.ballotId)
        const { recipient, spends } = payout
        this.ballotDeserialized = payout
        this.address = Address.getPublicKeyHashAddress(
          this.networkStore.chainUnformatted,
          getAddress(recipient),
        )
        const assets = spends.map(spend => {
          const { asset, amount } = spend
          return {
            asset: asset.asset,
            amount: amount > ZEN_TO_KALAPA_RATIO ?
              kalapasToZen(amount) : zenKalapasBalanceDisplay(amount),
            id: this.getUniqueId(), // needed for the ui
          }
        })
        this.assetAmounts.replace(assets)
      })
    } else {
      runInAction(() => {
        this.ballotIdValid = false
        this.address = ''
        this.assetAmounts = [{ asset: '', amount: 0, id: this.getUniqueId() }]
      })
    }
  }

  serializeBallotIdOnChange() {
    const payout =
      toPayout(this.networkStore.chainUnformatted, this.address, this.assetAmountsPure)
    try {
      this.ballotId = new Ballot(payout).toHex()
    } catch (e) {
      this.ballotId = ''
    }
  }

  @action
  addAssetAmountPair() {
    const lastItem = last(this.assetAmounts)
    if (!lastItem.asset || !lastItem.amount) return
    if (this.assetAmounts.length >= 100) return

    // create an id for react to prevent list.map bugs
    const uniqueId = this.getUniqueId()

    this.assetAmounts.push({ asset: '', amount: 0, id: uniqueId })
  }

  getUniqueId() {
    return Math.random().toString(36).substr(2, 9)
      + Math.random().toString(36).substr(2, 9)
  }

  @action
  removeAssetAmountPair({ index } = {}) {
    this.ballotId = ''
    if (this.assetAmounts.length === 1) return

    this.assetAmounts.splice(index, 1)
  }

  @action
  changeAssetAmountPair({ index, asset, amount } = {}) {
    if (this.assetAmounts[index].asset !== asset || this.assetAmounts[index].amount !== amount) this.ballotId = ''
    this.assetAmounts[index].asset = asset
    this.assetAmounts[index].amount = amount
  }

  @action
  submitAllocationVote = async (confirmedPassword: string) => {
    if (this.allocationValid) {
      try {
        const stringAllocation = 'Allocation'
        const allocation = new Allocation(convertZPtoPercentage(this.allocation))
        this.submitBallot(stringAllocation, allocation, confirmedPassword)
        // start polling for the vote
        this.allocationVoteFetchStatus.fetching = true
        this.fetchAllocationVotePollManager.initPolling()
        runInAction(() => {
          this.statusAllocation = { status: 'success' }
        })
      } catch (error) {
        runInAction(() => {
          this.statusAllocation = { status: 'error', errorMessage: error.message }
        })
      }
    }
  }

  submitBallot = async (stringBallot, ballotData, pass) => {
    const phase = this.isNomination ? 'Nomination' : 'Vote'
    const ballot = new Ballot(ballotData).toHex()
    const interval = Data.serialize(new Data.UInt32(BigInteger.valueOf(this.currentInterval)))
    const ballotSerialized = Data.serialize(new Data.String(ballot))
    const phaseSer = Data.serialize(new Data.String(phase))
    const messageToCompute = interval.toString().concat(phaseSer).concat(ballotSerialized)
    const message = Hash.compute(messageToCompute).bytes
    await this.publicAddressStore.getKeys(pass)
    const arrayPromise = toJS(this.publicAddressStore.publicKeys).map(async item => {
      const { publicKey, path } = item
      const signature = await this.authorizedProtocolStore.signMessage(
        message,
        path,
        pass,
      )
      return [publicKey, new Data.Signature(signature)]
    })
    const data = await Promise.all(arrayPromise)
      .then(signatures => new Data.Dictionary([
        [stringBallot, new Data.String(ballot)],
        ['Signature', new Data.Dictionary(signatures)],
      ]))
      .catch(error => console.log(error))
    await this.runContractStore.run(
      pass,
      payloadData(this.addressVote, data, stringBallot),
    )
  }

  @action
  submitPayoutVote = async (confirmedPassword: string) => {
    if (this.payoutValid) {
      try {
        const stringPayout = 'Payout'
        const payout =
          toPayout(this.networkStore.chainUnformatted, this.address, this.assetAmountsPure)
        this.submitBallot(stringPayout, payout, confirmedPassword)
        // start polling for the vote
        this.payoutVoteFetchStatus.fetching = true
        this.fetchPayoutVotePollManager.initPolling()
        runInAction(() => {
          this.statusPayout = { status: 'success' }
        })
      } catch (error) {
        runInAction(() => {
          this.statusPayout = { status: 'error', errorMessage: error.message }
        })
      }
    }
  }
  @action
  submitNominationVote = async (confirmedPassword: string) => {
    if (this.payoutValid) {
      try {
        const stringNomination = 'Nomination'
        const payout =
          toPayout(this.networkStore.chainUnformatted, this.address, this.assetAmountsPure)
        this.submitBallot(stringNomination, payout, confirmedPassword)
        // start polling for the vote
        this.nominationVoteFetchStatus.fetching = true
        this.fetchNominationVotePollManager.initPolling()
        runInAction(() => {
          this.statusNomination = { status: 'success' }
        })
      } catch (error) {
        runInAction(() => {
          this.statusNomination = { status: 'error', errorMessage: error.message }
        })
      }
    }
  }
}

export default CGPStore
