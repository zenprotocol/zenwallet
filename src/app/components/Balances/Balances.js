import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import autobind from 'class-autobind'
import {Link} from 'react-router-dom'
import Flexbox from 'flexbox-react'

import Layout from '../UI/Layout/Layout'

@inject('balance')
@observer
class Balances extends Component {
  constructor() {
    super()
    autobind(this)
  }

  componentDidMount() {
    const {balance} = this.props
    balance.fetch()
  }

  render() {
    const {balance} = this.props

    const balances = balance.assets.map(asset => {
      return (
        <tr key={asset.asset}>
          <td className='align-left' >{asset.asset}</td>
          <td className='align-right bright-blue' >{asset.balance}</td>
        </tr>
      )
    })

    return (
      <Layout className="balances">

        <Flexbox className='page-title'>
          <h1>Balances</h1>
        </Flexbox>

        <Flexbox className="balance-list">
          <table>
            <thead>
              <tr>
                <th className='align-left' >Asset Name / Hash</th>
                <th className='align-right' >Amount</th>
              </tr>
            </thead>
            <tbody>
              {balances}
            </tbody>
          </table>
        </Flexbox>

    </Layout>
  )
}
}

export default Balances
