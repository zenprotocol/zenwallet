import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Flexbox from 'flexbox-react'
import PropTypes from 'prop-types'

import Layout from '../UI/Layout/Layout'

@inject('blockchainLogsState')
@observer
class BlockchainLogs extends Component {
  static propTypes = {
    blockchainLogsState: PropTypes.shape({
      logs: PropTypes.array.isRequired,
    }).isRequired,
  }

  render() {
    const { blockchainLogsState } = this.props

    return (
      <Layout className="balances">

        <Flexbox className="page-title">
          <h1>Blockchain Logs</h1>
        </Flexbox>

        <Flexbox className="balance-list">
          <div>
            {blockchainLogsState.logs}
          </div>
        </Flexbox>

      </Layout>
    )
  }
}

export default BlockchainLogs
