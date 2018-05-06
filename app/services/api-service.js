// @flow
import { get, post } from 'axios'

import { isZenAsset } from '../../utils/helpers'
import { getServerAddress, getCrowdsaleServerAddress } from '../config/server-address'

const serverAddress = getServerAddress()
const crowdsaleServerAddress = getCrowdsaleServerAddress()
type hash = string;
type address = string;

type Asset = {
  asset: hash,
  assetType: hash,
  balance: number
};

export async function getBalances(): Promise<Asset[]> {
  const response = await get(`${serverAddress}/wallet/balance`)
  return response.data.map(asset => ({
    ...asset,
    balance: normalizePresentableAmount(asset.asset, asset.balance),
  }))
}

export async function getPublicAddress(): Promise<string> {
  const response = await get(`${serverAddress}/wallet/address`)
  return response.data
}

type Transaction = {
  to?: address,
  asset: hash,
  assetType: hash,
  amount: number
};
type Password = { password: string };
export async function postTransaction(tx: Transaction & Password): Promise<string> {
  const {
    password, to, asset, assetType, amount,
  } = tx
  const data = {
    address: to,
    password,
    spend: {
      asset,
      assetType,
      amount: normalizeSendableAmount(asset, amount),
    },
  }

  const response = await post(`${serverAddress}/wallet/send`, data, {
    headers: { 'Content-Type': 'application/json' },
  })

  return response.data
}

type ActivateContractPayload = { code: string, numberOfBlocks: string } & Password;
export async function postActivateContract(data: ActivateContractPayload) {
  console.log('postActivateContract data', data)
  const response = await post(`${serverAddress}/wallet/contract/activate`, data, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response.data
}

type ContractMessage = {
  asset: hash,
  assetType: hash,
  to: address,
  amount: number,
  command: string,
  data: string
};

type RunContractPayload = {
  address: address,
  options: {
    returnAddress: boolean
  },
  command?: string,
  data?: string,
  spends?: Array<{asset: hash, assetType: hash, amount: number}>
};
export async function postRunContractMessage(contractMessage: ContractMessage & Password) {
  const {
    password, asset, assetType, to, amount, command, data,
  } = contractMessage

  const finaldata: RunContractPayload = {
    password,
    address: to,
    options: {
      returnAddress: true,
    },
  }
  if (command) { finaldata.command = command }
  if (data) { finaldata.data = data }

  if (asset && assetType && amount) {
    finaldata.spends = [
      {
        asset,
        assetType,
        amount: normalizeSendableAmount(asset, amount),
      },
    ]
  }

  const response = await post(`${serverAddress}/wallet/contract/execute`, finaldata, {
    headers: { 'Content-Type': 'application/json' },
  })

  return response.data
}

type Contract = {
  contractHash: hash,
  address: address,
  expire: number,
  code: string,
  name?: string
};
export async function getActiveContractSet(): Promise<Contract[]> {
  const response = await get(`${serverAddress}/contract/active`)
  return response.data
}

type TransactionResponse = {
  txHash: hash,
  deltas: Transaction[]
};
export async function getTxHistory(): Promise<TransactionResponse[]> {
  const response = await get(`${serverAddress}/wallet/transactions`)
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
  const response = await get(`${serverAddress}/blockchain/info`)
  return response.data
}

export async function getNetworkConnections(): Promise<number> {
  const response = await get(`${serverAddress}/network/connections/count`)
  return response.data
}

export async function getWalletExists(): Promise<boolean> {
  console.log('getWalletExists()')
  const response = await get(`${serverAddress}/wallet/exists`)
  return response.data
}

export async function getLockWallet(): Promise<string> {
  const response = await get(`${serverAddress}/wallet/lock`)
  return response.data
}

export async function getIsAccountLocked(): Promise<boolean> {
  const response = await get(`${serverAddress}/wallet/locked`)
  return response.data
}

export async function postImportWallet(secretPhraseArray: string[], secret: string) {
  const data = {
    words: secretPhraseArray,
    password: secret,
  }
  console.log('postImportWallet data', data)
  const response = await post(`${serverAddress}/wallet/import`, data, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response
}

export async function postCheckPassword(password: string) {
  const data = { password }
  const response = await post(`${serverAddress}/wallet/checkpassword`, data, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response.data
}

export async function getWalletResync() {
  const response = await get(`${serverAddress}/wallet/resync`)
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

  const response = await get(url)
  console.log('getCheckCrowdsaleTokensEntitlement response', response)
  return response.data
}

export async function postRedeemCrowdsaleTokens(data: *) {
  const response = await post(`${crowdsaleServerAddress}/redeem_crowdsale_tokens`, data, {
    headers: { 'Content-Type': 'application/json' },
  })

  return response.data
}
/* eslint-enable camelcase */
