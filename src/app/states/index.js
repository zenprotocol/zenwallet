import BalanceState from './balance-state'
import PublicAddressState from './public-address-state'
import TransactionState from './transaction-state'

export default {
    balance: new BalanceState(),
    publicAddress: new PublicAddressState(),
    transaction: new TransactionState()
}
