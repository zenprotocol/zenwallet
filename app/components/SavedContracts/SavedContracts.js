// @flow
import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import Flexbox from 'flexbox-react'
import swal from 'sweetalert'
import Highlight from 'react-highlight'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import cx from 'classnames'

import ActiveContractSetState from '../../states/acs-state'
import ContractMessageState from '../../states/contract-message'
import ContractState from '../../states/contract-state'
import Layout from '../UI/Layout/Layout'
import CopyableTableCell from '../UI/CopyableTableCell'
import db from '../../services/store'

const contractList = db.get('savedContracts')

type Props = {
  activeContractSet: ActiveContractSetState,
  contractMessage: ContractMessageState,
  contract: ContractState
};

type State = {
  showCodeSnippetForContractAddress: string
};

@inject('contract')
@inject('contractMessage')
@inject('activeContractSet')
@observer
class SavedContracts extends Component<Props, State> {
  state = {
    showCodeSnippetForContractAddress: '',
  }

  toggleCodeSnippet = (address: string) => {
    this.setState(({ showCodeSnippetForContractAddress }) => ({
      showCodeSnippetForContractAddress: showCodeSnippetForContractAddress === address ? '' : address,
    }))
  }

  onDeleteClicked = (contractId: string) => {
    swal({ // eslint-disable-line promise/catch-or-return
      title: 'Are you sure?',
      text: 'Are you sure that you want to delete this contract?',
      icon: 'warning',
      dangerMode: true,
    })
      .then(willDelete => {
        if (willDelete) { // eslint-disable-line promise/always-return
          db.get('savedContracts').remove({ contractId }).write()
          swal('Deleted!', 'Your contract has been deleted!', 'success')
          this.forceUpdate()
        }
      })
  }

  renderSavedContractsRows() {
    const { activeContractSet } = this.props
    const listOfContracts = contractList.value()
    const { showCodeSnippetForContractAddress } = this.state
    return listOfContracts.map((savedContract) => {
      const isCodeCurrentyViewed = showCodeSnippetForContractAddress === savedContract.address
      const matchingActiveContract = activeContractSet.activeContracts
        .find(ac => ac.contractId === savedContract.contractId)
      return (
        <Fragment key={savedContract.contractId}>
          <tr key={savedContract.contractId}>
            <td className="text">{savedContract.name}</td>
            <CopyableTableCell string={savedContract.contractId} />
            <CopyableTableCell string={savedContract.address} />
            <td>{ matchingActiveContract ? matchingActiveContract.expire.toLocaleString() : 'Inactive' }</td>
            <td className="align-right buttons">
              {
                matchingActiveContract ?
                  (
                    <Link title="Run Contract" className="button small play margin-right play-upload-button" to="/run-contract" onClick={() => this.props.contractMessage.updateAddress(savedContract.address)}>
                      <FontAwesomeIcon icon={['far', 'play']} /> <span className="button-text">Run</span>
                    </Link>
                  ) : (
                    <Link className="button small margin-right play-upload-button" to="/activate-contract" title="Upload Contract" onClick={() => { this.props.contract.prepareToUploadSavedContract(savedContract.name, savedContract.code) }}>
                      <FontAwesomeIcon icon={['far', 'cloud-upload']} /> <span className="button-text">Upload</span>
                    </Link>
                  )
              }
              <a
                title="Toggle Code Snippet"
                onClick={() => { this.toggleCodeSnippet(savedContract.address) }}
                className="button secondary small margin-right code"
              >
                <FontAwesomeIcon icon={['far', 'code']} /> <span className="button-text">Code</span>
              </a>
              <a className="button small alert" onClick={() => { this.onDeleteClicked(savedContract.contractId) }}>
                <FontAwesomeIcon icon={['far', 'trash']} />
              </a>
            </td>
          </tr>
          <tr className={cx('code', { 'display-none': !isCodeCurrentyViewed })}>
            <td colSpan="5">
              <Flexbox flexDirection="column" className="contract-code form-row">
                <Highlight className="fsharp">
                  {savedContract.code}
                </Highlight>
              </Flexbox>
            </td>
          </tr>
          <tr className="separator" />
        </Fragment>
      )
    })
  }

  render() {
    return (
      <Layout className="saved-contracts">
        <Flexbox flexDirection="column" className="saved-contracts-container">

          <Flexbox flexDirection="column" className="page-title">
            <h1>Saved Contracts</h1>
            <h3>
              Saved contracts, are like your contract address book.
              <br />
              They get saved on your local machine, so you can re-activate them
              even after they have left the Active Contract Set.
            </h3>
          </Flexbox>


          <Flexbox className="contracts-list" flexGrow={1}>
            <table>
              <thead>
                <tr>
                  <th>Contract Name</th>
                  <th>Hash</th>
                  <th>Address</th>
                  <th>Active Until</th>
                  <th className="align-right">Actions</th>
                </tr>
                <tr className="separator" />
              </thead>
              <tbody>
                {this.renderSavedContractsRows()}
              </tbody>
            </table>
          </Flexbox>

        </Flexbox>
      </Layout>
    )
  }
}

export default SavedContracts
