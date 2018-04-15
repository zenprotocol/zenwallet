import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Flexbox from 'flexbox-react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import cx from 'classnames'

import { LOGO_SRC } from '../../../constants/imgSources'

class OnBoardingLayout extends Component {
  static propTypes = {
    className: PropTypes.string,
    hideSteps: PropTypes.bool,
    progressStep: PropTypes.number,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.node,
    ]).isRequired,
  }
  static defaultProps = {
    className: '',
    hideSteps: false,
    progressStep: null,
  }
  renderProgressNumbers() {
    return _.range(1, 6).map(n => (
      <li key={n} className={cx({ active: n === this.props.progressStep })}>{n}</li>
    ))
  }
  render() {
    const { hideSteps, className } = this.props
    return (
      <Flexbox flexDirection="column" className={`onboarding-container ${className}`}>
        <Flexbox flexDirection="row" className="header">
          <Flexbox className="zen-logo" width="100px">
            <Link to="/">
              <img src={LOGO_SRC} alt="Zen Protocol Logo" />
            </Link>
          </Flexbox>
          <Flexbox flexGrow={1} />
          <Flexbox flexGrow={0} className={cx('progress-bar', { 'display-none': hideSteps })}>
            <ul>
              {this.renderProgressNumbers()}
            </ul>
          </Flexbox>
        </Flexbox>
        <Flexbox flexDirection="column" className="body">
          {this.props.children}
        </Flexbox>
      </Flexbox>
    )
  }
}

export default OnBoardingLayout
