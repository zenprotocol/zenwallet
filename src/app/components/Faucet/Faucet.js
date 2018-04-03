import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import autobind from 'class-autobind'
import {Link} from 'react-router-dom'
import Flexbox from 'flexbox-react'
import {clipboard} from 'electron'
import {toInteger} from 'lodash'
import classnames from 'classnames'
import { Base64 } from 'js-base64'
import base58 from 'bs58check'

import Layout from '../UI/Layout/Layout'
import FormResponseMessage from '../UI/FormResponseMessage/FormResponseMessage'

const shell = require('electron').shell

@inject('redeemTokensState')
@inject('publicAddress')
@observer
class Faucet extends Component {

	constructor() {
		super()
		autobind(this)
	}

	componentDidMount() {
		const {publicAddress} = this.props
		publicAddress.fetch()
		const {redeemTokensState} = this.props
		redeemTokensState.walletPublicAddress = publicAddress.address
	}

  onChange(e) {
    const pubkey = e.target.value.trim()
		this.setAndValidatePubkey(pubkey)
  }

	onPasteClicked() {
		const {redeemTokensState} = this.props
		const pubkey = clipboard.readText().trim()
		this.setAndValidatePubkey(pubkey)
		this.refs.pubkey.focus()
	}

	setAndValidatePubkey(pubkey) {
		const {redeemTokensState} = this.props
		redeemTokensState.pubkeyBase58 = pubkey
		redeemTokensState.status = ''

		try {

			const buffer = base58.decode(pubkey).slice(1)
			const result = buffer.toString('base64')

			redeemTokensState.pubkeyError = false
			redeemTokensState.pubkeyIsValid = true

			redeemTokensState.pubkeyBase64 = result
			redeemTokensState.checkCrowdsaleTokensEntitlement()
		} catch (e) {
			redeemTokensState.pubkeyError = true
			redeemTokensState.pubkeyIsValid = false
		}

		if (pubkey.length == 0) {
			redeemTokensState.pubkeyError = false
			redeemTokensState.pubkeyIsValid = false
		}
	}

	renderErrorMessage() {
		const {redeemTokensState} = this.props

    if (redeemTokensState.pubkeyError) {
      return (
        <div className='input-message error'>
          <i className="fa fa-exclamation"></i>
          <span>Invalid Public Key</span>
        </div>
      )
    }
  }

	renderRedeemMessage() {
		const {
			anyOrders, alreadyRedeemed,
			amountRedeemable, inprogress,
			redeemingTokens, pubkeyIsValid, pubkeyError
		} = this.props.redeemTokensState

		if (pubkeyIsValid && !inprogress) {
			if (anyOrders && amountRedeemable > 0) {
				if (alreadyRedeemed) {
					return (
						<Flexbox flexGrow={1} flexDirection="row" className='form-response-message warning'>
							<i className='fa fa-exclamation'></i>
							<Flexbox flexDirection="column">
								Tokens have already been redeemed by this key
							</Flexbox>
						</Flexbox>
					)
				} else {
					return (
						<Flexbox flexGrow={1} flexDirection="row" className='form-response-message success'>
							<i className='fa fa-check'></i>
							<Flexbox flexDirection="row">
								<span>This key is entitled to</span>
								<span className="bold blue">&nbsp;{amountRedeemable.toLocaleString()} tokens</span>
							</Flexbox>
						</Flexbox>
					)
				}
			} else {
				console.log('amountRedeemable', amountRedeemable)
				if (amountRedeemable === 0 || !anyOrders) {
					return (
						<Flexbox flexGrow={1} flexDirection="row" className='form-response-message warning'>
							<i className='fa fa-exclamation'></i>
							<Flexbox flexDirection="column">
								This Public Key is not entitled to any tokens
							</Flexbox>
						</Flexbox>
					)
				}
			}

		}

  }

	renderCheckingEntitlementMessage() {
		const {checkingTokenEntitlement, pubkeyIsValid} = this.props.redeemTokensState

		if (pubkeyIsValid && checkingTokenEntitlement) {
			return (
				<div className='input-message'>
					<i className="fa fa-spinner fa-spin"></i>
          <span>Checking if this key is entitled to tokens</span>
        </div>
			)
		}
	}

	renderValidPubkeyMessage() {
		const {checkingTokenEntitlement, pubkeyIsValid} = this.props.redeemTokensState

		if (pubkeyIsValid && !checkingTokenEntitlement) {
			return (
				<div className='input-message'>
					<i className="fa fa-check"></i>
          <span>Public key is valid</span>
        </div>
			)
		}
	}

