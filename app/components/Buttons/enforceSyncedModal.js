import React from 'react'
import ReactDOM from 'react-dom'
import swal from 'sweetalert'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { observer } from 'mobx-react'

import { networkStore } from '../../stores'
import NetworkStore from '../../stores/networkStore'

const enforceSyncedModal = () => {
  if (networkStore.isSynced) {
    return true
  }
  return swal({
    text: 'Must be fully synced to perform this operation!',
    icon: 'info',
    content: getModalContent(),
    className: 'enfore-synced-modal',
    buttons: false,
  })
}

export default enforceSyncedModal

type Props = {
  networkStore: NetworkStore
};

@observer
class ProtectWhenSyncingModal extends React.Component<Props> {
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

  renderPartialNetworkStatus() {
    const {
      chain, blocks, headers, connections, connectedToNode,
    } = this.props.networkStore

    if (!connectedToNode) {
      return (
        <div className="network-status">
          <span className="data-name">
            <FontAwesomeIcon icon={['fas', 'circle']} className="red" />
          </span>
          <span className="data-point"> Not Connected to a Node</span>
        </div>
      )
    }
    if (connections === 0) {
      return (
        <div className="network-status">
          <span className="data-name">
            <FontAwesomeIcon icon={['far', 'spinner-third']} spin />
          </span>
          <span className="data-point"> Connecting</span>
        </div>
      )
    }
    return (
      <div className="network-status">
        <div>
          <span className="data-name">Chain: </span>
          <span className="data-point">{chain}</span>
        </div>
        <div>
          <span className="data-name">Blocks: </span>
          <span className="data-point">{blocks.toLocaleString()}</span>
        </div>
        <div>
          <span className="data-name">Headers: </span>
          <span className="data-point">{headers.toLocaleString()}</span>
        </div>
        <div>
          <span className="data-name" title="Connections">Connections: </span>
          <span className="data-point">{connections}</span>
        </div>
        <div>
          { this.renderSyncingStatus() }
        </div>
      </div>
    )
  }
  onContinue = () => {
    swal.setActionValue({ cancel: true })
    swal.close()
  }
  onCancel = () => swal.close()
  renderButtons() {
    const { isSynced } = this.props.networkStore
    return (
      <div>
        <button className="secondary" onClick={this.onCancel}>Cancel</button>
        <button
          className="button-on-right"
          onClick={this.onContinue}
          disabled={!isSynced}
        >Continue {!isSynced && <FontAwesomeIcon icon={['far', 'spinner-third']} spin />}
        </button>
      </div>
    )
  }
  render() {
    return (
      <div>
        {this.renderPartialNetworkStatus()}
        <p style={{ margin: 40 }}>
          Once you are fully synced with the network, the &quot;continue&quot;
          button will become enabled
        </p>
        {this.renderButtons()}
      </div>
    )
  }
}

function getModalContent() {
  const wrapper = document.createElement('div')
  ReactDOM.render(<ProtectWhenSyncingModal networkStore={networkStore} />, wrapper)
  return wrapper.firstChild
}
