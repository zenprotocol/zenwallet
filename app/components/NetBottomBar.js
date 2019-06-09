// @flow

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import FontAwesomeIcon from '../vendor/@fortawesome/react-fontawesome'
import { MAINNET } from '../constants'
import NetworkStore from '../stores/networkStore'
import WalletModeStore from '../stores/walletModeStore'
import switchChain from '../pages/Settings/switchChain'

type Props = {
  networkStore: NetworkStore,
  walletModeStore: WalletModeStore,
  isSidebar?: boolean,
  width?: number
};

@inject('networkStore', 'walletModeStore')
@observer
class NetBottomBar extends Component<Props> {
  renderMainnetBar() {
    if (this.props.isSidebar) {
      return null
    }
    const walletMode = this.props.walletModeStore.isFullNode() ? 'Full Node' : 'Light Wallet'
    return (
      <div style={this.style}>
        MAINNET {walletMode} <a style={this.switchStyle} onClick={switchChain}>(Switch to Testnet)</a>
      </div>
    )
  }

  renderTestnetBar() {
    let walletMode = ''
    if (this.props.isSidebar) {
      walletMode = ''
    } else {
      walletMode = this.props.walletModeStore.isFullNode() ? 'Full Node' : 'Light Wallet'
    }
    return (
      <div style={this.style}>
        <FontAwesomeIcon style={{ marginRight: 5 }} icon={['fas', 'exclamation-triangle']} />
        TESTNET {walletMode} <a style={this.switchStyle} onClick={switchChain}>(Switch to Mainnet)</a>
      </div>
    )
  }

  get style() {
    const { width, networkStore: { chain } } = this.props
    return {
      position: 'fixed',
      left: 0,
      bottom: 0,
      width: width || '100%',
      background: chain === MAINNET ? 'rgba(18, 18, 18, 0.1)' : '#fd3a3a',
      textAlign: 'center',
      color: 'white',
      fontWeight: chain === MAINNET ? 'inherit' : 'bold',
      paddingTop: 6,
      paddingBottom: 6,
    }
  }

  get switchStyle() {
    return {
      fontSize: 10,
      color: 'inherit',
    }
  }

  render() {
    const { networkStore } = this.props
    console.log('networkStore.chain', networkStore.chain)
    return networkStore.chain === MAINNET ? this.renderMainnetBar() : this.renderTestnetBar()
  }
}

export default NetBottomBar
