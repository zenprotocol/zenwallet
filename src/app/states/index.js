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
import LoadingState from './loading-state'

export default {
  balances: new BalancesState(),
  publicAddress: new PublicAddressState(),
  transaction: new TransactionState(),
  txhistory: new TxHistoryState(),
	contract: new ContractState(),
	contractMessage: new ContractMessage(),
  activeContractSet: new ActiveContractSetState(),
  networkState: new NetworkState(),
  redeemTokensState: new RedeemTokensState(),
  secretPhraseState: new SecretPhraseState(),
  loading: new LoadingState()
}
