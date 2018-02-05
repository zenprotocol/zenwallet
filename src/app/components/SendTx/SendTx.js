import React, {Component} from 'react'
import autobind from 'class-autobind'
import {Link} from 'react-router-dom'
import Flexbox from 'flexbox-react'
import DevTools from 'mobx-react-devtools'
import {inject, observer} from 'mobx-react'

import {clipboard} from 'electron'
import {toInteger} from 'lodash'

import Layout from '../UI/Layout/Layout'
import FormResponseMessage from '../UI/FormResponseMessage/FormResponseMessage'

@inject('transaction')
@observer
class SendTx extends Component {

	constructor() {
		super()
		autobind(this)
	}

	componentWillMount() {
		const {match, transaction} = this.props
		const {assetHash} = match.params
		if (assetHash) {
			transaction.asset = assetHash
		}
	}

	onDestinationAddressChanged(event) {
		const {transaction} = this.props
		transaction.to = event.target.value
	}

	onAmountChanged(event) {
		const {transaction} = this.props
		if (event.target.value) {
			transaction.amount = toInteger(event.target.value)
		}	else {
			transaction.amount = undefined
		}
	}

	onAssetChanged(event) {
		const {transaction} = this.props
		transaction.asset = event.target.value
	}

	onPasteClicked() {
		const {transaction} = this.props
		transaction.to = clipboard.readText()
	}

	render() {
		const {transaction} = this.props

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
								<input
									className='full-width'
									id='to'
									name="to"
									type="text"
									placeholder="Destination address"
									onChange={this.onDestinationAddressChanged} value={transaction.to} />
									<button className="button secondary button-on-right" onClick={this.onPasteClicked}>Paste</button>
							</Flexbox>
						</Flexbox>

						<Flexbox flexDirection="row">

							<Flexbox flexGrow={1} flexDirection="column" className="select-asset">
								<label htmlFor="asset">Asset</label>
								<input
									id="asset"
									name="asset"
									type="text"
									placeholder="Enter Asset"
									value={transaction.asset}
									onChange={this.onAssetChanged} />
							</Flexbox>

							<Flexbox flexGrow={0} flexDirection="column" className="amount">
								<label htmlFor="amount">Amount</label>
								<input
									id="amount"
									name="amount"
									type="number"
									placeholder="Enter amount of Zens"
									value={transaction.amount}
									onChange={this.onAmountChanged} />
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
