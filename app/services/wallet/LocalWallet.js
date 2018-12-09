// @flow
import {
  getWalletExists, postImportWallet, getWalletResync, postCheckPassword,
  getIsAccountLocked, getLockWallet, postWalletMnemonicphrase, getBalances,
  getPublicAddress, getPublicPkHash, getActiveContracts, postRunContract,
  getTxHistory, postTransaction, postDeployContract, postRawTransaction,
} from '../api-service'
import type {
  RunContractPayload, SendTransactionPayload, RawTransactionPayload,
  TransactionRequest, DeployContractPayload,
} from '../api-service'
import type { AppChain } from '../../constants'

import type { IWallet, Chain } from './index'
import { networkMap } from './index'

class LocalWallet implements IWallet {
    chain: Chain
    constructor(chain: AppChain) {
      this.chain = networkMap[chain]
    }

    createRawTransaction(payload: RawTransactionPayload) {
      return postRawTransaction(payload)
    }

    activateContract(payload: DeployContractPayload) {
      return postDeployContract(payload)
    }

    sendTransaction(payload: SendTransactionPayload) {
      return postTransaction(payload)
    }

    getTransactions(payload: TransactionRequest) {
      return getTxHistory(payload)
    }

    runContract(payload: RunContractPayload) {
      return postRunContract(payload)
    }

    getActiveContracts() {
      return getActiveContracts()
    }

    import(mnemonic: string, password: string) {
      const words = mnemonic.split(' ')
      return postImportWallet(words, password)
    }

    unlock(password: string) {
      return this.checkPassword(password)
    }

    exists() {
      return getWalletExists()
    }

    getBalances() {
      return getBalances()
    }

    getAddress() {
      return getPublicAddress()
    }

    getPublicKeyHash(address: string) {
      return getPublicPkHash(address)
    }

    checkPassword(password: string) {
      return postCheckPassword(password)
    }

    resync() {
      return getWalletResync()
    }

    getMnemonicPhrase(password: string) {
      return postWalletMnemonicphrase(password)
    }

    isLocked() {
      return getIsAccountLocked()
    }

    lock() {
      return getLockWallet()
    }
}

export default LocalWallet
