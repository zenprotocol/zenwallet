import PortfolioStore from './portfolioStore'
import PublicAddressStore from './publicAddressStore'
import SendTxStore from './sendTxStore'
import TxHistoryStore from './txHistoryStore'
import DeployContractStore from './deployContractStore'
import RunContractStore from './runContractStore'
import ActiveContractsStore from './activeContractsStore'
import NetworkStore from './networkStore'
import RedeemTokensStore from './redeemTokensStore'
import SecretPhraseStore from './secretPhraseStore'
import Store from './blockchainLogsStore'
import ErrorReportingStore from './errorReportingStore'
import WalletModeStore from './walletModeStore'

const errorReportingStore = new ErrorReportingStore()
errorReportingStore.init()

const walletModeStore = new WalletModeStore()
const networkStore = new NetworkStore(walletModeStore)
const activeContractsStore = new ActiveContractsStore(networkStore)
const publicAddressStore = new PublicAddressStore(networkStore)
const portfolioStore = new PortfolioStore(activeContractsStore, networkStore)
const redeemTokensStore = new RedeemTokensStore(networkStore)
const txHistoryStore = new TxHistoryStore(networkStore)
const secretPhraseStore =
  new SecretPhraseStore(
    networkStore, portfolioStore, activeContractsStore, redeemTokensStore,
    walletModeStore, txHistoryStore,
  )
const sendTxStore = new SendTxStore(networkStore)
const deployContractStore = new DeployContractStore(networkStore)
const runContractStore = new RunContractStore(activeContractsStore, networkStore)
const blockchainLogsStore = new Store()


export default {
  portfolioStore,
  publicAddressStore,
  sendTxStore,
  txHistoryStore,
  deployContractStore,
  runContractStore,
  activeContractsStore,
  networkStore,
  redeemTokensStore,
  secretPhraseStore,
  blockchainLogsStore,
  errorReportingStore,
  walletModeStore,
}
