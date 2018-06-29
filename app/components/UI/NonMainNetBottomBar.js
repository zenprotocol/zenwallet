// @flow

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import { MAINNET, LOCALNET, TESTNET } from '../../constants'
import NetworkState from '../../states/network-state'

type Props = {
  networkState: NetworkState,
  width?: number
};

@inject('networkState')
@observer
class NonMainNetBottomBar extends Component<Props> {
  render() {
    const { networkState, width } = this.props
    if (networkState.chain === MAINNET) {
      return null
    }
    return (
      <div style={style(width)}>
        <FontAwesomeIcon style={{ marginRight: 5 }} icon={['fas', 'exclamation-triangle']} />
        {text(networkState.chain)}
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
    return 'TEST NET CHAIN'
  }
  return 'UNKONWN CHAIN'
}
function style(width) {
  return {
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: width || '100%',
    background: 'rgba(253, 58, 58, 0.5)',
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    paddingTop: 2,
    paddingBottom: 2,
  }
}
