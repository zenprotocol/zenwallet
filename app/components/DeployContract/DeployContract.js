import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import Flexbox from 'flexbox-react'
import Dropzone from 'react-dropzone'
import Highlight from 'react-highlight'
import cx from 'classnames'
import swal from 'sweetalert'

import { ZEN_ASSET_NAME, ZEN_ASSET_HASH } from '../../constants'
import enforceSynced from '../../services/enforceSynced'
import confirmPasswordModal from '../../services/confirmPasswordModal'
import { zenToKalapas } from '../../utils/zenUtils'
import { CANCEL_ICON_SRC } from '../../constants/imgSources'
import Layout from '../UI/Layout/Layout'
import FormResponseMessage from '../UI/FormResponseMessage/FormResponseMessage'
import AmountInput from '../UI/AmountInput/AmountInput'
import ExternalLink from '../UI/ExternalLink'
import DeployContractState from '../../states/deploy-contract-state'
import BalancesState from '../../states/balances-state'

const startRegex = /NAME_START:/
const endRegex = /:NAME_END/

type Props = {
  deployContractState: DeployContractState,
  balances: BalancesState
};

@inject('deployContractState', 'balances')
@observer
class DeployContract extends Component<Props> {
  componentWillUnmount() {
    const { deployContractState } = this.props
    if (deployContractState.status.match(/success|error/)) {
      deployContractState.resetForm()
    }
  }
  dropzoneRef = null
  onDrop = ([contractFile], [rejectedFile]) => {
    if (rejectedFile) {
      swal({ title: 'file invalid', text: 'only .fst files are accepted', icon: 'error' })
      return
    }
    const { deployContractState } = this.props
    const reader = new FileReader()
    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => swal({ title: 'upload failed', icon: 'error' })
    reader.readAsBinaryString(contractFile)
    reader.onload = () => {
      const fileAsBinaryString = reader.result
      deployContractState.code = fileAsBinaryString
      const codeFromComment = this.getNamefromCodeComment(fileAsBinaryString)
      deployContractState.name = codeFromComment || '' // reset name in case a contract file with name was uploaded but not deployed before
    }
    deployContractState.dragDropText = contractFile.name
  }

  onContractNameChanged = (evt) => {
    const { deployContractState } = this.props
    const newValue = evt.target.value
    const isValidValue = /^[a-z0-9\s]+$/i.test(newValue)
    if (!isValidValue && newValue !== '') { return }
    deployContractState.name = newValue
    if (deployContractState.code) {
      deployContractState.code = this.addOrUpdateCodeComment(deployContractState.code, newValue)
    }
  }
  get isContractNameReserved() {
    const { deployContractState } = this.props
    const reg = new RegExp(`^(${ZEN_ASSET_NAME}|${ZEN_ASSET_HASH})$`, 'i')
    return deployContractState.name.match(reg)
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

  onDeployContractClicked = async () => {
    const confirmedPassword = await confirmPasswordModal()
    if (!confirmedPassword) {
      return
    }
    this.props.deployContractState.DeployContract(confirmedPassword)
  }

  get isFormValid() {
    const { deployContractState } = this.props
    return this.isAmountValid && !!deployContractState.name && !this.isContractNameReserved
  }

  get isAmountValid() {
    const { balances, deployContractState } = this.props
    return deployContractState.blocksAmount &&
      calcMaxBlocksForContract(balances.zenBalance, deployContractState.code.length)
        >= deployContractState.blocksAmount
  }

  get isSubmitButtonDisabled() {
    const { deployContractState } = this.props
    return !this.isFormValid || deployContractState.inprogress
  }

  renderCancelIcon() {
    const { deployContractState } = this.props
    if (deployContractState.code) {
      return (
        <a className="cancel-button" onClick={deployContractState.resetForm}>
          <img src={CANCEL_ICON_SRC} alt="Cancel chosen file" />
        </a>
      )
    }
  }

  renderSuccessResponse() {
    const { address, contractId, status } = this.props.deployContractState
    if (address && status === 'success') {
      return (
        <FormResponseMessage className="success">
          <span>
            Contract has been successfully activated and added to your <Link to="/saved-contracts">Saved Contracts</Link>
          </span>
          <div className="devider" />
          <p>Contract Id: {contractId}</p>
          <p>Contract Address: {address}</p>
        </FormResponseMessage>
      )
    }
  }

  renderErrorResponse() {
    if (this.props.deployContractState.status !== 'error') {
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
    const { deployContractState } = this.props
    if (deployContractState.code) {
      return (
        <Flexbox flexDirection="column" className="contract-code form-row">
          <label htmlFor="code">Code</label>
          <Highlight className="fsharp">
            {deployContractState.code}
          </Highlight>
        </Flexbox>
      )
    }
  }

  updateBlocksAmountDisplay = (blocksAmountDisplay) => {
    const { deployContractState } = this.props
    deployContractState.updateBlocksAmountDisplay(blocksAmountDisplay)
  }

  render() {
    const {
      dragDropText, name, blocksAmount, blocksAmountDisplay,
      code, inprogress, resetForm, formIsDirty,
    } = this.props.deployContractState

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
                maxAmount={calcMaxBlocksForContract(this.props.balances.zenBalance, code.length)}
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
              <button
                className={cx('button-on-right', { loading: inprogress })}
                disabled={this.isSubmitButtonDisabled}
                onClick={enforceSynced(this.onDeployContractClicked)}
              >{inprogress ? 'Activating' : 'Activate'}
              </button>
            </Flexbox>
          </Flexbox>
        </Flexbox>
      </Layout>
    )
  }
}

export default DeployContract

export function calcMaxBlocksForContract(zenBalance, codeLength) {
  if (zenBalance === 0 || codeLength === 0) {
    return 0
  }
  const kalapasBalance = zenToKalapas(zenBalance)
  return parseInt((kalapasBalance / codeLength), 10)
}
