import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Flexbox from 'flexbox-react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { disablePaste } from '../../../utils/helpers'
import ToggleVisibilityIcon from '../Icons/ToggleVisibilityIcon'
import Layout from '../UI/Layout/Layout'
import './Settings.scss'

@inject(['secretPhraseState'/* , 'modalState' */]) // add modal state once modal PR is merged
@observer
class Settings extends Component {
  static propTypes = {
    secretPhraseState: PropTypes.shape({
      autoLogoutMinutes: PropTypes.number.isRequired,
      password: PropTypes.string.isRequired,
      setPassword: PropTypes.func.isRequired,
      setAutoLogout: PropTypes.func.isRequired,
    }).isRequired,
  }
  state = {
    isChangePasswordActive: false,
    isPasswordVisible: false,
    password: '',
    newPassword: '',
    newPasswordConfirmation: '',
  }
  onPasswordChanged = (evt) => {
    this.setState({ password: evt.target.value })
  }
  onNewPasswordChanged = (evt) => {
    this.setState({ newPassword: evt.target.value })
  }
  onNewPasswordConfirmationChanged = (evt) => {
    this.setState({ newPasswordConfirmation: evt.target.value })
  }
  onClickTogglePasswordVisibility = () => {
    this.setState({ isPasswordVisible: this.state.isPasswordVisible })
  }
  onCancelPasswordChange = () => {
    this.setState({ isChangePasswordActive: false })
  }
  onActivatePasswordChange = () => {
    this.setState({ isChangePasswordActive: true })
  }
  onSetNewPassword = () => {
    this.props.secretPhraseState.setPassword(this.state.newPassword)
  }
  onAutoLogoutChanged = (evt) => {
    this.props.secretPhraseState.setAutoLogout(evt.target.value)
  }
  render() {
    const {
      isPasswordVisible, password, newPassword, newPasswordConfirmation, isChangePasswordActive,
    } = this.state
    return (
      <Layout className="settings-page">

        <Flexbox className="page-title">
          <h1>General settings</h1>
        </Flexbox>

        <Flexbox className="row">
          <Flexbox flexDirection="column" className="description">
            <h2 className="description-title">Password</h2>
            <p>Change your password</p>
          </Flexbox>
          <Flexbox flexDirection="column" className="actions">
            <button
              onClick={this.onActivatePasswordChange}
              className={cx('activate-password-change-button-container', 'btn-block', { isVisible: !isChangePasswordActive })}
            >Change Password
            </button>
            <div className={cx('password-change-container', { isVisible: isChangePasswordActive })}>
              <div className="input-group">
                <input
                  name="password"
                  type={isPasswordVisible ? 'text' : 'password'}
                  value={password}
                  placeholder="Enter current password"
                  className="input-group-field"
                  onChange={this.onPasswordChanged}
                />
                <span className="input-group-label show-password" onClick={this.onClickTogglePasswordVisibility}>
                  <ToggleVisibilityIcon shouldShow={isPasswordVisible} />
                </span>
              </div>
              <div className="input-group">
                <input
                  type="password"
                  value={newPassword}
                  placeholder="Enter new password"
                  className="input-group-field"
                  onChange={this.onNewPasswordChanged}
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  value={newPasswordConfirmation}
                  placeholder="Confirm new password"
                  className="input-group-field"
                  onPaste={disablePaste}
                  onChange={this.onNewPasswordConfirmationChanged}
                />
              </div>
              <div>
                <button onClick={this.onSetNewPassword} className="small pull-right change-password-button">Change</button>
                <button onClick={this.onCancelPasswordChange} className="small secondary pull-right">Cancel</button>
              </div>
            </div>
          </Flexbox>
        </Flexbox>
        <Flexbox className="row">
          <Flexbox flexDirection="column" className="description">
            <h2 className="description-title">Auto Logout</h2>
            <p>Configure auto logout after inactivity timeout</p>
          </Flexbox>
          <Flexbox flexDirection="column" className="actions">
            <div className="input-group">
              <input
                type="number"
                min="1"
                max="120"
                className="input-group-field"
                value={this.props.secretPhraseState.autoLogoutMinutes}
                onChange={this.onAutoLogoutChanged}
              />
              <span className="input-group-label with-background">MIN</span>
            </div>
          </Flexbox>
        </Flexbox>
        <Flexbox className="row">
          <Flexbox flexDirection="column" className="description">
            <h2 className="description-title">Show mnemonic</h2>
            <p>Display your mnemonic for account recovery</p>
          </Flexbox>
          <Flexbox flexDirection="column" className="actions">
            <button className="btn-block">Show Mnemonic</button>
          </Flexbox>
        </Flexbox>
        <Flexbox className="row">
          <Flexbox flexDirection="column" className="description">
            <h2 className="description-title">Mining</h2>
          </Flexbox>
          <Flexbox flexDirection="column" className="actions">
            <div className="text-right">
            On
            </div>
          </Flexbox>
        </Flexbox>
      </Layout>
    )
  }
}

export default Settings
