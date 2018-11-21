// @flow
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Flexbox from 'flexbox-react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import ReactTable from 'react-table'
import cx from 'classnames'

import { normalizeTokens, isZenAsset } from '../../utils/zenUtils'
import Layout from '../../components/Layout'
import OnScrollBottom from '../../components/OnScrollBottom'
import CopyableTableCell from '../../components/CopyableTableCell'
import ZpIoLink from '../../components/ZpIoLink'
import TransactionHistoryState from '../../stores/txHistoryStore'
import PortfolioState from '../../stores/portfolioStore'
import NetworkState from '../../stores/networkStore'

type Props = {
  txHistoryStore: TransactionHistoryState,
  portfolioStore: PortfolioState,
  networkStore: NetworkState
};

@inject('txHistoryStore', 'portfolioStore', 'networkStore')
@observer
class TxHistory extends Component<Props> {
  componentDidMount() {
    this.props.txHistoryStore.initPolling()
  }

  componentWillUnmount() {
    this.props.txHistoryStore.reset()
  }

  renderLoadingTransactions() {
    return (
      <tr className="loading-transactions">
        <td colSpan={5}>
          <Flexbox>
            <Flexbox flexGrow={1} >Loading transactions ...</Flexbox>
            <FontAwesomeIcon icon={['far', 'spinner-third']} spin />
          </Flexbox>
        </td>
      </tr>
    )
  }

  blockNumber(tx) {
    return String((this.props.networkStore.headers - tx.confirmations) + 1)
  }

  getDisplayAmount(tx) {
    const { asset, amount } = tx
    return normalizeTokens(amount, isZenAsset(asset))
  }

  get columns() {
    return [
      {
        Header: 'Transaction Hash',
        id: 'txHash',
        accessor: tx => <CopyableTableCell string={tx.txHash} isTx isReactTable />,
      },
      {
        Header: 'Asset Identifier',
        accessor: 'asset',
      },
      {
        Header: 'Asset Name',
        id: 'assetName',
        accessor: tx => this.props.portfolioStore.getAssetName(tx.asset),
      },
      {
        Header: 'Block',
        id: 'block',
        accessor: tx => (
          <ZpIoLink path={this.blockNumber(tx)}>
            {this.blockNumber(tx)}
          </ZpIoLink>
        ),
      },
      {
        Header: 'Confirmations',
        accessor: 'confirmations',
      },
      {
        Header: () => <div className="align-right">Amount</div>,
        id: 'amount',
        accessor: tx => (
          <div className={cx('amount align-right', tx.amount > 0 ? 'green' : 'red')}>
            {this.getDisplayAmount(tx)}
          </div>
        ),
      }]
  }

  render() {
    const { txHistoryStore } = this.props
    return (
      <Layout className="balances">

        <Flexbox className="page-title">
          <h1>Transactions</h1>
        </Flexbox>

        <Flexbox className="balance-list">
          <ReactTable
            className="align-left-headers"
            minRows={1}
            data={txHistoryStore.transactions}
            columns={this.columns}
          />
        </Flexbox>
        <OnScrollBottom onScrollBottom={txHistoryStore.fetch} />
      </Layout>
    )
  }
}

export default TxHistory
