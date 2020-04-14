// @flow
import axios from 'axios'
import type { observableArray } from 'mobx-react'

import { getServerAddress, getCrowdsaleServerAddress } from '../config/server-address'
import { MAINNET } from '../constants/constants'

import dataBlock from './firstBlock.json'

const crowdsaleServerAddress = getCrowdsaleServerAddress()

type Hash = string;
type Address = string;
type Asset = {
  asset: string,
  balance: number
};

type Spend = {
  asset: string,
  amount: number
};

type Candidate = {
  "recipient": string,
  "spendlist": Spend[]
};

const getRemoteNode = chain => (chain === MAINNET ? 'https://remote-node.zp.io' : 'https://testnet-remote-node.zp.io')

export async function getBalances(): Promise<Asset[]> {
  const response = await axios.get(`${getServerAddress()}/wallet/balance`)
  return response.data
}
const mainnetBlockExplorer = axios.create({
  baseURL: 'https://zp.io/',
  headers: { 'Access-Control-Allow-Origin': '*' },
})

const testnetBlockExplorer = axios.create({
  baseURL: 'https://testnet.zp.io/',
  headers: { 'Access-Control-Allow-Origin': '*' },
})

const getBE = chain => (chain === MAINNET ? mainnetBlockExplorer : testnetBlockExplorer)

export async function getCgp() {
  const response = await axios.get(`${getServerAddress()}/blockchain/cgp`)
  return response.data
}

export async function getCgpHistory({ interval } = {}) {
  const params = interval ? { interval } : {}
  const response = await axios.get(`${getServerAddress()}/blockchain/cgp/history`, { params })
  return response.data
}

export async function getLastAllocation(chain, currentInterval: number) {
  const response = await getBE(chain).get(`/api/cgp/relevant?interval=${currentInterval - 1}`)
  return response.data
}

export async function getCgpVotesFromExplorer({
  chain,
  type,
  interval,
  page = 0,
  pageSize = 1,
} = {}) {
  const response = await getBE(chain).get(`api/cgp/votes/${type}`, {
    params: {
      interval,
      page,
      pageSize,
    },
  })
  return response.data
}

export async function getCgpResultsFromExplorer({
  chain,
  type,
  interval,
  page = 0,
  pageSize = 1,
} = {}) {
  const response = await getBE(chain).get(`api/cgp/results/${type}`, {
    params: {
      interval,
      page,
      pageSize,
    },
  })
  return response.data
}

export async function getCgpParticipatedZpFromExplorer({ chain, type, interval } = {}) {
  const response = await getBE(chain).get(`api/cgp/participatedZp/${type}`, {
    params: {
      interval,
    },
  })
  return response.data
}

export async function getCgpPopularBallotsFromExplorer({
  chain,
  page = 0,
  pageSize = 5,
  currentInterval,
  type,
} = {}) {
  const response = await getBE(chain).get(`api/cgp/ballots/${type}?interval=${currentInterval}`, {
    params: {
      page,
      pageSize,
    },
  })
  return response.data
}

export async function getCgpVotesCount(chain, interval) {
  const [responsePayout, responseAllocation] = await Promise.all([
    getBE(chain).get('api/cgp/votes/payout', {
      params: {
        interval,
        page: 0,
        pageSize: 1,
      },
    }),
    getBE(chain).get('api/cgp/votes/allocation', {
      params: {
        interval,
        page: 0,
        pageSize: 1,
      },
    }),
  ])
  return responsePayout.data.data.count + responseAllocation.data.data.count
}

export async function getCurrentInterval(chain) {
  const response = await getBE(chain).get('api/votes/relevant')
  return response.data.data
}

export async function getNextInterval(chain) {
  const response = await getBE(chain).get('api/votes/next')
  return response.data.data
}

export async function getPublicAddress(): Promise<string> {
  const response = await axios.get(`${getServerAddress()}/wallet/address`)
  return response.data
}

export async function getRepoCandidates(chain) {
  const response = await getBE(chain).get('api/votes/candidates')
  return response.data
}

export async function getCandidates(interval: string): Promise<Candidate[]> {
  const response = await axios.get(`${getServerAddress()}/blockchain/candidates?interval=${interval}`)
  return response.data
}

