import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { normalizeTokens, isZenAsset } from '../../../utils/helpers'
import CopyableTableCell from '../UI/CopyableTableCell'

class SingleTxDelta extends Component {
  render() {
    const { asset, assetType, amount } = this.props.tx
    const finalAmount = normalizeTokens(amount, isZenAsset(asset))
    const amountClass = (finalAmount > 0 ? 'align-right green' : 'align-right red')

    return (
      [
        <CopyableTableCell string={`${asset}:${assetType}`} />,
        <td>{isZenAsset(asset) && 'ZENP'}</td>,
        <td className={amountClass}>
          {finalAmount}
        </td>,
      ]
    )
  }
}

export default SingleTxDelta
