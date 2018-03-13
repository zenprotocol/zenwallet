import BalancesState from './balances-state'
import PublicAddressState from './public-address-state'
import TransactionState from './transaction-state'
import ContractState from './contract-state'
import ContractMessage from './contract-message'
import ActiveContractSetState from './acs-state'

export default {
  balances: new BalancesState(),
  publicAddress: new PublicAddressState(),
  transaction: new TransactionState(),
	contract: new ContractState(),
	contractMessage: new ContractMessage(),
  activeContractSet: new ActiveContractSetState()
}
