import React, { Component } from 'react'
import Flexbox from 'flexbox-react'
import { inject, observer } from 'mobx-react'
import { clipboard } from 'electron'
import { toInteger } from 'lodash'
import PropTypes from 'prop-types'

import confirmPasswordModal from '../../services/confirmPasswordModal'
import enforceSynced from '../../services/enforceSynced'
import db from '../../services/store'
import { isZenAsset } from '../../utils/zenUtils'
import Layout from '../UI/Layout/Layout'
import AutoSuggestAssets from '../UI/AutoSuggestAssets/AutoSuggestAssets'
import AutoSuggestActiveContracts from '../UI/AutoSuggestActiveContracts'
import FormResponseMessage from '../UI/FormResponseMessage/FormResponseMessage'
import AmountInput from '../UI/AmountInput/AmountInput'
import { ZENP_MAX_DECIMALS, ZENP_MIN_DECIMALS } from '../../constants'

// TODO [AdGo] 12/05/2018 - get from contracts store after refactor
const savedContracts = db.get('savedContracts').value()

@inject('activeContractSet', 'balances', 'runContractState')
@observer
class RunContract extends Component {
  static propTypes = {
    activeContractSet: PropTypes.shape({
      activeContractsWithNames: PropTypes.array,
    }).isRequired,
    runContractState: PropTypes.shape({
      address: PropTypes.string,
      asset: PropTypes.string,
      amount: PropTypes.number,
      amountDisplay: PropTypes.string,
      command: PropTypes.string,
      data: PropTypes.string,
      contractName: PropTypes.string,
      status: PropTypes.string,
      inprogress: PropTypes.bool,
      run: PropTypes.func.isRequired,
    }).isRequired,
    balances: PropTypes.shape({
      getBalanceFor: PropTypes.func,
    }).isRequired,
  }

  componentWillUnmount() {
    const { runContractState } = this.props
    if (runContractState.status === 'success' || runContractState.status === 'error') {
      runContractState.resetForm()
    }
  }

  onDataChanged = (evt) => {
    const { runContractState } = this.props
    runContractState.data = evt.target.value.trim()
  }

  onAmountChanged = (evt) => {
    const { runContractState } = this.props
    if (evt.target.value) {
      runContractState.amount = toInteger(evt.target.value.trim())
    } else {
      runContractState.amount = undefined
    }
  }

  onCommandChanged = (evt) => {
    const { runContractState } = this.props
    runContractState.command = evt.target.value.trim()
  }

  onPasteClicked = () => {
    const { runContractState } = this.props
    runContractState.address = clipboard.readText()
  }

  onRunContractClicked = async () => {
    const confirmedPassword = await confirmPasswordModal()
    if (!confirmedPassword) {
      return
    }
    const { runContractState } = this.props
    runContractState.run(confirmedPassword)
    this.AutoSuggestAssets.wrappedInstance.reset()
    this.AutoSuggestActiveContracts.reset()
  }

  renderSuccessResponse() {
    const { runContractState } = this.props
    if (runContractState.status !== 'success') {
      return null
    }
    return (
      <FormResponseMessage className="success">
        <span>Contract has been run successfully</span>
      </FormResponseMessage>
    )
  }

  renderErrorResponse() {
    const { runContractState } = this.props
    if (runContractState.status !== 'error') {
      return null
    }
    return (
      <FormResponseMessage className="error">
        <span>
          Couldn&apos;t run the contract with the parameters you entered.
        </span>
        <div className="devider" />
        <p>Error message: {runContractState.errorMessage}</p>
      </FormResponseMessage>
    )
  }

  // HELPER METHODS FOR CONTRACT ADDRESS AUTO SUGGGEST //
  updateContractAddressFromSuggestions = ({ address }) => {
    const { runContractState } = this.props
    runContractState.updateAddress(address)
  }

  // HELPER METHODS FOR ASSET AUTO SUGGGEST //
  updateAssetFromSuggestions = ({ asset }) => {
    const { runContractState } = this.props
    runContractState.asset = asset
    runContractState.amountDisplay = ''
  }

  isAmountValid() {
    const { amount, asset } = this.props.runContractState
    if (!asset) {
      return true
    }
    if (!amount) {
      return false
    }
    return amount <= this.props.balances.getBalanceFor(asset)
  }

  updateAmountDisplay = (amountDisplay) => {
    const { runContractState } = this.props
    runContractState.updateAmountDisplay(amountDisplay)
  }

  validateForm() {
    return !!this.props.runContractState.address && this.isAmountValid()
  }

  isSubmitButtonDisabled() {
    const formIsValid = this.validateForm()
    if (formIsValid && this.props.runContractState.inprogress) { return true }
    if (!formIsValid) { return true }
    if (formIsValid) { return false }
  }

  render() {
    const {
      command, amount, asset, inprogress, data, address, amountDisplay,
    } = this.props.runContractState
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
              <Flexbox flexDirection="row" className="command-input">
                <input
                  id="command"
                  className="full-width"
                  name="command"
                  type="text"
                  placeholder="Enter Command"
                  value={command}
                  onChange={this.onCommandChanged}
                />
              </Flexbox>
            </Flexbox>
            <Flexbox flexDirection="row" className="contract-message-details form-row">
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
                onClick={enforceSynced(this.onRunContractClicked)}
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
