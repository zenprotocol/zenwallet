import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import autobind from 'class-autobind'
import {Link} from 'react-router-dom'
import Flexbox from 'flexbox-react'
import Layout from '../UI/Layout/Layout'

@inject('balances')
@observer
class Balances extends Component {
  constructor() {
    super()
    autobind(this)
  }

  componentDidMount() {
    const {balances} = this.props
    balances.fetch()
  }

  render() {
    const {balances} = this.props

    const balancesRows = balances.assets.map(asset => {
      const assetWithName = balances.getAssetWithName(asset.asset)
      return (
        <tr key={asset.asset}>
          <td className='align-left' >{assetWithName}</td>
          <td className='bright-blue' >{asset.balance.toLocaleString()}</td>
          <td className='align-left' >
            <Link className='button small' to={`/send-tx/${asset.asset}`} >Send</Link>
          </td>
        </tr>
      )
    })

    return (
      <Layout className="balances">

        <Flexbox className='page-title'>
          <h1>Portfolio</h1>
        </Flexbox>

        <Flexbox className="balance-list">
          <table>
            <thead>
              <tr>
                <th className='align-left'>Asset Name / Hash</th>
                <th className='align-left'>Balance</th>
                <th className='align-left'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {balancesRows}
            </tbody>
          </table>
        </Flexbox>

    </Layout>
  )
}
}

export default Balances
