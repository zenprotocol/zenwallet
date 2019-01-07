import React, { Component } from 'react'
import moment from 'moment'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import cx from 'classnames'
import { Online, Offline } from 'react-detect-offline'

import { ZEN_NODE_VERSION, WALLET_VERSION } from '../../constants/versions'
import { LOCALNET, TESTNET } from '../../constants'
import { LOGO_SRC } from '../../constants/imgSources'
import routes from '../../constants/routes'
import NetworkStore from '../../stores/networkStore'
import SecretPhraseStore from '../../stores/secretPhraseStore'

import SidebarMenu from './SidebarMenu'

type Props = {
  className?: string,
  networkStore: NetworkStore,
  secretPhraseStore: SecretPhraseStore
};

@inject('secretPhraseStore', 'networkStore')
@observer
class Sidebar extends Component<Props> {
  static defaultProps = {
    className: '',
  }
  get isBottomBarPresent() {
    return this.props.networkStore.chain !== TESTNET
  }
  get bottomDataClassName() {
    return cx('network-data-point bottom', { 'with-bottom-bar': this.isBottomBarPresent })
  }
  get bottomDataClassNameOffline() {
    return cx('network-data-point bottom', {
      'with-bottom-bar-and-offline': true && this.isBottomBarPresent,
      'with-bottom-bar': true,
    })
  }
  formattedBlockchainTime() {
    const { medianTime } = this.props.networkStore
    return medianTime
      ? moment(new Date(medianTime)).format('DD/MM/YYYY, HH:mm:ss')
      : medianTime
  }

  renderSyncingStatus() {
    const {
      isSynced, connections, isSyncing,
    } = this.props.networkStore

    if (connections === 0) {
      return
    }

    if (isSyncing) {
      return (
        <div>
          <span className="data-name" title="Syncing">
            <FontAwesomeIcon icon={['far', 'spinner-third']} spin />
          </span>
          <span className="data-point"> Syncing</span>
        </div>
      )
    }

    if (isSynced) {
      return (
        <div>
          <span className="data-name" title="Syncing">
            <FontAwesomeIcon icon={['fas', 'circle']} className="green" />
          </span>
          <span className="data-point"> Synced</span>
        </div>
      )
    }
  }

  renderMiningStatus() {
    const { isMining } = this.props.secretPhraseStore
    if (!isMining) {
      return
    }
    return (
      <div>
        <span className="data-name" title="Mining">
          <FontAwesomeIcon icon={['fas', 'cog']} spin />
        </span>
        <span className="data-point"> Mining</span>
      </div>
    )
  }

  renderVersions() {
    return (
      <React.Fragment>
        <div className="network-data-point">
          <span className="data-name" title="Wallet Version">Wallet Version: </span>
          <span className="data-point">{WALLET_VERSION}</span>
        </div>
        <div className="network-data-point">
          <span className="data-name" title="Node Version">Node Version: </span>
          <span className="data-point">{ZEN_NODE_VERSION}</span>
        </div>
      </React.Fragment>
    )
  }

  rednerHashingPower() {
    const { hashrateByUnit, hashrateUnit } = this.props.networkStore
    return (
      <div className="network-data-point truncate">
        <span className="data-name">Network Hashrate: </span>
        <span className="data-point" title={`${hashrateByUnit} ${hashrateUnit}`}>
          {parseFloat(hashrateByUnit).toFixed(2)} {hashrateUnit}
        </span>
      </div>
    )
  }

  renderNotConnectToANode() {
    return (
      <div>
        <span className="data-name">
          <FontAwesomeIcon icon={['fas', 'circle']} className="red" />
        </span>
        <span className="data-point"> Not Connected to a Node</span>
      </div>
    )
  }

  renderConnecting() {
    return (
      <div>
        <span className="data-name">
          <FontAwesomeIcon icon={['far', 'spinner-third']} spin />
        </span>
        <span className="data-point"> Connecting</span>
      </div>
    )
  }

  renderNetworkStatus() {
    const {
      chain, blocks, headers, difficulty, connections, connectedToNode,
    } = this.props.networkStore

    if (!connectedToNode) {
      return (
        <div className="network-status">
          { this.renderVersions() }
          <Online>
            <div className={this.bottomDataClassName}>
              { this.renderNotConnectToANode() }
            </div>
          </Online>
          <Offline>
            <div className={this.bottomDataClassNameOffline}>
              { this.renderNotConnectToANode() }
            </div>
          </Offline>
        </div>
      )
    }

    if (connections === 0 && chain !== LOCALNET) {
      return (
        <div className="network-status">
          { this.renderVersions() }
          <Online>
            <div className={this.bottomDataClassName}>
              { this.renderConnecting() }
            </div>
          </Online>
          <Offline>
            <div className={this.bottomDataClassNameOffline} />
          </Offline>
        </div>
      )
    }

    return (
      <div className="network-status">
        <Online>
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
            <span className="data-point" title={difficulty}>{difficulty}</span>
          </div>
          { this.rednerHashingPower() }
          <div className="network-data-point">
            <span className="data-name" title="Median Time Past">MTP: </span>
            <span className="data-point">{this.formattedBlockchainTime()}</span>
          </div>
          <div className="network-data-point">
            <span className="data-name" title="Connections">Connections: </span>
            <span className="data-point">{connections}</span>
          </div>
          { this.renderVersions() }
          <div className={this.bottomDataClassName}>
            { this.renderMiningStatus() }
            { this.renderSyncingStatus() }
          </div>
        </Online>
        <Offline>
          <div className="network-data-point">
            <span className="data-name">You are currently offline, reconnect!</span>
            { this.renderVersions() }
          </div>
        </Offline>
      </div>
    )
  }

  render() {
    return (
      <nav className={`sidebar ${this.props.className}`}>
        <div className="logo">
          <Link to={routes.PORTFOLIO}>
            <img src={LOGO_SRC} alt="Zen Protocol Logo" />
          </Link>
        </div>
        <SidebarMenu />
        {this.renderNetworkStatus()}
      </nav>
    )
  }
}

export default Sidebar
