import React,{Component} from 'react'
import autobind from 'class-autobind'
import PropTypes from 'prop-types'
import {inject, observer} from 'mobx-react'
import Flexbox from 'flexbox-react'
import classnames from 'classnames'

import {truncateString} from '../../../../utils/helpers'

@inject('balances')
@observer
class AmountInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
      amount: props.amount,
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

	onChange(event) {
		const {amount} = this.state
		if (event.target.value) {
      const newAmount = parseFloat(event.target.value.trim().replace(/,/g, ''))
      this.setState({amount: newAmount}, function () {
        this.validateAmount()
      })
      this.props.sendData({amount: newAmount})
		}	else {
      this.props.sendData({amount: ''})
      this.setState({amount: undefined}, function () {
        this.validateAmount()
      })
		}
	}

	onKeyDown = event => {
    if (event.keyCode == 38) { this.increaseAmount() } // UP
		if (event.keyCode == 40) { this.decreaseAmount() } // DOWN
	}

	increaseAmount() {
    const {amount} = this.state
    let newAmount
    if (amount === undefined) {
      newAmount = 1
    } else {
      newAmount = amount + 1
    }
    this.setState({amount: newAmount}, function () {
      this.validateAmount()
    })
    this.props.sendData({amount: newAmount})
	}

	decreaseAmount() {
    const {amount} = this.state
    let newAmount
    if (amount === undefined) {
      newAmount = -1
    } else {
      newAmount = amount - 1
    }

    this.setState({amount: newAmount}, function () {
      this.validateAmount()
    })

    this.props.sendData({amount: newAmount})
	}

	renderMaxAmountDiv() {
		const {assetIsValid, assetBalance} = this.state
    if (assetIsValid && assetBalance) {
      return (
        <div className='maxSend'> / {assetBalance.toLocaleString() }</div>
      )
    }
  }

  validateAmount() {
		const {amount, assetIsValid, assetBalance} = this.state

    if (amount < 0) {
      this.setState({amountIsInvalid: true})
      this.setState({errorMessage: 'Amount must be above 0'})
    } else {
      if (assetIsValid && assetBalance > 0) {
        if (amount > assetBalance) {
          this.setState({
            amountIsInvalid: true,
            errorMessage: "You don't have that many tokens"
          })
        } else {
          this.setState({amountIsInvalid: false})
        }
  		} else {
        this.setState({amountIsInvalid: false})
        this.setState({errorMessage: null})
      }
    }

	}

  renderErrorMessage() {
    const {amountIsInvalid, errorMessage} = this.state
    if (amountIsInvalid) {
      return (
        <div className='error-message'>
          <i className="fa fa-exclamation-circle"></i>
          <span>{errorMessage}</span>
        </div>
      )
    }
  }


  render() {
    const {amount, amountIsInvalid, assetIsValid, assetBalance} = this.state

		let amountInputClassNames = (assetIsValid ? 'amountInputContainer asset-chosen' : 'amountInputContainer')
		if (amountIsInvalid) {
      amountInputClassNames = classnames('error', amountInputClassNames)
    }

		const presentableAmount = (amount === undefined ? '' : amount.toLocaleString() )

    return (
      <Flexbox flexGrow={0} flexDirection="column" className="amount">
        <label htmlFor="amount">Amount</label>

        <Flexbox flexDirection='row' className={amountInputClassNames}>
          <input
            id='amount'
            name='amount'
            type='text'
            placeholder='Enter amount'
            value={presentableAmount}
            onKeyDown={this.onKeyDown}
            onChange={this.onChange}
          />
          { this.renderMaxAmountDiv() }
          <Flexbox flexDirection='column' className='amountArrows'>
            <div onClick={this.increaseAmount}>
              <i className='fa fa-angle-up' />
            </div>
            <div onClick={this.decreaseAmount}>
              <i className='fa fa-angle-down' />
            </div>
          </Flexbox>
        </Flexbox>
        {this.renderErrorMessage()}

      </Flexbox>

    )
  }
}

export default AmountInput
