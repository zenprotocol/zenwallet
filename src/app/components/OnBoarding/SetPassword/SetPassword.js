import path from 'path'
import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {Link} from 'react-router-dom'
import autobind from 'class-autobind'
import Flexbox from 'flexbox-react'
import classnames from 'classnames'

import OnBoardingLayout from '../Layout/Layout'

@inject('secretPhraseState')
@observer
class SetPassword extends Component {
  constructor(props) {
    super(props)

    this.state = {
      validLength: false,
      validUpper: false,
      hasNumbers: false,
      password: '',
      passwordConfirmation: '',
      passwordsMatch: '',
      inputType: 'password',
      autoLogoutMinutes: 30
    }

    autobind(this)
  }

  onPasswordChanged(e) {
    const newValue = e.target.value.trim()

    this.setState({
      password: newValue,
      validLength: (newValue.length > 5 && newValue.length < 13),
      validUpper: /^(.*[A-Z].*)$/.test(newValue),
      hasNumbers: /^(.*\d.*)$/.test(newValue)
    }, () => {
      this.validatePasswordConfirmation()
    })
  }

  onPasswordConfirmationChanged(e) {
    this.setState({
      passwordConfirmation: e.target.value.trim()
    }, () => {
      this.validatePasswordConfirmation()
    })
  }

  validatePasswordConfirmation() {
    const {password, passwordConfirmation} = this.state
    if (password.length > 0) {
      if (passwordConfirmation.length == 0) { this.setState({passwordsMatch: ''}) }
      if (passwordConfirmation.length > 0) {
        if (password.includes(passwordConfirmation)) {
          this.setState({passwordsMatch: 'contains'})
        } else {
          this.setState({passwordsMatch: 'error'})
        }
        if (password === passwordConfirmation) {
          const {secretPhraseState} = this.props
          secretPhraseState.password = password
          this.setState({passwordsMatch: 'match'})
          return true
        }
      }
    }
    return false
  }

  onClickTogglePasswordVisibility() {
    const {inputType} = this.state
    const newType = (inputType == 'password' ? 'text' : 'password')
    this.setState({inputType: newType})
  }

  onMinutesChange(e) {
    const {secretPhraseState} = this.props
    const val = e.target.value
    if (val > 0 && val < 121) {
      secretPhraseState.autoLogoutMinutes = val      
      this.setState({autoLogoutMinutes: val})
    }
  }

  render() {
    const {
      password, passwordConfirmation, passwordsMatch, inputType, 
      autoLogoutMinutes, validLength, validUpper, hasNumbers
    } = this.state

    const passwordIconClassNames = (inputType == 'password' ? 'fa fa-eye' : 'fa fa-eye-slash')

    const submitButtonDisabled = !(passwordsMatch == 'match' && validLength && validUpper && hasNumbers)

    return (
      <OnBoardingLayout className="set-password-container" progressStep={4}>
        <h1>Create a password</h1>
        <h3>Your password gives you a quick access to your wallet.</h3>

        <div className="devider after-title"></div>

        <Flexbox flexDirection="column" className="form-container" >

          <Flexbox flexDirection="row" className="password-form-container" >
            
            <Flexbox flexDirection="column" flexGrow={1} >
              <h5>Make sure your password includes:</h5>
              <ol>
                <li>
                  <i className={validLength ? 'fa fa-check' : 'fa fa-times'} ></i>
                  <span>6 to 12 characters</span>
                </li>
                <li>
                  <i className={validUpper ? 'fa fa-check' : 'fa fa-times'} ></i>
                  <span>Uper and lower case letters</span>
                </li>
                <li>
                  <i className={hasNumbers ? 'fa fa-check' : 'fa fa-times'} ></i>
                  <span>Numbers</span>
                </li>
              </ol>
            </Flexbox>

            <Flexbox flexDirection="column" flexGrow={0} justifyContent='flex-end' >
              <div className='input-group'>
                <input
                  name='password'
                  type={inputType}
                  value={password}
                  placeholder='Enter password'
                  className='input-group-field'
                  onChange={this.onPasswordChanged}
                />
                <span className='input-group-label show-password' onClick={this.onClickTogglePasswordVisibility}>
                  <i className={passwordIconClassNames}></i>
                </span>
              </div>

              {this.renderPasswordConfirmInput()}

            </Flexbox>
              
          </Flexbox>

          <div className="devider"></div>
          
          <Flexbox flexDirection="row" className="password-form-container" >
          
            <Flexbox flexDirection="column" flexGrow={1}>
              <h5>Auto logout</h5>
              <p>After how many minutes you would like to automatically log out?</p>
            </Flexbox>
            <Flexbox flexDirection="column" flexGrow={0} justifyContent='flex-end' >
              <div className='input-group'>
                <input
                  type='number'
                  name='min-logout'
                  min='1' 
                  max='120'
                  className='input-group-field'
                  value={autoLogoutMinutes}
                  onChange={this.onMinutesChange}
                />
                <span className='input-group-label with-background'>MIN</span>
              </div>
            </Flexbox>

          </Flexbox>
        
        </Flexbox>

        <div className="devider before-buttons"></div>

        <Flexbox flexDirection="row">
          <Flexbox flexGrow={1}></Flexbox>
          <Flexbox flexGrow={2}></Flexbox>
          <Flexbox flexGrow={1} justifyContent='flex-end' flexDirection="row">
            <Link 
              to="/import-or-create-wallet"
              className="button secondary"
            >
              Back
            </Link>
            <button
              className="button-on-right"
              disabled={submitButtonDisabled}
            >
              Continue
            </button>
          </Flexbox>
        </Flexbox>

      </OnBoardingLayout>
    )
  }

  onPastePassConfirmation(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  renderPasswordConfirmInput() {
    const {password, passwordConfirmation, passwordsMatch} = this.state
    
    let iconClasses
    let inputGroupClasses = 'input-group'
    let iconWrapperClasses = 'input-group-label display-none'

    if (password.length > 0 && passwordsMatch == 'match') {
      inputGroupClasses = 'input-group valid'
      iconWrapperClasses = 'input-group-label'
      iconClasses = 'fa fa-check'
    }

    if (password.length > 0 && passwordsMatch == 'error') {
      inputGroupClasses = 'input-group error'
      iconWrapperClasses = 'input-group-label'
      iconClasses = 'fa fa-times'
    }

    return (
      <div className={inputGroupClasses}>
        <input
          type='password'
          value={passwordConfirmation}
          name='password-confirmation'
          placeholder='Confirm password'
          className='input-group-field'
          onPaste={this.onPastePassConfirmation}
          onChange={this.onPasswordConfirmationChanged}
        />
        <span className={iconWrapperClasses} >
          <i className={iconClasses}></i>
        </span>
      </div>      
    )  
  }

}


export default SetPassword
