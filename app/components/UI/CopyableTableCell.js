import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import { truncateString } from '../../../utils/helpers'

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

  render() {
    const { string } = this.props
    const { copyText } = this.state
    const truncatedString = truncateString(string)

    return (
      <td className="align-left copyable" title={string} >

        <span title={string} >{truncatedString} </span>
        <span
          onClick={() => { this.copyToClipboard(string) }}
          data-balloon={copyText}
          data-balloon-pos="up"
        >
          <FontAwesomeIcon icon={['far', 'copy']} />
        </span>

      </td>
    )
  }
}

export default CopyableTableCell
