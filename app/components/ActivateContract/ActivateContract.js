import React, { Component } from 'react'
import { inject, observer, PropTypes as PropTypesMobx } from 'mobx-react'
import { Link } from 'react-router-dom'
import Flexbox from 'flexbox-react'
import Dropzone from 'react-dropzone'
import PropTypes from 'prop-types'
import { head } from 'lodash'
import Highlight from 'react-highlight'

import { normalizeTokens, zenToKalapa, stringToNumber } from '../../utils/helpers'
import { CANCEL_ICON_SRC } from '../../constants/imgSources'
import Layout from '../UI/Layout/Layout'
import FormResponseMessage from '../UI/FormResponseMessage/FormResponseMessage'
import AmountInput from '../UI/AmountInput/AmountInput'

const { shell } = require('electron')

const startRegex = /NAME_START:/
const endRegex = /:NAME_END/

@inject('contract')
@inject('balances')
@observer
class ActivateContract extends Component {
  static propTypes = {
    contract: PropTypes.shape({
      name: PropTypes.string,
      status: PropTypes.string,
      address: PropTypes.string,
      contractId: PropTypes.string,
      dragDropText: PropTypes.string,
      inprogress: PropTypes.boolean,
      acceptedFiles: PropTypesMobx.observableArray,
      rejectedFiles: PropTypesMobx.observableArray,
      resetForm: PropTypes.func,
      activateContract: PropTypes.func,
    }).isRequired,
    balances: PropTypes.shape({
      zen: PropTypes.string,
    }).isRequired,
  }

  componentWillUnmount() {
    if (this.props.contract.status === 'success') {
      this.props.contract.resetForm()
    }
  }

