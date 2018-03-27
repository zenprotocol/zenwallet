import React,{Component} from 'react'
import autobind from 'class-autobind'
import PropTypes from 'prop-types'
import {truncateString, normalizeTokens} from '../../../utils/helpers'
const {clipboard} = require('electron')

class CopyableTableCell extends Component {
  constructor() {
    super()
    this.state = {
      copyText: 'Copy'
    }
    autobind(this)
  }

  copyToClipboard = (string) => {
    clipboard.writeText(string)
    this.setState({copyText: 'Copied to Clipboard'})
    setTimeout(() => {
      this.setState({copyText: 'Copy'})
    }, 1250)
  }

  render() {
    const {string} = this.props
    const {copyText} = this.state
    const truncatedString = truncateString(string)

    return (
      <td className='align-left copyable' title={string} >

        <span title={string} >{truncatedString} </span>
        <span
          onClick={()=>{this.copyToClipboard(string)}}
          data-balloon={copyText}
          data-balloon-pos='up'>
          <i className="fa fa-copy" ></i>
        </span>

      </td>
    )
  }
}

export default CopyableTableCell
