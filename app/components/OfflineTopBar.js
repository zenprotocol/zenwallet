// @flow

import React, { Component } from 'react'
import { observer } from 'mobx-react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'


type Props = {
  width?: number
};


@observer
class OfflineTopBar extends Component<Props> {
  style(width) {
    return {
      position: 'fixed',
      right: '38%',
      top: 0,
      width: width || '100%',
      background: '#f68b3d',
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

export default OfflineTopBar
