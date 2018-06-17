import React from 'react'
import { Provider } from 'mobx-react'
import MobxDevTools from 'mobx-react-devtools'

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
      <React.Fragment>
        <Provider history={history} {...states}>
          <React.Fragment>
            <AppUpdater />
            <Idle />
            <Routes />
            <ModalContainer />
          </React.Fragment>
        </Provider>
        {process.env.NODE_ENV !== 'production' && <MobxDevTools />}
      </React.Fragment>
    )
  }
}
