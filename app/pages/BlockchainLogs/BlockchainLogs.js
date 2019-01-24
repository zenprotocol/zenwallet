// @flow

import React from 'react'
import { inject, observer } from 'mobx-react'
import Flexbox from 'flexbox-react'
import List from 'react-virtualized/dist/commonjs/List'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import hljs from 'highlight.js'

import Layout from '../../components/Layout'
import BlockchainLogsStore from '../../stores/blockchainLogsStore'

type Props = {
  blockchainLogsStore: BlockchainLogsStore
};

@inject('blockchainLogsStore')
@observer
class BlockchainLogs extends React.Component<Props> {
  componentDidMount() {
    // eslint-disable-next-line max-len
    setTimeout(this.scrollToBottom, 0) // [AdGo] 17/01/2019 - not sure why the timeout needed, but it doesn't work without it
  }

  componentDidUpdate() {
    if (!this.dontAutoScrollToBottom) {
      this.scrollToBottom()
    }
  }
  dontAutoScrollToBottom = false
  onScroll = ({ clientHeight, scrollHeight, scrollTop }) => {
    if (scrollTop === 0) { // avoid disabling scroll on initial render
      return
    }
    this.dontAutoScrollToBottom = !this.didScrollToBottom(clientHeight, scrollHeight, scrollTop)
  }
  didScrollToBottom(clientHeight, scrollHeight, scrollTop) {
    // eslint-disable-next-line max-len
    return clientHeight + scrollTop + 15 >= scrollHeight // [AdGo] 17/01/2019 - there's an offset of 15 when scrolling to the bottom, don't know why exactly 15
  }
  scrollToBottom = () => {
    if (this.List) {
      this.List.scrollToPosition(this.lastRowOffset)
    }
  }
  get lastRowOffset() {
    const { logs } = this.props.blockchainLogsStore
    // 10 is added to compensate for horizontal scrollbar
    return this.List.getOffsetForRow({ index: logs.length - 1 }) + 10
  }
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    style, // Style object to be applied to row (to position it)
  }) => {
    const { logs } = this.props.blockchainLogsStore
    return (
      <div
        key={key}
        style={style}
        className="log-list-item"
      >
        {logs[index]}
      </div>
    )
  }
  onRowsRendered = () => {
    const logNodes = document.getElementsByClassName('log-list-item')
    if (logNodes.length) {
      [...logNodes].forEach(logNode => {
        hljs.highlightBlock(logNode)
      })
    }
  }
  render() {
    const { logs } = this.props.blockchainLogsStore
    return (
      <Layout className="blockchain-logs">
        <Flexbox className="page-title">
          <h1>Blockchain Logs</h1>
        </Flexbox>
        <div className="contract-code form-row" ref={el => { this.container = el }}>
          <AutoSizer>
            {({ width, height }) => (
              <List
                ref={el => { this.List = el }}
                width={width}
                height={height}
                rowCount={logs.length}
                rowHeight={20}
                rowRenderer={this.rowRenderer}
                onRowsRendered={this.onRowsRendered}
                scrollToAlignment="end"
                onScroll={this.onScroll}
                className="shell-session"
              />
                )}
          </AutoSizer>
        </div>
      </Layout>
    )
  }
}

export default BlockchainLogs

