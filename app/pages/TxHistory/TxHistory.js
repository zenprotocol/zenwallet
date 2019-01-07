// @flow
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Flexbox from 'flexbox-react'
import ReactTable from 'react-table'
import cx from 'classnames'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import { normalizeTokens, isZenAsset } from '../../utils/zenUtils'
import Layout from '../../components/Layout'
import ReactTablePagination from '../../components/ReactTablePagination'
import CopyableTableCell from '../../components/CopyableTableCell'
import Dropdown from '../../components/Dropdown'
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
  componentWillMount() {
    this.props.txHistoryStore.fetch()
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
        accessor: tx => this.blockNumber(tx),
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

  get renderSelectPageSize() {
    const { pageSize, pageSizeOptions } = this.props.txHistoryStore
    return (
      <div className="select-page-size">
        <span >SHOW</span>
        <Dropdown
          options={pageSizeOptions}
          value={String(pageSize)}
          onChange={this.selectPageSize}
        />
        <span>ENTRIES</span>
      </div>
    )
  }

  selectPageSize = (selected: { value: string }) => {
    this.props.txHistoryStore.selectPageSize(Number(selected.value))
  }

  render() {
    const {
      pageSize, pagesCount, pageIdx, transactions, onPageChange,
    } = this.props.txHistoryStore
    return (
      <Layout className="tx-history">
        <Flexbox className="page-title">
          <h1>Transactions</h1>
          {this.renderSelectPageSize}
        </Flexbox>
        <Flexbox className="balance-list">
          <ReactTable
            page={pageIdx}
            manual
            onPageChange={onPageChange}
            pages={pagesCount}
            PaginationComponent={ReactTablePagination}
            className="align-left-headers"
            minRows={1}
            data={transactions}
            pageSize={pageSize}
            columns={this.columns}
            previousText={<FontAwesomeIcon icon={['fas', 'angle-double-left']} />}
            nextText={<FontAwesomeIcon icon={['fas', 'angle-double-right']} />}
          />
        </Flexbox>
      </Layout>
    )
  }
}

export default TxHistory
