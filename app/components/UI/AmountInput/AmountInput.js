import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Flexbox from 'flexbox-react'
import cx from 'classnames'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import { minimumDecimalPoints, numberWithCommas } from '../../../utils/helpers'
import { getActiveElement } from '../../../utils/domUtils'

import { formatNextAmountDisplay } from './AmountInputUtils'

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

  onChange = (evt) => {
    const { maxDecimal, onAmountDisplayChanged } = this.props
    const newAmountDisplay = formatNextAmountDisplay(evt.target.value, maxDecimal)
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
    const { maxAmount, shouldShowMaxAmount } = this.props
    if (!shouldShowMaxAmount || maxAmount === null) {
      return null
    }
    return <div className="maxAmount"> / { this.maxAmountDisplay }</div>
  }
  get maxAmountDisplay() {
    const { maxAmount, minDecimal } = this.props
    const n = minDecimal ? minimumDecimalPoints(maxAmount, minDecimal) : maxAmount
    return numberWithCommas(n)
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

  get isFocused() {
    return this.el && getActiveElement().id === this.el.id
  }
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
              'is-focused': this.isFocused,
            },
          )}
        >
          <input
            id="amount"
            placeholder="Enter amount"
            value={numberWithCommas(amountDisplay)}
            ref={(el) => { this.el = el }}
            onKeyDown={this.onKeyDown}
            onChange={this.onChange}
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
