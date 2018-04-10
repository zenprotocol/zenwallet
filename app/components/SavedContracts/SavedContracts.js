import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Flexbox from 'flexbox-react'
import swal from 'sweetalert'

import Layout from '../UI/Layout/Layout'
import CopyableTableCell from '../UI/CopyableTableCell'
import db from '../../services/store'

const contractList = db.get('savedContracts')

class SavedContracts extends Component {
  onRemoveContractClicked() {
    this.props.contractMessage.sendContractMessage()
  }

  onDeleteClicked = (hash) => {
    swal({ // eslint-disable-line promise/catch-or-return
      title: 'Are you sure?',
      text: 'Are you sure that you want to delete this contract?',
      icon: 'warning',
      dangerMode: true,
    })
      .then(willDelete => {
        if (willDelete) { // eslint-disable-line promise/always-return
          db.get('savedContracts').remove({ hash }).write()
          swal('Deleted!', 'Your contract has been deleted!', 'success')
          this.forceUpdate()
        }
      })
  }

  render() {
    const listOfContracts = contractList.value()
    const savedContracts = listOfContracts.map((contract) => (
      <React.Fragment key={contract.hash}>
        <tr>
          <td className="text">{contract.name}</td>
          <CopyableTableCell string={contract.hash} />
          <CopyableTableCell string={contract.address} />
          <td className="align-right">
            <Link className="button small margin-right" to={`/run-contract/${contract.address}`} >Run</Link>
            <a className="button small alert" onClick={() => { this.onDeleteClicked(contract.hash) }}>Delete</a>
          </td>
        </tr>
        <tr className="separator" />
      </React.Fragment>
    ))

    return (
      <Layout className="saved-contracts">
        <Flexbox flexDirection="column" className="saved-contracts-container">

          <Flexbox flexDirection="column" className="page-title">
            <h1>Saved Contracts</h1>
            <h3>
              Saved contracts, are like your contract address book.
              <br />
              They get saved on your local machine, so you can re-activate them even after they have left the Active Contract Set.
            </h3>
          </Flexbox>


          <Flexbox className="contracts-list" flexGrow={1}>
            <table>
              <thead>
                <tr>
                  <th>Contract Name</th>
                  <th>Hash</th>
                  <th>Address</th>
                  <th className="align-right">Actions</th>
                </tr>
                <tr className="separator" />
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
