import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Flexbox from 'flexbox-react'
import classnames from 'classnames'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import { normalizeTokens, isZenAsset } from '../../../../utils/helpers'

@inject('balances')
@observer
class AmountInput extends Component {
  state = {
    amount: this.initialAmountState(),
    assetBalance: this.props.assetBalance,
    assetIsValid: this.props.assetIsValid,
    asset: this.props.asset,
  }

  componentDidMount() {
    this.validateAmount()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status === 'success') {
      this.setState({ amount: '', assetBalance: '', assetIsValid: false })
    } else {
      this.setState({
        assetBalance: nextProps.assetBalance,
        assetIsValid: nextProps.assetIsValid,
        asset: nextProps.asset,
      }, function () {
        this.validateAmount()
      })
    }
  }
  initialAmountState() {
    const { amount, normalize } = this.props
    if (amount > 0) {
      return normalize ? (amount / 100000000) : amount
    }
    return ''
  }
  onChange = (e) => {
    if (e.target.value) {
      const regex = /^[0-9\.]+$/
      let newAmount = e.target.value

      if (regex.test(e.target.value)) {
        newAmount = e.target.value
        if (newAmount >= 0) {
          this.setState({ amount: newAmount }, function () {
            this.validateAmount()
          })
          this.sendDataToParent(newAmount)
        }
      }

      // const newAmount = parseFloat(e.target.value.trim().replace(/,/g, ''))
    }	else {
      this.sendDataToParent('')
      this.setState({ amount: undefined }, function () {
        this.validateAmount()
      })
    }
  }

	onKeyDown = e => {
	  if (e.keyCode == 38) { this.increaseAmount() } // UP
	  if (e.keyCode == 40) { this.decreaseAmount() } // DOWN
	}

	increaseAmount = () => {
	  const { amount } = this.state
	  let newAmount
	  if (amount === undefined || amount === '') {
	    newAmount = 1
	  } else {
	    newAmount = Number(amount) + 1
	  }
	  this.setState({ amount: newAmount }, function () {
	    this.validateAmount()
	  })
	  this.sendDataToParent(newAmount)
	}

	decreaseAmount = () => {
	  const { amount } = this.state
	  let newAmount

	  if (amount !== undefined) {
	    if (amount >= 1) {
	      newAmount = Number(amount) - 1
	      this.setState({ amount: newAmount }, function () {
	        this.validateAmount()
	      })

	      this.sendDataToParent(newAmount)
	    }
	  }
	}

	sendDataToParent(amount) {
	  const { asset } = this.state
	  if (isZenAsset(asset)) {
	    amount = Math.floor(amount * 100000000)
	  }
	  this.props.sendData({ amount })
	}

	renderMaxAmountDiv() {
	  const { assetIsValid, assetBalance, asset } = this.state

	  if (assetIsValid && assetBalance) {
	    return (
  <div className="maxSend"> / {normalizeTokens(assetBalance, isZenAsset(asset)) }</div>
	    )
	  }
	}

	validateAmount() {
	  const {
	    amount, assetIsValid, assetBalance, asset,
	  } = this.state
	  const { hasError, errorMessage } = this.props
	  let normalizedAssetBalance

	  if (assetIsValid && assetBalance > 0) {
	    if (isZenAsset(asset)) {
	      normalizedAssetBalance = assetBalance / 100000000
	    } else {
	      normalizedAssetBalance = assetBalance
	    }
	    if (amount > normalizedAssetBalance) {
	      this.setState({
	        amountIsInvalid: true,
	        errorMessage: "You don't have that many tokens",
	      })
	    } else {
	      this.setState({ amountIsInvalid: false })
	    }
	  } else if (hasError && errorMessage) {
	    this.setState({ errorMessage })
	    this.setState({ amountIsInvalid: true })
	  } else {
	    this.setState({ amountIsInvalid: false })
	    this.setState({ errorMessage: '' })
	  }
	}

	renderErrorMessage() {
	  const { amountIsInvalid, errorMessage } = this.state
	  if (amountIsInvalid) {
	    return (
  <div className="input-message error">
    <FontAwesomeIcon icon={['far', 'exclamation']} />
    <span>{errorMessage}</span>
  </div>
	    )
	  }
	}

	onFocus = () => this.setState({ isFocused: true })
	onBlur = () => this.setState({ isFocused: false })

	render() {
	  const {
	    amount, amountIsInvalid, assetIsValid, isFocused,
	  } = this.state
	  const { label } = this.props

	  let amountInputClassNames = (assetIsValid ? 'amountInputContainer asset-chosen' : 'amountInputContainer')
	  if (amountIsInvalid) { amountInputClassNames = classnames('error', amountInputClassNames) }
	  if (isFocused) { amountInputClassNames = classnames('is-focused', amountInputClassNames) }

	  let presentableAmount = (amount === undefined ? '' : amount.toLocaleString())
	  if (amount === undefined) {
	    presentableAmount = ''
	  } else {
	    const parts = (+amount).toFixed(4).split('.')
	    presentableAmount = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (+parts[1] ? `.${parts[1]}` : '');
	  }

	  return (
  <Flexbox flexGrow={0} flexDirection="column" className="amount">
    <label htmlFor="amount">{label}</label>

    <Flexbox flexDirection="row" className={amountInputClassNames}>
      <input
        id="amount"
        name="amount"
        type="text"
        placeholder="Enter amount"
        value={amount}
        onKeyDown={this.onKeyDown}
        onChange={this.onChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      />
      { this.renderMaxAmountDiv() }
      <Flexbox flexDirection="column" className="amountArrows">
        <FontAwesomeIcon onClick={this.increaseAmount} icon={['far', 'angle-up']} />
        <FontAwesomeIcon onClick={this.decreaseAmount} icon={['far', 'angle-down']} />
      </Flexbox>
    </Flexbox>
    {this.renderErrorMessage()}

  </Flexbox>

	  )
	}
}

export default AmountInput
