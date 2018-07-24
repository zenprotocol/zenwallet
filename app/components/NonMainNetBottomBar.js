// @flow

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import { MAINNET, LOCALNET, TESTNET } from '../constants'
import NetworkStore from '../stores/networkStore'

type Props = {
  networkStore: NetworkStore,
  width?: number
};

@inject('networkStore')
@observer
class NonMainNetBottomBar extends Component<Props> {
  render() {
    const { networkStore, width } = this.props
    if (networkStore.chain === MAINNET) {
      return null
    }
    return (
      <div style={style(width)}>
        <FontAwesomeIcon style={{ marginRight: 5 }} icon={['fas', 'exclamation-triangle']} />
        {text(networkStore.chain)}
      </div>
    )
  }
}

export default NonMainNetBottomBar

function text(chain) {
  if (chain === LOCALNET) {
    return 'LOCAL NET CHAIN'
  }
  if (chain === TESTNET) {
    return 'TESTNET'
  }
  return 'UNKNOWN NETWORK'
}
function style(width) {
  return {
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: width || '100%',
    background: '#fd3a3a',
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    paddingTop: 6,
    paddingBottom: 6,
  }
}
