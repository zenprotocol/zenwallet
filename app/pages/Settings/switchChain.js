// @flow
import swal from 'sweetalert'
import { ipcRenderer } from 'electron'

import history from '../../services/history'
import { IPC_RESTART_ZEN_NODE } from '../../ZenNode'
import { networkStore, secretPhraseStore, walletModeStore } from '../../stores'
import { MAINNET } from '../../constants/constants'
import routes from '../../constants/routes'
import { formatChainForZenNode } from '../../utils/helpers'
import db from '../../services/db'

const switchChain = async () => {
  const shouldSwitch = await shouldSwitchModal()
  if (!shouldSwitch) {
    return
  }
  networkStore.stopPolling()
  db.set('chain', networkStore.otherChain).write()

  if (walletModeStore.isFullNode()) {
    let isMining
    if (networkStore.otherChain === MAINNET && secretPhraseStore.isMining) {
      isMining = false
      secretPhraseStore.setMining(false)
    }
    const args = { net: formatChainForZenNode(networkStore.otherChain), isMining }
    ipcRenderer.send(IPC_RESTART_ZEN_NODE, args)
  }
  networkStore.chain = networkStore.otherChain
  history.push(routes.LOADING)
}

export default switchChain

function shouldSwitchModal() {
  return swal({
    title: 'Confirm switching chain',
    text: `Switch from ${networkStore.chain} to ${networkStore.otherChain}?
    (Continuing will redirect you to the loading screen)`,
    icon: 'warning',
    dangerMode: true,
    buttons: true,
  })
}

