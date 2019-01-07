import swal from 'sweetalert'
import { ipcRenderer, ipcMain } from 'electron'

import passwordModal from '../../services/confirmPasswordModal'
import { walletModeStore, networkStore } from '../../stores'
import history from '../../services/history'
import routes from '../../constants/routes'
import { IPC_SHUT_DOWN_ZEN_NODE, IPC_START_ZEN_NODE } from '../../ZenNode'
import { getRemoteWalletInstance, getLocalWalletInstance } from '../../services/wallet/WalletFactory'
import { getWalletInstance } from '../../services/wallet'

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
jest.mock('../../services/confirmPasswordModal')
jest.mock('../../services/history')
jest.mock('../../services/wallet/WalletFactory')
jest.mock('../../services/wallet')

beforeAll(() => {
  getLocalWalletInstance.mockReturnValue({
    exists: jest.fn(),
    import: jest.fn(),
    getMnemonicPhrase: jest.fn(),
  })

  getRemoteWalletInstance.mockReturnValue({
    exists: jest.fn(),
    import: jest.fn(),
    getMnemonicPhrase: jest.fn(),
  })

  getWalletInstance.mockReturnValue({
    checkPassword: jest.fn(),
    import: jest.fn(),
  })

  passwordModal.mockReturnValue(Promise.resolve('test123'))

  getWalletInstance().checkPassword.mockReturnValue(Promise.resolve(true))
})

describe('Switch Wallet Mode', () => {
  afterEach(() => {
    ipcRenderer.send.mockReset()
    ipcMain.send.mockReset()
    getWalletInstance().import.mockReset()
    getLocalWalletInstance().import.mockReset()
    getRemoteWalletInstance().getMnemonicPhrase.mockReset()
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

  describe('when sweetalert returns some password', () => {
    beforeAll(() => {
      swal.mockReturnValue(Promise.resolve('test123'))
    })
    describe('when switching wallet mode to Full and network is test', () => {
      beforeAll(async () => {
        const remoteWallet = getRemoteWalletInstance()
        const localWallet = getLocalWalletInstance()
        walletModeStore.mode = 'Light'
        networkStore.chain = 'testnet'
        history.push.mockReset()
        getWalletInstance().checkPassword.mockReturnValue(Promise.resolve(true))
        localWallet.import.mockReturnValue(Promise.resolve(true))
        remoteWallet.getMnemonicPhrase.mockReturnValue(Promise.resolve('fake phrase'))
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

    describe('when switching wallet mode to Light and network is test', () => {
      beforeAll(async () => {
        walletModeStore.mode = 'Full'
        networkStore.chain = 'testnet'
        await switchWalletMode()
      })

      it('sends shutdown signal to zennode', () => {
        expect(ipcRenderer.send).toHaveBeenCalledWith(IPC_SHUT_DOWN_ZEN_NODE, { net: 'test', walletMode: 'Light' })
      })

      it("should change wallet mode to 'Light'", () => {
        expect(walletModeStore.mode).toEqual('Light')
      })
    })

    describe('when switching wallet mode to Full and network is main', () => {
      beforeAll(async () => {
        walletModeStore.mode = 'Light'
        networkStore.chain = 'mainnet'
        await switchWalletMode()
      })

      it('sends START_ZEN_NODE signal to ipcRenderer', () => {
        expect(ipcRenderer.send).toHaveBeenCalledWith(IPC_START_ZEN_NODE, { net: 'main', walletMode: 'Full' })
      })

      it("should change wallet mode to 'Full'", () => {
        expect(walletModeStore.mode).toEqual('Full')
      })
    })

    describe('when switching wallet mode to Light and network is main', () => {
      beforeAll(async () => {
        walletModeStore.mode = 'Full'
        networkStore.chain = 'mainnet'
        await switchWalletMode()
      })

      it('sends shutdown signal to zennode', () => {
        expect(ipcRenderer.send).toHaveBeenCalledWith(IPC_SHUT_DOWN_ZEN_NODE, { net: 'main', walletMode: 'Light' })
      })

      it("should change wallet mode to 'Light'", () => {
        expect(walletModeStore.mode).toEqual('Light')
      })
    })

    describe('when switching to full node and light wallet exists', () => {
      beforeAll(async () => {
        walletModeStore.mode = 'Light'
        networkStore.chain = 'testnet'

        const lightWallet = getRemoteWalletInstance()
        lightWallet.getMnemonicPhrase.mockReturnValue(Promise.resolve('test seed'))
        lightWallet.exists.mockReturnValue(Promise.resolve(true))
        await switchWalletMode()
      })

      it('should call import on the local wallet with the seed from the light wallet', () => {
        const wallet = getLocalWalletInstance()
        expect(wallet.import).toHaveBeenCalledWith('test seed', 'test123')
      })
    })

    describe('when switching to light wallet and full node exists', () => {
      beforeAll(async () => {
        walletModeStore.mode = 'Full'
        networkStore.chain = 'testnet'

        const localWallet = getLocalWalletInstance()
        localWallet.getMnemonicPhrase.mockReturnValue(Promise.resolve('test seed'))
        localWallet.exists.mockReturnValue(Promise.resolve(true))
        await switchWalletMode()
      })

      it('should get the seed from the light wallet', () => {
        const wallet = getRemoteWalletInstance()
        expect(wallet.import).toHaveBeenCalledWith('test seed', 'test123')
      })
    })
  })
})
