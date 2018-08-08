// @flow

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Flexbox from 'flexbox-react'
import cx from 'classnames'
import base58 from 'bs58check'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import history from '../../services/history'
import routes from '../../constants/routes'
import { ref } from '../../utils/domUtils'
import { MAINNET } from '../../constants'
import ExternalLink from '../../components/ExternalLink'
import Layout from '../../components/Layout'
import PasteButton from '../../components/PasteButton'
import FormResponseMessage from '../../components/FormResponseMessage'
import RedeemTokensStore from '../../stores/redeemTokensStore'
import PublicAddressStore from '../../stores/publicAddressStore'
import NetworkStore from '../../stores/networkStore'

type Props = {
  redeemTokensStore: RedeemTokensStore,
  publicAddressStore: PublicAddressStore,
  networkStore: NetworkStore
};

@inject('redeemTokensStore', 'publicAddressStore', 'networkStore')
@observer
class Faucet extends Component<Props> {
  elPubkey: HTMLInputElement

  componentDidMount() {
    const { publicAddressStore, redeemTokensStore, networkStore } = this.props
    if (networkStore.chain === MAINNET) {
      console.warn('Main net should not access faucet, redirecting to balances')
      history.push(routes.PORTFOLIO)
    }
    publicAddressStore.fetch()
    redeemTokensStore.walletPublicAddress = publicAddressStore.address
  }


  onChange = (evt: SyntheticEvent<HTMLInputElement>) => {
    const pubkey = evt.currentTarget.value.trim()
    this.setAndValidatePubkey(pubkey)
  }

  onPasteClicked = (pubkey: string) => {
    this.setAndValidatePubkey(pubkey)
    this.elPubkey.focus()
  }

  setAndValidatePubkey(pubkey: string) {
    const { redeemTokensStore } = this.props
    redeemTokensStore.pubkeyBase58 = pubkey
    redeemTokensStore.status = ''

    try {
      const buffer = base58.decode(pubkey).slice(1)
      const result = buffer.toString('base64')

      redeemTokensStore.pubkeyError = false
      redeemTokensStore.pubkeyIsValid = true

      redeemTokensStore.pubkeyBase64 = result
      redeemTokensStore.checkCrowdsaleTokensEntitlement()
    } catch (e) {
      redeemTokensStore.pubkeyError = true
      redeemTokensStore.pubkeyIsValid = false
    }

    if (pubkey.length === 0) {
      redeemTokensStore.pubkeyError = false
      redeemTokensStore.pubkeyIsValid = false
    }
  }

  isSubmitButtonDisabled() {
    const { inprogress, redeemingTokens } = this.props.redeemTokensStore
    return redeemingTokens || inprogress || !this.isRedeemable
  }

  get isRedeemable() {
    const {
      anyOrders, alreadyRedeemed, amountRedeemable, pubkeyIsValid,
    } = this.props.redeemTokensStore
    return pubkeyIsValid && anyOrders && !alreadyRedeemed && amountRedeemable > 0
  }

  renderRedeemInnerButton() {
    const { redeemingTokens } = this.props.redeemTokensStore

    if (redeemingTokens) {
      return (
        <span>
          Redeeming Tokens
          <FontAwesomeIcon icon={['far', 'spinner']} spin />
        </span>
      )
    }
    return 'Redeem Tokens'
  }

  renderErrorMessage() {
    const { redeemTokensStore } = this.props

    if (redeemTokensStore.pubkeyError) {
      return (
        <div className="input-message error">
          <FontAwesomeIcon icon={['far', 'exclamation']} />
          <span>Invalid Public Key</span>
        </div>
      )
    }
  }

  renderRedeemMessage() {
    const {
      anyOrders, alreadyRedeemed, amountRedeemable, inprogress, pubkeyIsValid,
    } = this.props.redeemTokensStore

    if (pubkeyIsValid && !inprogress) {
      if (anyOrders && amountRedeemable > 0) {
        if (alreadyRedeemed) {
          return (
            <Flexbox flexGrow={1} flexDirection="row" className="form-response-message warning">
              <FontAwesomeIcon icon={['far', 'exclamation']} />
              <Flexbox flexDirection="column">
                Tokens have already been redeemed by this key
              </Flexbox>
            </Flexbox>
          )
        }
        return (
          <Flexbox flexGrow={1} flexDirection="row" className="form-response-message success">
            <FontAwesomeIcon icon={['far', 'check']} />
            <Flexbox flexDirection="row">
              <span>This key is entitled to</span>
              <span className="bold blue">&nbsp;{amountRedeemable.toLocaleString()} tokens</span>
            </Flexbox>
          </Flexbox>
        )
      }
      console.log('amountRedeemable', amountRedeemable)
      if (amountRedeemable === 0 || !anyOrders) {
        return (
          <Flexbox flexGrow={1} flexDirection="row" className="form-response-message warning">
            <FontAwesomeIcon icon={['far', 'exclamation']} />
            <Flexbox flexDirection="column">
              This Public Key is not entitled to any tokens
            </Flexbox>
          </Flexbox>
        )
      }
    }
  }

