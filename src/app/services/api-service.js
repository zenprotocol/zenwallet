import {get} from 'axios'

import serverAddress from '../config/server-address'

export async function getBalances() {
    const response = await get(`${serverAddress}/wallet/balance`)
    return response.data
}

export async function getPublicAddress() {
    const response = await get(`${serverAddress}/wallet/address`)
    return response.data.address
}
