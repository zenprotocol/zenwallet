import { ipcMain } from 'electron'

import ZenNode, { IPC_ASK_IF_WIPED_DUE_TO_VERSION, IPC_RESTART_ZEN_NODE, IPC_BLOCKCHAIN_LOGS } from '../ZenNode'

jest.mock('@zen/zen-node', () => () => ({
  stderr: { pipe: jest.fn(), on: jest.fn() },
  stdout: { pipe: jest.fn(), on: jest.fn() },
  kill: jest.fn(),
  on: jest.fn(),
}))
jest.mock('electron', () => ({
  ipcMain: { once: jest.fn() },
}))

jest.unmock('services/db')

jest.mock('services/db', () => ({
  get: (key) => {
    if (key === 'config.isMining') {
      return ({
        value: () => false,
      })
    }
    return ({
      value: () => undefined,
    })
  },
  set: jest.fn(() => ({
    write: jest.fn(),
  })),
}))

// mock resourcesPath for isInstalledWithInstaller function
const originalProcessResourcePath = process.resourcesPath
beforeAll(() => {
  process.resourcesPath = 'node_modules/electron/dist'
})
afterAll(() => {
  process.resourcesPath = originalProcessResourcePath
})

beforeEach(() => {
  jest.useFakeTimers()
})

const mockedWebContents = { send: jest.fn() }
const mockedOnClose = jest.fn()
const mockedOnError = jest.fn()

ZenNode.zenNodeVersionRequiredWipe = false

afterEach(() => {
  jest.clearAllMocks()
  delete process.env.WIPE
  delete process.env.WIPEFULL
  delete process.env.ZEN_LOCAL_NET
  delete process.env.ZEN_TEST_NET
  delete process.env.MINER
})

test('instantiates with correct args', () => {
  // action
  const zenNode = getZenNode()
  // assertion
  expect(zenNode.webContents).toBe(mockedWebContents)
  expect(zenNode.onClose).toBe(mockedOnClose)
  expect(zenNode.onError).toBe(mockedOnError)
  expect(ipcMain.once).toHaveBeenCalledWith(
    IPC_ASK_IF_WIPED_DUE_TO_VERSION,
    zenNode.answerIfWipedDueToVersion,
  )
  expect(ipcMain.once).toHaveBeenCalledTimes(1)
})

test('init', () => {
  // setup
  const zenNode = getZenNode()
  ipcMain.once.mockClear()
  // action
  zenNode.init()
  // assertion
  expect(zenNode.updateLastWipeInDb).not.toHaveBeenCalled()
  expect(zenNode.node.stderr.pipe).toHaveBeenCalledTimes(1)
  expect(zenNode.node.stderr.pipe).toHaveBeenCalledWith(process.stderr)
  expect(zenNode.node.stdout.pipe).toHaveBeenCalledTimes(1)
  expect(zenNode.node.stdout.pipe).toHaveBeenCalledWith(process.stdout)
  expect(ipcMain.once).toHaveBeenCalledTimes(1)
  expect(ipcMain.once).toHaveBeenCalledWith(IPC_RESTART_ZEN_NODE, zenNode.onRestartZenNode)
  expect(zenNode.node.on).toHaveBeenCalledTimes(3)
  expect(zenNode.node.on).toHaveBeenCalledWith('exit', zenNode.onZenNodeExit)
  expect(setInterval).toHaveBeenCalledTimes(1)
  expect(setInterval).toHaveBeenCalledWith(zenNode.sendPendingLogsToRenderer, 2000)
})
test('init when wiping', () => {
  // setup
  const zenNode = getZenNode()
  zenNode.config.wipe = true
  // action
  zenNode.init()
  // assertion
  expect(zenNode.updateLastWipeInDb).toHaveBeenCalledTimes(1)
})
test('init when wiping full', () => {
  // setup
  const zenNode = getZenNode()
  zenNode.config.wipeFull = true
  // action
  zenNode.init()
  // assertion
  expect(zenNode.updateLastWipeInDb).toHaveBeenCalledTimes(1)
})

test('zenNodeArgs empty args', () => {
  const zenNode = getZenNode()
  expect(zenNode.zenNodeArgs).toEqual([])
})
test('zenNodeArgs wipe from command line', () => {
  // setup
  process.env.WIPE = 'true'
  const zenNode = getZenNode()
  // assertion
  expect(zenNode.zenNodeArgs).toEqual(['--wipe'])
})
test('zenNodeArgs wipe full from command line', () => {
  // setup
  process.env.WIPEFULL = 'true'
  const zenNode = getZenNode()
  // assertion
  expect(zenNode.zenNodeArgs).toEqual(['--wipe', 'full'])
})
test('zenNodeArgs running local net from command line', () => {
  // setup
  process.env.ZEN_LOCAL_NET = 'true'
  const zenNode = getZenNode()
  // assertion
  expect(zenNode.zenNodeArgs).toEqual(['--chain', 'local'])
})
test('zenNodeArgs running testnet from command line', () => {
  // setup
  process.env.ZEN_TEST_NET = 'true'
  const zenNode = getZenNode()
  // assertion
  expect(zenNode.zenNodeArgs).toEqual(['--chain', 'test'])
})

test('onZenNodeExit when signal is NOT restart', () => {
  // setup
  const nonRestartSignal = 'SIGINT'
  const zenNode = getZenNode()
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
  const zenNode = getZenNode()
  const log = 'foo'
  // action
  zenNode.onBlockchainLog(log)
  // assertion
  expect(zenNode.logs).toEqual([log])
  expect(zenNode.pendingLogsToSendToRenderer).toEqual([log])
})

test('sendPendingLogsToRenderer when there are no pending logs', () => {
  // setup
  const zenNode = getZenNode()
  // action
  zenNode.sendPendingLogsToRenderer()
  // assertion
  expect(zenNode.webContents.send).toHaveBeenCalledTimes(0)
  expect(zenNode.pendingLogsToSendToRenderer).toEqual([])
})

test('sendPendingLogsToRenderer', () => {
  // setup
  const zenNode = getZenNode()
  const logs = ['foo', 'bar']
  zenNode.pendingLogsToSendToRenderer = [...logs]
  // action
  zenNode.sendPendingLogsToRenderer()
  // assertion
  expect(zenNode.webContents.send).toHaveBeenCalledTimes(1)
  expect(zenNode.webContents.send)
    .toHaveBeenCalledWith(IPC_BLOCKCHAIN_LOGS, logs)
  expect(zenNode.pendingLogsToSendToRenderer).toEqual([])
})

function getZenNode() {
  const zenNode = new ZenNode({
    webContents: mockedWebContents,
    onClose: mockedOnClose,
    onError: mockedOnError,
  })
  zenNode.updateLastWipeInDb = jest.fn()
  return zenNode
}
