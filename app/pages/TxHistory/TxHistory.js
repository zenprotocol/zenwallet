// @flow
import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import Flexbox from 'flexbox-react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import Layout from '../../components/Layout'
import OnScrollBottom from '../../components/OnScrollBottom'
import CopyableTableCell from '../../components/CopyableTableCell'
import TransactionHistoryState from '../../stores/txHistoryStore'

import SingleTxDelta from './SingleTxDelta'

type Props = {
  txHistoryStore: TransactionHistoryState
};

@inject('txHistoryStore')
@observer
class TxHistory extends Component<Props> {
  componentDidMount() {
    this.props.txHistoryStore.initPolling()
  }

  componentWillUnmount() {
    this.props.txHistoryStore.reset()
  }

  renderRows() {
    const { txHistoryStore } = this.props
    return txHistoryStore.transactions.map((tx, index) => (
      <Fragment key={`${tx.txHash}-${index}`}>
        <tr>
          <CopyableTableCell string={tx.txHash} istx />
          {/* $FlowIssue */}
          <SingleTxDelta tx={tx} />
        </tr>
        <tr className="separator" />
      </Fragment>
    ))
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
  render() {
    const { txHistoryStore } = this.props
    return (
      <Layout className="balances">

        <Flexbox className="page-title">
          <h1>Transactions</h1>
        </Flexbox>

        <Flexbox className="balance-list">
          <table>
            <thead>
              <tr>
                <th className="align-left">Transaction Hash</th>
                <th className="align-left">Asset Identifier</th>
                <th className="align-left">Asset Name</th>
                <th className="align-left">Block</th>
                <th className="align-left">Confirmations</th>
                <th className="align-right">Amount</th>
              </tr>
              <tr className="separator" />
            </thead>
            <tbody>
              { this.renderRows() }
              {/* { txHistoryStore.isFetching && this.renderLoadingTransactions() } */}
            </tbody>
          </table>
        </Flexbox>
        <OnScrollBottom onScrollBottom={txHistoryStore.fetch} />
      </Layout>
    )
  }
}

export default TxHistory
