import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Flexbox from 'flexbox-react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

@inject('balances', 'history')
@observer
class Header extends Component {
  static propTypes = {
    className: PropTypes.string,
  }

  onBackClicked = (evt) => {
    this.props.history.goBack()
    evt.preventDefault()
  }

  onForwardClicked = (evt) => {
    this.props.history.goForward()
    evt.preventDefault()
  }

  renderBackButton() {
    const history = this.props.history
    const canGoBack = (history.index != 0)
    const className = (canGoBack ? 'back-button active' : 'back-button')
    return (
      <a onClick={this.onBackClicked} className={className} disabled={!canGoBack}>
        <FontAwesomeIcon icon={['far', 'angle-left']} />
      </a>
    )
  }

  renderForwardButton() {
    const history = this.props.history
    const canGoForward = (history.length - history.index) != 1
    const className = (canGoForward ? 'forward-button active' : 'forward-button')

    return (
      <a onClick={this.onForwardClicked} className={className} disabled={!canGoForward}>
        <FontAwesomeIcon icon={['far', 'angle-right']} />
      </a>
    )
  }

  render() {
    const { balances } = this.props
    const className = classnames('header', this.props.className)
    return (
      <Flexbox className={className} element="header" >
        <Flexbox flexGrow={1} />
        <div className="balance">
          <div className="balance-and-ticker">
            <span className="total-balance">Total Balance</span>
            <span className="zen-symbol">ZP</span>
          </div>
          <div className="account-balance">{balances.zenDisplay}</div>
        </div>
      </Flexbox>
    )
  }
}

export default Header
