import WalletModeStore from './walletModeStore'

describe('WalletModeStore', () => {
  const walletModeStore = new WalletModeStore()

  it("should have a default mode of 'Light'", () => {
    expect(walletModeStore.mode).toBe('Light')
  })

  describe("when mode is 'Light'", () => {
    beforeEach(() => {
      walletModeStore.mode = 'Light'
    })
    it('should return false for isFullNode', () => {
      expect(walletModeStore.isFullNode()).toBe(false)
    })
  })

  describe("when mode is 'Full'", () => {
    beforeEach(() => {
      walletModeStore.mode = 'Full'
    })
    it('should return true for isFullNode', () => {
      expect(walletModeStore.isFullNode()).toBe(true)
    })
  })
})
