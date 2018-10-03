// @flow

import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { inject } from 'mobx-react'

import ExternalLink from '../components/ExternalLink'
import { truncateString } from '../utils/helpers'
import { isZenAsset } from '../utils/zenUtils'
import NetworkStore from '../stores/networkStore'
import { MAINNET } from '../constants'

const { clipboard } = require('electron')

type Props = {
  networkStore: NetworkStore,
  string: string,
  istx?: boolean
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
    return !isZenAsset(string) ? truncateString(string) : string
  }
  renderString() {
    const { string, istx } = this.props
    return istx ? (
      <ExternalLink link={`https://${this.getLink}zp.io/tx/${string}`}>
        {this.formattedString}
      </ExternalLink>
    ) : this.formattedString
  }

  render() {
    const { string } = this.props
    const { copyText } = this.state
    return (
      <td className="align-left copyable" title={string}>
        <span title={string}>
          { this.renderString() }{' '}
        </span>
        <span
          onClick={() => { this.copyToClipboard(string) }}
          data-balloon={copyText}
          data-balloon-pos="up"
        >
          <FontAwesomeIcon icon={['far', 'copy']} className="" />
        </span>
      </td>
    )
  }
}

export default CopyableTableCell
