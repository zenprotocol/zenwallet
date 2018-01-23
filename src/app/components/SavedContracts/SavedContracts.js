import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import autobind from 'class-autobind'
import {Link} from 'react-router-dom'
import Flexbox from 'flexbox-react'

import Layout from '../UI/Layout/Layout'

import db from '../../services/store'

db.defaults({
  savedContracts: [
    { name: 'Testing 123', hash: 'asdf234sadflkj', contractAddress: 'asdf234sadflkj'},
    { name: 'Testing another', hash: 'asdf234sadflkj', contractAddress: 'asdf234sadflkj' }
  ]
}).write()

class SavedContracts extends Component {
  constructor(props) {
    super(props)
    autobind(this)
  }

  render() {
    const contractList = db.get('savedContracts').value()

    const savedContracts = contractList.map((contract, index) => {
      return (
        <tr key={contract.name}>
          <td>{index}</td>
          <td>{contract.name}</td>
          <td>{contract.path}</td>
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
                  <th>Path</th>
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
