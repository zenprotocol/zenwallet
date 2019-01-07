// @flow
import swal from 'sweetalert'
import { ipcRenderer } from 'electron'

import history from '../../services/history'
import { IPC_SHUT_DOWN_ZEN_NODE, IPC_START_ZEN_NODE } from '../../ZenNode'
import { walletModeStore, networkStore } from '../../stores'
import routes from '../../constants/routes'
import { formatChainForZenNode } from '../../utils/helpers'
import { getRemoteWalletInstance, getLocalWalletInstance } from '../../services/wallet/WalletFactory'
import { getWalletInstance } from '../../services/wallet'

const ACCOUNT_EXISTS = 'account already exist'
const IMPORT_RETRY_INTERVAL = 1000
const delay = (time) => new Promise(resolve => {
  setTimeout(resolve, time)
})

const importWallet = async (wallet, seed, password) => {
  try {
    await wallet.import(seed, password)
  } catch (err) {
    if (err.response && err.response.status === 400 && err.response.data === ACCOUNT_EXISTS) {
      return
    }
    await delay(IMPORT_RETRY_INTERVAL)
    return importWallet(wallet, seed, password)
  }
}

const switchWalletMode = async () => {
  const wallet = getWalletInstance(networkStore.chain)
  let isPasswordCorrect = false
  const password = await shouldSwitchModal()
  if (!password) {
    return
  }
  isPasswordCorrect = await wallet.checkPassword(password)
  if (!isPasswordCorrect) {
    await swal('Wrong password!')
    return
  }
  walletModeStore.isSwitching = true
  walletModeStore.mode = walletModeStore.isFullNode() ? 'Light' : 'Full'
  const args = { net: formatChainForZenNode(networkStore.chain), walletMode: walletModeStore.mode }
  if (walletModeStore.mode === 'Full') {
    const existingWallet = getRemoteWalletInstance(networkStore.chain)
    const otherWallet = getLocalWalletInstance(networkStore.chain)
    const seed = await existingWallet.getMnemonicPhrase(password)

    ipcRenderer.send(IPC_START_ZEN_NODE, args)
    await importWallet(otherWallet, seed, password)
  } else {
    const existingWallet = getLocalWalletInstance(networkStore.chain)
    const otherWallet = getRemoteWalletInstance(networkStore.chain)
    const seed = await existingWallet.getMnemonicPhrase(password)
    await importWallet(otherWallet, seed, password)
    ipcRenderer.send(IPC_SHUT_DOWN_ZEN_NODE, args)
  }
  walletModeStore.isSwitching = false
  history.push(routes.LOADING)
}

export default switchWalletMode

function shouldSwitchModal(): string {
  const [currentWalletMode, otherWalletMode] = walletModeStore.isFullNode() ?
    ['Full Node', 'Light wallet'] : ['Light wallet', 'Full Node']
  return swal({
    title: 'Confirm switching wallet mode',
    text: `Switch from ${currentWalletMode} to ${otherWalletMode}?
    (Continuing will redirect you to the loading screen)`,
    content: {
      element: 'input',
      attributes: {
        placeholder: 'Type your password to continue',
        type: 'password',
      },
    },
    icon: 'warning',
    dangerMode: true,
    buttons: true,
  })
}
