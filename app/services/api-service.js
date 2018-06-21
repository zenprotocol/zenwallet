// @flow
import axios from 'axios'
import type { observableArray } from 'mobx-react'

import { isZenAsset } from '../utils/helpers'
import { getServerAddress, getCrowdsaleServerAddress } from '../config/server-address'

const serverAddress = getServerAddress()
const crowdsaleServerAddress = getCrowdsaleServerAddress()

type hash = string;
type addressType = string;

type Asset = {
  asset: string,
  balance: string
};

export async function getBalances(): Promise<Asset[]> {
  const response = await axios.get(`${serverAddress}/wallet/balance`)
  return response.data.map(asset => ({
    ...asset,
    balance: normalizePresentableAmount(asset.asset, asset.balance),
  }))
}

export async function getPublicAddress(): Promise<string> {
  const response = await axios.get(`${serverAddress}/wallet/address`)
  return response.data
}

type Transaction = {
  to: addressType,
  asset: hash,
  amount: number
};
type Password = { password: string };
export async function postTransaction(tx: Transaction & Password): Promise<string> {
  const {
    password, to, asset, amount,
  } = tx
  const data = {
    outputs: [{
      asset,
      address: to,
      amount: normalizeSendableAmount(asset, amount),
    }],
    password,
  }

  const response = await axios.post(`${serverAddress}/wallet/send`, data, {
    headers: { 'Content-Type': 'application/json' },
  })

  return response.data
}

type ActivateContractPayload = { code: string, numberOfBlocks: number } & Password;
type NewContract = { address: addressType, contractId: string };

export async function postActivateContract(data: ActivateContractPayload): Promise<NewContract> {
  console.log('postActivateContract data', data)
  const response = await axios.post(`${serverAddress}/wallet/contract/activate`, data, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response.data
}

type ContractMessage = {
  asset: hash,
  address: addressType,
  amount: number,
  command: string,
  data?: ?string
};

type RunContractPayload = {
  address: addressType,
  options: {
    returnAddress: boolean
  },
  command?: string,
  data?: string,
  spends?: Array<{asset: hash, amount: number}>
};
export async function postRunContractMessage(contractMessage: ContractMessage & Password) {
  const {
    password, asset, address, amount, command, data,
  } = contractMessage

  const finaldata: RunContractPayload = {
    password,
    address,
    options: {
      returnAddress: true,
    },
  }
  if (command) { finaldata.command = command }
  if (data) { finaldata.data = data }

  if (asset && amount) {
    finaldata.spends = [
      {
        asset,
        amount: normalizeSendableAmount(asset, amount),
      },
    ]
  }

  const response = await axios.post(`${serverAddress}/wallet/contract/execute`, finaldata, {
    headers: { 'Content-Type': 'application/json' },
  })

  return response.data
}

type ActiveContract = {
  contractId: hash,
  address: addressType,
  expire: number,
  code: string
};
export async function getActiveContractSet(): Promise<ActiveContract[]> {
  const response = await axios.get(`${serverAddress}/contract/active`)
  return response.data
}

type TransactionRequest = {
  skip: number,
  take: number
};

export type TransactionDelta = {
  asset: string,
  amount: number
};

export type TransactionResponse = {
  txHash: hash,
  asset: string,
  amount: number,
  confirmations: number
};

export async function getTxHistory({
  skip, take,
}: TransactionRequest = {}): Promise<TransactionResponse[]> {
  const response = await axios.get(`${serverAddress}/wallet/transactions?skip=${skip}&take=${take}`, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response.data
}

type BlockChainInfo = {
  chain: string,
  blocks: number,
  headers: number,
  difficulty: number,
  medianTime: number
};
export async function getNetworkStatus(): Promise<BlockChainInfo> {
  const response = await axios.get(`${serverAddress}/blockchain/info`)
  return response.data
}

export async function getNetworkConnections(): Promise<number> {
  const response = await axios.get(`${serverAddress}/network/connections/count`)
  return response.data
}

export async function getWalletExists(): Promise<boolean> {
  const response = await axios.get(`${serverAddress}/wallet/exists`)
  console.log('getWalletExists()', response.data)
  return response.data
}

export async function getLockWallet(): Promise<string> {
  const response = await axios.get(`${serverAddress}/wallet/lock`)
  return response.data
}

export async function getIsAccountLocked(): Promise<boolean> {
  const response = await axios.get(`${serverAddress}/wallet/locked`)
  return response.data
}

export async function postImportWallet(secretPhraseArray: observableArray, password: string) {
  const data = {
    words: secretPhraseArray,
    password,
  }
  console.log('postImportWallet data', data)
  const response = await axios.post(`${serverAddress}/wallet/import`, data, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response
}

export async function postCheckPassword(password: string) {
  const data = { password }
  const response = await axios.post(`${serverAddress}/wallet/checkpassword`, data, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response.data
}

export async function getWalletResync() {
  const response = await axios.get(`${serverAddress}/wallet/resync`)
  return response.data
}

export async function postWalletMnemonicphrase(password: string): string {
  const data = { password }
  const response = await axios.post(`${serverAddress}/wallet/mnemonicphrase`, data, {
    headers: { 'Content-Type': 'application/json' },
  })
  // $FlowFixMe
  return response.data
}

export function normalizeSendableAmount(asset: hash, amount: number) {
  return isZenAsset(asset) ? Math.floor(amount * 100000000) : amount
}
export function normalizePresentableAmount(asset: hash, amount: number) {
  if (isZenAsset(asset)) {
    return (amount / 100000000).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    })
  }
  return amount.toLocaleString()
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
