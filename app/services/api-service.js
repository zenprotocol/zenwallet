import { get, post } from 'axios'

import { getServerAddress, getCrowdsaleServerAddress } from '../config/server-address'

const serverAddress = getServerAddress()
const crowdsaleServerAddress = getCrowdsaleServerAddress()

export async function getBalances() {
  const response = await get(`${serverAddress}/wallet/balance`)
  return response.data
}

export async function getPublicAddress() {
  const response = await get(`${serverAddress}/wallet/address`)
  return response.data
}

export async function postTransaction(tx) {
  const {
    password, to, asset, assetType, amount,
  } = tx
  const data = {
    address: to,
    password,
    spend: {
      asset,
      assetType,
      amount,
    },
  }

  const response = await post(`${serverAddress}/wallet/send`, data, {
    headers: { 'Content-Type': 'application/json' },
  })

  return response.data
}

export async function postActivateContract({ code, numberOfBlocks, password }) {
  const data = { code, numberOfBlocks, password }
  console.log('postActivateContract data', data)
  const response = await post(`${serverAddress}/wallet/contract/activate`, data, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response.data
}

export async function postRunContractMessage(contractMessage) {
  const {
    password, asset, assetType, to, amount, command, data,
  } = contractMessage

  const finaldata = {
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
        amount,
      },
    ]
  }

  const response = await post(`${serverAddress}/wallet/contract/execute`, finaldata, {
    headers: { 'Content-Type': 'application/json' },
  })

  return response.data
}

export async function getActiveContractSet() {
  const response = await get(`${serverAddress}/contract/active`)
  return response.data
}

export async function getTxHistory() {
  const response = await get(`${serverAddress}/wallet/transactions`)
  return response.data
}

export async function getNetworkStatus() {
  const response = await get(`${serverAddress}/blockchain/info`)
  return response.data
}

export async function getNetworkConnections() {
  const response = await get(`${serverAddress}/network/connections/count`)
  return response.data
}

export async function getWalletExists() {
  console.log('getWalletExists()')
  const response = await get(`${serverAddress}/wallet/exists`)
  return response.data
}

export async function getLockWallet() {
  const response = await get(`${serverAddress}/wallet/lock`)
  return response.data
}

export async function getIsAccountLocked() {
  const response = await get(`${serverAddress}/wallet/locked`)
  return response.data
}

export async function postImportWallet(secretPhraseArray, secret) {
  const data = {
    words: secretPhraseArray,
    password: secret,
  }
  console.log('postImportWallet data', data)
  const response = await post(`${serverAddress}/wallet/import`, data, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response.data
}

export async function postUnlockWallet(secret) {
  const data = { password: secret }
  const response = await post(`${serverAddress}/wallet/unlock`, data, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response.data
}

export async function postCheckPassword(password) {
  const data = { password }
  const response = await post(`${serverAddress}/wallet/checkpassword`, data, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response.data
}

export async function postWalletResync() {
  const response = await post(`${serverAddress}/wallet/resync`, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response.data
}


// CROWDSALE APIS //

/* eslint-disable camelcase */
export async function getCheckCrowdsaleTokensEntitlement(pubkey_base_64, pubkey_base_58) {
  console.log('crowdsaleServerAddress', crowdsaleServerAddress)

  const url = `${crowdsaleServerAddress}/check_crowdsale_tokens_entitlement?pubkey_base_64=${pubkey_base_64}&pubkey_base_58=${pubkey_base_58}`

  const response = await get(url)
  console.log('getCheckCrowdsaleTokensEntitlement response', response)
  return response.data
}

export async function postRedeemCrowdsaleTokens(data) {
  const response = await post(`${crowdsaleServerAddress}/redeem_crowdsale_tokens`, data, {
    headers: { 'Content-Type': 'application/json' },
  })

  return response.data
}
/* eslint-enable camelcase */
