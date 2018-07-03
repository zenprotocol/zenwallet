import { observable, action, runInAction } from 'mobx'

import { logApiError } from '../utils/apiUtils'
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
    } catch (err) {
      logApiError('check crowdsale tokens entitlement', err)
      runInAction(() => {
        this.checkingTokenEntitlement = false
        this.inprogress = false
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
          db.set('config.alreadyRedeemedTokens', true).write()
          this.resetForm()
          this.status = response.status
          this.amountRedeemable = response.tokens_sent
          setTimeout(() => {
            this.status = ''
          }, 15000)
        } else {
          logApiError('redeem crowdsale tokens response', response)
        }
      })
    } catch (err) {
      runInAction(() => {
        this.inprogress = false
        this.redeemingTokens = false
        logApiError('redeem crowdsale tokens catch', err)
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
}

export default RedeemTokensState
