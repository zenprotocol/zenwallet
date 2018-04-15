import React, { Component } from 'react'
import { inject, observer, PropTypes as PropTypesMobx } from 'mobx-react'
import Flexbox from 'flexbox-react'
import PropTypes from 'prop-types'
import Highlight from 'react-highlight'

import Layout from '../UI/Layout/Layout'

@inject('blockchainLogsState')
@observer
class BlockchainLogs extends Component {
  static propTypes = {
    blockchainLogsState: PropTypes.shape({
      logs: PropTypesMobx.observableArrayOf(PropTypes.string),
    }).isRequired,
  }

  render() {
    const { blockchainLogsState } = this.props

    return (
      <Layout className="blockchain-logs">

        <Flexbox className="page-title">
          <h1>Blockchain Logs</h1>
        </Flexbox>

        <Flexbox flexDirection="column" className="contract-code form-row">
          <Highlight className="shell-session">
            {blockchainLogsState.logs.join('')}
          </Highlight>
        </Flexbox>

      </Layout>
    )
  }
}

export default BlockchainLogs
