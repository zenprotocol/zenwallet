// @flow
import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import Flexbox from 'flexbox-react'
import swal from 'sweetalert'
import Highlight from 'react-highlight'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import cx from 'classnames'

import ActiveContractSetState from '../../states/acs-state'
import BalancesState from '../../states/balances-state'
import RunContractState from '../../states/run-contract-state'
import ContractState from '../../states/contract-state'
import Layout from '../UI/Layout/Layout'
import CopyableTableCell from '../UI/CopyableTableCell'
import db from '../../services/store'

const { Component, Fragment } = React
type Props = {
  activeContractSet: ActiveContractSetState,
  runContractState: RunContractState,
  contract: ContractState,
  balances: BalancesState
};

type State = {
  showCodeSnippetForContractAddress: string
};

type SavedContract = {
  contractId: string,
  address: string,
  code: string,
  isActive: boolean,
  isCodeCurrentlyViewed: boolean,
  expire: number,
  name: string
};

type DBSavedContract = {
  contractId?: string,
  address?: string,
  code?: string,
  name?: string
};

@inject('contract')
@inject('runContractState')
@inject('activeContractSet')
@inject('balances')
@observer
class SavedContracts extends Component<Props, State> {
  state = {
    showCodeSnippetForContractAddress: '',
  }

  componentDidMount() {
    this.props.activeContractSet.initPolling()
  }

  componentWillUnmount() {
    this.props.activeContractSet.stopPolling()
  }

  toggleCodeSnippet = (address: string) => {
    this.setState(({ showCodeSnippetForContractAddress }) => ({
      showCodeSnippetForContractAddress: showCodeSnippetForContractAddress === address ? '' : address,
    }))
  }

  onDeleteClicked = async (contractId: string) => {
    const cannotDelete = this.contractExistsInAssets(contractId)
    if (cannotDelete) {
      await swal({
        title: 'Can\'t delete contract',
        text: 'You have a matching asset for this contract in your portfolio.',
        icon: 'warning',
      })
      return
    }
    const userConfirmedDelete = await swal({
      title: 'Are you sure?',
      text: 'Are you sure that you want to delete this contract?',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    if (userConfirmedDelete) {
      db.get('savedContracts').remove({ contractId }).write()
      swal('Deleted!', 'Your contract has been deleted!', 'success')
    }
  }

  addRequiredFieldsToSavedContract = (savedContract: DBSavedContract): SavedContract => {
    const matchingActiveContract = this.props.activeContractSet.activeContracts
      .find(ac => ac.contractId === savedContract.contractId) || {}
    return {
      ...savedContract,
      code: savedContract.code || '',
      name: savedContract.name || '',
      expire: matchingActiveContract.expire || 0,
      isActive: !!matchingActiveContract.expire,
      isCodeCurrentlyViewed: this.state.showCodeSnippetForContractAddress === savedContract.address,
    }
  }

  sortSavedContractsByExpiry = (a: SavedContract, b: SavedContract): number => {
    const aExpire = a.expire || Number.MAX_VALUE
    const bExpire = b.expire || Number.MAX_VALUE
    return aExpire - bExpire
  }

  contractExistsInAssets = (contractId: string): boolean =>
    !!this.props.balances.assets.find(a => a.asset === contractId)

  renderSavedContractRow = (savedContract: SavedContract) => {
    const cannotDelete = this.contractExistsInAssets(savedContract.contractId)
    return (
      <Fragment key={savedContract.contractId}>
        <tr key={savedContract.contractId}>
          <td className="text">{savedContract.name}</td>
          <CopyableTableCell string={savedContract.contractId} />
          <CopyableTableCell string={savedContract.address} />
          <td>{ savedContract.isActive ? savedContract.expire.toLocaleString() : 'Inactive' }</td>
          <td className="align-right buttons">
            <a
              title="Toggle Code Snippet"
              onClick={() => { this.toggleCodeSnippet(savedContract.address) }}
              className="button secondary small margin-right code"
            >
              <FontAwesomeIcon icon={['far', 'code']} /> <span className="button-text">Code</span>
            </a>
            {
            savedContract.isActive ?
              (
                <Link title="Run Contract" className="button small play margin-right play-upload-button" to="/run-contract" onClick={() => this.props.runContractState.updateAddress(savedContract.address)}>
                  <FontAwesomeIcon icon={['far', 'play']} /> <span className="button-text">Run</span>
                </Link>
              ) : (
                <Link className="button small margin-right play-upload-button" to="/activate-contract" title="Upload Contract" onClick={() => { this.props.contract.prepareToUploadSavedContract(savedContract.name, savedContract.code) }}>
                  <FontAwesomeIcon icon={['far', 'cloud-upload']} /> <span className="button-text">Upload</span>
                </Link>
              )
          }
            {
              <a
                className="button small alert"
                aria-disabled={String(cannotDelete)}
                onClick={() => this.onDeleteClicked(savedContract.contractId)}
                title={cannotDelete ? 'Cant delete contract with matching asset (click for details)' : ''}
              >
                <FontAwesomeIcon icon={['far', 'trash']} />
              </a>
          }
          </td>
        </tr>
        <tr className={cx('code', { 'display-none': !savedContract.isCodeCurrentlyViewed })}>
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
  }

  renderSavedContractsRows(): React.Node[] {
    const savedContracts: DBSavedContract[] = db.get('savedContracts').value()
    return savedContracts
      .map(this.addRequiredFieldsToSavedContract)
      .sort(this.sortSavedContractsByExpiry)
      .map(this.renderSavedContractRow)
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
