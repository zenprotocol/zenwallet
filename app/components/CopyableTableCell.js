// @flow

import React from 'react'
import { inject } from 'mobx-react'

import FontAwesomeIcon from '../vendor/@fortawesome/react-fontawesome'
import { truncateString } from '../utils/helpers'
import { isZenAsset } from '../utils/zenUtils'
import NetworkStore from '../stores/networkStore'
import { MAINNET } from '../constants'

import ExternalLink from './ExternalLink'

const { clipboard } = require('electron')

type Props = {
  networkStore: NetworkStore,
  string: string,
  isTx?: boolean,
  isReactTable?: boolean,
  hideIcon?: boolean,
  normalText?: boolean,
  isSpan?: boolean,
  isAddress?: boolean,
  isBlock?: boolean,
  className?: string
};

type State = {
  copyText: string
};
@inject('networkStore')
class CopyableTableCell extends React.Component<Props, State> {
  copyTimeout: TimeoutID
  state = {
    copyText: 'Copy',
  }
  componentWillUnmount() {
    clearTimeout(this.copyTimeout)
  }
  copyToClipboard = (string: string) => {
    clipboard.writeText(string)
    this.setState({ copyText: 'Copied to Clipboard' })
    this.copyTimeout = setTimeout(() => {
      this.setState({ copyText: 'Copy' })
    }, 1250)
  }

  get getLink() {
    const { networkStore } = this.props
    return networkStore.chain === MAINNET ? '' : 'testnet.'
  }

  get formattedString() {
    const { string } = this.props
    if (this.props.normalText) return string
    return !isZenAsset(string) ? truncateString(string) : string
  }
  renderString() {
    const {
      string, isTx, isAddress, isBlock,
    } = this.props
    if (isTx) {
      return (
        <ExternalLink link={`https://${this.getLink}zp.io/tx/${string}`}>
          {this.formattedString}
        </ExternalLink>
      )
    }
    if (isAddress) {
      return (
        <ExternalLink link={`https://${this.getLink}zp.io/address/${string}`}>
          {this.formattedString}
        </ExternalLink>
      )
    }
    if (isBlock) {
      return (
        <ExternalLink link={`https://${this.getLink}zp.io/blocks/${string}`}>
          {this.formattedString}
        </ExternalLink>
      )
    }
    return this.formattedString
  }

  get renderInner() {
    const { string } = this.props
    const { copyText } = this.state
    return (
      <React.Fragment>
        <span
          title={string}
          onClick={() => { this.copyToClipboard(string) }}
          data-balloon={copyText}
          data-balloon-pos="up"
          className={this.props.className}
        >
          { this.renderString() }{' '}
        </span>
        <span
          onClick={() => { this.copyToClipboard(string) }}
          data-balloon={copyText}
          data-balloon-pos="up"
        >
          {!this.props.hideIcon && <FontAwesomeIcon icon={['far', 'copy']} />}
        </span>
      </React.Fragment>
    )
  }

  render() {
    const { string, isReactTable, isSpan } = this.props
    if (isSpan) return <span className="align-left copyable" title={string}>{this.renderInner}</span>
    if (isReactTable) return <div className="align-left copyable" title={string}>{this.renderInner}</div>
    return <td className="align-left copyable" title={string}>{this.renderInner}</td>
  }
}

export default CopyableTableCell
