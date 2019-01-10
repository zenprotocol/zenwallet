import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import Flexbox from 'flexbox-react'
import Dropzone from 'react-dropzone'
import Highlight from 'react-highlight'
import cx from 'classnames'
import swal from 'sweetalert'

import { CANCEL_ICON_SRC } from '../../constants/imgSources'
import routes from '../../constants/routes'
import Layout from '../../components/Layout'
import ProtectedButton from '../../components/Buttons'
import FormResponseMessage from '../../components/FormResponseMessage'
import AmountInput from '../../components/AmountInput'
import ExternalLink from '../../components/ExternalLink'
import PublicAddressStore from '../../stores/publicAddressStore'
import DeployContractStore from '../../stores/deployContractStore'
import PortfolioStore from '../../stores/portfolioStore'

import { replacePkHashVar, isContractNameReserved, calcMaxBlocksForContract } from './deployContractUtils'

const startRegex = /NAME_START:/
const endRegex = /:NAME_END/

type Props = {
  deployContractStore: DeployContractStore,
  publicAddressStore: PublicAddressStore,
  portfolioStore: PortfolioStore
};

@inject('deployContractStore', 'portfolioStore', 'publicAddressStore')
@observer
class DeployContract extends Component<Props> {
  componentDidMount() {
    // needed for replacePkHashVar function
    this.props.publicAddressStore.fetch()
  }

  componentWillUnmount() {
    const { deployContractStore } = this.props
    if (deployContractStore.status.match(/success|error/)) {
      deployContractStore.resetForm()
    }
  }
  dropzoneRef = null
  onDrop = ([contractFile], [rejectedFile]) => {
    if (rejectedFile) {
      swal({ title: 'file invalid', text: 'only .fst files are accepted', icon: 'error' })
      return
    }
    const { deployContractStore, publicAddressStore } = this.props
    const reader = new FileReader()
    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => swal({ title: 'upload failed', icon: 'error' })
    reader.readAsBinaryString(contractFile)
    reader.onload = () => {
      const code = replacePkHashVar(reader.result, publicAddressStore.pkHash)
      deployContractStore.code = code
      const codeFromComment = this.getNamefromCodeComment(code)
      deployContractStore.name = codeFromComment || '' // reset name in case a contract file with name was uploaded but not deployed before
    }
    deployContractStore.dragDropText = contractFile.name
  }

  onContractNameChanged = (evt) => {
    const { deployContractStore } = this.props
    const newValue = evt.target.value
    const isValidValue = /^[a-z0-9\s]+$/i.test(newValue)
    if (!isValidValue && newValue !== '') { return }
    deployContractStore.name = newValue
    if (deployContractStore.code) {
      deployContractStore.code = this.addOrUpdateCodeComment(deployContractStore.code, newValue)
    }
  }
  get isContractNameReserved() {
    const { deployContractStore } = this.props
    return isContractNameReserved(deployContractStore.name)
  }
  addOrUpdateCodeComment(code, name) {
    const nameCommentIsPresent = this.nameCommentIsPresent(code)
    if (nameCommentIsPresent) {
      const nameComment = `(* NAME_START:${name}:NAME_END *)`
      const indexOfStart = code.indexOf('NAME_START:') - 3
      const indexOfEnd = code.indexOf(':NAME_END') + 12
      const length = indexOfEnd - indexOfStart
      const stringToReplace = code.substr(indexOfStart, length)
      console.log('stringToReplace', stringToReplace)
      return code.replace(stringToReplace, nameComment)
    }
    const nameComment = `(* NAME_START:${name}:NAME_END *)\n`
    console.log('new nameComment', nameComment)
    const newCode = nameComment + code
    console.log('new nameComment', newCode)
    return newCode
  }

  nameCommentIsPresent(code) {
    const startIsPresent = startRegex.test(code)
    const endIsPresent = endRegex.test(code)
    return startIsPresent && endIsPresent
  }

  getNamefromCodeComment(code) {
    const startIsPresent = startRegex.test(code)
    const endIsPresent = endRegex.test(code)

    if (startIsPresent && endIsPresent) {
      const indexOfStart = code.indexOf('NAME_START:') + 11
      const indexOfEnd = code.indexOf(':NAME_END')
      const length = indexOfEnd - indexOfStart
      const name = code.substr(indexOfStart, length).trim()
      return name
    }
    return false
  }

  onDeployContractClicked = (confirmedPassword) => {
    this.props.deployContractStore.deploy(confirmedPassword)
  }

  get isFormValid() {
    const { deployContractStore } = this.props
    return this.isAmountValid && !isContractNameReserved(deployContractStore.name)
  }

  get isAmountValid() {
    const { portfolioStore, deployContractStore } = this.props
    return deployContractStore.blocksAmount &&
      calcMaxBlocksForContract(portfolioStore.zenBalance, deployContractStore.code.length)
        >= deployContractStore.blocksAmount
  }

  get isSubmitButtonDisabled() {
    const { deployContractStore } = this.props
    return !this.isFormValid || deployContractStore.inprogress
  }

