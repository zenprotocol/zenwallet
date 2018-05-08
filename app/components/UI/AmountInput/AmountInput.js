import React, { Component } from 'react'
// import ReactDOM from 'react-dom' // might be used for checking if input is focused
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Flexbox from 'flexbox-react'
import cx from 'classnames'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import { stringToNumber, validateInputNumber } from '../../../utils/helpers'

@observer
class AmountInput extends Component {
  static propTypes = {
    maxDecimal: PropTypes.number,
    amount: PropTypes.string.isRequired,
    maxAmount: PropTypes.string,
    shouldShowMaxAmount: PropTypes.bool,
    exceedingErrorMessage: PropTypes.string.isRequired,
    onUpdateParent: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
  }
  static defaultProps = {
    maxDecimal: 0,
    maxAmount: null,
    shouldShowMaxAmount: false,
  }
  state = {
    isFocused: false,
  }

  onChange = (evt) => {
    const result = validateInputNumber(evt.target.value, this.props.maxDecimal)
    if (result === false) {
      return
    }
    this.updateParent(result)
  }

  onKeyDown = evt => {
    if (evt.keyCode === 38) { this.increaseAmount() } // UP
    if (evt.keyCode === 40) { this.decreaseAmount() } // DOWN
  }

  increaseAmount = () => {
    const { amount } = this.props
    let newAmount
    if (amount === undefined || amount === '') {
      newAmount = 1
    } else {
      newAmount = Number(amount) + 1
    }
    this.updateParent(newAmount)
  }

  decreaseAmount = () => {
    const { amount } = this.props
    if (amount !== undefined && amount >= 1) {
      this.updateParent(Number(amount) - 1)
    }
  }

  updateParent(amount) {
    this.props.onUpdateParent(String(amount)) // TODO check if need to cast to string
  }

  renderMaxAmountDiv() {
    const { maxAmount, shouldShowMaxAmount } = this.props
    if (!shouldShowMaxAmount || maxAmount === null) {
      return null
    }
    return (
      <div className="maxAmount"> / { maxAmount }</div>
    )
  }

  isExceedingMaxAmount() {
    const { amount, maxAmount } = this.props
    return stringToNumber(amount) > stringToNumber(maxAmount)
  }

  renderExceedingMaxAmountError() {
    if (this.isExceedingMaxAmount()) {
      return (
        <div className="input-message error">
          <FontAwesomeIcon icon={['far', 'exclamation']} />
          <span>{this.props.exceedingErrorMessage}</span>
        </div>
      )
    }
  }

  onFocus = () => this.setState({ isFocused: true })
  onBlur = () => this.setState({ isFocused: false })

  render() {
    const { label, amount } = this.props
    return (
      <Flexbox flexGrow={0} flexDirection="column" className="amount">
        <label htmlFor="amount">{label}</label>

        <Flexbox
          flexDirection="row"
          className={cx(
            'amountInputContainer',
            {
              error: this.isExceedingMaxAmount(),
              'is-focused': this.state.isFocused, // ReactDOM.findDOMNode(this.el), TODO implement with ref, try document.activeElement
            },
          )}
        >
          <input
            id="amount"
            placeholder="Enter amount"
            value={amount}
            ref={(el) => { this.el = el }}
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
        {this.renderExceedingMaxAmountError()}
      </Flexbox>

    )
  }
}

export default AmountInput
