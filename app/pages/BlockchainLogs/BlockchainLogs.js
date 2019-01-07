// @flow

import React from 'react'
import { inject, observer } from 'mobx-react'
import Flexbox from 'flexbox-react'
import Highlight from 'react-highlight'

import Layout from '../../components/Layout'
import BlockchainLogsStore from '../../stores/blockchainLogsStore'

type Props = {
  blockchainLogsStore: BlockchainLogsStore
};

@inject('blockchainLogsStore')
@observer
class BlockchainLogs extends React.Component<Props> {
  render() {
    const { blockchainLogsStore } = this.props
    return (
      <Layout className="blockchain-logs">
        <Flexbox className="page-title">
          <h1>Node Logs</h1>
        </Flexbox>
        <Flexbox flexDirection="column" className="contract-code form-row">
          <Highlight className="shell-session">
            {blockchainLogsStore.logs.join('')}
          </Highlight>
        </Flexbox>
      </Layout>
    )
  }
}

export default BlockchainLogs
