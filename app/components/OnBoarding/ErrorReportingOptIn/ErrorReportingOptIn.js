// @flow

import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import Flexbox from 'flexbox-react'

import history from '../../../services/history'
import { BUG_SRC } from '../../../constants/imgSources'
import OnBoardingLayout from '../Layout/Layout'
import ErrorReportingState from '../../../states/error-reporting-state'

type Props = {
  errorReportingState: ErrorReportingState
};

const nextPage = '/portfolio'

@inject('errorReportingState')
@observer
class ErrorReportingOptIn extends Component<Props> {
  componentDidMount() {
    const { errorReportingState } = this.props
    if (errorReportingState.isReporting) {
      console.warn('already reporting errors, user should not see this page, redirecting to', nextPage)
      history.push(nextPage)
    }
  }
  onNoThanks = () => {
    const { errorReportingState } = this.props
    // This should already be set to false, since user should only see this page if
    // he hasn't opted in already to report errors (see componentDidMount)
    // This is just an extra security measure, since privacy is such a sensitive issue
    errorReportingState.userOptsOut()
    history.push(nextPage)
  }
  onAgree = () => {
    const { errorReportingState } = this.props
    errorReportingState.userOptsIn()
    history.push(nextPage)
  }
  render() {
    return (
      <OnBoardingLayout>
        <h1>Help Improve the Zen Wallet</h1>
        <div className="devider after-title" />

        <Flexbox flexDirection="row" className="body-section">
          <Flexbox flexDirection="column" className="bullet-points" flexGrow={1}>
            <p className="reduce-errors">
              Help us reduce errors and provide you a better functioning app by anonymously sending error reports.
            </p>
          </Flexbox>
          <Flexbox className="bullet-image" flexGrow={1} justifyContent="flex-end">
            <img className="bug-img" alt="Bug" src={BUG_SRC} style={{ maxWidth: 360, maxHeight: 180 }} />
          </Flexbox>
        </Flexbox>

        <div className="devider before-buttons" />

        <Flexbox flexDirection="row">
          <Flexbox flexGrow={1} />
          <Flexbox flexGrow={2} />
          <Flexbox flexGrow={1} justifyContent="flex-end" flexDirection="row">
            <button onClick={this.onNoThanks}>No</button>
            <button className="button-on-right" onClick={this.onAgree}>Sure, happy to help</button>
          </Flexbox>
        </Flexbox>
      </OnBoardingLayout>
    )
  }
}

export default ErrorReportingOptIn
