import React from 'react'
import { Provider } from 'mobx-react'
import MobxDevTools from 'mobx-react-devtools'
import ErrorBoundary from 'react-error-boundary'
import { Online } from 'react-detect-offline'
import 'react-table/react-table.css'

import ErrorScreen from './pages/ErrorScreen'
import WalletSwitchInProgress from './pages/WalletSwitchInProgress'
import AppUpdater from './components/AppUpdater'
import PrerequisitesNotification from './components/PrerequisitesNotification'
import WipeModal from './components/WipeModal'
import history from './services/history'
import './services/rendererZenNodeNonZeroExit'
import stores from './stores'
import Routes from './Routes'
import './fontawesome'

export default class App extends React.Component {
  render() {
    return (
      <Provider history={history} {...stores}>
        <ErrorBoundary FallbackComponent={ErrorScreen}>
          <React.Fragment>
            <React.Fragment>
              <Online><AppUpdater /></Online>
              <PrerequisitesNotification />
              <WipeModal />
              <div className="app-wrapper">
                <Routes />
                <WalletSwitchInProgress />
              </div>
            </React.Fragment>
            {process.env.NODE_ENV !== 'production' && <MobxDevTools />}
          </React.Fragment>
        </ErrorBoundary>
      </Provider>
    )
  }
}
