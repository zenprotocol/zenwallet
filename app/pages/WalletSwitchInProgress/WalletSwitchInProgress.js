// @flow
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Flexbox from 'flexbox-react'

import { LOADING_GIF_SRC, LOGO_GIF_SRC } from '../../constants/imgSources'
import WalletModeStore from '../../stores/walletModeStore'

type Props = {
    walletModeStore: WalletModeStore
};
@inject('walletModeStore')
@observer
class WalletSwitchInProgress extends Component<Props> {
  render() {
    if (!this.props.walletModeStore.isSwitching) {
      return null
    }
    return (
      <Flexbox flexDirection="column" className="loading-container">
        <Flexbox flexDirection="column" className="center">
          <img className="zen-logo" src={LOGO_GIF_SRC} alt="Zen Protocol Logo" />
          <p>Switching wallet mode, please wait</p>
          <img className="loading-dots" src={LOADING_GIF_SRC} alt="Loading Gif" />
        </Flexbox>
      </Flexbox>
    )
  }
}

export default WalletSwitchInProgress
