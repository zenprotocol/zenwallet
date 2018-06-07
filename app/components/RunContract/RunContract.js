import React, { Component } from 'react'
import Flexbox from 'flexbox-react'
import { inject, observer } from 'mobx-react'
import { clipboard } from 'electron'
import { toInteger } from 'lodash'
import PropTypes from 'prop-types'

import confirmPasswordModal from '../../services/confirmPasswordModal'
import db from '../../services/store'
import { stringToNumber, isZenAsset } from '../../utils/helpers'
import Layout from '../UI/Layout/Layout'
import AutoSuggestAssets from '../UI/AutoSuggestAssets/AutoSuggestAssets'
import AutoSuggestActiveContracts from '../UI/AutoSuggestActiveContracts'
import AutoSuggestContractCommands from '../UI/AutoSuggestContractCommands'
import FormResponseMessage from '../UI/FormResponseMessage/FormResponseMessage'
import AmountInput from '../UI/AmountInput/AmountInput'
import { ZENP_MAX_DECIMALS } from '../../constants'

// TODO [AdGo] 12/05/2018 - get from contracts store after refactor
const savedContracts = db.get('savedContracts').value()

@inject('activeContractSet')
@inject('balances')
@inject('contractMessage')
@observer
class RunContract extends Component {
  static propTypes = {
    activeContractSet: PropTypes.shape({
      activeContractsWithNames: PropTypes.array,
    }).isRequired,
    contractMessage: PropTypes.shape({
      address: PropTypes.string,
      asset: PropTypes.string,
      amount: PropTypes.string,
      command: PropTypes.string,
      data: PropTypes.string,
      contractName: PropTypes.string,
      status: PropTypes.string,
      inprogress: PropTypes.bool,
      sendContractMessage: PropTypes.func,
    }).isRequired,
    balances: PropTypes.shape({
      // TODO [AdGo] 14/05/2018 - enfore one type after refactoring types
      zen: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      getBalanceFor: PropTypes.func,
    }).isRequired,
  }

  componentWillUnmount() {
    const { contractMessage } = this.props
    if (contractMessage.status === 'success' || contractMessage.status === 'error') {
      contractMessage.resetForm()
    }
  }

  onDataChanged = (evt) => {
    const { contractMessage } = this.props
    contractMessage.data = evt.target.value.trim()
  }

  onAmountChanged = (evt) => {
    const { contractMessage } = this.props
    if (evt.target.value) {
      contractMessage.amount = toInteger(evt.target.value.trim())
    } else {
      contractMessage.amount = undefined
    }
  }

  onCommandChanged = (command) => {
    const { contractMessage } = this.props
    contractMessage.command = command.trim()
  }

  onPasteClicked = () => {
    const { contractMessage } = this.props
    contractMessage.address = clipboard.readText()
  }

  onRunContractClicked = async () => {
    const confirmedPassword = await confirmPasswordModal()
    if (!confirmedPassword) {
      return
    }
    const { contractMessage } = this.props
    contractMessage.sendContractMessage(confirmedPassword)
    this.AutoSuggestAssets.wrappedInstance.reset()
    this.AutoSuggestActiveContracts.reset()
  }

  renderSuccessResponse() {
    const { contractMessage } = this.props
    if (contractMessage.status !== 'success') {
      return null
    }
    return (
      <FormResponseMessage className="success">
        <span>Contract has been run successfully</span>
      </FormResponseMessage>
    )
  }

  renderErrorResponse() {
    const { contractMessage } = this.props
    if (contractMessage.status !== 'error') {
      return null
    }
    return (
      <FormResponseMessage className="error">
        <span>
          Couldn&apos;t run the contract with the parameters you entered.
        </span>
        <div className="devider" />
        <p>Error message: {contractMessage.errorMessage}</p>
      </FormResponseMessage>
    )
  }

