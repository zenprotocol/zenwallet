import BalancesState from './balances-state'
import PublicAddressState from './public-address-state'
import TransactionState from './transaction-state'
import TxHistoryState from './tx-history-state'
import ContractState from './contract-state'
import ContractMessage from './contract-message'
import ActiveContractSetState from './acs-state'
import NetworkState from './network-state'
import RedeemTokensState from './redeem-tokens-state'
import SecretPhraseState from './secret-phrase-state'
import BlockchainLogsState from './blockchain-logs-state'
import ModalState from './modal-state'
import ErrorReportingState from './error-reporting-state'

const activeContractSet = new ActiveContractSetState()
const balances = new BalancesState(activeContractSet)
const publicAddress = new PublicAddressState()
const networkState = new NetworkState()
const secretPhraseState = new SecretPhraseState(networkState, balances, activeContractSet)
const transaction = new TransactionState()
const txhistory = new TxHistoryState()
const contract = new ContractState()
const contractMessage = new ContractMessage(activeContractSet)
const redeemTokensState = new RedeemTokensState()
const blockchainLogsState = new BlockchainLogsState()
const modalState = new ModalState()
const errorReportingState = new ErrorReportingState()

errorReportingState.init()

export default {
  balances,
  publicAddress,
  transaction,
  txhistory,
  contract,
  contractMessage,
  activeContractSet,
  networkState,
  redeemTokensState,
  secretPhraseState,
  blockchainLogsState,
  modalState,
  errorReportingState,
}
