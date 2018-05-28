// @flow
import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import Flexbox from 'flexbox-react'
import Highlight from 'react-highlight'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import cx from 'classnames'

import Layout from '../UI/Layout/Layout'
import CopyableTableCell from '../UI/CopyableTableCell'
import ActiveContractSetState from '../../states/acs-state'
import ContractMessageState from '../../states/contract-message'

type Props = {
  activeContractSet: ActiveContractSetState,
  contractMessage: ContractMessageState
};

type State = {
  showCodeSnippetForContractAddress: string
};

@inject('contractMessage')
@inject('activeContractSet')
@observer
class ActiveContractSet extends Component<Props, State> {
  state = {
    showCodeSnippetForContractAddress: '',
  }

  componentWillMount() {
    this.props.activeContractSet.fetch()
  }

  toggleCodeSnippet = (address: string) => {
    this.setState(({ showCodeSnippetForContractAddress }) => ({
      showCodeSnippetForContractAddress: showCodeSnippetForContractAddress === address ? '' : address,
    }))
  }

  renderActiveContractRows() {
    const { activeContractSet } = this.props
    const { showCodeSnippetForContractAddress } = this.state
    return activeContractSet.activeContractsWithNames.map((contract) => {
      const formattedActiveUntil = contract.expire.toLocaleString()
      const isCodeCurrentyViewed = showCodeSnippetForContractAddress === contract.address
      const viewCodeButtonText = isCodeCurrentyViewed ? 'Hide Code' : 'View Code'
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
                <FontAwesomeIcon icon={['far', 'code']} /> <span className="button-text">{viewCodeButtonText}</span>
              </a>
              <Link title="Run Contract" className="button small play" to="/run-contract" onClick={() => this.props.contractMessage.updateAddress(contract.address)}>
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
        <Flexbox flexDirection="column" className="active-contract-set-container">

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
              <Link className="button with-icon" to="/activate-contract" title="Upload Contract">
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

export default ActiveContractSet
