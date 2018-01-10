import React, {Component} from 'react'
import autobind from 'class-autobind'
import {Link} from 'react-router-dom'
import Flexbox from 'flexbox-react'
import DevTools from 'mobx-react-devtools'
import {inject, observer} from 'mobx-react'

import {clipboard} from 'electron'
import {toInteger} from 'lodash'

import Layout from '../UI/Layout/Layout'

@inject('transaction')
@observer
class SendTx extends Component {

	constructor() {
		super()
		autobind(this)
	}

	onDestinationAddressChanged(event) {
		const {transaction} = this.props
		transaction.to = event.target.value
	}

	onAmountChanged(event) {
		const {transaction} = this.props

		if (event.target.value)
		transaction.amount = toInteger(event.target.value)
		else
		transaction.amount = undefined
	}

	onSendTransactionClicked() {
		const {transaction} = this.props
		transaction.createTransaction(transaction)
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

					<div className='destination-address-div'>
						<label htmlFor='to'>Destination Address</label>
						<Flexbox flexDirection="row" className='destination-address-input'>
							<input
								id='to'
								name="to"
								type="text"
								onChange={this.onDestinationAddressChanged} value={transaction.to} />
								<button className="button secondary button-on-right" onClick={this.onPasteClicked}>Paste</button>
							</Flexbox>
						</div>

						<Flexbox flexDirection="row">

							<Flexbox flexDirection="column" className="select-asset">
								<label htmlFor="asset">Select Asset</label>
								<select>
									<option value="0000000000000000000000000000000000000000000000000000000000000000">ZENP</option>
									<option value="0000000USDZ">USDZ</option>
									<option value="BITZEN">BITZEN</option>
									<option value="BITGOLD">BITGOLD</option>
								</select>
							</Flexbox>

							<Flexbox flexDirection="column" className="amount">
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

							<div className='devider' />

							<Flexbox justifyContent='flex-end' flexDirection="row">
								<button onClick={this.onSendTransactionClicked}>Send</button>
							</Flexbox>

						</Flexbox>
					</Layout>
				)

			}
		}

		export default SendTx
