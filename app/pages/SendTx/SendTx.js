// @flow

import React, { Component } from 'react'
import Flexbox from 'flexbox-react'
import { inject, observer } from 'mobx-react'
import cx from 'classnames'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { Offline, Online } from 'react-detect-offline'
import QRCode from 'qrcode.react'

import SendTxStore from '../../stores/sendTxStore'
import PortfolioStore from '../../stores/portfolioStore'
import { isValidAddress } from '../../utils/helpers'
import { ref } from '../../utils/domUtils'
import { isZenAsset } from '../../utils/zenUtils'
import { ZENP_MAX_DECIMALS, ZENP_MIN_DECIMALS } from '../../constants'
import Layout from '../../components/Layout'
import IsValidIcon from '../../components/IsValidIcon'
import ProtectedButton from '../../components/Buttons'
import OfflineButton from '../../components/Buttons/OfflineButton'
import AutoSuggestAssets from '../../components/AutoSuggestAssets'
import FormResponseMessage from '../../components/FormResponseMessage'
import AmountInput from '../../components/AmountInput'
import PasteButton from '../../components/PasteButton'
import ResetButton from '../../components/ResetButton'
import Copy from '../../components/Copy'
import NetworkStore from '../../stores/networkStore'

type Props = {
  sendTxStore: SendTxStore,
  portfolioStore: PortfolioStore,
  networkStore: NetworkStore
};

type State = {
  isOfflineSent: boolean
};

@inject('portfolioStore', 'sendTxStore', 'networkStore')
@observer
class SendTx extends Component<Props, State> {
  state = {
    isOfflineSent: false,
  }
  componentDidMount() {
    this.props.portfolioStore.fetch()
  }

  onToChanged = (evt: SyntheticEvent<HTMLInputElement>) => {
    this.props.sendTxStore.to = evt.currentTarget.value.trim()
    this.state.isOfflineSent = false
  }

  onReset = () => {
    this.setState({ isOfflineSent: false })
    this.AutoSuggestAssets.wrappedInstance.reset()
  }

  onWrappedInstanceReset = () => {
    const { sendTxStore } = this.props
    sendTxStore.resetForm()
    this.AutoSuggestAssets.wrappedInstance.reset()
  }

  onPasteClicked = (clipboardContents: string) => {
    this.props.sendTxStore.to = clipboardContents
    // $FlowFixMe
    this.elTo.focus()
  }

  get isToInvalid() {
    const { to } = this.props.sendTxStore
    return to.length && !isValidAddress(to,this.props.networkStore.chainUnformatted)
  }

  renderAddressErrorMessage() {
    if (this.isToInvalid) {
      return (
        <div className="error input-message">
          <FontAwesomeIcon icon={['far', 'exclamation-circle']} />
          <span>Destination Address is invalid</span>
        </div>
      )
    }
  }

  updateAssetFromSuggestions = ({ asset }: { asset: string }) => {
    const { sendTxStore } = this.props
    sendTxStore.updateAssetFromSuggestions(asset)
  }
  updateAmountDisplay = (amountDisplay: string) => {
    const { sendTxStore } = this.props
    sendTxStore.updateAmountDisplay(amountDisplay)
  }
  renderSuccessResponse() {
    if (this.props.sendTxStore.status !== 'success') {
      return null
    }
    return (
      <FormResponseMessage className="success">
        <span>Transaction sent successfully.</span>
      </FormResponseMessage>
    )
  }

  renderErrorResponse() {
    const { status, errorMessage } = this.props.sendTxStore
    if (status !== 'error') {
      return null
    }
    return (
      <FormResponseMessage className="error">
        <span>There was a problem with sending the transaction.</span>
        <span className="devider" />
        <p>Error message: {errorMessage}</p>
      </FormResponseMessage>
    )
  }

  renderRawTransactionBox(response) {
    return (
      this.state.isOfflineSent &&
      <Offline>
        <Flexbox flexDirection="column" className="offline-container">
          <div className="input-container">
            <Copy valueToCopy={response}>
              <Copy.Label>Raw Transaction: </Copy.Label>
              <Flexbox flexDirection="row" className="offline-button form-row">
                <Copy.Input className="full-width input-container" />
                <Copy.Button className="button-on-right" />
                <ResetButton onClick={this.onReset} className="button-on-right" />
              </Flexbox>
              <Copy.ActiveMsg>
                <Flexbox>
                  <div className="bright-blue copied-to-clipboard-message">Raw transaction copied to clipboard</div>
                </Flexbox>
              </Copy.ActiveMsg>
            </Copy>
          </div>
          <div className="input-container">
            <h2 className="qrcode-text">Scan this to publish the transaction via the block explorer</h2>
            <QRCode className="qrcode" value={this.explorerLink(response)} size={256} level="H" />
          </div>
        </Flexbox>
      </Offline>
    )
  }

  explorerLink(response) {
    return `https://zp.io/broadcastTx/${response}`
  }

