// @flow
import axios from 'axios'

import { getServerAddress, getCrowdsaleServerAddress } from '../config/server-address'

import dataBlock from './firstBlock.json'

const crowdsaleServerAddress = getCrowdsaleServerAddress()

type Hash = string;
type Address = string;
export type Asset = {
  asset: string,
  balance: number
};

export async function getBalances(): Promise<Asset[]> {
  const response = await axios.get(`${getServerAddress()}/wallet/balance`)
  return response.data
}

export async function getPublicAddress(): Promise<string> {
  const response = await axios.get(`${getServerAddress()}/wallet/address`)
  return response.data
}

export async function getPublicPkHash(publicAddress: string): Promise<string> {
  const response = await axios.get(`${getServerAddress()}/address/decode?address=${publicAddress}`)
  return response.data.pkHash
}

type Transaction = {
  to: Address,
  asset: Hash,
  amount: number
};
type Password = { password: string };
export type SendTransactionPayload = Transaction & Password;
export async function postTransaction(tx: SendTransactionPayload): Promise<string> {
  const {
    password, to, asset, amount,
  } = tx
  const data = {
    outputs: [{
      asset,
      address: to,
      amount,
    }],
    password,
  }

  const response = await axios.post(`${getServerAddress()}/wallet/send`, data, {
    headers: { 'Content-Type': 'application/json' },
  })

  return response.data
}

export type RawTransactionPayload = Transaction & Password;
export async function postRawTransaction(tx: RawTransactionPayload): Promise<string> {
  const {
    password, to, asset, amount,
  } = tx
  const data = {
    outputs: [{
      asset,
      address: to,
      amount,
    }],
    password,
  }

  const response = await axios.post(`${getServerAddress()}/wallet/createrawtransaction`, data, {
    headers: { 'Content-Type': 'application/json' },
  })

  return response.data
}

export type DeployContractPayload = { code: string, numberOfBlocks: number } & Password;
export type NewContract = { address: Address, contractId: string };

export async function postDeployContract(data: DeployContractPayload): Promise<NewContract> {
  const response = await axios.post(`${getServerAddress()}/wallet/contract/activate`, data, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response.data
}

export type RunContractPayload = {
  address: Address,
  options: {
    returnAddress: boolean
  },
  command?: string,
  messageBody?: string,
  spends?: Array<{asset: Hash, amount: number}>,
  password?: string
};
export async function postRunContract(data: RunContractPayload) {
  const response = await axios.post(`${getServerAddress()}/wallet/contract/execute`, data, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response.data
}

export type ActiveContract = {
  contractId: Hash,
  address: Address,
  expire: number,
  code: string
};
export async function getActiveContracts(): Promise<ActiveContract[]> {
  const response = await axios.get(`${getServerAddress()}/contract/active`)
  return response.data
}

export type TransactionRequest = {
  skip: number,
  take: number
};

export type TransactionDelta = {
  asset: string,
  amount: number
};

export type TransactionResponse = {
  txHash: Hash,
  asset: string,
  amount: number,
  confirmations: number
};

export async function getTxHistory({
  skip, take,
}: TransactionRequest = {}): Promise<TransactionResponse[]> {
  const response = await axios.get(`${getServerAddress()}/wallet/transactions?skip=${skip}&take=${take}`, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response.data
}
export type ApiResponseChain = 'main' | 'testnet' | 'local';

export async function getTxHistoryCount(): Promise<number> {
  const response = await axios.get(`${getServerAddress()}/wallet/transactioncount`, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response.data
}

export type BlockChainInfo = {
  chain: ApiResponseChain,
  blocks: number,
  headers: number,
  difficulty: number,
  medianTime: number,
  connections: number,
  initialBlockDownload: boolean,
  connectedToNode: boolean,
  tip: string
};

export async function getNetworkStatus(): Promise<BlockChainInfo> {
  const response = await axios.get(`${getServerAddress()}/blockchain/info`)
  return response.data
}

export async function getNetworkConnections(): Promise<number> {
  const response = await axios.get(`${getServerAddress()}/network/connections/count`)
  return response.data
}

export async function getWalletExists(): Promise<boolean> {
  const response = await axios.get(`${getServerAddress()}/wallet/exists`)
  const msg = response.data ? 'wallet exists' : 'wallet does NOT exist'
  console.log(msg)
  return response.data
}

export async function getLockWallet(): Promise<string> {
  const response = await axios.get(`${getServerAddress()}/wallet/lock`)
  return response.data
}

export async function getIsAccountLocked(): Promise<boolean> {
  const response = await axios.get(`${getServerAddress()}/wallet/locked`)
  return response.data
}

export async function postImportWallet(secretPhraseArray: string[], password: string) {
  const data = {
    words: secretPhraseArray,
    password,
  }
  console.log('postImportWallet data', data)
  const response = await axios.post(`${getServerAddress()}/wallet/import`, data, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response
}

export async function postCheckPassword(password: string) {
  const data = { password }
  const response = await axios.post(`${getServerAddress()}/wallet/checkpassword`, data, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response.data
}

export async function getWalletResync() {
  const response = await axios.get(`${getServerAddress()}/wallet/resync`)
  return response.data
}

export async function postWalletMnemonicphrase(password: string): Promise<string> {
  const data = { password }
  const response = await axios.post(`${getServerAddress()}/wallet/mnemonicphrase`, data, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response.data
}

export async function postBlockchainBlock(): Promise<string> {
  const response = await axios.post(`${getServerAddress()}/blockchain/publishblock`, dataBlock, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response.data
}

// CROWDSALE APIS //

/* eslint-disable camelcase */
export async function getCheckCrowdsaleTokensEntitlement(
  pubkey_base_64: string,
  pubkey_base_58: string,
) {
  console.log('crowdsaleServerAddress', crowdsaleServerAddress)

  const url = `${crowdsaleServerAddress}/check_crowdsale_tokens_entitlement?pubkey_base_64=${pubkey_base_64}&pubkey_base_58=${pubkey_base_58}`

  const response = await axios.get(url)
  console.log('getCheckCrowdsaleTokensEntitlement response', response)
  return response.data
}

export async function postRedeemCrowdsaleTokens(data: *) {
  const response = await axios.post(`${crowdsaleServerAddress}/redeem_crowdsale_tokens`, data, {
    headers: { 'Content-Type': 'application/json' },
  })

  return response.data
}
/* eslint-enable camelcase */
