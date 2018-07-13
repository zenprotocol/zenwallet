import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getAssetName } from '../../utils/helpers'
import { normalizeTokens, isZenAsset } from '../../utils/zenUtils'
import CopyableTableCell from '../UI/CopyableTableCell'

class SingleTxDelta extends Component {
  render() {
    const { asset, amount, confirmations } = this.props.tx
    const amountClass = (amount > 0 ? 'amount align-right green' : 'amount align-right red')
    const finalAmount = normalizeTokens(amount, isZenAsset(asset))
    const assetName = getAssetName(asset)

    return (
      <React.Fragment>
        <CopyableTableCell string={asset} />
        <td>{assetName}</td>
        <td>{confirmations}</td>
        <td className={amountClass}>{finalAmount}</td>
      </React.Fragment>

    )
  }
}

export default SingleTxDelta
