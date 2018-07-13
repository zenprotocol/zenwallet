import React, { Component } from 'react'
import Flexbox from 'flexbox-react'
import { inject, observer } from 'mobx-react'
import { clipboard } from 'electron'
import cx from 'classnames'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import enforceSynced from '../../services/enforceSynced'
import confirmPasswordModal from '../../services/confirmPasswordModal'
import IsValidIcon from '../Icons/IsValidIcon'
import { isValidAddress } from '../../utils/helpers'
import { isZenAsset } from '../../utils/zenUtils'
import { ZENP_MAX_DECIMALS, ZENP_MIN_DECIMALS } from '../../constants'
import Layout from '../UI/Layout/Layout'
import AutoSuggestAssets from '../UI/AutoSuggestAssets/AutoSuggestAssets'
import FormResponseMessage from '../UI/FormResponseMessage/FormResponseMessage'
import AmountInput from '../UI/AmountInput/AmountInput'

@inject('balances', 'transaction')
@observer
class SendTx extends Component {
  static propTypes = {
    transaction: PropTypes.shape({
      asset: PropTypes.string,
      amount: PropTypes.number,
      amountDisplay: PropTypes.string,
      to: PropTypes.string,
      inprogress: PropTypes.bool,
      status: PropTypes.string,
      errorMessage: PropTypes.string,
      createTransaction: PropTypes.func,
    }).isRequired,
    balances: PropTypes.shape({
      fetch: PropTypes.func.isRequired,
      getBalanceFor: PropTypes.func.isRequired,
    }).isRequired,
  }
  state = {
    addressIsValid: false,
    addressError: false,
  }

  componentDidMount() {
    this.props.balances.fetch()
    this.validateAddressStates()
  }

  onDestinationAddressChanged = (evt) => {
    this.props.transaction.to = evt.target.value.trim()
    this.validateAddressStates()
  }

  validateAddressStates() {
    const { transaction } = this.props
    const value = transaction.to
    const addressIsValid = isValidAddress(value)
    this.setState({
      addressIsValid,
      addressError: (value.length > 0 && !addressIsValid),
    })
  }

  onPasteClicked = () => {
    this.props.transaction.to = clipboard.readText().trim()
    this.validateAddressStates()
    this['elem-to'].focus()
  }

  renderAddressErrorMessage() {
    if (this.state.addressError) {
      return (
        <div className="error input-message">
          <FontAwesomeIcon icon={['far', 'exclamation-circle']} />
          <span>Destination Address is invalid</span>
        </div>
      )
    }
  }

  onAddressBlur = () => { this.setState({ addressIsValid: false }) }
  onAddressFocus = () => { this.validateAddressStates() }

  // HELPER METHODS FOR ASSET AUTO SUGGGEST //

  updateAssetFromSuggestions = ({ asset }) => {
    const { transaction } = this.props
    transaction.updateAssetFromSuggestions(asset)
  }
  updateAmountDisplay = (amountDisplay) => {
    const { transaction } = this.props
    transaction.updateAmountDisplay(amountDisplay)
  }
  renderSuccessResponse() {
    if (this.props.transaction.status !== 'success') {
      return null
    }
    return (
      <FormResponseMessage className="success">
        <span>Transaction sent successfully.</span>
      </FormResponseMessage>
    )
  }

  renderErrorResponse() {
    const { status, errorMessage } = this.props.transaction
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

  onSubmitButtonClicked = async () => {
    const confirmedPassword = await confirmPasswordModal()
    if (!confirmedPassword) {
      return
    }
    this.props.transaction.createTransaction(confirmedPassword)
    this.AutoSuggestAssets.wrappedInstance.reset()
  }

  validateAmountField() {
    const { amount, asset } = this.props.transaction
    if (!amount) {
      return false
    }
    return amount <= this.props.balances.getBalanceFor(asset)
  }

  validateDestinationAddressField() {
    const value = this.props.transaction.to
    const addressIsValid = isValidAddress(value)
    return (value.length > 0) && addressIsValid
  }

  validateAllFields() {
    const { asset, to } = this.props.transaction
    return !!(asset && to && this.validateAmountField() && this.validateDestinationAddressField())
  }

  isSubmitButtonDisabled() {
    const allFieldsPresent = this.validateAllFields()
    if (allFieldsPresent) { return false }
    if (allFieldsPresent && this.props.transaction.inprogress) { return true }
    if (!allFieldsPresent) { return true }
  }
  render() {
    const {
      to, asset, amount, amountDisplay,
    } = this.props.transaction
    const { addressIsValid, addressError } = this.state

    let addressClassNames = (addressError ? 'error' : '')
    if (addressIsValid) { addressClassNames = cx('is-valid', addressClassNames) }

    return (
      <Layout className="send-tx">
        <Flexbox flexDirection="column" className="send-tx-container">

          <Flexbox className="page-title">
            <h1>Send</h1>
          </Flexbox>

          <Flexbox flexDirection="column" className="form-container">

            <Flexbox flexDirection="column" className="destination-address-input form-row">
              <label htmlFor="to">Destination Address</label>
              <Flexbox flexDirection="row" className="destination-address-input">

                <Flexbox flexDirection="column" className="full-width relative">
                  <input
                    id="to"
                    ref={(el) => { this['elem-to'] = el }}
                    name="to"
                    type="text"
                    placeholder="Destination address"
                    className={addressClassNames}
                    onChange={this.onDestinationAddressChanged}
                    value={to}
                    onBlur={this.onAddressBlur}
                    onFocus={this.onAddressFocus}
                    autoFocus
                  />
                  <IsValidIcon
                    isValid={isValidAddress(this.props.transaction.to)}
                    className="input-icon"
                    hasColors
                    isHidden={!to}
                  />
                  {this.renderAddressErrorMessage()}
                </Flexbox>
                <button
                  className="secondary button-on-right"
                  onClick={this.onPasteClicked}
                >Paste
                </button>
              </Flexbox>
            </Flexbox>
            <Flexbox flexDirection="row">
              <AutoSuggestAssets
                asset={asset}
                onUpdateParent={this.updateAssetFromSuggestions}
                ref={(el) => { this.AutoSuggestAssets = el }}
              />
              <AmountInput
                amount={amount}
                amountDisplay={amountDisplay}
                maxDecimal={isZenAsset(asset) ? ZENP_MAX_DECIMALS : 0}
                minDecimal={isZenAsset(asset) ? ZENP_MIN_DECIMALS : 0}
                maxAmount={asset ? this.props.balances.getBalanceFor(asset) : null}
                shouldShowMaxAmount
                exceedingErrorMessage="Insufficient Funds"
                onAmountDisplayChanged={this.updateAmountDisplay}
                label="Amount"
              />
            </Flexbox>
          </Flexbox>
          <Flexbox flexDirection="row">
            { this.renderSuccessResponse() }
            { this.renderErrorResponse() }
            <Flexbox flexGrow={2} />
            <Flexbox flexGrow={1} justifyContent="flex-end" flexDirection="row">
              <button
                className={cx('button-on-right', { loading: this.props.transaction.inprogress })}
                disabled={this.isSubmitButtonDisabled()}
                onClick={enforceSynced(this.onSubmitButtonClicked)}
              >
                {this.props.transaction.inprogress ? 'Sending' : 'Send'}
              </button>
            </Flexbox>
          </Flexbox>
        </Flexbox>
      </Layout>
    )
  }
}

export default SendTx