  onSubmitButtonClicked = async (confirmedPassword: string) => {
    this.props.sendTxStore.createTransaction(confirmedPassword)
    // $FlowFixMe
    this.AutoSuggestAssets.wrappedInstance.reset()
  }

  onSubmitOfflineButtonClicked = async (confirmedPassword: string) => {
    this.state.isOfflineSent = true
    this.props.sendTxStore.createRawTransaction(confirmedPassword)
      .then(() => this.renderRawTransactionBox(this.props.sendTxStore.offlineResponse))
      .catch((error) => error)
  }

  get isAmountValid() {
    const { amount, asset } = this.props.sendTxStore
    return amount && (amount <= this.props.portfolioStore.getBalanceFor(asset))
  }

  get isToValid() {
    const { to } = this.props.sendTxStore
    return (to.length > 0) && isValidAddress(to, this.props.networkStore.chainUnformatted)
  }

  get areAllFieldsValid() {
    const { asset, to } = this.props.sendTxStore
    return !!(asset && to && this.isAmountValid && this.isToValid)
  }

  get isSubmitButtonDisabled() {
    const { inprogress } = this.props.sendTxStore
    return inprogress || !this.areAllFieldsValid
  }

  render() {
    const {
      portfolioStore,
      sendTxStore: {
        to, asset, amount, amountDisplay, inprogress,
      },
    } = this.props

    return (
      <Layout className="send-tx">
        <Flexbox flexDirection="column" className="send-tx-container">

          <Flexbox className="page-title">
            <Online><h1>Send</h1></Online>
            <Offline><h1>Send ( Offline Mode )</h1></Offline>
          </Flexbox>

          <Flexbox flexDirection="column" className="form-container">

            <Flexbox flexDirection="column" className="destination-address-input form-row">
              <label htmlFor="to">Destination Address</label>
              <Flexbox flexDirection="row" className="destination-address-input">

                <Flexbox flexDirection="column" className="full-width relative">
                  <input
                    id="to"
                    ref={ref('elTo').bind(this)}
                    name="to"
                    type="text"
                    placeholder="Destination address"
                    className={cx({ 'is-valid': this.isToValid, error: this.isToInvalid })}
                    onChange={this.onToChanged}
                    value={to}
                    autoFocus
                  />
                  <IsValidIcon
                    isValid={isValidAddress(to, this.props.networkStore.chainUnformatted)}
                    className="input-icon"
                    hasColors
                    isHidden={!to}
                  />
                  {this.renderAddressErrorMessage()}
                </Flexbox>
                <PasteButton
                  className="button-on-right"
                  onClick={this.onPasteClicked}
                />
              </Flexbox>
            </Flexbox>
            <Flexbox flexDirection="row">
              {/* $FlowIssue */}
              <AutoSuggestAssets
                asset={asset}
                onUpdateParent={this.updateAssetFromSuggestions}
                ref={ref('AutoSuggestAssets').bind(this)}
              />
              <AmountInput
                amount={amount}
                amountDisplay={amountDisplay}
                maxDecimal={isZenAsset(asset) ? ZENP_MAX_DECIMALS : 0}
                minDecimal={isZenAsset(asset) ? ZENP_MIN_DECIMALS : 0}
                maxAmount={asset ? portfolioStore.getBalanceFor(asset) : null}
                shouldShowMaxAmount
                exceedingErrorMessage="Insufficient Funds"
                onAmountDisplayChanged={this.updateAmountDisplay}
                label="Amount"
              />
            </Flexbox>
          </Flexbox>
          <Flexbox className="middle-nav">
            { this.renderRawTransactionBox(this.props.sendTxStore.offlineResponse) }
          </Flexbox>
          <Flexbox flexDirection="row">
            <Online>{ this.renderSuccessResponse() }</Online>
            { this.renderErrorResponse() }
            <Flexbox flexGrow={2} />
            <Flexbox flexGrow={1} justifyContent="flex-end" flexDirection="row">
              <Online>
                <ProtectedButton
                  className={cx('button-on-right', { loading: inprogress })}
                  disabled={this.isSubmitButtonDisabled}
                  onClick={this.onSubmitButtonClicked}
                >
                  {inprogress ? 'Sending' : 'Send'}
                </ProtectedButton>
              </Online>
              <Offline>
                { !this.state.isOfflineSent &&
                <OfflineButton
                  className={cx('button-on-right', { loading: inprogress })}
                  disabled={this.isSubmitButtonDisabled}
                  onClick={this.onSubmitOfflineButtonClicked}
                >
                  {inprogress ? 'Generating' : 'Generate Raw Transaction'}
                </OfflineButton> }
                { !this.state.isOfflineSent && <ResetButton onClick={this.onWrappedInstanceReset} className="button-on-right" /> }
              </Offline>
            </Flexbox>
          </Flexbox>
        </Flexbox>
      </Layout>
    )
  }
}

export default SendTx
