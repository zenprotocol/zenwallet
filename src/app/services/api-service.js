import {get, post} from 'axios'

import serverAddress from '../config/server-address'

export async function getBalances() {
	const response = await get(`${serverAddress}/wallet/balance`)
	return response.data
}

export async function getPublicAddress() {
	const response = await get(`${serverAddress}/wallet/address`)
	return response.data.address
}

export async function postTransaction(tx) {
	const {to, asset, assetType, amount} = tx

	const data = {
		"address" : to,
		"spend" : {
			"asset" : asset,
			"assetType" : assetType,
			"amount" : amount
		}
	}

	const response = await post(`${serverAddress}/wallet/spend`, data, {
		headers: { 'Content-Type': 'application/json' }
	})

	return response.data
}

export async function postActivateContract(contract) {

	const data = {
		"code" : contract.code,
		"numberOfBlocks" : contract.numberOfBlocks
	}

	console.log('postActivateContract data', data)

	const response = await post(`${serverAddress}/wallet/contract/activate`, data, {
		headers: { 'Content-Type': 'application/json' }
	})

	return response.data
}

export async function postRunContractMessage(contractMessage) {
	const {asset, assetType, to, amount, command, data} = contractMessage

	let finaldata = {	"address" : to }
	if (command) { finaldata['command'] = command	}
	if (data) { finaldata['data'] = data }

	if (asset && assetType && amount) {
		finaldata['spends'] = [
			{
				"asset" : asset,
				"assetType" : assetType,
				"amount" : amount
			}
		]
	}

	const response = await post(`${serverAddress}/wallet/contract/execute`, finaldata, {
		headers: { 'Content-Type': 'application/json' }
	})

	return response.data
}

export async function getActiveContractSet() {
	const response = await get(`${serverAddress}/contract/active`)
	return response.data
}

export async function getNetworkStatus() {
	const response = await get(`${serverAddress}/blockchain/info`)
	return response.data
}
