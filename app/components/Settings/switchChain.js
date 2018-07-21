import swal from 'sweetalert'
import { ipcRenderer } from 'electron'

import history from '../../services/history'
import { IPC_RESTART_ZEN_NODE } from '../../ZenNode'
import { networkState, secretPhraseState } from '../../states'
import { MAINNET } from '../../constants'

const switchChain = async () => {
  const shouldSwitch = await shouldSwitchModal()
  if (!shouldSwitch) {
    return
  }
  const args = { net: formatChainForZenNode() }
  if (networkState.otherChain === MAINNET && secretPhraseState.isMining) {
    args.isMining = false
    secretPhraseState.setMining(false)
  }
  ipcRenderer.send(IPC_RESTART_ZEN_NODE, args)
  history.push('/loading')
}

export default switchChain

function shouldSwitchModal() {
  return swal({
    title: 'Confirm switching chain',
    text: `Switch from ${networkState.chain} to ${networkState.otherChain}? 
    (Continuing will redirect you to the loading screen)`,
    icon: 'warning',
    dangerMode: true,
    buttons: true,
  })
}

// zen node expects chain to be "main" or "test", but the api call to `/blockchain/info`
// returns "main" or "testnet", so we need to format before sending the signal
function formatChainForZenNode() {
  return networkState.otherChain.replace('net', '')
}
