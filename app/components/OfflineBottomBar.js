// @flow

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import NetworkStore from '../stores/networkStore'
import { MAINNET } from '../constants'

type Props = {
  networkStore: NetworkStore,
  width?: number
};

@inject('networkStore')
@observer
class OfflineBottomBar extends Component<Props> {
  isTestnet() {
    const { networkStore } = this.props
    if (networkStore.chain === MAINNET) {
      return false
    }
    return true
  }
  style(width) {
    console.log(this.isTestnet)
    const bottom = this.isTestnet() ? 29 : 0
    return {
      position: 'fixed',
      left: 0,
      bottom,
      width: width || '100%',
      background: '#fd3a3a',
      textAlign: 'center',
      color: 'white',
      fontWeight: 'bold',
      paddingTop: 6,
      paddingBottom: 6,
    }
  }
  render() {
    const { width } = this.props
    return (
      <div style={this.style(width)}>
        <FontAwesomeIcon style={{ marginRight: 5 }} icon={['fas', 'exclamation-triangle']} />
        OFFLINE
      </div>
    )
  }
}

export default OfflineBottomBar