	onRedeemButtonClicked() {
		const {publicAddress, redeemTokensState} = this.props
		redeemTokensState.walletPublicAddress = publicAddress.address
		this.props.redeemTokensState.redeemCrowdsaleTokens()
	}

	renderSuccessResponse() {
		const {status, amountRedeemable} = this.props.redeemTokensState

		if (status == 'success') {
			return(
				<FormResponseMessage className='success'>
					<span>{(amountRedeemable/100000000).toLocaleString()} tokens were sent to your wallet</span>
				</FormResponseMessage>
			)
		}
	}

	onLinkClick = (e) => {
    e.preventDefault()
		shell.openExternal(e.target.href)
	}

	render() {
		const {pubkeyBase58, pubkeyError, pubkeyIsValid, inprogress} = this.props.redeemTokensState

		let pubkeyClassNames = ''
		if (pubkeyError) { pubkeyClassNames = classnames('error', pubkeyClassNames) }
		if (pubkeyIsValid) { pubkeyClassNames = classnames('is-valid', pubkeyClassNames) }

		return (
			<Layout className="faucet">
				<Flexbox flexDirection="column" className="faucet-container">

					<Flexbox flexDirection="column" className='page-title'>
						<h1>Get Access to the Zen Protocol Software</h1>
						<h3>
							To gain access to the Zen Protocol software insert the key generated using our software sale wallet and redeem your tokens.
							<br/>
							If you didn't save your key contact our support team at <a href="mailto:info@zenprotocol.com">info@zenprotocol.com</a> and we'll help you retreive it
							<br/>
							You can also retrieve it by visiting 
							<a
								href="https://crowdsale.zenprotocol.com/create-wallet/complete"
								onClick={this.onLinkClick}
							>this link</a> in the same browser you made your purchase from.
						</h3>
					</Flexbox>

					<Flexbox flexDirection="column" className="form-container">

						<Flexbox flexDirection="column" className='destination-address-input form-row'>
							<label htmlFor='to'>What is your key?</label>
							<Flexbox flexDirection="row" className='public-key-input'>

								<Flexbox flexDirection="column" className='full-width'>
									<input
										id='pubkey'
										ref='pubkey'
										name='pubkey'
										type="text"
										className={pubkeyClassNames}
										placeholder="Your Public Key"
										onChange={this.onChange}
										value={pubkeyBase58}
										autoFocus
									/>
									{this.renderErrorMessage()}
									{this.renderCheckingEntitlementMessage()}
									{this.renderValidPubkeyMessage()}
			          </Flexbox>

								<button
									className="button secondary button-on-right"
									onClick={this.onPasteClicked}>
									Paste
								</button>
							</Flexbox>
						</Flexbox>
						<Flexbox>
							<h3 className='agree-to-terms'>
								* By claiming your tokens you agree to the 
								<a
									href="https://www.zenprotocol.com/legal/zen_protocol_token_sale_agreement.pdf"
									onClick={this.onLinkClick}
								>Software License Terms</a>.
							</h3>
						</Flexbox>

					</Flexbox>

					<Flexbox flexDirection="row">
						{ this.renderRedeemMessage() }
						{ this.renderSuccessResponse() }
						<Flexbox flexGrow={2}></Flexbox>
						<Flexbox flexGrow={1} justifyContent='flex-end' flexDirection="row">
							<button
								disabled={this.isSubmitButtonDisabled()}
								onClick={this.onRedeemButtonClicked}>
								{this.renderRedeemInnerButton()}
							</button>
						</Flexbox>
					</Flexbox>

				</Flexbox>
			</Layout>
		)
	}

	isRedeemable() {
		const {anyOrders, alreadyRedeemed, amountRedeemable, pubkeyIsValid} = this.props.redeemTokensState
		return (pubkeyIsValid && anyOrders && !alreadyRedeemed && amountRedeemable > 0)
	}

	renderRedeemInnerButton() {
		const {inprogress, redeemingTokens} = this.props.redeemTokensState

		if (redeemingTokens) {
			return (
				<span>
					Redeeming Tokens
					<i className="fa fa-spinner fa-spin"></i>
				</span>
			)
		} else {
			return "Redeem Tokens"
		}

	}

	isSubmitButtonDisabled() {
		const {inprogress, redeemingTokens} = this.props.redeemTokensState

		if (redeemingTokens) { return true; }
		return !(this.isRedeemable() && !inprogress)
	}

}

export default Faucet
