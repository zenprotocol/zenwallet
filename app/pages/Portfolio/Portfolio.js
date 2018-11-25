// @flow

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import Flexbox from 'flexbox-react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import Layout from '../../components/Layout'
import CopyableTableCell from '../../components/CopyableTableCell'
import PortfolioStore from '../../stores/portfolioStore'
import SendTxStore from '../../stores/sendTxStore'
import routes from '../../constants/routes'

type Props = {
  portfolioStore: PortfolioStore,
  sendTxStore: SendTxStore
};

@inject('portfolioStore', 'sendTxStore')
@observer
class Balances extends Component<Props> {
  componentDidMount() {
    this.props.portfolioStore.fetch()
  }

  get balancesRows() {
    const { portfolioStore } = this.props
    return portfolioStore.assets.map(asset => (
      <React.Fragment key={asset.asset}>
        <tr>
          <td className="align-left text" title={asset.name}>{asset.name}</td>
          <CopyableTableCell string={asset.asset} />
          <td className="bright-blue" title={asset.balance}>
            {asset.balanceDisplay}
          </td>
          <td className="align-right" >
            <Link className="button small with-icon" to={routes.SEND_TX} title="Send Transaction" onClick={() => this.props.sendTxStore.updateAsset(asset)}>
              <FontAwesomeIcon icon={['far', 'paper-plane']} /> <span className="button-text">Send</span>
            </Link>
          </td>
        </tr>
        <tr className="separator" />
      </React.Fragment>
    ))
  }
  render() {
    return (
      <Layout>
        <Flexbox className="page-title">
          <h1>Portfolio</h1>
        </Flexbox>
        <Flexbox className="balance-list">
          <table>
            <thead>
              <tr>
                <th className="align-left">Asset Name</th>
                <th className="align-left">Asset Identifier</th>
                <th className="align-left">Balance</th>
                <th className="align-right">Actions</th>
              </tr>
              <tr className="separator" />
            </thead>
            <tbody>
              {this.balancesRows}
            </tbody>
          </table>
        </Flexbox>
      </Layout>
    )
  }
}

export default Balances
