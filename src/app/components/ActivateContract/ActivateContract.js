const path = require('path')
import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {Link} from 'react-router-dom'
import autobind from 'class-autobind'
import Flexbox from 'flexbox-react'
import Dropzone from 'react-dropzone'
import {head} from 'lodash'
import Highlight from 'react-highlight'

import Layout from '../UI/Layout/Layout'
import FormResponseMessage from '../UI/FormResponseMessage/FormResponseMessage'
import AmountInput from '../UI/AmountInput/AmountInput'

@inject('contract')
@observer
class ActivateContract extends Component {
	constructor() {
		super()
		autobind(this)
	}

	componentWillUnmount() {
		const {contract} = this.props
		if (contract.status == 'success') {
			contract.resetForm()
		}
	}

	onDrop(acceptedFiles, rejectedFiles) {
		const {contract} = this.props

		acceptedFiles.forEach(file => {
			const reader = new FileReader()
			reader.onload = () => {
				const fileAsBinaryString = reader.result
				contract.code = fileAsBinaryString
			}
			reader.onabort = () => console.log('file reading was aborted')
			reader.onerror = () => console.log('file reading has failed')

			reader.readAsBinaryString(file)
		})

		contract.acceptedFiles = acceptedFiles
		contract.rejectedFiles = rejectedFiles

		if (acceptedFiles.length > 0) {
			contract.fileName = head(acceptedFiles).name
			contract.dragDropText = head(acceptedFiles).name
		}
	}

	onActivateContractClicked() {
		const result = this.props.contract.activateContract()
	}

	onContractNameChanged(event) {
		this.props.contract.name = event.target.value
	}

	validateForm() {
		const {name, acceptedFiles} = this.props.contract
		return (acceptedFiles.length == 1 && !!name)
	}

	isSubmitButtonDisabled() {
		const {inprogress, acceptedFiles} = this.props.contract
		const formIsValid = this.validateForm()

		if (formIsValid && inprogress) { return true }
		if (!formIsValid) { return true }
		if (formIsValid) { return false }
	}

	renderActivateButtonText() {
		const {inprogress} = this.props.contract
		return (inprogress ? "Activating" : "Activate")
	}

	renderClassNames() {
		const {inprogress} = this.props.contract
		return (inprogress ? "button-on-right loading" : "button-on-right")
	}

	renderCancelIcon() {
		const {acceptedFiles} = this.props.contract
		const cancelIconSource = path.join(__dirname, '../../assets/img/cancel-icon.png')
		if (acceptedFiles.length == 1) {
			return (
				<a className='cancel-button' onClick={this.onCancelChosenFiledClicked}>
					<img src={cancelIconSource} alt="Cancel chosen file"/>
				</a>
			)
		}
	}

	onCancelChosenFiledClicked() {
		const {contract} = this.props
		contract.acceptedFiles = []
		contract.resetDragDropText()
	}

	renderDropZoneClassName() {
		const isFileChosen = this.props.contract.acceptedFiles.length == 1
		return (isFileChosen ? 'dropzone full-width file-chosen' : 'dropzone full-width')
	}

	renderSuccessResponse() {
		const {address, hash, status} = this.props.contract

		if (address && hash && status == 'success') {
			return(
				<FormResponseMessage className='success'>
					<span>
						Contract has been successfully activated and added to your <Link to="/saved-contracts">Saved Contracts</Link>
					</span>
					<div className="devider"></div>
					<p>Contract Hash: {hash}</p>
					<p>Contract Address: {address}</p>
				</FormResponseMessage>
			)
		}
	}

	renderErrorResponse() {
		const {status} = this.props.contract
		if (status == 'error') {
			return(
				<FormResponseMessage className='error'>
					<span>
						There seems to be a problem with your contract. Please contact your developer and direct them to use the ZEN-SDK to test the contract.
						<br/>
						SDK Link: <a target="_blank" href="https://github.com/zenprotocol/ZFS-SDK">https://github.com/zenprotocol/ZFS-SDK</a>
					</span>
				</FormResponseMessage>
			)
		}
	}

	renderCodeSnippet() {
		const {code, acceptedFiles} = this.props.contract
		if (acceptedFiles.length == 1 && code) {
			return (
				<Flexbox flexDirection="column" className="contract-code form-row">
					<label htmlFor='code'>Code</label>
					<Highlight className='fsharp'>
					  {code}
					</Highlight>
				</Flexbox>
			)
		}
	}


	// AMOUNT INPUT //

	updateNumberOfBlocks = (data) => {
		this.props.contract.numberOfBlocks = data.amount
	}


	render() {
		const {dragDropText, name, amountOfBlocks, status} = this.props.contract

		let dropzoneRef

		return (
			<Layout className="activate-contract">
				<Flexbox flexDirection="column" className="send-tx-container">

					<Flexbox className='page-title'>
						<h1>Activate Contract</h1>
					</Flexbox>

					<Flexbox flexDirection="column" className="form-container">

						<Flexbox flexDirection="column" className='destination-address-input form-row'>
							<label htmlFor='to'>Upload a contract from your computer</label>
							<Flexbox flexDirection="row" className='upload-contract-dropzone'>
								<Dropzone
									ref={(node) => { dropzoneRef = node; }}
									className={ this.renderDropZoneClassName() }
									activeClassName='active'
									multiple={false}
									accept=".fst"
									onDrop={this.onDrop.bind(this)}
									>
									<p>{dragDropText}</p>
								</Dropzone>
								{this.renderCancelIcon()}
								<button
									className='button secondary button-on-right'
									onClick={() => { dropzoneRef.open() }} >
									Upload
								</button>
							</Flexbox>
						</Flexbox>

						<Flexbox flexDirection="row" className="contract-name-and-amount form-row">

							<Flexbox flexGrow={2} flexDirection="column" className="contract-name with-input-on-right">
								<label htmlFor='to'>Name Your Contract</label>
								<input
									id='contract-name'
									name='contract-name'
									type='text'
									onChange={this.onContractNameChanged}
									value={name}
									autoFocus
								/>
							</Flexbox>

							<AmountInput
								amount={amountOfBlocks}
								status={status}
								label='Number Of Blocks'
								sendData={this.updateNumberOfBlocks}
							/>

						</Flexbox>

						{this.renderCodeSnippet()}

					</Flexbox>

					<Flexbox flexDirection="row">
						{ this.renderSuccessResponse() }
						{ this.renderErrorResponse() }
						<Flexbox flexGrow={2}></Flexbox>
						<Flexbox flexGrow={1} justifyContent='flex-end' flexDirection="row">
							<button
								className={this.renderClassNames()}
								disabled={this.isSubmitButtonDisabled()}
								onClick={this.onActivateContractClicked}>{this.renderActivateButtonText()}
							</button>
						</Flexbox>
					</Flexbox>

					{/* <br/>
					<br/>
					<br/>

	        <aside>
	          <h2>Accepted files</h2>
	          <ul>
	            {
	              contract.acceptedFiles.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
	            }
	          </ul>
	          <h2>Rejected files</h2>
	          <ul>
	            {
	              contract.rejectedFiles.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
	            }
	          </ul>
	        </aside> */}

				</Flexbox>
			</Layout>
		)
	}
}

export default ActivateContract
