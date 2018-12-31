import { observable, action, runInAction } from 'mobx'

import { getCGP, getGenesisTimestamp } from '../services/api-service'
import PollManager from '../utils/PollManager'


class CGPStore {
  @observable allocationVote = []
  @observable resultAllocation = ''
  @observable totalPayoutVoted = 0
  @observable totalAllocationAmountVoted = 0
  @observable payoutVote = [Object]
  @observable resultPayout = ''
  @observable error = ''
  @observable genesisTimestamp = 0
  fetchPollManager = new PollManager({
    name: 'CGP fetch',
    fnToPoll: this.fetch,
    timeoutInterval: 2500,
  })

  constructor(networkStore) {
    this.networkStore = networkStore
  }

  @action
  initPolling() {
    this.fetchPollManager.initPolling()
  }

  @action.bound
  async fetch() {
    try {
      const cgp = await getCGP()
      const currentInterval = Math.floor(this.networkStore.headers / 100)
      runInAction(() => {
        this.resultAllocation = cgp.resultAllocation
        this.resultPayout = cgp.resultPayout
        this.fund = cgp.fund
        const currentTally = cgp.tallies.filter(data => data.interval === currentInterval)[0]
        this.interval = currentTally.interval
        this.allocationVote = currentTally.allocation ? currentTally.allocation.votes : []
        this.totalAllocationAmountVoted = this.getAmountVoted(this.allocationVote)
        this.payoutVote = currentTally.payout ? currentTally.payout.votes : []
        this.totalPayoutAmountVoted = this.getAmountVoted(this.payoutVote)
        this.error = ''
      })
    } catch (err) {
      console.error('error getting cgp', err)
      runInAction(() => { this.error = 'Error getting cgp' })
    }
    const coinBaseTimestamp = await getGenesisTimestamp()
    runInAction(() => {
      this.genesisTimestamp = coinBaseTimestamp
    })
  }

  getAmountVoted(voteArray: Array) {
    if (!voteArray) {
      return
    }
    let vote = 0
    voteArray.forEach((payoutVote) => {
      const { count } = payoutVote
      vote += Number(count)
    })
    return vote
  }
}

export default CGPStore
