import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { NavLink } from 'react-router-dom'
import { Online } from 'react-detect-offline'

import routes from '../../constants/routes'

import Badge from './Badge'

@inject('redeemTokensStore', 'txHistoryStore')
@observer
class SidebarMenu extends Component<Props> {
  render() {
    const { newTxsCountSinceUserVisitedTransactionsPage } = this.props.txHistoryStore
    return (
      <div className="menu">
        <ul>
          <li> <NavLink to={routes.PORTFOLIO} activeClassName="active">Portfolio</NavLink></li>
          <li> <NavLink to={routes.SEND_TX} activeClassName="active">Send</NavLink></li>
          <li> <NavLink to={routes.RECEIVE} activeClassName="active">Receive</NavLink></li>
          <li>
            <NavLink to={routes.TX_HISTORY} activeClassName="active">
            Transactions <Badge n={newTxsCountSinceUserVisitedTransactionsPage} />
            </NavLink>
          </li>
          <Online><li> <NavLink to={routes.ACTIVE_CONTRACTS} activeClassName="active">Active Contracts</NavLink></li></Online>
          <li> <NavLink to={routes.SAVED_CONTRACTS} activeClassName="active">Saved Contracts</NavLink></li>
          <Online><li> <NavLink to={routes.BLOCKCHAIN_LOGS} activeClassName="active">Blockchain Logs</NavLink></li></Online>
          <li> <NavLink to={routes.SETTINGS} activeClassName="active">Settings</NavLink></li>
        </ul>
      </div>
    )
  }
}

export default SidebarMenu
