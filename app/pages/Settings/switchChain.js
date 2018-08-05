import swal from 'sweetalert'
import { ipcRenderer } from 'electron'

import history from '../../services/history'
import { IPC_RESTART_ZEN_NODE } from '../../ZenNode'
import { networkStore, secretPhraseStore } from '../../stores'
import { MAINNET } from '../../constants'
import routes from '../../constants/routes'

const switchChain = async () => {
  const shouldSwitch = await shouldSwitchModal()
  if (!shouldSwitch) {
    return
  }
  const args = { net: formatChainForZenNode() }
  if (networkStore.otherChain === MAINNET && secretPhraseStore.isMining) {
    args.isMining = false
    secretPhraseStore.setMining(false)
  }
  ipcRenderer.send(IPC_RESTART_ZEN_NODE, args)
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

// zen node expects chain to be "main" or "test", but the api call to `/blockchain/info`
// returns "main" or "testnet", so we need to format before sending the signal
function formatChainForZenNode() {
  return networkStore.otherChain.replace('net', '')
}
