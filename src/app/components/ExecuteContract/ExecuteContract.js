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
class ExecuteContract extends Component {

	constructor() {
		super()
		autobind(this)
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

	onPasteClicked() {
		const {contractMessage} = this.props
		contractMessage.to = clipboard.readText()
	}

	onExecuteContractClicked() {
		const {contractMessage} = this.props
		contractMessage.sendContractMessage(contractMessage)
	}

	render() {
		const {contractMessage} = this.props

		return (
			<Layout className="execute-contract">
				<Flexbox flexDirection="column" className="send-tx-container">

					<Flexbox flexDirection="column" className='page-title'>
						<h1>Execute Contract</h1>
						<p>Lorem ipsum - this is a form to send a message to a zen contract.</p>
					</Flexbox>

					<Flexbox flexDirection="column" className="contract-address input-container">

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

					<Flexbox flexDirection="row" className="contract-message-details">

						<Flexbox flexGrow={1} flexDirection="column" className="choose-command input-container">
							<label htmlFor="asset">Choose command</label>
							<select>
								<option value="collateralize">Collateralize</option>
								<option value="buy">Buy</option>
								<option value="excersize">Excersize</option>
								<option value="close">Close</option>
							</select>
						</Flexbox>

						<Flexbox flexGrow={0} flexDirection="row" className="amount-fields input-container container-on-right">

							<Flexbox flexDirection="column" className="select-asset">
								<label htmlFor="asset">Select Asset</label>
								<select>
									<option value="0000000000000000000000000000000000000000000000000000000000000000">ZENP</option>
									<option value="0000000USDZ">USDZ</option>
									<option value="BITZEN">BITZEN</option>
									<option value="BITGOLD">BITGOLD</option>
								</select>
							</Flexbox>

							<Flexbox flexDirection="column" className="choose-amount">
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

					</Flexbox>

					<Flexbox flexDirection="column" className="message-data input-container">
						<label htmlFor="data">Data</label>
						<textarea rows='4' cols='50'
							className='full-width'
							id="data"	name="data"	type="text"
							placeholder="Paste message data here"
							value={contractMessage.data}
							onChange={this.onDataChanged} >
							Lorem Ipsum
						</textarea>
					</Flexbox>

					<Flexbox justifyContent='flex-end' flexDirection="row">
						<button onClick={this.onExecuteContractClicked}>Execute</button>
					</Flexbox>

				</Flexbox>
			</Layout>
		)
	}
}

export default ExecuteContract
