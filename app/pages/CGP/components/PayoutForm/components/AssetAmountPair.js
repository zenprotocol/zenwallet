import React, { Component } from 'react'
import PropTypes from 'prop-types'

import AutoSuggestAssets from '../../../../../components/AutoSuggestAssets'
import AmountInput from '../../../../../components/AmountInput'
import { ZENP_MAX_DECIMALS, ZENP_MIN_DECIMALS } from '../../../../../constants/constants'

class AssetAmountPair extends Component {
  // reset hack - AutoSuggestAssets does not reset properly if prev asset was valid
  componentDidUpdate(prevProps) {
    if (prevProps.asset !== '' && !this.props.asset) {
      this.AutoSuggestAssets.wrappedInstance.reset()
    }
  }

  assetChangedHandler = ({ asset }) => {
    const { onChange } = this.props
    if (typeof onChange === 'function') {
      onChange({ asset })
    }
  }
  amountChangedHandler = amountDisplay => {
    const { onChange } = this.props
    if (typeof onChange === 'function') {
      onChange({ amount: amountDisplay || 0 })
    }
  }

  render() {
    const {
      asset, assetBalance, amount, showLabels, index, titleAsset, hidePlaceHolder,
    } = this.props
    return (
      <React.Fragment>
        <AutoSuggestAssets
          cgp
          cgpAssetAmountsIndex={index}
          asset={asset}
          onUpdateParent={this.assetChangedHandler}
          showLabel={showLabels}
          ref={(el) => { this.AutoSuggestAssets = el }}
          disable={this.props.disable}
          className={this.props.className}
          title={titleAsset}
        />
        <AmountInput
          disable={this.props.disable}
          amount={amount}
          amountDisplay={amount ? String(amount) : ''}
          maxDecimal={ZENP_MAX_DECIMALS}
          minDecimal={ZENP_MIN_DECIMALS}
          maxAmount={asset ? assetBalance : null}
          shouldShowMaxAmount
          exceedingErrorMessage="Insufficient Funds"
          onAmountDisplayChanged={this.amountChangedHandler}
          label={showLabels ? 'Amount' : ''}
          className={this.props.className}
          showPlaceHolder={hidePlaceHolder}
        />
      </React.Fragment>
    )
  }
}

AssetAmountPair.propTypes = {
  asset: PropTypes.string,
  disable: PropTypes.bool,
  assetBalance: PropTypes.number,
  amount: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  showLabels: PropTypes.bool,
  index: PropTypes.number.isRequired,
  className: PropTypes.string,
  titleAsset: PropTypes.string,
  hidePlaceHolder: PropTypes.bool,
}

AssetAmountPair.defaultProps = {
  asset: '',
  assetBalance: 0,
  amount: 0,
  showLabels: true,
  disable: false,
  className: '',
  titleAsset: undefined,
  hidePlaceHolder: false,
}

export default AssetAmountPair
