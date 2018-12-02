import swal from 'sweetalert'
import { ipcRenderer } from 'electron'

import history from '../../services/history'
import { IPC_RESTART_ZEN_NODE } from '../../ZenNode'
import { networkStore, secretPhraseStore, walletModeStore } from '../../stores'
import { MAINNET } from '../../constants'
import routes from '../../constants/routes'
import { formatChainForZenNode } from '../../utils/helpers'
import db from '../../services/db'

const switchChain = async () => {
  const shouldSwitch = await shouldSwitchModal()
  if (!shouldSwitch) {
    return
  }
  const args = { net: formatChainForZenNode(networkStore.otherChain) }

  if (walletModeStore.isFullNode()) {
    if (networkStore.otherChain === MAINNET && secretPhraseStore.isMining) {
      args.isMining = false
      secretPhraseStore.setMining(false)
    }
    ipcRenderer.send(IPC_RESTART_ZEN_NODE, args)
  }
  networkStore.chain = networkStore.otherChain
  db.set('chain', args.net).write()
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

