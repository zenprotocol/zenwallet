import React, {Component} from 'react'
import autobind from 'class-autobind'
import {Link} from 'react-router-dom'
import Flexbox from 'flexbox-react'
import {inject, observer} from 'mobx-react'
import Autosuggest from 'react-autosuggest'
import {truncateString} from '../../../utils/helpers'

import {clipboard} from 'electron'
import {toInteger} from 'lodash'


import Layout from '../UI/Layout/Layout'
import FormResponseMessage from '../UI/FormResponseMessage/FormResponseMessage'

@inject('balances')
@inject('transaction')
@observer
class SendTx extends Component {

	constructor() {
		super()

		this.state = {
			autoSuggestvalue: '',
			suggestionValue: '',
			suggestions: [],
			assetError: ''
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

		const {transaction} = this.props
		this.setState({suggestionValue: transaction.asset})
  }

	onDestinationAddressChanged(event) {
		const {transaction} = this.props
		transaction.to = event.target.value.trim()
	}

	onAmountChanged(event) {
		const {transaction} = this.props
		if (event.target.value) {
			transaction.amount = toInteger(event.target.value.trim())
		}	else {
			transaction.amount = undefined
		}
	}

	onPasteClicked() {
		const {transaction} = this.props
		transaction.to = clipboard.readText().trim()
	}


 // AUTO SUGGEST ASSET //

	getSuggestionValue = suggestion => suggestion.asset

	renderSuggestion = suggestion => (
	  <div className='suggestionItem'>
			{suggestion.name} ({truncateString(suggestion.asset)})
		</div>
	)

	onSuggestionSelected = (event, {suggestion}) => {
		const {suggestionValue} = this.state
		const {transaction} = this.props

		this.setState({suggestionValue: suggestion.asset})
		transaction.asset = suggestion.asset
	}

	onChange = (event, { newValue, method }) => {
		const {suggestionValue} = this.state
		const {transaction} = this.props
		const val = newValue.trim()

		const userPressedUpOrDown = (method === 'down' || method === 'up')
		if (!userPressedUpOrDown) { this.setState({suggestionValue: val})	}

		const suggestions = this.getSuggestions(val)
		this.setState({assetError: (suggestions.length === 0 && val != '')})
	}

	onAssetBlur = () => {
		const {suggestionValue} = this.state
		const val = suggestionValue.trim()
		const suggestions = this.getSuggestions(val)

		const {transaction} = this.props

		if (suggestions.length === 1 && suggestions[0].asset === val) {
			transaction.asset = val
		}

		if (suggestions.length === 0 && val != '') {
			transaction.asset = ''
			this.setState({suggestionValue: ''})
			this.setState({assetError: false})
		}
	}

	getSuggestions = value => {
		const {balances} = this.props
		balances.searchQuery = value
		return balances.filtered
	}

	onSuggestionsFetchRequested = ({ value }) => {
		this.setState({ suggestions: this.getSuggestions(value) })
  }

	onSuggestionsClearRequested = () => {
		this.setState({suggestions: []})
	}

	shouldRenderSuggestions = (value) => {
		const suggestions = this.getSuggestions(value)
		return !(suggestions.length === 1 && suggestions[0].asset === value)
	}

	renderAssetErrorMessage() {
		const {assetError} = this.state
		if (assetError) {
			return (
				<div className='error-message'>
					<i className="fa fa-exclamation-circle"></i>
					<span>You don't have such an asset</span>
				</div>
			)
		}
	}

	render() {
		const {transaction} = this.props
		const {suggestionValue, suggestions, assetError} = this.state

		const assetClassNames = (assetError ? 'full-width error' : 'full-width' )

		const inputProps = {
			type: 'search',
      placeholder: 'Start typing the asset name',
      value: suggestionValue,
			className: assetClassNames,
      onChange: this.onChange,
			onBlur: this.onAssetBlur
    }

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

								<Autosuggest
					        suggestions={suggestions}
									onSuggestionSelected={this.onSuggestionSelected}
					        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
					        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
					        getSuggestionValue={this.getSuggestionValue}
					        renderSuggestion={this.renderSuggestion}
									shouldRenderSuggestions={this.shouldRenderSuggestions}
					        inputProps={inputProps}
					      />
								{this.renderAssetErrorMessage()}

							</Flexbox>

							<Flexbox flexGrow={0} flexDirection="column" className="amount">
								<label htmlFor="amount">Amount</label>
								<input
									id="amount"
									name="amount"
									type="number"
									placeholder="Enter amount you wan to send"
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
