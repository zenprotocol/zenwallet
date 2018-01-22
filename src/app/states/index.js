import BalanceState from './balance-state'
import PublicAddressState from './public-address-state'
import TransactionState from './transaction-state'
import ContractState from './contract-state'
import ContractMessage from './contract-message'

export default {
    balance: new BalanceState(),
    publicAddress: new PublicAddressState(),
    transaction: new TransactionState(),
		contract: new ContractState(),
		contractMessage: new ContractMessage()
}
