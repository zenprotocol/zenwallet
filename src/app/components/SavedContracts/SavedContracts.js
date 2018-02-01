import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import autobind from 'class-autobind'
import {Link} from 'react-router-dom'
import Flexbox from 'flexbox-react'
import swal from 'sweetalert'

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

  onDeleteClicked = (hash) => {
    swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this contract?",
      icon: "warning",
      dangerMode: true,
    })
    .then(willDelete => {
      if (willDelete) {
        db.get('savedContracts').remove({ hash: hash }).write()
        swal("Deleted!", `Your contract has been deleted!`, "success")
        this.forceUpdate()
      }
    })
  }

  render() {

    const listOfContracts = contractList.value()

    const savedContracts = listOfContracts.map((contract, index) => {

      let address = truncateString(contract.address)
      let hash = truncateString(contract.hash)

      return (
        <tr key={contract.hash}>
          <td>{contract.name}</td>
          <td><span title={contract.hash} >{hash}</span></td>
          <td><span title={contract.address} >{address}</span></td>
          <td>
            <Link className='button small' to={`/run-contract/${contract.address}`} >Run</Link>
            <button className='small alert' onClick={()=>{this.onDeleteClicked(contract.hash)}}>Delete</button>
          </td>
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
                  <th>Contract Name</th>
                  <th>Hash</th>
                  <th>Address</th>
                  <th>Actions</th>
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
