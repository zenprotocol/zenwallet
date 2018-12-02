import swal from 'sweetalert'
import { ipcRenderer, ipcMain } from 'electron'

import { walletModeStore, networkStore } from '../../stores'
import history from '../../services/history'
import routes from '../../constants/routes'
import { IPC_RESTART_ZEN_NODE } from '../../ZenNode'

import switchChain from './switchChain'

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

describe('Switch Chain Mode', () => {
  afterEach(() => {
    ipcRenderer.send.mockReset()
    ipcMain.send.mockReset()
  })

  describe('when sweetalert returns false', () => {
    beforeAll(async () => {
      walletModeStore.mode = 'Light'
      networkStore.chain = 'testnet'
      swal.mockReturnValue(Promise.resolve(false))
      await switchChain()
    })

    it('does not send any message through IPC', () => {
      expect(ipcRenderer.send).not.toHaveBeenCalled()
    })

    it('does not change the route', () => {
      expect(history.push).not.toHaveBeenCalled()
    })
  })

  describe('when sweetalert return true', () => {
    beforeAll(() => {
      swal.mockReturnValue(Promise.resolve(true))
    })
    it('changes route to LOADING', async () => {
      await switchChain()
      expect(history.push).toHaveBeenCalledWith(routes.LOADING)
    })
    describe('and wallet is Full Node', () => {
      beforeEach(() => {
        walletModeStore.mode = 'Full'
      })
      describe('and network is testnet', () => {
        beforeEach(async () => {
          networkStore.chain = 'testnet'
          await switchChain()
        })

        it('sends IPC_RESTART_ZEN_NODE signal with net "main"', () => {
          expect(ipcRenderer.send).toHaveBeenCalledWith(IPC_RESTART_ZEN_NODE, { net: 'main' })
        })

        it('sets chain to mainnet', () => {
          expect(networkStore.chain).toBe('mainnet')
        })
      })

      describe('and network is mainnet', () => {
        beforeEach(async () => {
          networkStore.chain = 'mainnet'
          await switchChain()
        })

        it('sends IPC_RESTART_ZEN_NODE signal with net "test"', () => {
          expect(ipcRenderer.send).toHaveBeenCalledWith(IPC_RESTART_ZEN_NODE, { net: 'test' })
        })

        it('sets chain to testnet', () => {
          expect(networkStore.chain).toBe('testnet')
        })
      })
    })

    describe('and wallet is Light', () => {
      beforeEach(() => {
        walletModeStore.mode = 'Light'
      })
      describe('and network is testnet', () => {
        beforeEach(async () => {
          networkStore.chain = 'testnet'
          await switchChain()
        })

        it('shoud not send any IPC signal', () => {
          expect(ipcRenderer.send).not.toHaveBeenCalled()
        })
      })

      describe('and network is mainnet', () => {
        beforeEach(async () => {
          networkStore.chain = 'mainnet'
          await switchChain()
        })

        it('shoud not send any IPC signal', () => {
          expect(ipcRenderer.send).not.toHaveBeenCalled()
        })
      })
    })
  })
})
