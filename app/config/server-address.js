import { ipcRenderer } from 'electron'

// @flow
const localhost = 'http://127.0.0.1'
const TESTNET_PORT = '31567'
const LOCAL_NET_PORT = '36000'
const MAIN_NET_PORT = '11567'

let chain = getInitialChain()

ipcRenderer.on('switchChain', onSwitchChain)

function onSwitchChain(evt, newChain) {
  console.log('setting server address for chain:', newChain)
  chain = newChain
}

export const getServerAddress = () => {
  if (process.env.ZEN_NODE_API_PORT) {
    return `${localhost}:${process.env.ZEN_NODE_API_PORT}`
  }
  if (chain === 'local') {
    return `${localhost}:${LOCAL_NET_PORT}`
  }
  if (chain === 'test') {
    return `${localhost}:${TESTNET_PORT}`
  }
  return `${localhost}:${MAIN_NET_PORT}`
}

export const getCrowdsaleServerAddress = () => (process.env.ZEN_LOCAL_NET === 'localhost' ? `${localhost}:3000` : 'https://www.zenprotocol.com')

function getInitialChain() {
  if (process.env.ZEN_LOCAL_NET) {
    return 'local'
  }
  if (process.env.ZEN_TEST_NET) {
    return 'test'
  }
  return ''
}
