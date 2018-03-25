import React,{Component} from 'react'
import autobind from 'class-autobind'
import PropTypes from 'prop-types'
import {inject, observer} from 'mobx-react'
import Flexbox from 'flexbox-react'
import classnames from 'classnames'

import {truncateString, normalizeTokens} from '../../../../utils/helpers'

@inject('balances')
@observer
class AmountInput extends Component {
  constructor(props) {
    super(props)

    let normalizedNumber, normalizeAssetBalance

    if (props.amount > 0) {
      normalizedNumber = (props.normalize ? props.amount / 100000000 : props.amount)
    } else {
      normalizedNumber = ''
    }

    this.state = {
      amount: normalizedNumber,
      assetBalance: props.assetBalance,
      assetIsValid: props.assetIsValid
    }

    autobind(this)
  }

  componentDidMount() {
    this.validateAmount()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status === 'success') {
      this.setState({amount: '', assetBalance: '', assetIsValid: false})
    } else {
      this.setState({
        assetBalance: nextProps.assetBalance,
        assetIsValid: nextProps.assetIsValid
      }, function () {
        this.validateAmount()
      })
    }
  }

	onChange(e) {
		const {amount} = this.state
		if (e.target.value) {

      const regex = /^[0-9\.]+$/
      let newAmount = e.target.value

      if (regex.test(e.target.value)) {
        newAmount = e.target.value
        if (newAmount >= 1) {
          this.setState({amount: newAmount}, function () {
            this.validateAmount()
          })
          this.sendDataToParent(newAmount)
        }
      }

      // const newAmount = parseFloat(e.target.value.trim().replace(/,/g, ''))

		}	else {
      this.sendDataToParent('')
      this.setState({amount: undefined}, function () {
        this.validateAmount()
      })
		}
	}

	onKeyDown = e => {
    if (e.keyCode == 38) { this.increaseAmount() } // UP
		if (e.keyCode == 40) { this.decreaseAmount() } // DOWN
	}

	increaseAmount() {
    const {amount} = this.state
    let newAmount
    if (amount === undefined || amount === '') {
      newAmount = 1
    } else {
      newAmount = Number(amount) + 1
    }
    this.setState({amount: newAmount}, function () {
      this.validateAmount()
    })
    this.sendDataToParent(newAmount)
	}

	decreaseAmount() {
    const {amount} = this.state
    let newAmount

    if (amount !== undefined) {
      if (amount >= 1) {
        newAmount = Number(amount) - 1
        this.setState({amount: newAmount}, function () {
          this.validateAmount()
        })

        this.sendDataToParent(newAmount)
      }
    }

	}

  sendDataToParent(amount) {
    this.props.sendData({amount: amount})
  }

	renderMaxAmountDiv() {
		const {assetIsValid, assetBalance} = this.state
    if (assetIsValid && assetBalance) {
      return (
        <div className='maxSend'> / {normalizeTokens(assetBalance) }</div>
      )
    }
  }

  validateAmount() {
		const {amount, assetIsValid, assetBalance} = this.state
		const {hasError, errorMessage} = this.props

    if (assetIsValid && assetBalance > 0) {
      const normalizedAssetBalance = assetBalance / 100000000
      if (amount > normalizedAssetBalance) {
        this.setState({
          amountIsInvalid: true,
          errorMessage: "You don't have that many tokens"
        })
      } else {
        this.setState({amountIsInvalid: false})
      }
		} else {
      if (hasError && errorMessage) {
        this.setState({errorMessage: errorMessage})
        this.setState({amountIsInvalid: true})
      } else {
        this.setState({amountIsInvalid: false})
        this.setState({errorMessage: ''})
      }
    }

	}

  renderErrorMessage() {
    const {amountIsInvalid, errorMessage} = this.state
    if (amountIsInvalid) {
      return (
        <div className='input-message error'>
          <i className="fa fa-exclamation"></i>
          <span>{errorMessage}</span>
        </div>
      )
    }
  }

  onFocus() { this.setState({isFocused: true}) }
  onBlur() { this.setState({isFocused: false}) }

  render() {
    const {amount, amountIsInvalid, assetIsValid, assetBalance, isFocused} = this.state
    const {label} = this.props

		let amountInputClassNames = (assetIsValid ? 'amountInputContainer asset-chosen' : 'amountInputContainer')
		if (amountIsInvalid) { amountInputClassNames = classnames('error', amountInputClassNames) }
    if (isFocused) { amountInputClassNames = classnames('is-focused', amountInputClassNames) }

    let presentableAmount = (amount === undefined ? '' : amount.toLocaleString() )
    if (amount === undefined) {
      presentableAmount = ''
    } else {
      const parts = (+amount).toFixed(4).split(".")
      presentableAmount = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (+parts[1] ? "." + parts[1] : "");
    }

    return (
      <Flexbox flexGrow={0} flexDirection="column" className="amount">
        <label htmlFor="amount">{label}</label>

        <Flexbox flexDirection='row' className={amountInputClassNames}>
          <input
            id='amount'
            name='amount'
            type='text'
            placeholder='Enter amount'
            value={amount}
            onKeyDown={this.onKeyDown}
            onChange={this.onChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
          />
          { this.renderMaxAmountDiv() }
          <Flexbox flexDirection='column' className='amountArrows'>
            <i className='fa fa-angle-up' onClick={this.increaseAmount} />
            <i className='fa fa-angle-down' onClick={this.decreaseAmount}/>
          </Flexbox>
        </Flexbox>
        {this.renderErrorMessage()}

      </Flexbox>

    )
  }
}

export default AmountInput
