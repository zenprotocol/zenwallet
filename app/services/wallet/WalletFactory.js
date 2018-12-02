// @flow
import type { ApiResponseChain } from '../api-service'
import type { WalletMode } from '../../stores/walletModeStore'
import db from '../db'

import RemoteWallet from './RemoteWallet'
import LocalWallet from './LocalWallet'

import type { IWallet } from './index'

const walletInstances = {
  Light: {},
  Full: {},
}

const getWalletInstance = (chain: ApiResponseChain): IWallet => {
  const mode: WalletMode = db.get('wallet.mode').value() || 'Light'
  if (mode === 'Light') {
    if (!walletInstances.Light[chain]) {
      walletInstances.Light[chain] = new RemoteWallet(chain)
    }
    return walletInstances.Light[chain]
  }
  if (!walletInstances.Full[chain]) {
    walletInstances.Full[chain] = new LocalWallet(chain)
  }
  return walletInstances.Full[chain]
}

export default getWalletInstance
