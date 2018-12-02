// @flow
import swal from 'sweetalert'

import history from '../../services/history'
import routes from '../../constants/routes'
import { TESTNET } from '../../constants'
import { networkStore } from '../../stores'
import db from '../../services/db'
import { getWalletInstance } from '../../services/wallet'
import { MAINNET_WALLET_SEED_KEY, TESTNET_WALLET_SEED_KEY } from '../../services/wallet/RemoteWallet'


const wipeLocalStorage = async () => {
  const shouldWipe = await swal({
    title: 'Wipe your seeds',
    text: 'Be sure you have your seed saved.',
    icon: 'warning',
    dangerMode: true,
    buttons: true,
  })
  if (shouldWipe) {
    const wallet = getWalletInstance(networkStore.chain)
    if (networkStore.chain === TESTNET) {
      db.set(TESTNET_WALLET_SEED_KEY, '').write()
    } else {
      db.set(MAINNET_WALLET_SEED_KEY, '').write()
    }
    wallet.lock()
    history.push(routes.WELCOME_MESSAGES)
  }
}

export default wipeLocalStorage
