import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import Flexbox from 'flexbox-react'

import ToggleVisibilityIcon from '../../Icons/ToggleVisibilityIcon'
import IsValidIcon from '../../Icons/IsValidIcon'
import OnBoardingLayout from '../Layout/Layout'
import db from '../../../services/store'

@inject('secretPhraseState')
@observer
class SetPassword extends Component {
  state = {
    validLength: false,
    password: '',
    passwordConfirmation: '',
    passwordsMatch: '',
    inputType: 'password',
    autoLogoutMinutes: db.get('config').value().autoLogoutMinutes,
  }

  onPasswordChanged = (evt) => {
    const newValue = evt.target.value.trim()

    this.setState({
      password: newValue,
      validLength: (newValue.length > 3),
    }, () => {
      this.validatePasswordConfirmation()
    })
  }

  onPasswordConfirmationChanged = (evt) => {
    this.setState({
      passwordConfirmation: evt.target.value.trim(),
    }, () => {
      this.validatePasswordConfirmation()
    })
  }

  validatePasswordConfirmation() {
    const { password, passwordConfirmation } = this.state
    if (password.length > 0) {
      if (passwordConfirmation.length === 0) { this.setState({ passwordsMatch: '' }) }
      if (passwordConfirmation.length > 0) {
        if (password.includes(passwordConfirmation)) {
          this.setState({ passwordsMatch: 'contains' })
        } else {
          this.setState({ passwordsMatch: 'error' })
        }
        if (password === passwordConfirmation) {
          this.setState({ passwordsMatch: 'match' })
          return true
        }
      }
    }
    return false
  }

  onClickTogglePasswordVisibility = () => {
    const { inputType } = this.state
    const newType = (inputType === 'password' ? 'text' : 'password')
    this.setState({ inputType: newType })
  }

  onMinutesChange = (evt) => {
    const { secretPhraseState } = this.props
    const val = evt.target.value
    if (val > 0 && val < 121) {
      secretPhraseState.autoLogoutMinutes = val
      this.setState({ autoLogoutMinutes: val })
      db.set('config.autoLogoutMinutes', val).write()
    }
  }

  validatePassword() {
    const {
      passwordsMatch, validLength,
    } = this.state
    return (passwordsMatch === 'match' && validLength)
  }

  onSubmitClicked = () => {
    const { secretPhraseState } = this.props
    secretPhraseState.importWallet(this.state.password)
  }

  renderPasswordConfirmInput() {
    const { password, passwordConfirmation, passwordsMatch } = this.state

    let inputGroupClasses = 'input-group'
    let iconWrapperClasses = 'input-group-label display-none'

    if (password.length > 0 && passwordsMatch === 'match') {
      inputGroupClasses = 'input-group valid'
      iconWrapperClasses = 'input-group-label'
    }

    if (password.length > 0 && passwordsMatch === 'error') {
      inputGroupClasses = 'input-group error'
      iconWrapperClasses = 'input-group-label'
    }

    return (
      <div className={inputGroupClasses}>
        <input
          type="password"
          value={passwordConfirmation}
          name="password-confirmation"
          placeholder="Confirm password"
          className="input-group-field"
          onChange={this.onPasswordConfirmationChanged}
        />
        <span className={iconWrapperClasses} >
          <IsValidIcon isValid={passwordsMatch === 'match'} isHidden={password.length === 0} />
        </span>
      </div>
    )
  }
  render() {
    const { isImporting } = this.props.secretPhraseState
    const {
      password, inputType,
      autoLogoutMinutes, validLength,
    } = this.state

    return (
      <OnBoardingLayout className="set-password-container" progressStep={4}>
        <h1>Create a password</h1>
        <h3>Your password gives you a quick access to your wallet.</h3>

        <div className="devider after-title" />

        <Flexbox flexDirection="column" className="form-container" >

          <Flexbox flexDirection="row" className="password-form-container" >

            <Flexbox flexDirection="column" flexGrow={1} >
              <h5>Make sure your password includes:</h5>
              <ol>
                <li>
                  <span>At least 4 characters</span>
                  <IsValidIcon isValid={validLength} />
                </li>
              </ol>
            </Flexbox>

            <Flexbox flexDirection="column" flexGrow={0} justifyContent="flex-end" >
              <div className="input-group">
                <input
                  autoFocus
                  name="password"
                  type={inputType}
                  value={password}
                  placeholder="Enter password"
                  className="input-group-field"
                  onChange={this.onPasswordChanged}
                />
                <span className="input-group-label show-password" onClick={this.onClickTogglePasswordVisibility}>
                  <ToggleVisibilityIcon shouldShow={inputType === 'password'} />
                </span>
              </div>

              {this.renderPasswordConfirmInput()}

            </Flexbox>

          </Flexbox>

          <div className="devider" />

          <Flexbox flexDirection="row" className="password-form-container" >

            <Flexbox flexDirection="column" flexGrow={1}>
              <h5>Auto logout</h5>
              <p>After how many minutes you would like to automatically log out?</p>
            </Flexbox>
            <Flexbox flexDirection="column" flexGrow={0} justifyContent="flex-end" >
              <div className="input-group">
                <input
                  type="number"
                  name="min-logout"
                  min="1"
                  max="120"
                  className="input-group-field"
                  value={autoLogoutMinutes}
                  onChange={this.onMinutesChange}
                />
                <span className="input-group-label with-background">MIN</span>
              </div>
            </Flexbox>

          </Flexbox>

        </Flexbox>

        <div className="devider before-buttons" />

        <Flexbox flexDirection="row">
          <Flexbox flexGrow={1} />
          <Flexbox flexGrow={2} />
          <Flexbox flexGrow={1} justifyContent="flex-end" flexDirection="row">
            <Link
              to="/import-or-create-wallet"
              className="button secondary"
            >
              Back
            </Link>
            <button
              className="button-on-right"
              onClick={this.onSubmitClicked}
              disabled={!this.validatePassword() || isImporting}
            >
              { isImporting ? 'Importing ...' : 'Continue' }
            </button>
          </Flexbox>
        </Flexbox>

      </OnBoardingLayout>
    )
  }
}


export default SetPassword
