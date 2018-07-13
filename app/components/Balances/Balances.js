import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import Flexbox from 'flexbox-react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import Layout from '../UI/Layout/Layout'
import CopyableTableCell from '../UI/CopyableTableCell'

@inject('balances', 'transaction')
@observer
class Balances extends Component {
  componentDidMount() {
    this.props.balances.fetch()
  }

  render() {
    const { balances } = this.props
    const balancesRows = balances.assets.map(asset => (
      <React.Fragment key={asset.asset}>
        <tr>
          <td className="align-left text" title={asset.name}>{asset.name}</td>
          <CopyableTableCell string={asset.asset} />
          <td className="bright-blue" title={asset.balance}>
            {asset.balanceDisplay}
          </td>
          <td className="align-right" >
            <Link className="button small with-icon" to="/send-tx" title="Send Transaction" onClick={() => this.props.transaction.updateAsset(asset)}>
              <FontAwesomeIcon icon={['far', 'paper-plane']} /> <span className="button-text">Send</span>
            </Link>
          </td>
        </tr>
        <tr className="separator" />
      </React.Fragment>
    ))

    return (
      <Layout className="balances">

        <Flexbox className="page-title">
          <h1>Portfolio</h1>
        </Flexbox>

        <Flexbox className="balance-list">
          <table>
            <thead>
              <tr>
                <th className="align-left">Asset Name</th>
                <th className="align-left">Hash</th>
                <th className="align-left">Balance</th>
                <th className="align-right">Actions</th>
              </tr>
              <tr className="separator" />
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
