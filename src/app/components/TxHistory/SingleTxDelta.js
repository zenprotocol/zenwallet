import React,{Component} from 'react'
import autobind from 'class-autobind'
import PropTypes from 'prop-types'
import {truncateString, normalizeTokens} from '../../../utils/helpers'

import CopyableTableCell from '../UI/CopyableTableCell'

const zenAsset = '0000000000000000000000000000000000000000000000000000000000000000'

class SingleTxDelta extends Component {
  constructor() {
    super()
    autobind(this)
  }

  render() {
    const {asset, assetType, amount} = this.props.tx
    let assetName, finalAmount

    finalAmount = Math.abs(amount)
    if (asset === zenAsset && assetType === zenAsset) {
      assetName = 'ZENP'
      finalAmount = normalizeTokens(finalAmount)  // / 100000000
    } else {
      finalAmount = finalAmount.toLocaleString()
    }

    const truncatedHash = truncateString(asset)
    const amountClass = (finalAmount > 0 ? 'align-right green' : 'align-right red' )

    return (
      [
        <CopyableTableCell string={`${asset}:${assetType}`} />,
        <td>{assetName}</td>,
        <td className={amountClass}>
          {finalAmount}
        </td>
      ]
    )

  }
}

export default SingleTxDelta
