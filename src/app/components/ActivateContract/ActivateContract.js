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
      rejected: [],
			dropText: 'Drag and drop your contract file here. Only *.txt files will be accepted.'
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

		console.log('acceptedFiles', acceptedFiles.length)

		if (acceptedFiles.length > 0) {
			contract.name = head(acceptedFiles).name
			this.setState({dropText: head(acceptedFiles).name});
		}

		this.setState({
			accepted: acceptedFiles,
			rejected: rejectedFiles
		});
	}

	onActivateContractClicked() {
		const {contract} = this.props
		const result = contract.activateContract(contract.code)
		console.log('onActivateContractClicked result', result)
	}

	render() {
		let dropzoneRef;

		const {dropText} = this.state

		return (
			<Layout className="activate-contract">
				<Flexbox flexDirection="column" className="send-tx-container">

					<Flexbox className='page-title'>
						<h1>Contract Activation</h1>
					</Flexbox>

					<div className='destination-address-div'>
						<label htmlFor='to'>Upload a contract from your computer</label>
						<Flexbox flexDirection="column" className='destination-address-input'>

							<Flexbox flexDirection="row" className='upload-contract-dropzone'>
			          <Dropzone
									ref={(node) => { dropzoneRef = node; }}
									className='dropzone'
									activeClassName='active'
									multiple={false}
			            accept="text/plain"
			            onDrop={this.onDrop.bind(this)}
			          >
			           	<p>{dropText}</p>
			          </Dropzone>
								<button className='button secondary button-on-right' onClick={() => { dropzoneRef.open() }} >Upload</button>
			        </Flexbox>

							<div className="devider"></div>

							<Flexbox justifyContent='flex-end' flexDirection="row">
								<button className='button secondary' >Cancel</button>
								<button className='button-on-right' onClick={this.onActivateContractClicked}>Activate</button>
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
					</div>

				</Flexbox>
			</Layout>
		)
	}
}

export default ActivateContract
