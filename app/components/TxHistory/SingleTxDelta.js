import React, { Component } from 'react'
import autobind from 'class-autobind'
import PropTypes from 'prop-types'
import { truncateString, normalizeTokens, isZenAsset } from '../../../utils/helpers'

import CopyableTableCell from '../UI/CopyableTableCell'

class SingleTxDelta extends Component {
  constructor() {
    super()
    autobind(this)
  }

  render() {
    const { asset, assetType, amount } = this.props.tx
    let assetName

    if (isZenAsset(asset)) {
      assetName = 'ZENP'
    }
    const finalAmount = normalizeTokens(amount, isZenAsset(asset))

    const truncatedHash = truncateString(asset)
    const amountClass = (finalAmount > 0 ? 'align-right green' : 'align-right red')

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
