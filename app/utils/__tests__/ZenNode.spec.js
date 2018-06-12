import { ipcMain } from 'electron'

import ZenNode from '../ZenNode'

const mockedWebContents = jest.fn()
const mockedOnClose = jest.fn()

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

afterEach(() => {
  mockedWebContents.mockClear()
  mockedOnClose.mockClear()
  // mockedZenNode.mockClear()
})

test('instantiates with correct args', () => {
  const zenNode = new ZenNode(mockedWebContents)
  expect(zenNode.webContents).toBe(mockedWebContents)
  zenNode.init()
  // zenNode.onClose = mockedOnClose
  expect(ipcMain.once).toHaveBeenCalledTimes(1)
})

test()

// test zenNode
