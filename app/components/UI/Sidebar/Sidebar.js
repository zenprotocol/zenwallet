import React, { Component } from 'react'
import moment from 'moment'
import { inject, observer } from 'mobx-react'
import { Link, NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import { LOGO_SRC } from '../../../constants/imgSources'

@inject('networkState')
@observer
class Sidebar extends Component {
  static propTypes = {
    className: PropTypes.string,
    networkState: PropTypes.shape({
      headers: PropTypes.number.isRequired,
      difficulty: PropTypes.number.isRequired,
      connections: PropTypes.number.isRequired,
      chain: PropTypes.string.isRequired,
      blocks: PropTypes.number.isRequired,
      medianTime: PropTypes.number.isRequired,
      begin: PropTypes.func.isRequired,
    }).isRequired,
  }
  static defaultProps = {
    className: '',
  }

  componentDidMount() {
    this.props.networkState.begin()
  }

  formattedBlockchainTime() {
    const { medianTime } = this.props.networkState
    return medianTime
      ? moment(new Date(medianTime)).format('DD/MM/YYYY, HH:mm:ss')
      : medianTime
  }

  renderNetworkStatus() {
    const {
      chain, blocks, headers, difficulty, connections,
    } = this.props.networkState
    if (blocks === 0) {
      return (
        <div className="network-status">
          Syncing...
        </div>
      )
    }
    return (
      <div className="network-status">
        <div className="network-data-point">
          <span className="data-name">Chain: </span>
          <span className="data-point">{chain}</span>
        </div>
        <div className="network-data-point">
          <span className="data-name">Blocks: </span>
          <span className="data-point">{blocks.toLocaleString()}</span>
        </div>
        <div className="network-data-point">
          <span className="data-name">Headers: </span>
          <span className="data-point">{headers.toLocaleString()}</span>
        </div>
        <div className="network-data-point truncate">
          <span className="data-name">Mining Difficulty: </span>
          <span className="data-point">{difficulty}</span>
        </div>
        <div className="network-data-point">
          <span className="data-name" title="Median Time Past">MTP: </span>
          <span className="data-point">
            {this.formattedBlockchainTime()}
          </span>
        </div>
        <div className="network-data-point">
          <span className="data-name" title="Connections">Connections: </span>
          <span className="data-point">
            {connections}
          </span>
        </div>
      </div>
    )
  }

  renderMenu() { // eslint-disable-line class-methods-use-this
    return (
      <div className="menu">
        <ul>
          {[
            { to: 'portfolio', text: 'Portfolio' },
            { to: 'send-tx', text: 'Send' },
            { to: 'receive', text: 'Receive' },
            { to: 'tx-history', text: 'Transactions' },
            { to: 'acs', text: 'Explore Contracts' },
            { to: 'saved-contracts', text: 'My Saved Contracts' },
            { to: 'faucet', text: 'Access Software' },
          ].map(({ to, text }) => <li key={to}><NavLink activeClassName="active" to={`/${to}`}>{text}</NavLink></li>)
        }
        </ul>
      </div>
    )
  }
  render() {
    return (
      <nav className={`sidebar ${this.props.className}`}>
        <div className="logo">
          <Link to="/">
            <img src={LOGO_SRC} alt="Zen Protocol Logo" />
          </Link>
        </div>
        {this.renderMenu()}
        {this.renderNetworkStatus()}
      </nav>
    )
  }
}

export default Sidebar
