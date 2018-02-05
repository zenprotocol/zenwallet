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

export async function postTransaction(asset, to, amount) {

	const data = {
		"address" : to,
		"spend" : {
			"asset" : asset,
			"amount" : amount
		}
	}

	const response = await post(`${serverAddress}/wallet/spend`, data, {
		headers: { 'Content-Type': 'application/json' }
	})

	return response.data
}

export async function postActivateContract(code) {

	const data = {"code" : code}

	const response = await post(`${serverAddress}/wallet/contract/activate`, data, {
		headers: { 'Content-Type': 'application/json' }
	})

	return response.data
}

export async function postRunContractMessage(asset, to, amount, command, data) {

	let finaldata = {	"address" : to }
	if (command) { finaldata['command'] = command	}
	if (asset && amount) {
		finaldata['spends'] = [
			{
				"asset" : asset,
				"amount" : amount
			}
		]
	}

	const response = await post(`${serverAddress}/wallet/contract/execute`, finaldata, {
		headers: { 'Content-Type': 'application/json' }
	})

	return response.data
}
