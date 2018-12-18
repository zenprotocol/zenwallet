// @flow

import React, { Component } from 'react'
import { observer } from 'mobx-react'

type Props = {
  width?: number
};

@observer
class OnlineTopBar extends Component<Props> {
  // $FlowFixMe
  style(width) {
    return {
      position: 'fixed',
      right: '38%',
      top: 0,
      width: width || '100%',
      background: '#3385c6',
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
        Connected
      </div>
    )
  }
}

export default OnlineTopBar
