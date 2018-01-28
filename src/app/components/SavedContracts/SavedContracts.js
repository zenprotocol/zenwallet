import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import autobind from 'class-autobind'
import {Link} from 'react-router-dom'
import Flexbox from 'flexbox-react'

import Layout from '../UI/Layout/Layout'

import db from '../../services/store'
import {truncateString} from '../../../utils/helpers'

db.defaults({
  savedContracts: [
    { name: 'Testing 123', hash: 'asdf234sadflkj', contractAddress: 'asdf234sadflkj'},
    { name: 'Testing another', hash: 'asdf234sadflkj', contractAddress: 'asdf234sadflkj' }
  ]
}).write()

const contractList = db.get('savedContracts')

class SavedContracts extends Component {
  constructor(props) {
    super(props)
    autobind(this)
  }

  onRemoveContractClicked() {
    const {contractMessage} = this.props
    contractMessage.sendContractMessage(contractMessage)
  }

  render() {

    const listOfContracts = contractList.value()

    const savedContracts = listOfContracts.map((contract, index) => {

      let address = truncateString(contract.address)
      let hash = truncateString(contract.hash)

      return (
        <tr key={contract.name}>
          <td>{index}</td>
          <td>{contract.name}</td>
          <td><span title={contract.address} >{address}</span></td>
          <td><span title={contract.hash} >{hash}</span></td>
          <td></td>
        </tr>
      )
    })

    return (
      <Layout className="saved-contracts">
        <Flexbox flexDirection="column" className="saved-contracts-container">

          <Flexbox className='page-title'>
            <h1>Saved Contracts</h1>
          </Flexbox>

          <Flexbox className='contracts-list' flexGrow={1}>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Hash</th>
                </tr>
              </thead>
              <tbody>
                {savedContracts}
              </tbody>
            </table>
          </Flexbox>

        </Flexbox>
      </Layout>
    )
  }
}

export default SavedContracts