  onDrop(acceptedFiles, rejectedFiles) {
    const { contract } = this.props
    acceptedFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => {
        const fileAsBinaryString = reader.result
        contract.code = fileAsBinaryString
        const codeFromComment = this.getNamefromCodeComment(fileAsBinaryString)
        if (codeFromComment) {
          contract.name = codeFromComment
        }
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

  onContractNameChanged = (evt) => {
    const { contract } = this.props
    const newValue = evt.target.value
    const isValidValue = /^[a-z0-9\s]+$/i.test(newValue)
    if (!isValidValue && newValue !== '') { return }
    contract.name = evt.target.value
    if (contract.acceptedFiles.length > 0 && contract.code) {
      contract.code = this.addOrUpdateCodeComment(contract.code, evt.target.value)
    }
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

  onActivateContractClicked = () => this.props.contract.activateContract()

  validateForm() {
    const { name, acceptedFiles } = this.props.contract
    return this.isAmountValid() && (acceptedFiles.length === 1) && !!name
  }

  isAmountValid() {
    const { numberOfBlocks, code } = this.props.contract
    return calcMaxBlocksForContract(this.props.balances.zen, code.length) >= numberOfBlocks
  }

  isSubmitButtonDisabled() {
    const { inprogress } = this.props.contract
    const formIsValid = this.validateForm()

    if (formIsValid && inprogress) { return true }
    if (!formIsValid) { return true }
    if (formIsValid) { return false }
  }

  renderActivateButtonText() {
    const { inprogress } = this.props.contract
    return (inprogress ? 'Activating' : 'Activate')
  }

  renderClassNames() {
    const { inprogress } = this.props.contract
    return (inprogress ? 'button-on-right loading' : 'button-on-right')
  }

  renderCancelIcon() {
    const { acceptedFiles } = this.props.contract
    if (acceptedFiles.length === 1) {
      return (
        <a className="cancel-button" onClick={this.onCancelChosenFiledClicked}>
          <img src={CANCEL_ICON_SRC} alt="Cancel chosen file" />
        </a>
      )
    }
  }

  onCancelChosenFiledClicked = () => {
    const { contract } = this.props
    contract.acceptedFiles = []
    contract.resetDragDropText()
  }

  renderDropZoneClassName() {
    const isFileChosen = this.props.contract.acceptedFiles.length === 1
    return (isFileChosen ? 'dropzone full-width file-chosen' : 'dropzone full-width')
  }

  renderSuccessResponse() {
    const { address, contractId, status } = this.props.contract

    if (address && contractId && status === 'success') {
      return (
        <FormResponseMessage className="success">
          <span>
            Contract has been successfully activated and added to your <Link to="/saved-contracts">Saved Contracts</Link>
          </span>
          <div className="devider" />
          <p>Contract Hash: {contractId}</p>
          <p>Contract Address: {address}</p>
        </FormResponseMessage>
      )
    }
  }

  onLinkClick = (evt) => {
    evt.preventDefault()
    shell.openExternal(evt.target.href)
  }

  renderErrorResponse() {
    if (this.props.contract.status !== 'error') {
      return null
    }
    return (
      <FormResponseMessage className="error">
        <span>
          There seems to be a problem with your contract. Please contact your
          developer and direct them to use the ZEN-SDK to test the contract.
          <br />
          SDK Link:
          <a
            href="https://github.com/zenprotocol/ZFS-SDK"
            onClick={this.onLinkClick}
          >
            https://github.com/zenprotocol/ZFS-SDK
          </a>
        </span>
      </FormResponseMessage>
    )
  }

  renderCodeSnippet() {
    const { code, acceptedFiles } = this.props.contract
    if (acceptedFiles.length === 1 && code) {
      return (
        <Flexbox flexDirection="column" className="contract-code form-row">
          <label htmlFor="code">Code</label>
          <Highlight className="fsharp">
            {code}
          </Highlight>
        </Flexbox>
      )
    }
  }

  renderCostToActivate() {
    const { contract } = this.props
    const { code, acceptedFiles, numberOfBlocks } = contract
    if (acceptedFiles.length === 1 && code.length > 0 && numberOfBlocks > 0) {
      let unitOfAccountText
      const activationCostInKalapa = code.length * numberOfBlocks
      if (activationCostInKalapa > 1000000) {
        const newValue = normalizeTokens(activationCostInKalapa, true)
        unitOfAccountText = `${newValue} ZENP`
      } else {
        unitOfAccountText = `${activationCostInKalapa.toLocaleString()} Kalapas`
      }
      return (
        <Flexbox flexGrow={1} flexDirection="row" className="form-response-message">
          <span className="key">Activation cost: </span>
          <span className="value">{unitOfAccountText}</span>
        </Flexbox>
      )
    }
  }

  updateBlocksAmount = (amount) => {
    this.props.contract.numberOfBlocks = amount
  }

  render() {
    const {
      dragDropText, name, numberOfBlocks, code,
    } = this.props.contract

    let dropzoneRef

    return (
      <Layout className="activate-contract">
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
                  ref={(node) => { dropzoneRef = node }}
                  className={this.renderDropZoneClassName()}
                  activeClassName="active"
                  multiple={false}
                  accept=".fst"
                  onDrop={this.onDrop.bind(this)}
                >
                  <p>{dragDropText}</p>
                </Dropzone>
                {this.renderCancelIcon()}
                <button
                  className="button secondary button-on-right"
                  onClick={() => { dropzoneRef.open() }}
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
                  onChange={this.onContractNameChanged}
                  value={name}
                />
              </Flexbox>

              <AmountInput
                amount={numberOfBlocks}
                maxAmount={String(calcMaxBlocksForContract(this.props.balances.zen, code.length))}
                exceedingErrorMessage="Insufficient funds for that many blocks"
                onUpdateParent={this.updateBlocksAmount}
                label="Number Of Blocks"
              />

            </Flexbox>

            {this.renderCodeSnippet()}

          </Flexbox>

          <Flexbox flexDirection="row">
            { this.renderCostToActivate() }
            { this.renderSuccessResponse() }
            { this.renderErrorResponse() }
            <Flexbox flexGrow={2} />
            <Flexbox flexGrow={1} justifyContent="flex-end" flexDirection="row">
              <button
                className={this.renderClassNames()}
                disabled={this.isSubmitButtonDisabled()}
                onClick={this.onActivateContractClicked}
              >{this.renderActivateButtonText()}
              </button>
            </Flexbox>
          </Flexbox>
        </Flexbox>
      </Layout>
    )
  }
}

export default ActivateContract

export function calcMaxBlocksForContract(zenBalance, codeLength) {
  // TODO [AdGo] 06/05/18 - fix predicitibility of zen balance to number or string
  // and enfore triple === check
  if (zenBalance == 0 || codeLength === 0) {
    return 0
  }
  const zenBalanceInKalapas = zenToKalapa(stringToNumber(zenBalance))
  return parseInt((zenBalanceInKalapas / codeLength), 10)
}
