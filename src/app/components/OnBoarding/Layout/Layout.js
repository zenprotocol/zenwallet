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
    const {hideSteps, progressStep} = this.props

    const logoSrc = path.join(__dirname, '../../../assets/img/zen-logo.png')
    const classNames = classnames('onboarding-container', this.props.className)

    const progressClassNames = (hideSteps ? 'progress-bar display-none' : 'progress-bar')

    const progressNumbers = [1,2,3,4].map(li => {
      if (li === progressStep) {
        return (<li className="active">{li}</li>)
      } else {
        return (<li>{li}</li>)
      }
    })

    return (
      <Flexbox flexDirection="column" className={classNames}>
        <Flexbox flexDirection="row" className="header">
          <Flexbox className='zen-logo' width="100px">
            <Link to="/">
              <img src={logoSrc} alt="Zen Protocol Logo"/>
            </Link>
          </Flexbox>
          <Flexbox flexGrow={1}></Flexbox>
          <Flexbox flexGrow={0} className={progressClassNames} >
            <ul>
              {progressNumbers}
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
