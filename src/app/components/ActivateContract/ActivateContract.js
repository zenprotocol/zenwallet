import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import autobind from 'class-autobind'
import Flexbox from 'flexbox-react'
import Dropzone from 'react-dropzone'
import {head} from 'lodash'

import Layout from '../UI/Layout/Layout'

@inject('contract')
@observer
class ActivateContract extends Component {
	constructor() {
		super()
		this.state = {
      accepted: [],
      rejected: []
    }
		autobind(this)
	}

	onDrop(acceptedFiles, rejectedFiles) {
		const {contract} = this.props

		acceptedFiles.forEach(file => {
			const reader = new FileReader();
			reader.onload = () => {
				const fileAsBinaryString = reader.result;
				contract.code = fileAsBinaryString
			};
			reader.onabort = () => console.log('file reading was aborted');
			reader.onerror = () => console.log('file reading has failed');

			reader.readAsBinaryString(file);
		});

		if (acceptedFiles.length > 0) {
			contract.fileName = head(acceptedFiles).name
			contract.dragDropText = head(acceptedFiles).name

			this.clearForm()
		}

		this.setState({ accepted: acceptedFiles, rejected: rejectedFiles });
	}

	clearForm = () => {
		const {contract} = this.props
		console.log('clearing form')
		contract.name = ''
		contract.hash = ''
		contract.address = ''
		contract.inprogress = false
		contract.errorMessage = ''
	}

	onActivateContractClicked() {
		const {contract} = this.props
		const result = contract.activateContract(contract.code)
	}

	onContractNameChanged(event) {
		const {contract} = this.props
		contract.name = event.target.value
	}

	renderSuccessResponse() {
		const {contract} = this.props

		if (contract.address && contract.hash) {
			return(
				<div>
					Contract Activated Successfully
					<br/>
					Order hash: {contract.hash}
					<br/>
					Order address: {contract.address}
					<br/>
					Order Status: {contract.status}
					<br/>
					InProgress: {contract.inprogress}
					<br/>
				</div>
			)
		}
	}

	isActivateButtonDisabled() {
		const {inprogress} = this.props.contract
		const {accepted} = this.state

		if (accepted.length == 1 && inprogress) { return true }
		if (accepted.length == 1) { return false }
		if (accepted.length == 0) { return true }
	}

	renderActivateButtonText() {
		const {inprogress} = this.props.contract
		return (inprogress ? "Proccessing" : "Activate")
	}

	renderClassNames() {
		const {inprogress} = this.props.contract
		return (inprogress ? "button-on-right loading" : "button-on-right")
	}

	render() {
		const {contract} = this.props

		let dropzoneRef

		return (
			<Layout className="activate-contract">
				<Flexbox flexDirection="column" className="send-tx-container">

					<Flexbox className='page-title'>
						<h1>Contract Activation</h1>
					</Flexbox>

					<Flexbox flexDirection="column" className="contract-name input-container">
						<label htmlFor='to'>Contract Name (Optional)</label>
						<input
							id='contract-name'
							name='contract-name'
							type='text'
							onChange={this.onContractNameChanged}
							value={contract.name}
						/>
					</Flexbox>

					<Flexbox flexDirection="column" className='destination-address-input input-container'>
						<label htmlFor='to'>Upload a contract from your computer</label>
						<Flexbox flexDirection="row" className='upload-contract-dropzone '>
		          <Dropzone
								ref={(node) => { dropzoneRef = node; }}
								className='dropzone'
								activeClassName='active'
								multiple={false}
		            // accept="text/plain"
		            onDrop={this.onDrop.bind(this)}
							>
		           	<p>{contract.dragDropText}</p>
		          </Dropzone>
							<button
								className='button secondary button-on-right'
								onClick={() => { dropzoneRef.open() }} >
								Upload
							</button>
		        </Flexbox>
					</Flexbox>

					{ this.renderSuccessResponse() }

					<div className="devider"></div>

					<Flexbox justifyContent='flex-end' flexDirection="row">
						<button className='button secondary'>Cancel</button>
						<button
							className={this.renderClassNames()}
							disabled={this.isActivateButtonDisabled()}
							onClick={this.onActivateContractClicked}>{this.renderActivateButtonText()}
						</button>
					</Flexbox>


					<br/>
					<br/>
					<br/>

{/*
			        <aside>
			          <h2>Accepted files</h2>
			          <ul>
			            {
			              this.state.accepted.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
			            }
			          </ul>
			          <h2>Rejected files</h2>
			          <ul>
			            {
			              this.state.rejected.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
			            }
			          </ul>
			        </aside>
*/}


				</Flexbox>
			</Layout>
		)
	}
}

export default ActivateContract
