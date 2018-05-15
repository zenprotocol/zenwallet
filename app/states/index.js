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

const balances = new BalancesState()
const publicAddress = new PublicAddressState()
const networkState = new NetworkState()
const activeContractSet = new ActiveContractSetState()
const secretPhraseState = new SecretPhraseState(networkState, balances, activeContractSet)
const transaction = new TransactionState(secretPhraseState)
const txhistory = new TxHistoryState()
const contract = new ContractState(secretPhraseState)
const contractMessage = new ContractMessage(secretPhraseState, activeContractSet)
const redeemTokensState = new RedeemTokensState()
const blockchainLogsState = new BlockchainLogsState()
const modalState = new ModalState()

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
}
