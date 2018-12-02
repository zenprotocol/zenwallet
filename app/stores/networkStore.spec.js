import { getNetworkStatus, getNetworkConnections } from '../services/api-service'
import { getNetworkStatus as getRemoteNetworkStatus } from '../services/remote-node-api-service'

import NetworkStore from './networkStore'
import WalletModeStore from './walletModeStore'

jest.mock('../services/api-service')
jest.mock('../services/remote-node-api-service')
jest.mock('../services/db', () => ({
  get: () => ({ value() { return 'test' } }),
  set() {
    return { write: jest.fn() }
  },
}))

describe('NetworkStore', () => {
  const walletModeStore = new WalletModeStore()
  beforeEach(() => {
    getNetworkStatus.mockReset()
    getNetworkConnections.mockReset()
    getRemoteNetworkStatus.mockReset()
  })

  describe('when db has a chain value', () => {
    it('should initialise the chain from the db chain', () => {
      const networkStore = new NetworkStore(walletModeStore)
      expect(networkStore.chain).toBe('test')
    })
  })

  describe('when wallet mode is Light and fetch is called', () => {
    beforeEach(() => {
      walletModeStore.mode = 'Light'
      const networkStore = new NetworkStore(walletModeStore)
      networkStore.fetch()
    })

    it('should call getRemoteNetworkStatus', () => {
      expect(getRemoteNetworkStatus).toHaveBeenCalled()
    })

    it('should not call getNetworkConnections', () => {
      expect(getNetworkConnections).not.toHaveBeenCalled()
    })
  })

  describe('when wallet mode is Full and fetch is called', () => {
    beforeEach(() => {
      walletModeStore.mode = 'Full'
      const networkStore = new NetworkStore(walletModeStore)
      networkStore.fetch()
    })

    it('should call getNetworkStatus', () => {
      expect(getNetworkStatus).toHaveBeenCalled()
    })

    it('should call getNetworkConnections', () => {
      expect(getNetworkConnections).toHaveBeenCalled()
    })
  })
})
