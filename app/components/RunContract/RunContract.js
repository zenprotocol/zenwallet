import React, { Component } from 'react'
import Flexbox from 'flexbox-react'
import { inject, observer } from 'mobx-react'
import Checkbox from 'rc-checkbox'

import ActiveContractSetState from '../../states/acs-state'
import RunContractSetState from '../../states/run-contract-state'
import BalancesState from '../../states/balances-state'
import confirmPasswordModal from '../../services/confirmPasswordModal'
import enforceSynced from '../../services/enforceSynced'
import db from '../../services/store'
import { isZenAsset } from '../../utils/zenUtils'
import Layout from '../UI/Layout/Layout'
import ResetButton from '../UI/ResetButton'
import AutoSuggestAssets from '../UI/AutoSuggestAssets/AutoSuggestAssets'
import AutoSuggestActiveContracts from '../UI/AutoSuggestActiveContracts'
import FormResponseMessage from '../UI/FormResponseMessage/FormResponseMessage'
import AmountInput from '../UI/AmountInput/AmountInput'
import { ZENP_MAX_DECIMALS, ZENP_MIN_DECIMALS } from '../../constants'

// TODO [AdGo] 12/05/2018 - get from contracts store after refactor
const savedContracts = db.get('savedContracts').value()

type Props = {
  activeContractSet: ActiveContractSetState,
  runContractState: RunContractSetState,
  balances: BalancesState
};

@inject('activeContractSet', 'balances', 'runContractState')
@observer
class RunContract extends Component<Props> {
  componentWillUnmount() {
    const { runContractState } = this.props
    if (runContractState.status.match(/success|error/)) {
      runContractState.resetForm()
    }
  }

  onMessageBodyChanged = (evt) => {
    const { runContractState } = this.props
    runContractState.updateMessageBody(evt.target.value)
  }

  onCommandChanged = (evt) => {
    const { runContractState } = this.props
    runContractState.command = evt.target.value.trim()
  }

  onRunContractClicked = async () => {
    const confirmedPassword = await confirmPasswordModal()
    if (!confirmedPassword) {
      return
    }
    const { runContractState } = this.props
    runContractState.run(confirmedPassword)
    this.resetHack()
  }

  // TODO [AdGo] 18/07/2018 - manage these components state by passing props,
  // probably by getDerivedStateFromProps https://reactjs.org/docs/react-component.html#static-getderivedstatefromprops
  resetHack() {
    this.AutoSuggestAssets.wrappedInstance.reset()
    this.AutoSuggestActiveContracts.reset()
  }
  // TODO [AdGo] 18/07/2018 - call runContractState.resetForm() from button directly
  // after refactoring resetHack
  reset = () => {
    this.props.runContractState.resetForm()
    this.resetHack()
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
    runContractState.updateAmountDisplay('')
  }

  get isAmountValid() {
    const { amount, asset } = this.props.runContractState
    return !asset || amount <= this.props.balances.getBalanceFor(asset)
  }

  updateAmountDisplay = (amountDisplay) => {
    const { runContractState } = this.props
    runContractState.updateAmountDisplay(amountDisplay)
  }

  get isFormValid() {
    const { runContractState } = this.props
    return !!runContractState.address && !runContractState.messageBodyError && this.isAmountValid
  }

  isSubmitButtonDisabled() {
    const { runContractState } = this.props
    return runContractState.inprogress || !this.isFormValid
  }

  render() {
    const {
      command, amount, asset, inprogress, messageBody, address, amountDisplay, messageBodyError,
      returnAddress, toggleReturnAddress,
    } = this.props.runContractState
    const { activeContractsWithNames } = this.props.activeContractSet
    return (
      <Layout className="run-contract">
        <Flexbox flexDirection="column" className="send-tx-container">
          <Flexbox flexDirection="column" className="page-title">
            <h1>Run Contract</h1>
            <h3>
              A contract must be in the <span className="bold">Active Contract Set</span>{' '}
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
            <Flexbox flexDirection="column" className="message-body">
              <label htmlFor="messageBody">Body</label>
              <textarea
                rows="4"
                cols="50"
                id="messageBody"
                name="messageBody"
                type="text"
                placeholder="Paste message body here"
                value={messageBody}
                onChange={this.onMessageBodyChanged}
              />
              {messageBodyError && <div className="error-msg">{messageBodyError}</div>}
              <label className="checkbox">
                <Checkbox type="checkbox" checked={returnAddress} onChange={toggleReturnAddress} />
                <span className="checkbox-text">
                &nbsp; Include return address
                </span>
              </label>
            </Flexbox>
          </Flexbox>
          <Flexbox flexDirection="row">
            { this.renderSuccessResponse() }
            { this.renderErrorResponse() }
            <Flexbox flexGrow={2} />
            <Flexbox flexGrow={1} justifyContent="flex-end" flexDirection="row">
              <ResetButton onClick={this.reset} />
              <button
                className="button-on-right"
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
