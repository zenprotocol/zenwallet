// @flow
import type {
  Asset, RunContractPayload, SendTransactionPayload, ActiveContract,
  TransactionRequest, TransactionResponse, DeployContractPayload, NewContract,
  RawTransactionPayload,
} from '../api-service'

import getWalletInstance from './WalletFactory'

export type Chain = 'test' | 'main' | 'lsChain';
export type ChainNet = 'testnet' | 'mainnet' | 'localnet';
export interface IWallet {
    chain: Chain;
    import(mnemonic: string, password: string): Promise<{status: number}>;
    exists(): Promise<boolean>;
    checkPassword(password: string): Promise<boolean>;
    resync(): Promise<string>;
    isLocked(): Promise<boolean>;
    lock(): Promise<string>;
    unlock(string): Promise<boolean>;
    getAddress(): Promise<string>;
    getActiveContracts():Promise<ActiveContract[]>;
    getPublicKeyHash(string): Promise<string>;
    getTransactions(TransactionRequest): Promise<TransactionResponse[]>;
    getBalances(): Promise<Asset[]>;
    runContract(RunContractPayload): Promise<*>;
    sendTransaction(SendTransactionPayload): Promise<string>;
    createRawTransaction(RawTransactionPayload): Promise<string>;
    getMnemonicPhrase(password: string): Promise<string>;
    activateContract(DeployContractPayload): Promise<NewContract>
}

export { getWalletInstance }

export const networkMap = {
  mainnet: 'main',
  testnet: 'test',
  main: 'main',
  test: 'test',
  localnet: 'local',
}

