import React, {Component} from 'react'
import autobind from 'class-autobind'
import {Link} from 'react-router-dom'
import Flexbox from 'flexbox-react'
import {inject, observer} from 'mobx-react'
import {clipboard} from 'electron'
import {toInteger} from 'lodash'
import Autosuggest from 'react-autosuggest'
import classnames from 'classnames'

import {truncateString, validateAddress} from '../../../utils/helpers'

import Layout from '../UI/Layout/Layout'
import AutoSuggestAssets from '../UI/AutoSuggestAssets/AutoSuggestAssets'
import FormResponseMessage from '../UI/FormResponseMessage/FormResponseMessage'
import AmountInput from '../UI/AmountInput/AmountInput'

@inject('balances')
@inject('transaction')
@observer
class SendTx extends Component {

	constructor() {
		super()

		this.state = {
			addressIsValid: false,
			addressError: false,
			assetBalance: 0
		}

		autobind(this)
	}

	componentWillMount() {
		const {match, transaction} = this.props

		const {assetHash} = match.params
		if (assetHash) { transaction.asset = assetHash }
	}

	componentDidMount() {
    const {balances} = this.props
    balances.fetch()
		this.validateAddressStates()
  }

	onDestinationAddressChanged(event) {
		const {transaction} = this.props
		const value = event.target.value.trim()
		const addressIsValid = validateAddress(value)
		transaction.to = value
		this.validateAddressStates()
	}

	validateAddressStates() {
		const {transaction} = this.props
		const value = transaction.to
		const addressIsValid = validateAddress(value)
		this.setState({
			addressIsValid: addressIsValid,
			addressError: (value.length > 0 && !addressIsValid)
		})
	}

	onPasteClicked() {
		const {transaction} = this.props
		transaction.to = clipboard.readText().trim()

		this.validateAddressStates()

		this.refs.to.focus()
	}

	renderAddressErrorMessage() {
    if (this.state.addressError) {
      return (
        <div className='error-message'>
          <i className="fa fa-exclamation-circle"></i>
          <span>Destination Address is invalid</span>
        </div>
      )
    }
  }

	onAddressBlur() { this.setState({ addressIsValid: false }) }
	onAddressFocus() { this.validateAddressStates() }


	// HELPER METHODS FOR ASSET AUTO SUGGGEST //

	updateAssetFromSuggestions = (data) => {
		const {transaction, balances} = this.props
		transaction.assetBalance = balances.getBalanceFor(data.asset)
		transaction.asset = data.asset
		transaction.assetType = data.assetType
		transaction.assetName = data.assetName
		transaction.assetIsValid = data.assetIsValid
	}

	onBlur() { this.refs.child.onAssetBlur() }
	onAssetFocus() { this.refs.child.onAssetFocus() }


  // AMOUNT INPUT //

	updateAmount = (data) => {
		const {transaction} = this.props
		transaction.amount = Math.floor(data.amount * 100000000)
	}


	render() {
		const {transaction} = this.props
		const {to, asset, assetName, status, amount, assetIsValid, assetBalance} = this.props.transaction
		const {addressIsValid, addressError} = this.state

		let addressClassNames = (addressError ? 'error' : '' )
		if (addressIsValid) { addressClassNames = classnames('is-valid', addressClassNames) }

		return (
			<Layout className="send-tx">
				<Flexbox flexDirection="column" className="send-tx-container">

					<Flexbox className='page-title'>
						<h1>Send</h1>
					</Flexbox>

					<Flexbox flexDirection="column" className="form-container">

						<Flexbox flexDirection="column" className='destination-address-input form-row'>
							<label htmlFor='to'>Destination Address</label>
							<Flexbox flexDirection="row" className='destination-address-input'>

								<Flexbox flexDirection="column" className='full-width'>
									<input
										id='to'
										ref='to'
										name='to'
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
									className="button secondary button-on-right"
									onClick={this.onPasteClicked}>
									Paste
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
								normalize={true}
								amount={amount}
								label='Amount'
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
						<Flexbox flexGrow={2}></Flexbox>
						<Flexbox flexGrow={1} justifyContent='flex-end' flexDirection="row">
							<button
								className={this.submitButtonClassNames()}
								disabled={this.isSubmitButtonDisabled()}
								onClick={this.onSubmitButtonClicked}
							>
								{this.renderSubmitButtonText()}
							</button>
						</Flexbox>
					</Flexbox>

				</Flexbox>
			</Layout>
		)
	}


	renderSuccessResponse() {
		const {status} = this.props.transaction
		if (status == 'success') {
			return(
				<FormResponseMessage className='success'>
					<span>Transaction sent successfully.</span>
				</FormResponseMessage>
			)
		}
	}

	renderErrorResponse() {
		const {status, errorMessage} = this.props.transaction
		if (status == 'error') {
			return(
				<FormResponseMessage className='error'>
					<span>There was a problem with sending the transaction.</span>
					<span className="devider"></span>
					<p>Error message: {errorMessage}</p>
				</FormResponseMessage>
			)
		}
	}

	onSubmitButtonClicked() {
		const {transaction} = this.props
		transaction.createTransaction(transaction)
	}

	submitButtonClassNames() {
		const {inprogress} = this.props.transaction
		return (inprogress ? "button-on-right loading" : "button-on-right")
	}

	renderSubmitButtonText() {
		const {inprogress} = this.props.transaction
		return (inprogress ? "Sending" : "Send")
	}

	validateAmountField() {
		const {amount, assetBalance, assetIsValid} = this.props.transaction
		return (assetIsValid && amount <= assetBalance)
	}

	validateDestinationAddressField() {
		const value = this.props.transaction.to
		const addressIsValid = validateAddress(value)
		return (value.length > 0 && addressIsValid)
	}

	validateAllFields() {
		const {asset, to, amount, inprogress} = this.props.transaction
		return !!(asset && to && this.validateAmountField() && this.validateDestinationAddressField())
	}

	isSubmitButtonDisabled() {
		const allFieldsPresent = this.validateAllFields()
		if (allFieldsPresent) { return false }
		if (allFieldsPresent && inprogress) { return true }
		if (!allFieldsPresent) { return true }
	}

}

export default SendTx
