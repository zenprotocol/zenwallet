import React, {Component} from 'react'
import autobind from 'class-autobind'
import {Link} from 'react-router-dom'
import Flexbox from 'flexbox-react'
import {inject, observer} from 'mobx-react'

import {clipboard} from 'electron'
import {toInteger} from 'lodash'

import Layout from '../UI/Layout/Layout'

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
		console.log('this.props.params contractAddress', contractAddress)
		if (contractAddress) {
			contractMessage.to = contractAddress
			contractMessage.amount = null
		}
	}

	componentWillUnmount() {
		const {contractMessage} = this.props
		contractMessage.resetForm()
	}

	onContractAddressChanged(event) {
		const {contractMessage} = this.props
		contractMessage.to = event.target.value
	}

	onDataChanged(event) {
		const {contractMessage} = this.props
		contractMessage.data = event.target.value
	}

	onAmountChanged(event) {
		const {contractMessage} = this.props

		if (event.target.value)
			contractMessage.amount = toInteger(event.target.value)
		else
			contractMessage.amount = undefined
	}

	onCommandChanged(event) {
		const {contractMessage} = this.props
		contractMessage.command = event.target.value
	}

	onAssetChanged(event) {
		const {contractMessage} = this.props
		contractMessage.asset = event.target.value
	}

	onPasteClicked() {
		const {contractMessage} = this.props
		contractMessage.to = clipboard.readText()
	}

	onRunContractClicked() {
		const {contractMessage} = this.props
		contractMessage.sendContractMessage(contractMessage)
	}

	render() {
		const {contractMessage} = this.props

		return (
			<Layout className="run-contract">
				<Flexbox flexDirection="column" className="send-tx-container">

					<Flexbox flexDirection="column" className='page-title'>
						<h1>Run Contract</h1>
						<p>Lorem ipsum - this is a form to send a message to a zen contract.</p>
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
									onChange={this.onContractAddressChanged}
									value={contractMessage.to}
								/>
								<button className="button secondary button-on-right" onClick={this.onPasteClicked}>Paste</button>
							</Flexbox>

						</Flexbox>

						<Flexbox flexDirection="column" className="choose-command form-row">
							<label htmlFor="asset">Choose command</label>
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

								<Flexbox flexGrow={1} flexDirection="column" className="select-asset">
									<label htmlFor="asset">Asset</label>

									<input
										id="asset"
										name="asset"
										type="text"
										placeholder="Enter Asset"
										value={contractMessage.asset}
										onChange={this.onAssetChanged} />

								</Flexbox>

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

					<Flexbox justifyContent='flex-end' flexDirection="row">
						<button onClick={this.onRunContractClicked}>Run</button>
					</Flexbox>

				</Flexbox>
			</Layout>
		)
	}
}

export default RunContract
