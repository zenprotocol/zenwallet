import React, { Component } from 'react'
import moment from 'moment'
import { inject, observer } from 'mobx-react'
import { Link, NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import pjson from '../../../../package.json'
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
      initialBlockDownload: PropTypes.bool.isRequired,
    }).isRequired,
  }
  static defaultProps = {
    className: '',
  }

  formattedBlockchainTime() {
    const { medianTime } = this.props.networkState
    return medianTime
      ? moment(new Date(medianTime)).format('DD/MM/YYYY, HH:mm:ss')
      : medianTime
  }

  renderSyncingStatus() {
    const { initialBlockDownload, connections } = this.props.networkState

    if (connections === 0) {
      return
    }

    if (initialBlockDownload) {
      return (
        <div className="network-data-point">
          <span className="data-name" title="Syncing">
            <FontAwesomeIcon icon={['far', 'spinner-third']} spin />
          </span>
          <span className="data-point"> Syncing</span>
        </div>
      )
    }

    if (!initialBlockDownload) {
      return (
        <div className="network-data-point">
          <span className="data-name" title="Syncing">
            <FontAwesomeIcon icon={['fas', 'circle']} className="green" />
          </span>
          <span className="data-point"> Synced</span>
        </div>
      )
    }
  }

  renderVersions() {
    return (
      [
        <div className="network-data-point">
          <span className="data-name" title="Wallet Version">Wallet Version: </span>
          <span className="data-point">{pjson.version}</span>
        </div>,
        <div className="network-data-point">
          <span className="data-name" title="Node Version">Node Version: </span>
          <span className="data-point">{pjson.dependencies['@zen/zen-node']}</span>
        </div>,
      ]
    )
  }

  renderNetworkStatus() {
    const {
      chain, blocks, headers, difficulty, connections,
    } = this.props.networkState

    if (connections === 0) {
      return (
        <div className="network-status">
          { this.renderVersions() }
          <div className="network-data-point">
            <span className="data-name">
              <FontAwesomeIcon icon={['far', 'spinner-third']} spin />
            </span>
            <span className="data-point"> Connecting</span>
          </div>
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
          <span className="data-point">{this.formattedBlockchainTime()}</span>
        </div>
        <div className="network-data-point">
          <span className="data-name" title="Connections">Connections: </span>
          <span className="data-point">{connections}</span>
        </div>
        { this.renderVersions() }
        { this.renderSyncingStatus() }
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
            { to: 'acs', text: 'Active Contracts' },
            { to: 'saved-contracts', text: 'Saved Contracts' },
            { to: 'faucet', text: 'Access Software' },
            { to: 'blockchain-logs', text: 'Blockchain Logs' },
            { to: 'settings', text: 'Settings' }, // doens't fit in the sidebar
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
          <Link to="/portfolio">
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
