import React from 'react'
import { Provider } from 'mobx-react'
import { Router } from 'react-router'

import history from '../app/services/history'
import stores from '../app/stores'

export const withHistoryAndState = (WrappedComponent) => (props) => (
  <Router history={history}>
    <Provider {...stores} history={history}>
      <WrappedComponent {...props} />
    </Provider>
  </Router>
)

export const withState = (WrappedComponent) => (props) => (
  <Provider {...stores} history={history}>
    <WrappedComponent {...props} />
  </Provider>
)

export const withHistory = (WrappedComponent) => (props) => (
  <Router history={history}>
    <WrappedComponent {...props} />
  </Router>
)
