import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import autobind from 'class-autobind'
import {Link} from 'react-router-dom'
import Flexbox from 'flexbox-react'
import Highlight from 'react-highlight'
const {clipboard} = require('electron')

import Layout from '../UI/Layout/Layout'

import db from '../../services/store'
import {truncateString} from '../../../utils/helpers'

const contractList = db.get('savedContracts')

@inject('activeContractSet')
@observer
class ActiveContractSet extends Component {
  constructor(props) {
    super(props)
    this.state = {
      copyText: 'Copy'
    }
    autobind(this)
  }

  componentWillMount() {
    const {activeContractSet} = this.props
    activeContractSet.fetch()
  }

  copyToClipboard = (string) => {
    clipboard.writeText(string)
    this.setState({copyText: 'Copied to Clipboard'})
    setTimeout(() => {
      this.setState({copyText: 'Copy'})
    }, 1250)
  }

  render() {
    const {activeContractSet} = this.props
    const {copyText} = this.state

    const contractsWithNames = activeContractSet.contractsWithNames
    console.log('contractsWithNames', contractsWithNames)

    const activeContractsRows = contractsWithNames.map((contract) => {

      let hash = truncateString(contract.contractHash)
      let address = truncateString(contract.address)

      return (
        [
          <tbody>
            <tr key={contract.contractHash}>
              <td className='text'>{contract.name}</td>
              <td className='copyable'>
                <span title={contract.contractHash} >{hash} </span>
                <span
                  onClick={()=>{this.copyToClipboard(contract.contractHash)}}
                  data-balloon={copyText}
                  data-balloon-pos='up'>
                  <i className="fa fa-copy" ></i>
                </span>
              </td>
              <td className='copyable'>
                <span title={contract.address} >{address} </span>
                <span
                  onClick={()=>{this.copyToClipboard(contract.address)}}
                  data-balloon={copyText}
                  data-balloon-pos='up'>
                  <i className="fa fa-copy" ></i>
                </span>
              </td>
              <td>{contract.expire.toLocaleString()}</td>
              <td className='align-right'>
                <a href="#" className="button secondary small margin-right">
                  <i className="fa fa-code"></i> View Code
                </a>
                <Link className='button small' to={`/run-contract/${contract.address}`} >
                  <i className="fa fa-play"></i> Run
                </Link>
              </td>
            </tr>
          </tbody>,
          <tbody className='code'>
            <tr>
              <td colspan="5">
                <Flexbox flexDirection="column" className="contract-code form-row">
                  <Highlight className='fsharp'>
                    {contract.code}
                  </Highlight>
                </Flexbox>
              </td>
            </tr>
          </tbody>
        ]
      )

    })

    return (
      <Layout className="active-contract-set">
        <Flexbox flexDirection="column" className="active-contract-set-container">

          <Flexbox flexDirection="row">
            <Flexbox flexDirection="column" className='page-title'>
              <h1>Explore Contracts - Active Contract Set</h1>
              <h3>
                The active contract set (ACS) contains all the contracts which can directly affect the network.
                <br/>
                The Zen Protocol reduces network load by allowing contracts to leave the set when they are not needed, while still allowing the tokens they generate to move freely.
  						</h3>
            </Flexbox>
            <Flexbox flexGrow={2}></Flexbox>
            <Flexbox flexGrow={1} justifyContent='flex-end' class-name='page-buttons'>
              <Link className='button' to="/activate-contract">
                Upload Contract
              </Link>
            </Flexbox>
          </Flexbox>

          <Flexbox className='contracts-list' flexGrow={1}>
            <table>
              <thead>
                <tr>
                  <th>Contract Name</th>
                  <th>Hash</th>
                  <th>Address</th>
                  <th>Active Until Block</th>
                  <th className='align-right'>Actions</th>
                </tr>
              </thead>
              {activeContractsRows}
            </table>
          </Flexbox>

        </Flexbox>
      </Layout>
    )
  }
}

export default ActiveContractSet