export async function getTxHistoryCount() {
  const response = await axios.get(`${getServerAddress()}/wallet/transactioncount`, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response.data
}

export async function getPublicPkHash(publicAddress: string): Promise<string> {
  const response = await axios.get(`${getServerAddress()}/address/decode?address=${publicAddress}`)
  return response.data.pkHash
}

export async function getUtxo(chain: string, address: string) {
  const response = await axios.post(`${getRemoteNode(chain)}/api/unspentoutputs`, [address], {
    headers: { 'Content-Type': 'application/json' },
  })
  return response.data
}

type Transaction = {
  to: Address,
  asset: Hash,
  amount: number
};
type Password = { password: string };
export async function postTransaction(tx: Transaction & Password): Promise<string> {
  const {
    password, to, asset, amount,
  } = tx
  const data = {
    outputs: [
      {
        asset,
        address: to,
        amount,
      },
    ],
    password,
  }

  const response = await axios.post(`${getServerAddress()}/wallet/send`, data, {
    headers: { 'Content-Type': 'application/json' },
  })

  return response.data
}

type WalletKey = {
  publicKey: string,
  path: string
};
export async function postWalletKeys(password: Password): Promise<WalletKey[]> {
  const data = { password }
  const response = await axios.post(`${getServerAddress()}/wallet/keys`, data, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response.data
}

type Sign = {
  message: string,
  path: string
};
export async function postSign(sign: Sign & Password): Promise<string> {
  const { password, message, path } = sign
  const data = {
    message,
    path,
    password,
  }

  const response = await axios.post(`${getServerAddress()}/wallet/sign`, data, {
    headers: { 'Content-Type': 'application/json' },
  })

  return response.data
}
export async function postRawTransaction(tx: Transaction & Password): Promise<string> {
  const {
    password, to, asset, amount,
  } = tx
  const data = {
    outputs: [
      {
        asset,
        address: to,
        amount,
      },
    ],
    password,
  }

  const response = await axios.post(`${getServerAddress()}/wallet/createrawtransaction`, data, {
    headers: { 'Content-Type': 'application/json' },
  })

  return response.data
}

type DeployContractPayload = { code: string, numberOfBlocks: number } & Password;
type NewContract = { address: Address, contractId: string };

export async function postDeployContract(data: DeployContractPayload): Promise<NewContract> {
  const response = await axios.post(`${getServerAddress()}/wallet/contract/activate`, data, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response.data
}

type RunContractPayload = {
  address: Address,
  options: {
    returnAddress: boolean
  },
  command?: string,
  messageBody?: string,
  spends?: Array<{ asset: Hash, amount: number }>
};
export async function postRunContract(data: RunContractPayload & Password) {
  const response = await axios.post(`${getServerAddress()}/wallet/contract/execute`, data, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response.data
}
export async function postRunCGPContract(password: Password) {
  const data =
    {
      password,
    }
  const response = await axios.post(`${getServerAddress()}/wallet/contract/cgp`, data, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response.data
}

type ActiveContract = {
  contractId: Hash,
  address: Address,
  expire: number,
  code: string
};
export async function getActiveContracts(): Promise<ActiveContract[]> {
  const response = await axios.get(`${getServerAddress()}/contract/active`)
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
  txHash: Hash,
  asset: string,
  amount: number,
  confirmations: number
};

export async function getTxHistory({
  skip, take,
}: TransactionRequest = {}): Promise<TransactionResponse[]> {
  const response = await axios.get(
    `${getServerAddress()}/wallet/transactions?skip=${skip}&take=${take}`,
    {
      headers: { 'Content-Type': 'application/json' },
    },
  )
  return response.data
}

export async function getContractTXHistory(chain: string, address: string, skip, take) {
  const data = {
    skip,
    take,
    addresses: [address],
  }
  const response = await axios.post(`${getRemoteNode(chain)}/api/history`, data, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response.data
}

export async function getContractHistory(chain: string, contractId: string, skip, take) {
  const data = {
    skip,
    take,
    contractId,
  }
  const response = await axios.post(`${getRemoteNode(chain)}/addressdb/contract/history/`, data, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response.data
}
export async function getContractBalance(chain: string, address: string, skip, take) {
  const data = {
    skip,
    take,
    addresses: [address],
  }
  const response = await axios.post(`${getRemoteNode(chain)}/addressdb/balance/`, data, {
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
  const response = await axios.get(`${getServerAddress()}/blockchain/info`)
  return response.data
}

export async function getNetworkConnections(): Promise<number> {
  const response = await axios.get(`${getServerAddress()}/network/connections/count`)
  return response.data
}

export async function getWalletExists(): Promise<boolean> {
  const response = await axios.get(`${getServerAddress()}/wallet/exists`)
  console.log('getWalletExists()', response.data)
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

export async function postImportWallet(secretPhraseArray: observableArray, password: string) {
  const data = {
    words: secretPhraseArray,
    password,
  }
  console.log('postImportWallet data')
  const response = await axios.post(`${getServerAddress()}/wallet/import`, data, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response
}

export async function postRemoveWallet(password: string) {
  const data = {
    password,
  }
  const response = await axios.post(`${getServerAddress()}/wallet/remove`, data, {
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

export async function postWalletMnemonicphrase(password: string): string {
  const data = { password }
  const response = await axios.post(`${getServerAddress()}/wallet/mnemonicphrase`, data, {
    headers: { 'Content-Type': 'application/json' },
  })
  // $FlowFixMe
  return response.data
}

export async function postBlockchainBlock(): string {
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
