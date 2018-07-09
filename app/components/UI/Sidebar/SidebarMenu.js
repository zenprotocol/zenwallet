import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { NavLink } from 'react-router-dom'

import RedeemTokenState from '../../../states/redeem-tokens-state'

type Props = {
  redeemTokensState: RedeemTokenState
};

@inject('redeemTokensState')
@observer
class SidebarMenu extends Component<Props> {
  render() {
    const { redeemTokensState } = this.props
    return (
      <div className="menu">
        <ul>
          <li> <NavLink to="/portfolio" activeClassName="active">Portfolio</NavLink></li>
          <li> <NavLink to="/send-tx" activeClassName="active">Send</NavLink></li>
          <li> <NavLink to="/receive" activeClassName="active">Receive</NavLink></li>
          <li> <NavLink to="/tx-history" activeClassName="active">Transactions</NavLink></li>
          <li> <NavLink to="/acs" activeClassName="active">Active Contracts</NavLink></li>
          <li> <NavLink to="/saved-contracts" activeClassName="active">Saved Contracts</NavLink></li>
          {redeemTokensState.isFaucetActive && <li> <NavLink to="/faucet" activeClassName="active">Access Software</NavLink></li>}
          <li> <NavLink to="/blockchain-logs" activeClassName="active">Blockchain Logs</NavLink></li>
          <li> <NavLink to="/settings" activeClassName="active">Settings</NavLink></li>
        </ul>
      </div>
    )
  }
}

export default SidebarMenu
