import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import initCrashReporterForRenderer from './utils/crashReporter/crashReporterRendererProcess'
import App from './App'
import './app.scss'

initCrashReporterForRenderer()

render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById('root'),
)

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App') // eslint-disable-line global-require
    render(
      <AppContainer>
        <NextApp />
      </AppContainer>,
      document.getElementById('root'),
    )
  })
}
