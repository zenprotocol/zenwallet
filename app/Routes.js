import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'

import history from './services/history'
import Balances from './components/Balances/Balances'
import SendTx from './components/SendTx/SendTx'
import TxHistory from './components/TxHistory/TxHistory'
import Receive from './components/Receive/Receive'
import DeployContract from './components/DeployContract/DeployContract'
import RunContract from './components/RunContract/RunContract'
import SavedContracts from './components/SavedContracts/SavedContracts'
import ActiveContractSet from './components/ActiveContractSet/ActiveContractSet'
import Faucet from './components/Faucet/Faucet'
import Loading from './components/Loading/Loading'
import UnlockWallet from './components/UnlockWallet/UnlockWallet'
import BlockchainLogs from './components/BlockchainLogs'
import Settings from './components/Settings'
// Onboarding routes
import WelcomeMessages from './components/OnBoarding/WelcomeMessages/WelcomeMessages'
import ImportOrCreateWallet from './components/OnBoarding/ImportOrCreateWallet/ImportOrCreateWallet'
import ImportWallet from './components/OnBoarding/ImportWallet/ImportWallet'
import SecretPhrase from './components/OnBoarding/SecretPhrase/SecretPhrase'
import SecretPhraseQuiz from './components/OnBoarding/SecretPhraseQuiz/SecretPhraseQuiz'
import SetPassword from './components/OnBoarding/SetPassword/SetPassword'
import TermsOfService from './components/OnBoarding/TermsOfService/TermsOfService'
import ErrorReportingOptIn from './components/OnBoarding/ErrorReportingOptIn'

const Routes = () => (
  <Router history={history}>
    <Switch>
      <Route exact path="/portfolio" component={Balances} />
      <Route exact path="/receive" component={Receive} />
      <Route exact path="/send-tx" component={SendTx} />
      <Route exact path="/tx-history" component={TxHistory} />
      <Route exact path="/deploy-contract" component={DeployContract} />
      <Route exact path="/run-contract" component={RunContract} />
      <Route exact path="/saved-contracts" component={SavedContracts} />
      <Route exact path="/acs" component={ActiveContractSet} />
      <Route exact path="/faucet" component={Faucet} />
      <Route exact path="/loading" component={Loading} />
      <Route exact path="/unlock-wallet" component={UnlockWallet} />
      <Route exact path="/blockchain-logs" component={BlockchainLogs} />
      <Route exact path="/settings" component={Settings} />
      { /* Onboarding Routes */ }
      <Route exact path="/welcome-messages" component={WelcomeMessages} />
      <Route exact path="/import-or-create-wallet" component={ImportOrCreateWallet} />
      <Route exact path="/import-wallet" component={ImportWallet} />
      <Route exact path="/secret-phrase" component={SecretPhrase} />
      <Route exact path="/secret-phrase-quiz" component={SecretPhraseQuiz} />
      <Route exact path="/set-password" component={SetPassword} />
      <Route exact path="/terms-of-service" component={TermsOfService} />
      <Route exact path="/error-reporting-opt-in" component={ErrorReportingOptIn} />
      <Route exact path="/" component={Loading} />
    </Switch>
  </Router>
)

export default Routes
