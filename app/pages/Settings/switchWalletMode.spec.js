import swal from 'sweetalert'
import { ipcRenderer, ipcMain } from 'electron'

import { walletModeStore, networkStore } from '../../stores'
import history from '../../services/history'
import routes from '../../constants/routes'
import { IPC_SHUT_DOWN_ZEN_NODE, IPC_START_ZEN_NODE } from '../../ZenNode'

import switchWalletMode from './switchWalletMode'

jest.mock('electron', () => ({
  ipcMain: {
    send: jest.fn(),
  },
  ipcRenderer: {
    send: jest.fn(),
    on: jest.fn(),
  },
}))

jest.mock('sweetalert')
jest.mock('../../services/history')

describe('Switch Wallet Mode', () => {
  afterEach(() => {
    ipcRenderer.send.mockReset()
    ipcMain.send.mockReset()
  })

  describe('does nothing if sweetalert returns false', () => {
    beforeAll(async () => {
      history.push.mockReset()
      walletModeStore.mode = 'Light'
      networkStore.chain = 'testnet'
      swal.mockReturnValue(Promise.resolve(false))
      await switchWalletMode()
    })

    it('should not send any signal to zennode', () => {
      expect(ipcRenderer.send).not.toHaveBeenCalled()
    })

    it('should not change wallet mode', () => {
      expect(walletModeStore.mode).toEqual('Light')
    })

    it('should not change the route', () => {
      expect(history.push).not.toHaveBeenCalled()
    })
  })

  describe('when wallet mode is light and network is test', () => {
    beforeAll(async () => {
      history.push.mockReset()
      walletModeStore.mode = 'Light'
      networkStore.chain = 'testnet'
      swal.mockReturnValue(Promise.resolve(true))
      await switchWalletMode()
    })

    it('sends START_ZEN_NODE signal to ipcRenderer', () => {
      expect(ipcRenderer.send).toHaveBeenCalledWith(IPC_START_ZEN_NODE, { net: 'test', walletMode: 'Full' })
    })

    it("should change wallet mode to 'Full'", () => {
      expect(walletModeStore.mode).toEqual('Full')
    })

    it('should change the route to import/create wallet route', () => {
      expect(history.push).toHaveBeenCalledWith(routes.LOADING)
    })
  })

  describe('when wallet mode is Full and network is test', () => {
    beforeAll(async () => {
      walletModeStore.mode = 'Full'
      networkStore.chain = 'testnet'
      swal.mockReturnValue(Promise.resolve(true))
      await switchWalletMode()
    })

    it('sends shutdown signal to zennode', () => {
      expect(ipcRenderer.send).toHaveBeenCalledWith(IPC_SHUT_DOWN_ZEN_NODE, { net: 'test', walletMode: 'Light' })
    })

    it("should change wallet mode to 'Light'", () => {
      expect(walletModeStore.mode).toEqual('Light')
    })
  })

  describe('when wallet mode is light and network is main', () => {
    beforeAll(async () => {
      walletModeStore.mode = 'Light'
      networkStore.chain = 'mainnet'
      swal.mockReturnValue(Promise.resolve(true))
      await switchWalletMode()
    })

    it('sends START_ZEN_NODE signal to ipcRenderer', () => {
      expect(ipcRenderer.send).toHaveBeenCalledWith(IPC_START_ZEN_NODE, { net: 'main', walletMode: 'Full' })
    })

    it("should change wallet mode to 'Full'", () => {
      expect(walletModeStore.mode).toEqual('Full')
    })
  })

  describe('when wallet mode is Full and network is main', () => {
    beforeAll(async () => {
      walletModeStore.mode = 'Full'
      networkStore.chain = 'mainnet'
      swal.mockReturnValue(Promise.resolve(true))
      await switchWalletMode()
    })

    it('sends shutdown signal to zennode', () => {
      expect(ipcRenderer.send).toHaveBeenCalledWith(IPC_SHUT_DOWN_ZEN_NODE, { net: 'main', walletMode: 'Light' })
    })

    it("should change wallet mode to 'Light'", () => {
      expect(walletModeStore.mode).toEqual('Light')
    })
  })
})
