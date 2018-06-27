import React from 'react'
import swal from 'sweetalert'
import { ipcRenderer } from 'electron'

import { WALLET_VERSION } from '../../constants/versions'
import { IPC_ASK_IF_WIPED_DUE_TO_VERSION, IPC_ANSWER_IF_WIPED_DUE_TO_VERSION } from '../../ZenNode'

class WipeModal extends React.Component {
  componentDidMount() {
    ipcRenderer.send(IPC_ASK_IF_WIPED_DUE_TO_VERSION)
    ipcRenderer.once(IPC_ANSWER_IF_WIPED_DUE_TO_VERSION, (evt, flag) => {
      if (flag) {
        this.initModal()
      }
    })
  }
  initModal() {
    swal({
      title: 'Local wipe occured',
      text: `Your new version of the zen wallet (${WALLET_VERSION}) requires a local chain wipe, so we automatically did it for you. Sit back while your local node is being synced with the network (see syncing progress in the bottom left portion of the screen)`,
    })
  }
  render() {
    return null
  }
}

export default WipeModal
