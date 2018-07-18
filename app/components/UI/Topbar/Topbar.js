// @flow

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import cx from 'classnames'
import Flexbox from 'flexbox-react'

import BalancesState from '../../../states/balances-state'

type Props = {
  balances: BalancesState,
  className?: string
};

@inject('balances')
@observer
class Header extends Component<Props> {
  render() {
    const { balances, className } = this.props
    return (
      <Flexbox className={cx('header', className)} element="header" >
        <Flexbox flexGrow={1} />
        <div className="balance">
          <div className="balance-and-ticker">
            <span className="total-balance">Balance</span>
            <span className="zen-symbol">ZP</span>
          </div>
          <div className="account-balance">{balances.zenDisplay}</div>
        </div>
      </Flexbox>
    )
  }
}

export default Header
