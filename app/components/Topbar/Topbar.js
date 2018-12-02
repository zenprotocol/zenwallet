// @flow

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import cx from 'classnames'
import Flexbox from 'flexbox-react'
import { Offline } from 'react-detect-offline'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import OfflineTopBar from '../../components/OfflineTopBar'
import PortfolioStore from '../../stores/portfolioStore'

type Props = {
  portfolioStore: PortfolioStore,
  history: sgtr,
  className?: string
};

@inject('portfolioStore', 'history')
@observer
class Header extends Component<Props> {
  onBackClicked = (evt) => {
    const { history } = this.props
    if (history.index > 2) {
      history.goBack()
    }
    evt.preventDefault()
  }

  onForwardClicked = (evt) => {
    const { history } = this.props
    if ((history.length - history.index) !== 1) {
      history.goForward()
    }
    evt.preventDefault()
  }

  renderBackButton() {
    const { history } = this.props
    const canGoBack = (history.index > 2)
    const className = (canGoBack ? 'back-button active' : 'back-button')
    return (
      <a className={className} disabled={!canGoBack} onClick={this.onBackClicked}>
        <FontAwesomeIcon icon={['far', 'angle-left']} />
      </a>
    )
  }

  renderForwardButton() {
    const { history } = this.props
    const canGoForward = (history.length - history.index) !== 1
    const className = (canGoForward ? 'forward-button active' : 'forward-button')

    return (
      <a className={className} disabled={!canGoForward} onClick={this.onForwardClicked}>
        <FontAwesomeIcon icon={['far', 'angle-right']} />
      </a>
    )
  }

  render() {
    const { portfolioStore, className } = this.props
    const SIDEBAR_WIDTH = 230
    return (
      <Flexbox className={cx('header', className)} element="header" >
        <Flexbox className="back-buttons">
          { this.renderBackButton() }
          { this.renderForwardButton() }
        </Flexbox>
        <Flexbox flexGrow={1} />
        <div className="balance">
          <div className="balance-and-ticker">
            <span className="total-balance">Balance</span>
            <span className="zen-symbol">ZP</span>
          </div>
          <div className="account-balance">{portfolioStore.zenDisplay}</div>
          <Offline><OfflineTopBar width={SIDEBAR_WIDTH} /></Offline>
        </div>

      </Flexbox>
    )
  }
}

export default Header
