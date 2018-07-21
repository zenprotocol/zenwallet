import { ipcRenderer } from 'electron'

import { isWindows } from '../utils/platformUtils'

// @flow
const TESTNET_PORT = '31567'
const LOCAL_NET_PORT = '36000'
const MAIN_NET_PORT = '11567'


let chain = getInitialChain()

if (ipcRenderer) {
  ipcRenderer.on('switchChain', onSwitchChain)
}

function onSwitchChain(evt, newChain) {
  console.log('setting server address for chain:', newChain)
  chain = newChain
}

export const getPort = () => {
  if (chain === 'local') {
    return LOCAL_NET_PORT
  }
  if (chain === 'test') {
    return TESTNET_PORT
  }

  return MAIN_NET_PORT
}

export const getServerAddress = () => {
  let localhost = 'http://127.0.0.1'

  if (isWindows()) {
    localhost = 'http://localhost'
  }

  if (process.env.ZEN_NODE_API_PORT) {
    return `${localhost}:${process.env.ZEN_NODE_API_PORT}`
  }

  return `${localhost}:${getPort()}`
}

export const getCrowdsaleServerAddress = () => (process.env.ZEN_LOCAL_NET === 'localhost' ? 'http://127.0.0.1:3000' : 'https://www.zenprotocol.com')

function getInitialChain() {
  if (process.env.ZEN_LOCAL_NET) {
    return 'local'
  }
  if (process.env.ZEN_TEST_NET) {
    return 'test'
  }
  return ''
}
