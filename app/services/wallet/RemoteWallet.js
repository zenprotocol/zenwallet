// @flow
import { Wallet } from '@zen/zenjs/build/src/Wallet'
import { SecurePhrase } from '@zen/zenjs/build/src/SecurePhrase'

import db from '../db'
import { getActiveContracts as getActiveContractsRemote } from '../remote-node-api-service'
import type {
  RunContractPayload, SendTransactionPayload,
  ApiResponseChain, Asset,
} from '../api-service'

import type { IWallet, Chain } from './index'
import { networkMap } from './index'

export const MAINNET_WALLET_SEED_KEY = 'mainnet.wallet.seed'
export const TESTNET_WALLET_SEED_KEY = 'testnet.wallet.seed'
class RemoteWallet implements IWallet {
    chain: Chain
    instance: any

    constructor(chain: ApiResponseChain) {
      this.chain = networkMap[chain]
    }

    get walletSeed() {
      return this.chain === 'main' ? MAINNET_WALLET_SEED_KEY : TESTNET_WALLET_SEED_KEY
    }

    async unlock(password: string) {
      const isPasswordCorrect = await this.checkPassword(password)
      if (isPasswordCorrect) {
        const mnemonicString = await this.getMnemonicPhrase(password)
        const { status } = await this.import(mnemonicString, password)
        return status === 200
      }
      return false
    }

    async sendTransaction(payload: SendTransactionPayload) {
      await this.resync()
      return this.instance.send([{
        address: payload.to,
        asset: payload.asset,
        amount: payload.amount,
      }])
    }

    createRawTransaction() {
      throw new Error('action is not yet supported')
    }

    async runContract(payload: RunContractPayload) {
      await this.resync()
      const {
        address, command, messageBody, options, spends,
      } = payload
      return this.instance.executeContract(
        address,
        command,
        messageBody,
        options.returnAddress,
        spends,
      )
    }

    async getTransactions() {
      await this.resync()
      return this.instance.getTransactions()
    }

    async getBalances() {
      await this.resync()
      const balance: {[string]: number} = this.instance.getBalance()
      const assets: string[] = Object.keys(balance)
      const assetBalances: Asset[] = assets.map(asset => ({ asset, balance: balance[asset] }))
      return Promise.resolve(assetBalances)
    }

    async getAddress() {
      await this.resync()
      return this.instance.getAddress()
    }

    async getPublicKeyHash() {
      await this.resync()
      return this.instance.getPublicKeyHash().hash
    }

    activateContract() {
      throw new Error('action is not yet supported')
    }

    import(mnemonic: string, password: string) {
      const encryptedPassword = SecurePhrase.encrypt(password, mnemonic)
      db.set(this.walletSeed, encryptedPassword).write()

      const remoteEndPoint = this.chain === 'main' ? 'https://remote-node.zp.io' : 'https://testnet-remote-node.zp.io'
      this.instance = Wallet.fromMnemonic(
        mnemonic, this.chain,
        new Wallet.RemoteNodeWalletActions(remoteEndPoint),
      )
      return Promise.resolve({ status: 200 })
    }

    exists() {
      return Promise.resolve(db.get(this.walletSeed).value())
    }

    decryptMnemonicPhrase(password: string) {
      try {
        const seed = db.get(this.walletSeed).value()
        const decryptedSeed = SecurePhrase.decrypt(password, seed).toString()
        return decryptedSeed
      } catch (err) {
        return ''
      }
    }

    checkPassword(password: string) {
      const valid = !!this.decryptMnemonicPhrase(password)
      return Promise.resolve(valid)
    }

    resync() {
      if (this.instance) {
        this.instance.refresh()
        return Promise.resolve('done')
      }
      throw (new Error('wallet has not been initialised'))
    }

    getMnemonicPhrase(password: string) {
      const phrase = this.decryptMnemonicPhrase(password)
      return Promise.resolve(phrase)
    }

    isLocked() {
      const initialised = this.instance === null
      return Promise.resolve(initialised)
    }

    lock() {
      this.instance = null
      return Promise.resolve('')
    }

    getActiveContracts() {
      return getActiveContractsRemote()
    }
}

export default RemoteWallet
