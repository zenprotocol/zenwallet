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

    this.state = {
      validLength: false,
      validUpper: false,
      hasNumbers: false
    }

    autobind(this)
  }

  onPasswordChanged(e) {
    const {secretPhraseState} = this.props
    secretPhraseState.password = e.target.value.trim()
  }

  onPasswordConfirmationChanged(e) {
    const {secretPhraseState} = this.props
    secretPhraseState.passwordConfirmation = e.target.value.trim()
  }

  render() {
    const {secretPhraseState} = this.props

    return (
      <OnBoardingLayout className="set-password-container" progressStep={4}>
        <h1>Create a password</h1>
        <h3>Your password gives you a quick access to your wallet.</h3>

        <div className="devider after-title"></div>

        <Flexbox flexDirection="column" className="form-container" >

          <Flexbox flexDirection="row" className="password-form-container" >
            
            <Flexbox flexDirection="column" flexGrow={2} >
              <h5>Make sure your password includes:</h5>
              <ol>
                <li>6 to 12 characters</li>
                <li>Uper and lower case letters</li>
                <li>Numbers</li>
              </ol>
            </Flexbox>

            <Flexbox flexDirection="column" flexGrow={1} justifyContent='flex-end' >
              <div className='input-group'>
                <input
                  type="text"
                  name='password'
                  onChange={this.onPasswordChanged}
                  className='input-group-field'
                />
                <i className="fa fa-eye"></i>
              </div>

              <div className='input-group'>
                <input onChange={this.onPasswordConfirmationChanged} className='input-group-field' type="text" name='password-confirmation' />
                <i className="fa fa-eye"></i>
              </div>

            </Flexbox>
              
          </Flexbox>

          <div className="devider"></div>
          
          <Flexbox flexDirection="row" className="password-form-container" >
          
            <Flexbox flexDirection="column">
              <h6>Auto logout</h6>
              <p>After how many minutes you would like to automatically log out?</p>
            </Flexbox>
            <Flexbox flexDirection="column">
              <div className='input-group'>
                <input className='input-group-field' type="number" name='min-logout' />
                <span className='input-group-label'>MIN</span>
              </div>
            </Flexbox>

          </Flexbox>
        
        </Flexbox>

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

export default SetPassword
