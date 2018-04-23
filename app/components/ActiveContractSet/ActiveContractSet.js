import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import Flexbox from 'flexbox-react'
import Highlight from 'react-highlight'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import Layout from '../UI/Layout/Layout'
import { truncateString, getNamefromCodeComment } from '../../../utils/helpers'
import CopyableTableCell from '../UI/CopyableTableCell'

@inject('activeContractSet')
@observer
class ActiveContractSet extends Component {
  state = {
    showCodeSnippetForContractAddress: '',
  }

  componentWillMount() {
    this.props.activeContractSet.fetch()
  }

  toggleCodeSnippet = (address) => {
    const { showCodeSnippetForContractAddress } = this.state
    if (showCodeSnippetForContractAddress === address) {
      this.setState({ showCodeSnippetForContractAddress: '' })
    } else {
      this.setState({ showCodeSnippetForContractAddress: address })
    }
  }

  render() {
    const { activeContractSet } = this.props
    const { copyText, showCodeSnippetForContractAddress } = this.state

    const activeContractsRows = activeContractSet.activeContracts.map((contract) => {
      const hash = truncateString(contract.contractHash)
      const address = truncateString(contract.address)
			const formattedBlock = contract.expire.toLocaleString()

      let codeSnippetClassNames,
        viewCodeButtonText
      if (showCodeSnippetForContractAddress === contract.address) {
        codeSnippetClassNames = 'code'
        viewCodeButtonText = 'Hide Code'
      } else {
        codeSnippetClassNames = 'code display-none'
        viewCodeButtonText = 'View Code'
      }

      return (
        <React.Fragment key={contract.contractHash}>
          <tr>
            <td className="text">{getNamefromCodeComment(contract.code)}</td>
            <CopyableTableCell string={contract.contractHash} />
            <CopyableTableCell string={contract.address} />
            <td title={`Block ${formattedBlock}`}>{formattedBlock}</td>
            <td className="align-right buttons">
              <a
                title='Show Code Snippet'
                onClick={() => { this.toggleCodeSnippet(contract.address) }}
                className="button secondary small margin-right code"
              >
                <FontAwesomeIcon icon={['far', 'code']} /> <span className="button-text">{viewCodeButtonText}</span>
              </a>
              <Link title='Run Contract' className="button small play" to={`/run-contract/${contract.address}`} >
                <FontAwesomeIcon icon={['far', 'play']} /> <span className="button-text">Run</span>
              </Link>
            </td>
          </tr>
          <tr className={codeSnippetClassNames}>
            <td colSpan="5">
              <Flexbox flexDirection="column" className="contract-code form-row">
                <Highlight className="fsharp">
                  {contract.code}
                </Highlight>
              </Flexbox>
            </td>
          </tr>
          <tr className="separator" />
        </React.Fragment>
      )
    })

    return (
      <Layout className="active-contract-set">
        <Flexbox flexDirection="column" className="active-contract-set-container">

          <Flexbox flexDirection="row" className="page-title" justifyContent="space-between">
            <Flexbox flexDirection="column">
              <h1>Active Contract Set</h1>
              <h3>
                The active contract set (ACS) contains all the contracts which can directly affect the network.
                <br />
                The Zen Protocol reduces network load by allowing contracts to leave the set when they are not needed, while still allowing the tokens they generate to move freely.
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
                {activeContractsRows}
              </tbody>
            </table>
          </Flexbox>

        </Flexbox>
      </Layout>
    )
  }
}

export default ActiveContractSet
