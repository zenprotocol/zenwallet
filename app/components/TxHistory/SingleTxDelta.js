import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { normalizeTokens, isZenAsset } from '../../utils/helpers'
import CopyableTableCell from '../UI/CopyableTableCell'

class SingleTxDelta extends Component {
  render() {
    const { asset, amount } = this.props.tx
    const amountClass = (amount > 0 ? 'align-right green' : 'align-right red')
    const finalAmount = normalizeTokens(amount, isZenAsset(asset))

    return (
      <React.Fragment>
        <CopyableTableCell string={asset} />
        <td>{isZenAsset(asset) && 'ZENP'}</td>
        <td className={amountClass}>
          {finalAmount}
        </td>
      </React.Fragment>

    )
  }
}

export default SingleTxDelta
