import { ipcMain } from 'electron'

import ZenNode, { IPC_RESTART_ZEN_NODE, ZEN_NODE_RESTART_SIGNAL, IPC_BLOCKCHAIN_LOGS } from '../ZenNode'

const mockedWebContents = { send: jest.fn() }

jest.mock('@zen/zen-node', () => () => ({
  stderr: { pipe: jest.fn() },
  stdout: { pipe: jest.fn(), on: jest.fn() },
  kill: jest.fn(),
  on: jest.fn(),
}))
jest.mock('electron', () => ({
  ipcMain: { once: jest.fn() },
}))
jest.mock('services/store', () => ({
  get: (key) => {
    if (key === 'config.isMining') {
      return ({
        value: () => false,
      })
    }
  },
}))

// mock resourcesPath for isInstalledWithInstaller function
const originalProcessResourcePath = process.resourcesPath
beforeAll(() => {
  process.resourcesPath = 'node_modules/electron/dist'
})
afterAll(() => {
  process.resourcesPath = originalProcessResourcePath
})

afterEach(() => {
  jest.clearAllMocks()
  delete process.env.WIPE
  delete process.env.WIPEFULL
  delete process.env.ZEN_LOCAL
  delete process.env.MINER
})

test('instantiates with correct args', () => {
  // action
  const zenNode = new ZenNode(mockedWebContents)
  // assertion
  expect(zenNode.webContents).toBe(mockedWebContents)
})

test('init', () => {
  // setup
  const zenNode = new ZenNode(mockedWebContents)
  // action
  zenNode.init()
  console.log(zenNode.node)
  // assertion
  expect(zenNode.node.stderr.pipe).toHaveBeenCalledTimes(1)
  expect(zenNode.node.stderr.pipe).toHaveBeenCalledWith(process.stderr)
  expect(zenNode.node.stdout.pipe).toHaveBeenCalledTimes(1)
  expect(zenNode.node.stdout.pipe).toHaveBeenCalledWith(process.stdout)
  expect(ipcMain.once).toHaveBeenCalledTimes(1)
  expect(ipcMain.once).toHaveBeenCalledWith(IPC_RESTART_ZEN_NODE, zenNode.onRestartZenNode)
  expect(zenNode.node.on).toHaveBeenCalledTimes(1)
  expect(zenNode.node.on).toHaveBeenCalledWith('exit', zenNode.onZenNodeExit)
})

test('zenNodeArgs empty args', () => {
  const zenNode = new ZenNode(mockedWebContents)
  expect(zenNode.zenNodeArgs).toEqual([])
})
test('zenNodeArgs wipe from command line', () => {
  // setup
  process.env.WIPE = 'true'
  const zenNode = new ZenNode(mockedWebContents)
  // assertion
  expect(zenNode.zenNodeArgs).toEqual(['--wipe'])
})
test('zenNodeArgs wipe full from command line', () => {
  // setup
  process.env.WIPEFULL = 'true'
  const zenNode = new ZenNode(mockedWebContents)
  // assertion
  expect(zenNode.zenNodeArgs).toEqual(['--wipe', 'full'])
})
test('zenNodeArgs running local node from command line', () => {
  // setup
  process.env.ZEN_LOCAL = 'true'
  const zenNode = new ZenNode(mockedWebContents)
  // assertion
  expect(zenNode.zenNodeArgs).toEqual(['--miner', '--chain', 'local'])
})

test('onRestartZenNode with minner flag', () => {
  // setup
  const zenNode = new ZenNode(mockedWebContents)
  zenNode.init()
  expect(zenNode.zenNodeArgs).toEqual([])
  // action
  zenNode.onRestartZenNode(null, { isMining: true })
  // assertion
  expect(zenNode.config).toEqual({
    isMining: true,
    wipe: false,
    wipeFull: false,
  })
  expect(zenNode.node.kill).toHaveBeenCalledTimes(1)
  expect(zenNode.node.kill).toHaveBeenCalledWith(ZEN_NODE_RESTART_SIGNAL)
  // action: mimick the call following zenNode.node.kill
  const initSpy = jest.spyOn(zenNode, 'init')
  const onCloseSpy = jest.spyOn(zenNode, 'onClose')
  zenNode.onZenNodeExit(null, ZEN_NODE_RESTART_SIGNAL)
  expect(initSpy).toHaveBeenCalledTimes(1)
  expect(onCloseSpy).not.toBeCalled()
})
test('onZenNodeExit when signal is NOT restart', () => {
  // setup
  const nonRestartSignal = 'SIGINT'
  const zenNode = new ZenNode(mockedWebContents)
  zenNode.init()
  const onCloseSpy = jest.spyOn(zenNode, 'onClose')
  const initSpy = jest.spyOn(zenNode, 'init')
  // action
  zenNode.onZenNodeExit(null, nonRestartSignal)
  // assertion
  expect(initSpy).not.toBeCalled()
  expect(onCloseSpy).toHaveBeenCalledTimes(1)
})

test('onBlockchainLog', () => {
  // setup
  const zenNode = new ZenNode(mockedWebContents)
  // action
  zenNode.onBlockchainLog('')
  // assertion
  expect(mockedWebContents.send).toHaveBeenCalledTimes(1)
  expect(mockedWebContents.send).toHaveBeenCalledWith(IPC_BLOCKCHAIN_LOGS, '')
})
