// @flow

import { ipcRenderer } from 'electron'

import db from '../services/db'

const TESTNET_PORT = '31567'
const LOCAL_NET_PORT = '36000'
const MAIN_NET_PORT = '11567'
const LOCALHOST = 'http://127.0.0.1'

if (ipcRenderer) {
  ipcRenderer.on('switchChain', onSwitchChain)
}

function onSwitchChain(evt, newChain) {
  console.log('setting server address for chain:', newChain)
  db.set('chain', newChain).write()
}

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

function getCurrentChain() {
  const dbChain = db.get('chain').value()
  if (dbChain) {
    return dbChain
  }
  if (process.env.ZEN_LOCAL_NET) {
    return 'local'
  }
  return 'test'
}
