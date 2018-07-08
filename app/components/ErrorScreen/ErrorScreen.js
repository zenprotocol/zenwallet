// @flow

import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'

import Container from '../UI/Container/Container'
import BugBounyLink from '../UI/BugBounyLink'
import ErrorReportingState from '../../states/error-reporting-state'

type Props = {
  error: Error,
  componentStack: string,
  errorReportingState: ErrorReportingState
};

@inject('errorReportingState')
@observer
class ErrorScreen extends Component<Props> {
  componentDidMount() {
    const { error, componentStack, errorReportingState } = this.props
    console.error('error', error)
    console.error('componentStack', componentStack)
    errorReportingState.report(error, { errorType: 'React Error Boundary' })
  }
  render() {
    const { error } = this.props
    return (
      <Container>
        <div className="error-screen">
          <div className="page-title">
            <h1>There was an error rendering the app</h1>
          </div>
          <p>We appologize for any inconvinience. Please try to restart the app again,
            and if the error continue, follow the steps at <BugBounyLink />
          </p>
          <h2 style={{ marginTop: 20 }}>Error description:</h2>
          <p className="error">{error.message}</p>
        </div>
      </Container>
    )
  }
}

export default ErrorScreen
