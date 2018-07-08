import { remote, ipcRenderer } from 'electron'
import swal from 'sweetalert'

import { IPC_ZEN_NODE_NON_ZERO_EXIT } from '../ZenNode'
import { BUG_BOUNTY_URL } from '../constants'

ipcRenderer.on(IPC_ZEN_NODE_NON_ZERO_EXIT, async (evt, logs) => {
  await swal({
    title: 'There was an uncaught error in the zen node',
    text: `Please copy and paste the following text and follow the steps at ${BUG_BOUNTY_URL}:\n\n ${logs.join('')}`,
    icon: 'error',
    className: 'zen-node-non-zero-exit-modal',
  })
  // TODO check if this works
  remote.app.quit()
})
