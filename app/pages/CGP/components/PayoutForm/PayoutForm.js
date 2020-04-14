/* eslint-disable react/prop-types */
// @flow
import React, { Component } from 'react'
import Flexbox from 'flexbox-react'
import { inject, observer } from 'mobx-react'
import cx from 'classnames'


import FontAwesomeIcon from '../../../../vendor/@fortawesome/react-fontawesome'
import IsValidIcon from '../../../../components/IsValidIcon'
import PasteButton from '../../../../components/PasteButton'
import { isValidAddress } from '../../../../utils/helpers'
import { ref } from '../../../../utils/domUtils'
import AutoSuggestCGP from '../../../../components/AutoSuggestCGP/AutoSuggestCGP'

import AssetAmountPair from './components/AssetAmountPair'

@inject('cgpStore', 'portfolioStore', 'networkStore')
@observer
class PayoutForm extends Component {
    addAssetAmountPair = () => this.props.cgpStore.addAssetAmountPair()
    removeAssetAmountPair = index => this.props.cgpStore.removeAssetAmountPair({ index })

    addressChangeHandler = e => this.props.cgpStore.updateAddress(e.currentTarget.value.trim())

    onAddressPasteClicked = (clipboardContents: string) => {
      this.props.cgpStore.updateAddress(clipboardContents)
    }

    onBallotIdPasteClicked = (clipboardContents: string) => {
      this.props.cgpStore.updateBallotId(clipboardContents)
    }

    ballotChangeHandler = e => this.props.cgpStore.updateBallotId(e.currentTarget.value.trim())

    ballotChangeAutoSuggestHandler = e => this.props.cgpStore.updateBallotId(e)

    assetAmountChangeHandler = (data, index) => {
      this.props.cgpStore.changeAssetAmountPair({
        index,
        asset:
                typeof data.asset !== 'undefined'
                  ? data.asset
                  : this.props.cgpStore.assetAmounts[index].asset,
        amount:
                typeof data.amount !== 'undefined'
                  ? data.amount
                  : this.props.cgpStore.assetAmounts[index].amount,
      })
    }

    get isAddressInvalid() {
      const { address } = this.props.cgpStore
      return address.length && !isValidAddress(address, this.props.networkStore.chainUnformatted)
    }

    get isAddressValid() {
      const { address } = this.props.cgpStore
      return address.length && isValidAddress(address, this.props.networkStore.chainUnformatted)
    }

    renderAddressErrorMessage() {
      if (this.isAddressInvalid) {
        return (
          <div className="error input-message">
            <FontAwesomeIcon icon={['far', 'exclamation-circle']} />
            <span>Destination Address is invalid</span>
          </div>
        )
      }
    }

    renderBallotIdErrorMessage() {
      const { ballotId, ballotIdValid } = this.props.cgpStore
      if (ballotId && !ballotIdValid) {
        return (
          <div className="error input-message">
            <FontAwesomeIcon icon={['far', 'exclamation-circle']} />
            <span>Ballot ID is invalid</span>
          </div>
        )
      }
    }

    renderMinus() {
      const { assetAmounts } = this.props.cgpStore
      return assetAmounts.length !== 1
    }

