import React,{Component} from 'react'
import {inject, observer} from 'mobx-react'
import autobind from 'class-autobind'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Flexbox from 'flexbox-react'
import {normalizeTokens} from '../../../../utils/helpers'

@inject('balances')
@inject('history')
@observer
class Header extends Component {
  constructor() {
    super()
    autobind(this)
  }

  static propTypes = {
    className: PropTypes.string
  }

  componentDidMount() {
    const {balances} = this.props
    balances.begin()
  }

  onBackClicked(event) {
    const history = this.props.history
    history.goBack()
    event.preventDefault()
  }

  onForwardClicked(event) {
    const history = this.props.history
    history.goForward()
    event.preventDefault()
  }

  renderBackButton() {
    const history = this.props.history
    const canGoBack = (history.index != 0)
    const className = (canGoBack ? 'back-button active' : 'back-button')
    return (
      <a onClick={this.onBackClicked} className={className} disabled={!canGoBack}>
        <i className="fa fa-angle-left"></i>
      </a>
    )
  }

  renderForwardButton() {
    const history = this.props.history
    const canGoForward = (history.length - history.index) != 1
    const className = (canGoForward ? 'forward-button active' : 'forward-button')

    return (
      <a onClick={this.onForwardClicked} className={className} disabled={!canGoForward}>
        <i className="fa fa-angle-right"></i>
      </a>
    )
  }

  render() {
    const {balances} = this.props
    const className = classnames('header', this.props.className)
    return (
      <Flexbox className={className} element="header" >
        <Flexbox className='back-buttons' width="100px">
          { this.renderBackButton() }
          { this.renderForwardButton() }
        </Flexbox>
        <Flexbox flexGrow={1}></Flexbox>
        <div className='balance'>
          <div className='balance-and-ticker'>
            <span className="total-balance">Total Balance</span>
            <span className='zen-symbol'>ZENP</span>
          </div>
          <div className='account-balance' title={`${balances.zen.toLocaleString()} Kalapas`} >{normalizeTokens(balances.zen, true)}</div>
        </div>
      </Flexbox>
    )
  }
}

export default Header
