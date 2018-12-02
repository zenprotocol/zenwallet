// @flow
import axios from 'axios'

import { getRemoteNodeAddress } from '../config/server-address'

import type { ActiveContract, BlockChainInfo } from './api-service'

const getInstance = () =>
  axios.create({
    baseURL: getRemoteNodeAddress(),
    headers: { 'Access-Control-Allow-Origin': '*' },
  })

export async function getActiveContracts(): Promise<ActiveContract[]> {
  const response = await getInstance().get('activecontracts')
  return response.data
}

export async function getNetworkStatus(): Promise<BlockChainInfo> {
  const response = await getInstance().get('info')
  return response.data
}
