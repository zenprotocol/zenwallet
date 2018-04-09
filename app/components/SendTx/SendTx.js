import React, { Component } from 'react'
import Flexbox from 'flexbox-react'
import { inject, observer } from 'mobx-react'
import { clipboard } from 'electron'
import cx from 'classnames'
import PropTypes from 'prop-types'

import { validateAddress } from '../../../utils/helpers'
import Layout from '../UI/Layout/Layout'
import AutoSuggestAssets from '../UI/AutoSuggestAssets/AutoSuggestAssets'
import FormResponseMessage from '../UI/FormResponseMessage/FormResponseMessage'
import AmountInput from '../UI/AmountInput/AmountInput'

@inject('balances')
@inject('transaction')
@observer
class SendTx extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        assetHash: PropTypes.string,
      }).isRequired,
    }).isRequired,
    transaction: PropTypes.shape({
      asset: PropTypes.string,
      amount: PropTypes.number,
      assetBalance: PropTypes.number,
      assetType: PropTypes.string,
      assetName: PropTypes.string,
      assetIsValid: PropTypes.bool,
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

  componentWillMount() {
    const { match, transaction } = this.props
    const { assetHash } = match.params
    if (assetHash) { transaction.asset = assetHash }
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
    const addressIsValid = validateAddress(value)
    this.setState({
      addressIsValid,
      addressError: (value.length > 0 && !addressIsValid)
    })
  }

  onPasteClicked() {
    this.props.transaction.to = clipboard.readText().trim()
    this.validateAddressStates()
    this['elem-to'].focus()
  }

  renderAddressErrorMessage() {
    if (this.state.addressError) {
      return (
        <div className="error-message">
          <i className="fa fa-exclamation-circle" />
          <span>Destination Address is invalid</span>
        </div>
      )
    }
  }

  onAddressBlur = () => { this.setState({ addressIsValid: false }) }
  onAddressFocus = () => { this.validateAddressStates() }

  // HELPER METHODS FOR ASSET AUTO SUGGGEST //

  updateAssetFromSuggestions = (data) => {
    const { transaction, balances } = this.props
    transaction.assetBalance = balances.getBalanceFor(data.asset)
    transaction.asset = data.asset
    transaction.assetType = data.assetType
    transaction.assetName = data.assetName
    transaction.assetIsValid = data.assetIsValid
  }

  onBlur = () => {
    this.refs.child.onAssetBlur()
  }

  onAssetFocus = () => {
    this.refs.child.onAssetFocus()
  }

  updateAmount = (data) => {
    const { transaction } = this.props
    transaction.amount = data.amount
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

  onSubmitButtonClicked() {
    this.props.transaction.createTransaction(this.props.transaction)
  }

  validateAmountField() {
    const { amount, assetBalance, assetIsValid } = this.props.transaction
    return (assetIsValid && amount <= assetBalance)
  }

  validateDestinationAddressField() {
    const value = this.props.transaction.to
    const addressIsValid = validateAddress(value)
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
      to, asset, assetName, status, amount, assetIsValid, assetBalance
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

                <Flexbox flexDirection="column" className="full-width">
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
                sendData={this.updateAssetFromSuggestions}
                asset={asset}
                assetName={assetName}
                onBlur={this.onBlur.bind(this)}
                onFocus={this.onAssetFocus.bind(this)}
                status={status}
              />
              <AmountInput
                normalize
                amount={amount}
                label="Amount"
                asset={asset}
                assetIsValid={assetIsValid}
                assetBalance={assetBalance}
                sendData={this.updateAmount}
                status={status}
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
                onClick={this.onSubmitButtonClicked}
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
