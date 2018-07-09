import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import ExternalLink from '../UI/ExternalLink'
import { truncateString, isZenAsset } from '../../utils/helpers'

const { clipboard } = require('electron')

class CopyableTableCell extends Component {
  state = {
    copyText: 'Copy',
  }
  componentWillUnmount() {
    clearTimeout(this.copyTimeout)
  }
  copyToClipboard = (string) => {
    clipboard.writeText(string)
    this.setState({ copyText: 'Copied to Clipboard' })
    this.copyTimeout = setTimeout(() => {
      this.setState({ copyText: 'Copy' })
    }, 1250)
  }

  renderString() {
    const { string, istx } = this.props
    let truncatedString = string
    if (!isZenAsset(string)) {
      truncatedString = truncateString(string)
    }

    if (istx) {
      return (
        <ExternalLink link={`https://zp.io/tx/${string}`}>
          {truncatedString}
        </ExternalLink>
      )
    }
    return (truncatedString)
  }

  render() {
    const { string, istx } = this.props
    const { copyText } = this.state
    let truncatedString = string
    if (!isZenAsset(string)) {
      truncatedString = truncateString(string)
    }

    return (
      <td className="align-left copyable" title={string}>

        <span title={string}>
          { this.renderString() }&nbsp;
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
