import { observable, action, runInAction } from 'mobx'

import { getUtilization, postAllocationVote, postPayoutVote } from '../services/api-service'
import PollManager from '../utils/PollManager'


class VoteStore {
  @observable allocationAmount = ''
  @observable payoutAddress = ''
  @observable payoutAmount = ''
  @observable pastAllocation = ''
  @observable pastPayout = ''
  @observable outstanding = -1
  @observable utilized = -1
  @observable inprogress = false
  @observable status = ''
  @observable errorMessage = ''
  fetchPollManager = new PollManager({
    name: 'Vote Store fetch',
    fnToPoll: this.fetch,
    timeoutInterval: 2500,
  })

  @action
  initPolling() {
    this.fetchPollManager.initPolling()
  }

  @action.bound
  async fetch() {
    try {
      const response = await getUtilization()
      runInAction(() => {
        this.outstanding = response.outstanding
        this.utilized = response.utilized
        if (response.vote) {
          this.pastAllocation = response.vote.allocation ? response.vote.allocation : null
          this.pastPayout = response.vote.payout ? response.vote.payout : null
        } else {
          this.pastAllocation = null
          this.pastPayout = null
        }
        this.error = ''
      })
    } catch (err) {
      console.error('error getting cgp', err)
      runInAction(() => { this.error = 'Error getting cgp' })
    }
  }

  @action
  async createAllocationVote(password) {
    try {
      this.inprogress = true
      const data = {
        allocation: this.allocationAmount,
        password,
      }
      console.log(data)
      const response = await postAllocationVote(data)
      console.log(response)
      runInAction(() => {
        console.log('createAllocationVote response', response)
        this.reset()
        this.status = 'success'
        setTimeout(() => {
          this.status = ''
        }, 15000)
      })
    } catch (error) {
      runInAction(() => {
        console.error('createTransaction error', error, error.response)
        this.errorMessage = error.response.data
      })
      this.inprogress = false
      this.status = 'error'
      setTimeout(() => {
        this.status = ''
      }, 15000)
    }
  }


  @action
  async createPayoutVote(password) {
    try {
      this.inprogress = true
      const data = {
        payout: {
          recipient: this.payoutAddress,
          amount: this.payoutAmount,
        },
        password,
      }
      const response = await postPayoutVote(data)

      runInAction(() => {
        console.log('createPayoutVote response', response)
        this.reset()
        this.status = 'success'
        setTimeout(() => {
          this.status = ''
        }, 15000)
      })
    } catch (error) {
      runInAction(() => {
        console.error('createTransaction error', error, error.response)
        this.errorMessage = error.response.data
      })
      this.inprogress = false
      this.status = 'error'
      setTimeout(() => {
        this.status = ''
      }, 15000)
    }
  }

  @action
  updateAmountDisplay(amountDisplay) {
    this.payoutAmount = amountDisplay
  }

  @action
  updateAddressDisplay(addressDisplay) {
    this.payoutAddress = addressDisplay
  }

  reset() {
    this.allocationAmount = ''
    this.payoutAddress = ''
    this.payoutAmount = ''
    this.inprogress = false
    this.status = ''
    this.errorMessage = ''
  }
}

export default VoteStore
