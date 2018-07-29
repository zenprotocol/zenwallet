import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

import { getAssetName } from '../../utils/helpers'
import { normalizeTokens, isZenAsset } from '../../utils/zenUtils'
import CopyableTableCell from '../UI/CopyableTableCell'
import NetworkState from '../../states/network-state'
import ExternalLink from '../UI/ExternalLink'

type Props = {
  networkState: NetworkState
};

@inject('networkState')
@observer
class SingleTxDelta extends Component<Props> {
  render() {
    const { headers } = this.props.networkState
    const { asset, amount, confirmations } = this.props.tx
    const amountClass = (amount > 0 ? 'amount align-right green' : 'amount align-right red')
    const finalAmount = normalizeTokens(amount, isZenAsset(asset))
    const assetName = getAssetName(asset)
    const blockNumber = (headers - confirmations) + 1

    return (
      <React.Fragment>
        <CopyableTableCell string={asset} />
        <td>{assetName}</td>
        <td>
          <ExternalLink link={`https://zp.io/blocks/${blockNumber}`}>
            {blockNumber}
          </ExternalLink>
        </td>
        <td>{confirmations}</td>
        <td className={amountClass}>{finalAmount}</td>
      </React.Fragment>

    )
  }
}

export default SingleTxDelta