  renderCheckingEntitlementMessage() {
    const { checkingTokenEntitlement, pubkeyIsValid } = this.props.redeemTokensStore

    if (pubkeyIsValid && checkingTokenEntitlement) {
      return (
        <div className="input-message">
          <FontAwesomeIcon icon={['far', 'spinner']} spin />
          <span>Checking if this key is entitled to tokens</span>
        </div>
      )
    }
  }

  renderValidPubkeyMessage() {
    const { checkingTokenEntitlement, pubkeyIsValid } = this.props.redeemTokensStore

    if (pubkeyIsValid && !checkingTokenEntitlement) {
      return (
        <div className="input-message">
          <FontAwesomeIcon icon={['far', 'check']} />
          <span>Public key is valid</span>
        </div>
      )
    }
  }

  onRedeemButtonClicked = () => {
    const { publicAddressStore, redeemTokensStore } = this.props
    redeemTokensStore.walletPublicAddress = publicAddressStore.address
    this.props.redeemTokensStore.redeemCrowdsaleTokens()
  }

  renderSuccessResponse() {
    const { status, amountRedeemable } = this.props.redeemTokensStore

    if (status === 'success') {
      return (
        <FormResponseMessage className="success">
          <span>{(amountRedeemable / 100000000).toLocaleString()}
            {' '}tokens were sent to your wallet
          </span>
        </FormResponseMessage>
      )
    }
  }

  render() {
    const { pubkeyBase58, pubkeyError, pubkeyIsValid } = this.props.redeemTokensStore

    let pubkeyClassNames = ''
    if (pubkeyError) { pubkeyClassNames = cx('error', pubkeyClassNames) }
    if (pubkeyIsValid) { pubkeyClassNames = cx('is-valid', pubkeyClassNames) }

    return (
      <Layout className="faucet">
        <Flexbox flexDirection="column" className="faucet-container">

          <Flexbox flexDirection="column" className="page-title">
            <h1>Get Access to the Zen Protocol Software</h1>
            <h3>
              To gain access to the Zen Protocol software insert the key generated
              {' '}using our software sale wallet and redeem your tokens.
              <br />
              If you didn&apos;t save your key contact our support team at <a href="mailto:info@zenprotocol.com">info@zenprotocol.com</a> and we&apos;ll help you retrieve it
              <br />
              You can also retrieve it by visiting&nbsp;
              <ExternalLink
                link="https://crowdsale.zenprotocol.com/create-wallet/complete"
              >this link
              </ExternalLink> in the same browser you made your purchase from.
            </h3>
          </Flexbox>

          <Flexbox flexDirection="column" className="form-container">

            <Flexbox flexDirection="column" className="destination-address-input form-row">
              <label htmlFor="to">What is your public key?</label>
              <Flexbox flexDirection="row" className="public-key-input">

                <Flexbox flexDirection="column" className="full-width">
                  <input
                    id="pubkey"
                    ref={ref('elPubkey').bind(this)}
                    type="text"
                    className={pubkeyClassNames}
                    placeholder="Your Public Key"
                    onChange={this.onChange}
                    value={pubkeyBase58}
                    autoFocus
                  />
                  {this.renderErrorMessage()}
                  {this.renderCheckingEntitlementMessage()}
                  {this.renderValidPubkeyMessage()}
                </Flexbox>

                <PasteButton
                  className="button-on-right"
                  onClick={this.onPasteClicked}
                />
              </Flexbox>
            </Flexbox>
            <Flexbox>
              <h3 className="agree-to-terms">
                * By claiming your tokens you agree to the&nbsp;
                <ExternalLink
                  link="https://www.zenprotocol.com/legal/zen_protocol_token_sale_agreement.pdf"
                >Software License Terms
                </ExternalLink>.
              </h3>
            </Flexbox>

          </Flexbox>

          <Flexbox flexDirection="row">
            { this.renderRedeemMessage() }
            { this.renderSuccessResponse() }
            <Flexbox flexGrow={2} />
            <Flexbox flexGrow={1} justifyContent="flex-end" flexDirection="row">
              <button
                disabled={this.isSubmitButtonDisabled()}
                onClick={this.onRedeemButtonClicked}
              >
                {this.renderRedeemInnerButton()}
              </button>
            </Flexbox>
          </Flexbox>

        </Flexbox>
      </Layout>
    )
  }
}

export default Faucet
