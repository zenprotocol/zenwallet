// @flow
import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import Flexbox from 'flexbox-react'
import Highlight from 'react-highlight'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import cx from 'classnames'

import routes from '../../constants/routes'
import Layout from '../../components/Layout'
import CopyableTableCell from '../../components/CopyableTableCell'
import ActiveContractsStore from '../../stores/activeContractsStore'
import RunContractStore from '../../stores/runContractStore'

type Props = {
  activeContractsStore: ActiveContractsStore,
  runContractStore: RunContractStore
};

type State = {
  showCodeSnippetForContractAddress: string
};

@inject('activeContractsStore', 'runContractStore')
@observer
class ActiveContracts extends Component<Props, State> {
  state = {
    showCodeSnippetForContractAddress: '',
  }

  componentDidMount() {
    this.props.activeContractsStore.initPolling()
  }

  componentWillUnmount() {
    this.props.activeContractsStore.stopPolling()
  }

  toggleCodeSnippet = (address: string) => {
    this.setState(({ showCodeSnippetForContractAddress }) => ({
      showCodeSnippetForContractAddress: showCodeSnippetForContractAddress === address ? '' : address,
    }))
  }

  renderActiveContractRows() {
    const { activeContractsStore, runContractStore } = this.props
    const { showCodeSnippetForContractAddress } = this.state
    return activeContractsStore.activeContracts.map((contract) => {
      const formattedActiveUntil = contract.expire.toLocaleString()
      const isCodeCurrentyViewed = showCodeSnippetForContractAddress === contract.address
      const isContractSavedToDb = runContractStore.isContractSavedToDb(contract.address)
      return (
        <Fragment key={contract.contractId}>
          <tr>
            <td className="text">{contract.name}</td>
            <CopyableTableCell string={contract.contractId} />
            <CopyableTableCell string={contract.address} />
            <td title={`Block ${formattedActiveUntil}`}>{formattedActiveUntil}</td>
            <td className="align-right buttons">
              <a
                title="Toggle Code Snippet"
                onClick={() => { this.toggleCodeSnippet(contract.address) }}
                className="button secondary small margin-right code"
              >
                <FontAwesomeIcon icon={['far', 'code']} /> <span className="button-text">Code</span>
              </a>
              <a
                title={isContractSavedToDb ? 'Contract already saved locally' : 'Save Contract'}
                onClick={() => (isContractSavedToDb ? null :
                  runContractStore.saveContractToDb(contract.address, { shouldToast: true }))}
                className={cx('button small margin-right save', { isDisabled: isContractSavedToDb })}
              >
                <FontAwesomeIcon icon={['far', 'download']} /> <span className="button-text">Save</span>
              </a>
              <Link title="Run Contract" className="button small play" to={routes.RUN_CONTRACT} onClick={() => this.props.runContractStore.updateAddress(contract.address)}>
                <FontAwesomeIcon icon={['far', 'play']} /> <span className="button-text">Run</span>
              </Link>
            </td>
          </tr>
          <tr className={cx('code', { 'display-none': !isCodeCurrentyViewed })}>
            <td colSpan="5">
              <Flexbox flexDirection="column" className="contract-code form-row">
                <Highlight className="fsharp">
                  {contract.code}
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
      <Layout className="active-contract-set">
        <Flexbox flexDirection="column" className="active-contracts-container">

          <Flexbox flexDirection="row" className="page-title" justifyContent="space-between">
            <Flexbox flexDirection="column">
              <h1>Active Contract Set</h1>
              <h3>
                The active contract set (ACS) contains all the contracts which
                can directly affect the network.
                <br />
                The Zen Protocol reduces network load by allowing contracts to
                leave the set when they are not needed, while still allowing
                the tokens they generate to move freely.
              </h3>
            </Flexbox>
            <Flexbox justifyContent="flex-end" className="page-buttons">
              <Link className="button with-icon" to={routes.DEPLOY_CONTRACT} title="Upload Contract">
                <FontAwesomeIcon icon={['far', 'cloud-upload']} /> <span className="button-text">Upload</span>
              </Link>
            </Flexbox>
          </Flexbox>

          <Flexbox className="contracts-list" flexGrow={1}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Hash</th>
                  <th>Address</th>
                  <th>Active Until</th>
                  <th className="align-right">Actions</th>
                </tr>
                <tr className="separator" />
              </thead>
              <tbody>
                {this.renderActiveContractRows()}
              </tbody>
            </table>
          </Flexbox>

        </Flexbox>
      </Layout>
    )
  }
}

export default ActiveContracts
