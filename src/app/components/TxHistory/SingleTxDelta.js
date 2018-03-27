import React,{Component} from 'react'
import autobind from 'class-autobind'
import PropTypes from 'prop-types'
import {truncateString, normalizeTokens} from '../../../utils/helpers'

import CopyableTableCell from '../UI/CopyableTableCell'

class SingleTxDelta extends Component {
  constructor() {
    super()
    autobind(this)
  }

  render() {
    const {tx} = this.props

    const truncatedHash = truncateString(tx.asset)
    const amountClass = (tx.amount > 0 ? 'align-right light-green' : 'align-right red' )
    const amountText = (tx.amount > 0 ? `+${tx.amount}` : tx.amount )

    return (
      [
        <CopyableTableCell string={tx.asset} />,
        <CopyableTableCell string={tx.assetType} />,
        <td className={amountClass}>
          {amountText}
        </td>
      ]
    )

  }
}

export default SingleTxDelta
