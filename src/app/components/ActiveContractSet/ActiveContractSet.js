import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import autobind from 'class-autobind'
import {Link} from 'react-router-dom'
import Flexbox from 'flexbox-react'
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
            <Link className='button small margin-right' to={`/run-contract/${contract.address}`} >Run</Link>
          </td>
        </tr>
      )

    })

    console.log('activeContractsRows', activeContractsRows)

    return (
      <Layout className="active-contract-set">
        <Flexbox flexDirection="column" className="active-contract-set-container">

          <Flexbox className='page-title'>
            <h1>Active Contracts</h1>
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
