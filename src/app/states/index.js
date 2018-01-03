import BalanceState from './balance-state'
import PublicAddressState from './public-address-state'

export default {
    balance: new BalanceState(),
    publicAddress: new PublicAddressState()
}
