import { LocalWallet, RemoteWallet } from '../services/wallet'

import SecretPhraseStore from './secretPhraseStore'
import NetworkStore from './networkStore'
import PortfolioStore from './portfolioStore'
import ActiveContractStore from './activeContractsStore'
import RedeemTokenStore from './redeemTokensStore'
import WalletModeStore from './walletModeStore'

jest.mock('electron', () => ({
  ipcRenderer: {
    send: jest.fn(),
    on: jest.fn(),
  },
}))
jest.mock('./networkStore')
jest.mock('./portfolioStore')
jest.mock('./activeContractsStore')
jest.mock('./redeemTokensStore')

beforeEach(() => {
  NetworkStore.mockClear()
  PortfolioStore.mockClear()
  ActiveContractStore.mockClear()
  RedeemTokenStore.mockClear()
})

describe('secretPhraseStore', () => {
  const networkStore = new NetworkStore()
  const activeContractsStore = new ActiveContractStore()
  const portfolioStore = new PortfolioStore(activeContractsStore)
  const redeemTokensStore = new RedeemTokenStore(networkStore)
  const walletModeStore = new WalletModeStore()

  const store = new SecretPhraseStore(
    networkStore,
    portfolioStore, activeContractsStore, redeemTokensStore,
    walletModeStore,
  )

  it('initialises dependent stores', () => {
    expect(store.networkStore).toBe(networkStore)
    expect(store.portfolioStore).toBe(portfolioStore)
    expect(store.activeContractsStore).toBe(activeContractsStore)
    expect(store.redeemTokensStore).toBe(redeemTokensStore)
    expect(store.walletModeStore).toBe(walletModeStore)
  })
})
