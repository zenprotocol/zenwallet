import React from 'react'
import { Provider } from 'mobx-react'
import MobxDevTools from 'mobx-react-devtools'
import ErrorBoundary from 'react-error-boundary'

import ErrorScreen from './components/ErrorScreen'
import AppUpdater from './components/AppUpdater/AppUpdater'
import Idle from './components/Idle'
import ModalContainer from './components/ModalContainer'
import history from './services/history'
import states from './states'
import Routes from './Routes'
import './fontawesome'

export default class App extends React.Component {
  render() {
    return (
      <ErrorBoundary FallbackComponent={ErrorScreen}>
        <React.Fragment>
          <Provider history={history} {...states}>
            <React.Fragment>
              <AppUpdater />
              <Idle />
              <div className="app-wrapper">
                <Routes />
              </div>
              <ModalContainer />
            </React.Fragment>
          </Provider>
          {process.env.NODE_ENV !== 'production' && <MobxDevTools />}
        </React.Fragment>
      </ErrorBoundary>
    )
  }
}
