import PortfolioStore from './portfolioStore'
import PublicAddressStore from './publicAddressStore'
import SendTxStore from './sendTxStore'
import TxHistoryStore from './txHistoryStore'
import DeployContractStore from './deployContractStore'
import RunContractStore from './runContractStore'
import ActiveContractsStore from './activeContractsStore'
import NetworkStore from './networkStore'
import AuthorizedProtocolStore from './authorizedProtocolStore'
import RedeemTokensStore from './redeemTokensStore'
import SecretPhraseStore from './secretPhraseStore'
import BlockchainLogsStore from './blockchainLogsStore'
import CGPStore from './cgpStore'
import ErrorReportingStore from './errorReportingStore'

const errorReportingStore = new ErrorReportingStore()
errorReportingStore.init()

const activeContractsStore = new ActiveContractsStore()
const portfolioStore = new PortfolioStore(activeContractsStore)
const networkStore = new NetworkStore()
const redeemTokensStore = new RedeemTokensStore(networkStore)
const publicAddressStore = new PublicAddressStore(networkStore)
const secretPhraseStore =
  new SecretPhraseStore(networkStore, portfolioStore, activeContractsStore, redeemTokensStore)
const sendTxStore = new SendTxStore()
const txHistoryStore = new TxHistoryStore({ networkStore })
const deployContractStore = new DeployContractStore()
const runContractStore = new RunContractStore(activeContractsStore)
const blockchainLogsStore = new BlockchainLogsStore()
const authorizedProtocolStore =
  new AuthorizedProtocolStore(publicAddressStore, networkStore, txHistoryStore, runContractStore)
const cgpStore =
  new CGPStore(
    publicAddressStore,
    networkStore,
    txHistoryStore,
    portfolioStore,
    authorizedProtocolStore,
    runContractStore,
  )
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
  authorizedProtocolStore,
  cgpStore,
}
