// @flow

import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'

import Container from '../../components/Container'
import BugBounyLink from '../../components/BugBounyLink'
import ErrorReportingStore from '../../stores/errorReportingStore'

type Props = {
  error: Error,
  componentStack: string,
  errorReportingStore: ErrorReportingStore
};

@inject('errorReportingStore')
@observer
class ErrorScreen extends Component<Props> {
  componentDidMount() {
    const { error, componentStack, errorReportingStore } = this.props
    console.error('error', error)
    console.error('componentStack', componentStack)
    errorReportingStore.report(error, { errorType: 'React Error Boundary' })
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