  // HELPER METHODS FOR CONTRACT ADDRESS AUTO SUGGGEST //
  updateContractAddressFromSuggestions = ({ address }) => {
    const { contractMessage } = this.props
    contractMessage.updateAddress(address)
  }

  onContractAddressBlur = () => this.refs.child.onContractAddressBlur()
  onContractAddressFocus = () => this.refs.child.onContractAddressFocus()

  // HELPER METHODS FOR ASSET AUTO SUGGGEST //
  updateAssetFromSuggestions = ({ asset }) => {
    const { contractMessage } = this.props
    contractMessage.asset = asset
    contractMessage.amount = ''
  }

  isAmountValid() {
    const { amount, asset } = this.props.contractMessage
    if (!asset) {
      return true
    }
    if (!amount) {
      return false
    }
    return stringToNumber(amount) <= stringToNumber(this.props.balances.getBalanceFor(asset))
  }

  updateAmount = (amount) => {
    const { contractMessage } = this.props
    contractMessage.amount = amount
  }

  validateForm() {
    return !!this.props.contractMessage.address && this.isAmountValid()
  }

  isSubmitButtonDisabled() {
    const formIsValid = this.validateForm()
    if (formIsValid && this.props.contractMessage.inprogress) { return true }
    if (!formIsValid) { return true }
    if (formIsValid) { return false }
  }

  render() {
    const {
      amount, asset, inprogress, data, address,
    } = this.props.contractMessage
    const { activeContractsWithNames } = this.props.activeContractSet
    return (
      <Layout className="run-contract">
        <Flexbox flexDirection="column" className="send-tx-container">
          <Flexbox flexDirection="column" className="page-title">
            <h1>Run Contract</h1>
            <h3>
              A contract must be in the <span className="bold">Active Contract Set</span>
              in order to run it.
            </h3>
          </Flexbox>
          <Flexbox flexDirection="column" className="form-container">
            <AutoSuggestActiveContracts
              activeContracts={activeContractsWithNames}
              savedContracts={savedContracts}
              initialSuggestionInputValue={address}
              onUpdateParent={this.updateContractAddressFromSuggestions}
              ref={(el) => { this.AutoSuggestActiveContracts = el }}
            />
            <Flexbox flexDirection="column" className="choose-command form-row">
              <label htmlFor="command">Choose command</label>
              <AutoSuggestContractCommands onChange={this.onCommandChanged} />
            </Flexbox>
            <Flexbox flexDirection="row" className="contract-message-details form-row">
              <AutoSuggestAssets
                asset={asset}
                onUpdateParent={this.updateAssetFromSuggestions}
                ref={(el) => { this.AutoSuggestAssets = el }}
              />
              <AmountInput
                amount={amount}
                maxDecimal={isZenAsset(asset) ? ZENP_MAX_DECIMALS : 0}
                maxAmount={asset ? this.props.balances.getBalanceFor(asset) : null}
                shouldShowMaxAmount
                exceedingErrorMessage="Insufficient Funds"
                onUpdateParent={this.updateAmount}
                label="Amount"
              />
            </Flexbox>
            <Flexbox flexDirection="column" className="message-data">
              <label htmlFor="data">Data</label>
              <textarea
                rows="4"
                cols="50"
                id="data"
                name="data"
                type="text"
                placeholder="Paste message data here"
                value={data}
                onChange={this.onDataChanged}
              />
            </Flexbox>
          </Flexbox>
          <Flexbox flexDirection="row">
            { this.renderSuccessResponse() }
            { this.renderErrorResponse() }
            <Flexbox flexGrow={2} />
            <Flexbox flexGrow={1} justifyContent="flex-end" flexDirection="row">
              <button
                disabled={this.isSubmitButtonDisabled()}
                onClick={this.onRunContractClicked}
              >
                {inprogress ? 'Running' : 'Run'}
              </button>
            </Flexbox>
          </Flexbox>
        </Flexbox>
      </Layout>
    )
  }
}

export default RunContract
