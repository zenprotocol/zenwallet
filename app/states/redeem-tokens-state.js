import { observable, action, runInAction } from 'mobx'

import { MAINNET } from '../constants'
import { getCheckCrowdsaleTokensEntitlement, postRedeemCrowdsaleTokens } from '../services/api-service'
import db from '../services/store'

class RedeemTokensState {
  @observable pubkeyBase64 = ''
  @observable pubkeyBase58 = ''
  @observable walletPublicAddress = ''
  @observable status
  @observable amountRedeemable
  @observable alreadyRedeemed = false
  @observable anyOrders = false
  @observable inprogress = false
  @observable checkingTokenEntitlement = false
  @observable redeemingTokens = false
  @observable pubkey = false
  @observable pubkeyIsValid = false

  constructor(networkState) {
    this.networkState = networkState
  }
  @action
  async checkCrowdsaleTokensEntitlement() {
    this.inprogress = true
    this.checkingTokenEntitlement = true

    try {
      const response =
        await getCheckCrowdsaleTokensEntitlement(this.pubkeyBase64, this.pubkeyBase58)
      runInAction(() => {
        console.log('getCheckCrowdsaleTokensEntitlement response', response)
        this.anyOrders = response.any_orders
        this.alreadyRedeemed = response.already_redeemed
        this.amountRedeemable = response.amount_redeemable
        this.inprogress = false
        this.checkingTokenEntitlement = false
      })
    } catch (error) {
      this.checkingTokenEntitlement = false
      this.inprogress = false
      runInAction(() => {
        console.log('getCheckCrowdsaleTokensEntitlement error', error)
      })
    }
  }


  @action
  async redeemCrowdsaleTokens() {
    this.inprogress = true
    this.redeemingTokens = true

    this.anyOrders = false
    this.alreadyRedeemed = false

    try {
      const response = await postRedeemCrowdsaleTokens({
        pubkey_base_64: this.pubkeyBase64,
        pubkey_base_58: this.pubkeyBase58,
        wallet_public_address: this.walletPublicAddress,
      })
      runInAction(() => {
        this.inprogress = false
        this.redeemingTokens = false
        if (response.status === 'success') {
          console.log('postRedeemCrowdsaleTokens response.status', response.status)
          db.set('config.alreadyRedeemedTokens', true).write()
          this.resetForm()
          this.status = response.status
          this.amountRedeemable = response.tokens_sent
          setTimeout(() => {
            this.status = ''
          }, 15000)
        } else {
          console.log('postRedeemCrowdsaleTokens error')
        }
        console.log('postRedeemCrowdsaleTokens response', response)
      })
    } catch (error) {
      runInAction(() => {
        this.inprogress = false
        this.redeemingTokens = false
        console.log('postRedeemCrowdsaleTokens error', error)
      })
    }
  }

  @action
  resetForm() {
    this.pubkeyBase64 = ''
    this.pubkeyBase58 = ''
    this.status = ''
    this.amountRedeemable = ''
    this.alreadyRedeemed = false
    this.anyOrders = false
    this.inprogress = false
    this.checkingTokenEntitlement = false
    this.redeemingTokens = false

    this.pubkey = false
    this.pubkeyIsValid = false
  }

  get shouldRedeemNonMainnetTokens() {
    const alreadyRedeemedTokens = db.get('config.alreadyRedeemedTokens').value()
    return this.isFaucetActive && !alreadyRedeemedTokens
  }
  get isFaucetActive() {
    return this.networkState.chain !== MAINNET
  }
}

export default RedeemTokensState
