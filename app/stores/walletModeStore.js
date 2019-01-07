/* eslint-disable no-underscore-dangle */
// @flow
import { observable } from 'mobx'

import db from '../services/db'

export type WalletMode = "Light" | "Full";
const WALLET_MODE_KEY = 'wallet.mode'

class WalletModeStore {
  @observable isSwitching = false
    _mode: WalletMode
    constructor() {
      this._mode = db.get(WALLET_MODE_KEY).value() || 'Light'
    }

    get mode() {
      return this._mode
    }

    set mode(mode: WalletMode) {
      this._mode = mode
      db.set(WALLET_MODE_KEY, mode).write()
    }

    isFullNode() {
      return this._mode === 'Full'
    }
}

export default WalletModeStore
