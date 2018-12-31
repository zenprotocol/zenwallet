// @flow

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import cx from 'classnames'
import Flexbox from 'flexbox-react'
import { Offline } from 'react-detect-offline'

import OfflineTopBar from '../../components/OfflineTopBar'
import PortfolioStore from '../../stores/portfolioStore'

type Props = {
  portfolioStore: PortfolioStore,
  className?: string
};

@inject('portfolioStore')
@observer
class Header extends Component<Props> {
  render() {
    const { portfolioStore, className } = this.props
    const SIDEBAR_WIDTH = 230
    return (
      <Flexbox className={cx('header', className)} element="header" >
        <Flexbox className="release-candidate-header">
          <p>Yesod - Release Candidate</p>
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
