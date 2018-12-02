// @flow
import db from '../services/db'
import type { ZenNodeChain } from '../ZenNode'
import { formatChainForZenNode } from '../utils/helpers'

import db from '../services/db'

const TESTNET_PORT = '31567'
const LOCAL_NET_PORT = '36000'
const MAIN_NET_PORT = '11567'
const LOCALHOST = 'http://127.0.0.1'

export const getPort = () => {
  const chain = getCurrentChain()
  if (chain === 'local') {
    return LOCAL_NET_PORT
  }
  if (chain === 'test') {
    return TESTNET_PORT
  }

  return MAIN_NET_PORT
}

export const getServerAddress = () => {
  if (process.env.ZEN_NODE_API_PORT) {
    return `${LOCALHOST}:${process.env.ZEN_NODE_API_PORT}`
  }
  return `${LOCALHOST}:${getPort()}`
}

export const getRemoteNodeAddress = () => {
  const currentChain = getCurrentChain()
  return (currentChain === 'main' ? 'https://remote-node.zp.io/api/' : 'https://testnet-remote-node.zp.io/api/')
}

export const getCrowdsaleServerAddress = () => (process.env.ZEN_LOCAL_NET === 'localhost' ? 'http://127.0.0.1:3000' : 'https://www.zenprotocol.com')

function getCurrentChain(): ZenNodeChain {
  const dbChain = db.get('chain').value()
  if (dbChain) {
    return formatChainForZenNode(dbChain)
  }
  if (process.env.ZEN_LOCAL_NET) {
    return 'local'
  }
  return 'test'
}
