import path from 'path'
import React, {Component} from 'react'
import autobind from 'class-autobind'
import {Link} from 'react-router-dom'
import Flexbox from 'flexbox-react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

class OnBoardingLayout extends Component {

  static propTypes = {
    className: PropTypes.string
  }

  render() {
    const logoSrc = path.join(__dirname, '../../../assets/img/zen-logo.png')
    const classNames = classnames('onboarding-container', this.props.className)

    return (
      <Flexbox flexDirection="column" className={classNames}>
        <Flexbox flexDirection="row" className="header">
          <Flexbox className='zen-logo' width="100px">
            <img src={logoSrc} alt="Zen Protocol Logo"/>
          </Flexbox>
          <Flexbox flexGrow={1}></Flexbox>
          <Flexbox flexGrow={0} className='progress-bar'>
            <span>1</span>
            <span className="line"></span>
            <span>2</span>
            <span className="line"></span>
            <span>3</span>
            <span className="line"></span>
            <span>4</span>
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