    render() {
      const {
        cgpStore: {
          assetAmounts, address, ballotId, ballotIdValid,
          lastAssetAmountValid, assets, isNomination, candidates,
        },
      } = this.props
      return (
        <Flexbox flexDirection="column">
          {!isNomination &&
          <AutoSuggestCGP
            currentBallot={ballotId}
            suggestionArray={candidates.items}
            onUpdateParent={this.ballotChangeAutoSuggestHandler}
            ref={ref('AutoSuggest').bind(this)}
          />}
          {isNomination &&
          <Flexbox flexDirection="column" className="form-row">
            <label htmlFor="ballotId">Ballot ID</label>
            <Flexbox flexDirection="row">
              <Flexbox flexDirection="column" className="full-width relative">
                <input
                  id="ballotId"
                  name="ballotId"
                  type="text"
                  placeholder="Enter a payout ballot ID"
                  className={cx({ 'is-valid': ballotIdValid, error: ballotId && !ballotIdValid })}
                  autoFocus
                  onChange={this.ballotChangeHandler}
                  value={ballotId}
                />
                <IsValidIcon
                  isValid={ballotIdValid}
                  className="input-icon"
                  hasColors
                  isHidden={!ballotId}
                  onClick={() => { this.props.cgpStore.ballotId = '' }}
                />
                {this.renderBallotIdErrorMessage()}
              </Flexbox>
              <PasteButton className="button-on-right" onClick={this.onBallotIdPasteClicked} />
            </Flexbox>
          </Flexbox>}
          <TextSeparator text={isNomination ? 'OR' : 'AS'} />
          <Flexbox flexDirection="column" className="destination-address-input form-row">
            <label htmlFor="address">Recipient Address</label>
            <Flexbox flexDirection="row" className="destination-address-input">
              <Flexbox flexDirection="column" className="full-width relative">
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder={!isNomination ? '' : 'Enter recipient address'}
                  className={cx(
                    { 'is-valid': this.isAddressValid, error: this.isAddressInvalid },
                    !isNomination ? 'disable-cgp' : '',
                  )}
                  autoFocus
                  onChange={this.addressChangeHandler}
                  value={address}
                  disabled={!isNomination}
                />
                <IsValidIcon
                  isValid={isValidAddress(address)}
                  className="input-icon"
                  hasColors
                  isHidden={!address}
                  onClick={() => { this.props.cgpStore.address = '' }}
                />
                {this.renderAddressErrorMessage()}
              </Flexbox>
              {isNomination && <PasteButton className="button-on-right" onClick={this.onAddressPasteClicked} />}
            </Flexbox>
          </Flexbox>
          <Flexbox flexDirection="column">
            {assetAmounts.map((item, index) => (
              <Flexbox flexDirection="row" className="form-row" key={item.id}>
                <AssetAmountPair
                  index={index}
                  showLabels={index === 0}
                  disable={!isNomination}
                  asset={item.asset}
                  amount={item.amount}
                  assetBalance={this.props.cgpStore.getBalanceFor(item.asset)}
                  onChange={data => {
                                    this.assetAmountChangeHandler(data, index)
                                }}
                  className={!isNomination ? 'disable-cgp' : ''}
                  titleAsset={!isNomination ? '' : 'Enter an asset'}
                  hidePlaceHolder={!isNomination}
                />
                {isNomination && this.renderMinus() &&
                <div className="remove-container">
                  {/* DO NOT REMOVE LABEL! */}
                  {/* the label is a hack to place the buttons in the right height. */}
                  {index === 0 && <label>x</label>}
                  <button
                    disabled={assetAmounts.length === 1}
                    type="button"
                    className="btn-plus-minus"
                    title="Remove"
                    onClick={() => this.removeAssetAmountPair(index)}
                  >
                    <FontAwesomeIcon icon={['far', 'minus-circle']} />{' '}
                  </button>
                </div>}
              </Flexbox>
                    ))}
            {assets.length !== assetAmounts.length && isNomination &&
              <Flexbox className="form-row">
                <button
                  disabled={!lastAssetAmountValid}
                  type="button"
                  className="button with-icon"
                  title="Add"
                  onClick={this.addAssetAmountPair}
                >
                  <FontAwesomeIcon icon={['far', 'plus-circle']} />{' '}
                  <span className="button-text">Add Asset & Amount</span>
                </button>
              </Flexbox>}
          </Flexbox>
        </Flexbox>
      )
    }
}

export default PayoutForm

function TextSeparator({ text }) {
  return (
    <Flexbox alignItems="center">
      <div className="devider" />
      <div>{text}</div>
      <div className="devider" />
    </Flexbox>
  )
}
