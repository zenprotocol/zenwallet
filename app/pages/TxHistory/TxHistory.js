// @flow
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Flexbox from 'flexbox-react'
import ReactTable from 'react-table'
import cx from 'classnames'


import { normalizeTokens, isZenAsset } from '../../utils/zenUtils'
import Layout from '../../components/Layout'
import ReactTablePagination from '../../components/ReactTablePagination'
import CopyableTableCell from '../../components/CopyableTableCell'
import Dropdown from '../../components/Dropdown'
import TransactionHistoryState from '../../stores/txHistoryStore'
import PortfolioState from '../../stores/portfolioStore'
import NetworkState from '../../stores/networkStore'
import FontAwesomeIcon from '../../vendor/@fortawesome/react-fontawesome'

type Props = {
  txHistoryStore: TransactionHistoryState,
  portfolioStore: PortfolioState,
  networkStore: NetworkState
};

@inject('txHistoryStore', 'portfolioStore', 'networkStore')
@observer
class TxHistory extends Component<Props> {
  componentDidMount() {
    this.props.txHistoryStore.fetch()
    this.props.txHistoryStore.initPolling()
    this.props.txHistoryStore.resetNewTxsCountSinceUserVisitedTransactionsPage()
  }

  blockNumber(tx) {
    return (
      <CopyableTableCell
        string={String((this.props.networkStore.headers - tx.confirmations) + 1)}
        isBlock
        isReactTable
      />
    )
  }

  getDisplayAmount(tx) {
    const { asset, amount } = tx
    const sign = tx.amount > 0 ? '+' : ''
    return sign + normalizeTokens(amount, isZenAsset(asset))
  }

  get columns() {
    return [
      {
        Header: 'Transaction Hash',
        id: 'txHash',
        accessor: tx => <CopyableTableCell string={tx.txHash} isTx isReactTable />,
        headerStyle: { outline: 0 },
      },
      {
        Header: 'Asset Identifier',
        accessor: 'asset',
        headerStyle: { outline: 0 },
      },
      {
        Header: 'Asset Name',
        id: 'assetName',
        accessor: tx => this.props.portfolioStore.getAssetName(tx.asset),
        headerStyle: { outline: 0 },
      },
      {
        Header: 'Block',
        id: 'block',
        accessor: tx => this.blockNumber(tx),
        headerStyle: { outline: 0 },
      },
      {
        Header: 'Confirmations',
        accessor: 'confirmations',
        headerStyle: { outline: 0 },
      },
      {
        Header: 'Type',
        id: 'lockType',
        accessor: tx => Object.keys(tx.lock)[0],
        headerStyle: { outline: 0 },
      },
      {
        Header: () => <div className="align-right">Amount</div>,
        id: 'amount',
        accessor: tx => (
          <div className={cx('amount align-right')}>
            {this.getDisplayAmount(tx)}
          </div>
        ),
        headerStyle: { outline: 0 },
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
            minRows={transactions ? 1 : 5}
            resizable={false}
            sortable={false}
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
