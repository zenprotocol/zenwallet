import React, {Component} from 'react'
import autobind from 'class-autobind'
import {Link} from 'react-router-dom'
import Flexbox from 'flexbox-react'
import {inject, observer} from 'mobx-react'

import {clipboard} from 'electron'
import {toInteger} from 'lodash'

import Layout from '../UI/Layout/Layout'
import AutoSuggestAssets from '../UI/AutoSuggestAssets/AutoSuggestAssets'
import FormResponseMessage from '../UI/FormResponseMessage/FormResponseMessage'

@inject('contractMessage')
@observer
class RunContract extends Component {

	constructor() {
		super()
		autobind(this)
	}

	componentWillMount() {
		const {match, contractMessage} = this.props
		const {contractAddress} = match.params
		if (contractAddress) {
			contractMessage.to = contractAddress
			contractMessage.amount = null
		}
	}

	componentWillUnmount() {
		const {contractMessage} = this.props
		if (contractMessage.status == 'success' || contractMessage.status == 'error') {
			contractMessage.resetForm()
		}
	}

	onContractAddressChanged(event) {
		const {contractMessage} = this.props
		contractMessage.to = event.target.value.trim()
	}

	onDataChanged(event) {
		const {contractMessage} = this.props
		contractMessage.data = event.target.value.trim()
	}

	onAmountChanged(event) {
		const {contractMessage} = this.props

		if (event.target.value)
			contractMessage.amount = toInteger(event.target.value.trim())
		else
			contractMessage.amount = undefined
	}

	onCommandChanged(event) {
		const {contractMessage} = this.props
		contractMessage.command = event.target.value.trim()
	}

	onPasteClicked() {
		const {contractMessage} = this.props
		contractMessage.to = clipboard.readText()
	}

	onRunContractClicked() {
		const {contractMessage} = this.props
		contractMessage.sendContractMessage(contractMessage)
	}

	renderSuccessResponse() {
		const {contractMessage} = this.props

		if (contractMessage.status == 'success') {
			return(
				<FormResponseMessage className='success'>
					<span>Contract has been run successfully</span>
				</FormResponseMessage>
			)
		}
	}

	renderErrorResponse() {
		const {contractMessage} = this.props
		if (contractMessage.status == 'error') {
			return(
				<FormResponseMessage className='error'>
					<span>Couldn't run the contract with the parameters you entered.</span>
					<div className="devider"></div>
					<p>Error message: {contractMessage.errorMessage}</p>
				</FormResponseMessage>
			)
		}
	}

	renderButtonText() {
		const {inprogress} = this.props.contractMessage
		return (inprogress ? "Running" : "Run")
	}


	// HELPER METHODS FOR ASSET AUTO SUGGGEST //

	updateAssetFromSuggestions = (data) => {
		this.props.contractMessage.asset = data
	}

	onBlur() {
    this.refs.child.onAssetBlur()
  }


	render() {
		const {contractMessage} = this.props

		return (
			<Layout className="run-contract">
				<Flexbox flexDirection="column" className="send-tx-container">

					<Flexbox flexDirection="column" className='page-title'>
						<h1>Run Contract</h1>
					</Flexbox>

					<Flexbox flexDirection="column" className="form-container">

						<Flexbox flexDirection="column" className="contract-address form-row">

							<label htmlFor='to'>Contract Address</label>
							<Flexbox flexDirection="row" className='destination-address-input'>
								<input
									className='full-width'
									id='to'
									name='to'
									type='text'
									placeholder="Enter contract address"
									onChange={this.onContractAddressChanged}
									value={contractMessage.to}
								/>
								<button className="button secondary button-on-right" onClick={this.onPasteClicked}>Paste</button>
							</Flexbox>

						</Flexbox>

						<Flexbox flexDirection="column" className="choose-command form-row">
							<label htmlFor="command">Choose command</label>
							<Flexbox flexDirection="row" className='command-input'>
								<input
									id="command"
									className="full-width"
									name="command"
									type="text"
									placeholder="Enter Command"
									value={contractMessage.command}
									onChange={this.onCommandChanged} />
							</Flexbox>
						</Flexbox>

						<Flexbox flexDirection="row" className="contract-message-details form-row">

								<AutoSuggestAssets sendData={this.updateAssetFromSuggestions} asset={contractMessage.asset} onBlur={this.onBlur.bind(this)} />

								<Flexbox flexGrow={0} flexDirection="column" className="choose-amount">
									<label htmlFor="amount">Amount</label>
									<input
										id="amount"
										name="amount"
										type="number"
										placeholder="Enter amount of Zens"
										value={contractMessage.amount}
										onChange={this.onAmountChanged} />
								</Flexbox>

						</Flexbox>

						<Flexbox flexDirection="column" className="message-data">
							<label htmlFor="data">Data</label>
							<textarea rows='4' cols='50'
								id="data"	name="data"	type="text"
								placeholder="Paste message data here"
								value={contractMessage.data}
								onChange={this.onDataChanged} />
						</Flexbox>

					</Flexbox>

					<Flexbox flexDirection="row">
						{ this.renderSuccessResponse() }
						{ this.renderErrorResponse() }
						<Flexbox flexGrow={2}></Flexbox>
						<Flexbox flexGrow={1} justifyContent='flex-end' flexDirection="row">
							<button
								disabled={this.isSubmitButtonDisabled()}
								onClick={this.onRunContractClicked}>
								{(contractMessage.inprogress ? "Running" : "Run")}
							</button>
						</Flexbox>
					</Flexbox>

				</Flexbox>
			</Layout>
		)
	}

	validateForm() {
		const {to, inprogress} = this.props.contractMessage
		return (!!to)
	}

	isSubmitButtonDisabled() {
		const {to, inprogress} = this.props.contractMessage
		const formIsValid = this.validateForm()

		if (formIsValid && inprogress) { return true }
		if (!formIsValid) { return true }
		if (formIsValid) { return false }
	}
}

export default RunContract
