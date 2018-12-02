// @flow
import swal from 'sweetalert'
import { ipcRenderer } from 'electron'

import history from '../../services/history'
import { IPC_SHUT_DOWN_ZEN_NODE, IPC_START_ZEN_NODE } from '../../ZenNode'
import { walletModeStore, networkStore } from '../../stores'
import routes from '../../constants/routes'
import { formatChainForZenNode } from '../../utils/helpers'

const switchWalletMode = async () => {
  const shouldSwitch = await shouldSwitchModal()
  if (!shouldSwitch) {
    return
  }
  walletModeStore.mode = walletModeStore.isFullNode() ? 'Light' : 'Full'
  const args = { net: formatChainForZenNode(networkStore.chain), walletMode: walletModeStore.mode }
  if (walletModeStore.mode === 'Full') {
    console.log('starting node signal')
    ipcRenderer.send(IPC_START_ZEN_NODE, args)
  } else {
    ipcRenderer.send(IPC_SHUT_DOWN_ZEN_NODE, args)
  }

  history.push(routes.LOADING)
}

export default switchWalletMode

function shouldSwitchModal(): boolean {
  const [currentWalletMode, otherWalletMode] = walletModeStore.modes
  return swal({
    title: 'Confirm switching wallet mode',
    text: `Switch from ${currentWalletMode} to ${otherWalletMode}?
    (Continuing will redirect you to the loading screen)`,
    icon: 'warning',
    dangerMode: true,
    buttons: true,
  })
}