  renderCancelIcon() {
    const { deployContractStore } = this.props
    if (deployContractStore.code) {
      return (
        <a className="cancel-button" onClick={deployContractStore.resetForm}>
          <img src={CANCEL_ICON_SRC} alt="Cancel chosen file" />
        </a>
      )
    }
  }

  renderSuccessResponse() {
    const { address, contractId, status } = this.props.deployContractStore
    if (address && status === 'success') {
      return (
        <FormResponseMessage className="success">
          <span>
            Contract has been successfully activated and added to your{' '}
            <Link to={routes.SAVED_CONTRACTS}>Saved Contracts</Link>
          </span>
          <div className="devider" />
          <p>Contract Id: {contractId}</p>
          <p>Contract Address: {address}</p>
        </FormResponseMessage>
      )
    }
  }

  renderErrorResponse() {
    if (this.props.deployContractStore.status !== 'error') {
      return null
    }
    return (
      <FormResponseMessage className="error">
        <span>
          There seems to be a problem with your contract. Please contact your
          developer and direct them to use the ZEN-SDK to test the contract.
          <br />
          SDK Link:{' '}
          <ExternalLink link="https://github.com/zenprotocol/ZFS-SDK">
            https://github.com/zenprotocol/ZFS-SDK
          </ExternalLink>
        </span>
      </FormResponseMessage>
    )
  }

  renderCodeSnippet() {
    const { deployContractStore } = this.props
    if (deployContractStore.code) {
      return (
        <Flexbox flexDirection="column" className="contract-code form-row">
          <label htmlFor="code">Code</label>
          <Highlight className="fsharp">
            {deployContractStore.code}
          </Highlight>
        </Flexbox>
      )
    }
  }

  updateBlocksAmountDisplay = (blocksAmountDisplay) => {
    const { deployContractStore } = this.props
    deployContractStore.updateBlocksAmountDisplay(blocksAmountDisplay)
  }

  render() {
    const {
      portfolioStore,
      deployContractStore: {
        dragDropText, name, blocksAmount, blocksAmountDisplay,
        code, inprogress, resetForm, formIsDirty,
      },
    } = this.props

    return (
      <Layout>
        <Flexbox flexDirection="column" className="send-tx-container">
          <Flexbox flexDirection="column" className="page-title">
            <h1>Upload a contract to the ACS</h1>
            <h3>
              By uploading a contract to the <span className="bold">Active Contract Set</span>, other peers can discover and run it for the amount of blocks you pay for.
            </h3>
          </Flexbox>

          <Flexbox flexDirection="column" className="form-container">
            <Flexbox flexDirection="column" className="destination-address-input form-row">
              <label htmlFor="to">Upload a contract from your computer</label>
              <Flexbox flexDirection="row" className="upload-contract-dropzone">
                <Dropzone
                  ref={(node) => { this.dropzoneRef = node }}
                  className={cx('dropzone', 'full-width', { 'file-chosen': !!code })}
                  activeClassName="active"
                  multiple={false}
                  accept=".fst"
                  onDrop={this.onDrop}
                >
                  <p>{dragDropText}</p>
                </Dropzone>
                {this.renderCancelIcon()}
                <button
                  className="button secondary button-on-right"
                  onClick={() => { this.dropzoneRef.open() }}
                >Upload
                </button>
              </Flexbox>
            </Flexbox>

            <Flexbox flexDirection="row" className="contract-name-and-amount form-row">
              <Flexbox flexGrow={2} flexDirection="column" className="contract-name with-input-on-right">
                <label htmlFor="to">Name Your Contract</label>
                <input
                  id="contract-name"
                  name="contract-name"
                  type="text"
                  placeholder={code ? 'Enter name' : 'Upload a contract before entering name'}
                  disabled={!code}
                  onChange={this.onContractNameChanged}
                  value={name}
                />
                {this.isContractNameReserved &&
                <span className="error-msg">This name is reserved</span>}
              </Flexbox>

              <AmountInput
                amount={blocksAmount}
                amountDisplay={blocksAmountDisplay}
                maxAmount={calcMaxBlocksForContract(portfolioStore.zenBalance, code.length)}
                exceedingErrorMessage="Insufficient funds for that many blocks"
                onAmountDisplayChanged={this.updateBlocksAmountDisplay}
                label="Number Of Blocks"
              />
            </Flexbox>
            {this.renderCodeSnippet()}
          </Flexbox>

          <Flexbox flexDirection="row">
            { this.renderSuccessResponse() }
            { this.renderErrorResponse() }
            <Flexbox flexGrow={2} />
            <Flexbox flexGrow={1} justifyContent="flex-end" flexDirection="row">
              <button
                className={cx('button-on-right', 'secondary')}
                disabled={!formIsDirty || inprogress}
                onClick={resetForm}
              >Clear form
              </button>
              <ProtectedButton
                className={cx('button-on-right', { loading: inprogress })}
                disabled={this.isSubmitButtonDisabled}
                onClick={this.onDeployContractClicked}
              >{inprogress ? 'Activating' : 'Activate'}
              </ProtectedButton>
            </Flexbox>
          </Flexbox>
        </Flexbox>
      </Layout>
    )
  }
}

export default DeployContract
