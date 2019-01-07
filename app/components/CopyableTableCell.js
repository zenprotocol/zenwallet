// @flow

import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { inject } from 'mobx-react'

import { truncateString } from '../utils/helpers'
import { isZenAsset } from '../utils/zenUtils'

const { clipboard } = require('electron')

type Props = {
  string: string,
  isReactTable?: boolean
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

  get formattedString() {
    const { string } = this.props
    return !isZenAsset(string) ? truncateString(string) : string
  }
  renderString() {
    return this.formattedString
  }

  get renderInner() {
    const { string } = this.props
    const { copyText } = this.state
    return (
      <React.Fragment>
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
      </React.Fragment>
    )
  }

  render() {
    const { string, isReactTable } = this.props
    return isReactTable
      ? <div className="align-left copyable" title={string}>{this.renderInner}</div>
      : <td className="align-left copyable" title={string}>{this.renderInner}</td>
  }
}

export default CopyableTableCell
