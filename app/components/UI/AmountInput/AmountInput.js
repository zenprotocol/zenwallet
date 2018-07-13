import React, { Component } from 'react'
// import ReactDOM from 'react-dom' // might be used for checking if input is focused
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Flexbox from 'flexbox-react'
import cx from 'classnames'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import { minimumDecimalPoints, validateInputNumber } from '../../../utils/helpers'

@observer
class AmountInput extends Component {
  static propTypes = {
    maxDecimal: PropTypes.number,
    minDecimal: PropTypes.number,
    amount: PropTypes.number,
    amountDisplay: PropTypes.string.isRequired,
    maxAmount: PropTypes.number,
    shouldShowMaxAmount: PropTypes.bool,
    exceedingErrorMessage: PropTypes.string.isRequired,
    onAmountDisplayChanged: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
  }
  static defaultProps = {
    maxDecimal: 0,
    minDecimal: 0,
    amount: null,
    maxAmount: null,
    shouldShowMaxAmount: false,
  }
  state = {
    isFocused: false,
  }

  onChange = (evt) => {
    const { maxDecimal, onAmountDisplayChanged } = this.props
    const newAmountDisplay = validateInputNumber(evt.target.value, maxDecimal)
    if (newAmountDisplay === false) {
      return
    }
    onAmountDisplayChanged(newAmountDisplay)
  }

  onKeyDown = evt => {
    if (evt.keyCode === 38) { this.increaseAmount() } // UP
    if (evt.keyCode === 40) { this.decreaseAmount() } // DOWN
  }

  increaseAmount = () => {
    const { amount, onAmountDisplayChanged } = this.props
    let newAmount
    if (amount === undefined || amount === '') {
      newAmount = 1
    } else {
      newAmount = amount + 1
    }
    onAmountDisplayChanged(String(newAmount))
  }

  decreaseAmount = () => {
    const { amount, onAmountDisplayChanged } = this.props
    if (amount !== undefined && amount >= 1) {
      onAmountDisplayChanged(String(amount - 1))
    }
  }

  renderMaxAmountDiv() {
    const { maxAmount, shouldShowMaxAmount, minDecimal } = this.props
    if (!shouldShowMaxAmount || maxAmount === null) {
      return null
    }
    return (
      <div className="maxAmount"> / { minDecimal ? minimumDecimalPoints(maxAmount, minDecimal) : maxAmount }</div>
    )
  }

  isExceedingMaxAmount() {
    const { amount, maxAmount } = this.props
    return amount > maxAmount
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
    const { label, amountDisplay } = this.props
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
            value={amountDisplay}
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
