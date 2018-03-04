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

@inject('balances')
@inject('transaction')
@observer
class SendTx extends Component {

	constructor() {
		super()

		this.state = {
			addressIsValid: false,
			addressError: false,
			assetChosen: false,
			assetBalance: 0,
			amountIsInvalid: false
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
		const {transaction,balances} = this.props
		const balanceOfAsset = balances.getBalanceFor(data.asset)
		this.setState({assetBalance: balanceOfAsset})

		transaction.asset = data.asset
		transaction.assetIsValid = data.assetIsValid
	}

	onBlur() { this.refs.child.onAssetBlur() }
	onAssetFocus() { this.refs.child.onAssetFocus() }


  // AMOUNT INPUT //

	onAmountChanged(event) {
		const {transaction} = this.props
		const {assetBalance} = this.state
		if (event.target.value) {
			transaction.amount = parseFloat(event.target.value.trim().replace(/,/g, ''))

			this.validateAmount()
		}	else {
			transaction.amount = undefined
		}
	}

	validateAmount() {
		const {transaction} = this.props
		const {assetBalance} = this.state
		if (transaction.assetIsValid && assetBalance > 0) {
			this.setState({amountIsInvalid: transaction.amount > assetBalance})
		}
	}

	onAmountKeyDown = event => {
		if (event.keyCode == 38) {
			if (this.props.transaction.amount === undefined) {
				this.props.transaction.amount = 1
			}
			this.props.transaction.amount++
		} // up
		if (event.keyCode == 40) {this.props.transaction.amount-- } // down
		this.validateAmount()
	}

	increaseAmount() {
		this.props.transaction.amount++
		this.validateAmount()
	}
	decreaseAmount() {
		this.props.transaction.amount--
		this.validateAmount()
	}

	renderMaxAmountDiv() {
		const {transaction} = this.props
		const {assetBalance} = this.state
    if (transaction.assetIsValid) {
      return (
        <div className='maxSend'> / {assetBalance.toLocaleString() }</div>
      )
    }
  }

	render() {
		const {transaction} = this.props
		const {
			addressIsValid,
			addressError,
			assetChosen,
			amountIsInvalid
		} = this.state

		let addressClassNames = (addressError ? 'error' : '' )
		if (addressIsValid) { addressClassNames = classnames('is-valid', addressClassNames) }

		console.log('render assetIsValid', transaction.assetIsValid)
		let amountInputClassNames = (transaction.assetIsValid ? 'amountInputContainer asset-chosen' : 'amountInputContainer')
		if (amountIsInvalid) { amountInputClassNames = classnames('error', amountInputClassNames) }

		const presentableAmount = (transaction.amount === undefined ? '' : transaction.amount.toLocaleString() )

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
										value={transaction.to}
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
								asset={transaction.asset}
								onBlur={this.onBlur.bind(this)}
								onFocus={this.onAssetFocus.bind(this)}
								status={transaction.status}
							/>

							<Flexbox flexGrow={0} flexDirection="column" className="amount">
								<label htmlFor="amount">Amount</label>

								<Flexbox flexDirection='row' className={amountInputClassNames}>
									<input
										id='amount'
										name='amount'
										type='text'
										placeholder='Enter amount'
										value={presentableAmount}
										onKeyDown={this.onAmountKeyDown}
										onChange={this.onAmountChanged}
									/>
									{ this.renderMaxAmountDiv() }
									<Flexbox flexDirection='column' className='amountArrows'>
										<div onClick={this.increaseAmount}>
											<i className='fa fa-angle-up' />
										</div>
										<div onClick={this.decreaseAmount}>
											<i className='fa fa-angle-down' />
										</div>
									</Flexbox>
								</Flexbox>

							</Flexbox>

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
		const {transaction} = this.props
		if (transaction.status == 'success') {
			return(
				<FormResponseMessage className='success'>
					<span>Transaction sent successfully.</span>
				</FormResponseMessage>
			)
		}
	}

	renderErrorResponse() {
		const {transaction} = this.props
		if (transaction.status == 'error') {
			return(
				<FormResponseMessage className='error'>
					<span>There was a problem with sending the transaction.</span>
					<span className="devider"></span>
					<p>Error message: {transaction.errorMessage}</p>
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

	validateAllFields() {
		const {asset,to,amount,inprogress} = this.props.transaction
		return !!(asset && to && amount)
	}

	isSubmitButtonDisabled() {
		const allFieldsPresent = this.validateAllFields()
		if (allFieldsPresent) { return false }
		if (allFieldsPresent && inprogress) { return true }
		if (!allFieldsPresent) { return true }
	}

}

export default SendTx
