import path from 'path'
import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {Link} from 'react-router-dom'
import autobind from 'class-autobind'
import Flexbox from 'flexbox-react'

import OnBoardingLayout from '../Layout/Layout'

@inject('secretPhraseState')
@observer
class SetPassword extends Component {
  constructor(props) {
    super(props)
    autobind(this)
  }

  render() {

    return (
      <OnBoardingLayout className="set-password-container" progressStep={4}>
        <h1>Create a password</h1>
        <h3>Your password gives you a quick access to your wallet.</h3>

        <div className="devider after-title"></div>

        <div></div>

        <div className="devider before-buttons"></div>

        <Flexbox flexDirection="row">
          <Flexbox flexGrow={1}></Flexbox>
          <Flexbox flexGrow={2}></Flexbox>
          <Flexbox flexGrow={1} justifyContent='flex-end' flexDirection="row">
            <button className='button-on-right' >
              Continue
            </button>
          </Flexbox>
        </Flexbox>

      </OnBoardingLayout>
    )
  }
}

export default SecretPhraseQuiz
