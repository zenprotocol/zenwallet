import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Flexbox from 'flexbox-react'
import cx from 'classnames'
import Switch from 'react-switch'
import Checkbox from 'rc-checkbox'
import { Online, Offline } from 'react-detect-offline'

import { MAINNET } from '../../constants'
import SecretPhraseStore from '../../stores/secretPhraseStore'
import ErrorReportingStore from '../../stores/errorReportingStore'
import NetworkStore from '../../stores/networkStore'
import { RedeemTokensStore } from '../../stores/redeemTokensStore'
import { disablePaste } from '../../utils/helpers'
import ToggleVisibilityIcon from '../../components/ToggleVisibilityIcon'
import Layout from '../../components/Layout'

import wipeBlockchain from './wipeBlockchainUtil'
import showSeed from './showSeedUtil'
import newWallet from './newWalletUtil'
import logout from './logoutUtil'
import switchChain from './switchChain'
import toggleUserIsOptedIn from './toggleUserIsOptedInUtil'
import './Settings.scss'

type Props = {
  secretPhraseStore: SecretPhraseStore,
  errorReportingStore: ErrorReportingStore,
  networkStore: NetworkStore,
  redeemTokensStore: RedeemTokensStore
};

type State = {
  isChangePasswordActive: boolean,
  isPasswordVisible: boolean,
  password: string,
  newPassword: string,
  newPasswordConfirmation: string
};

@inject('secretPhraseStore', 'errorReportingStore', 'networkStore', 'redeemTokensStore')
@observer
class Settings extends Component<Props, State> {
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
    // this.props.secretPhraseStore.setPassword(this.state.newPassword)
  }
  onAutoLogoutMinutesChanged = (evt) => {
    this.props.secretPhraseStore.setAutoLogoutMinutes(evt.target.value)
  }

  onBlockZero = () => {
    const { networkStore } = this.props
    if (networkStore.blocks === 0) {
      return true
    }
    return false
  }
  isTestnet() {
    const { networkStore } = this.props
    if (networkStore.chain === MAINNET) {
      return false
    }
    return true
  }

  renderPassword() {
    const {
      isPasswordVisible, password, newPassword, newPasswordConfirmation, isChangePasswordActive,
    } = this.state
    return (
      <Flexbox className="row" style={{ display: 'none' }}>
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
    )
  }

  renderAutoLogout() {
    const { secretPhraseStore } = this.props
    return (
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
              max="240"
              className="input-group-field"
              value={secretPhraseStore.autoLogoutMinutes}
              onChange={this.onAutoLogoutMinutesChanged}
            />
            <span className="input-group-label with-background">MIN</span>
          </div>
        </Flexbox>
      </Flexbox>
    )
  }

  renderWipe() {
    return (
      <Flexbox className="row">
        <Flexbox flexDirection="column" className="description">
          <h2 className="description-title">Wipe blockchain</h2>
          <p>Wipe your local copy of the blockchain, with an option to wipe your wallet as well</p>
        </Flexbox>
        <Flexbox flexDirection="column" className="actions">
          <button className="btn-block" onClick={wipeBlockchain}>Wipe Blockchain</button>
        </Flexbox>
      </Flexbox>
    )
  }

  renderShowSeed() {
    return (
      <Flexbox className="row">
        <Flexbox flexDirection="column" className="description">
          <h2 className="description-title">Show mnemonic</h2>
          <p>Display your mnemonic for account recovery</p>
        </Flexbox>
        <Flexbox flexDirection="column" className="actions">
          <button className="btn-block" onClick={() => showSeed()}>Show Mnemonic</button>
        </Flexbox>
      </Flexbox>
    )
  }

  renderNewWallet() {
    return (
      <Flexbox className="row">
        <Flexbox flexDirection="column" className="description">
          <h2 className="description-title">New wallet</h2>
          <p>Wipe your wallet and import or create a new one</p>
        </Flexbox>
        <Flexbox flexDirection="column" className="actions">
          <button className="btn-block" onClick={newWallet}>New wallet</button>
        </Flexbox>
      </Flexbox>
    )
  }

  renderResyncWallet() {
    const { secretPhraseStore } = this.props
    return (
      <Flexbox className="row">
        <Flexbox flexDirection="column" className="description">
          <h2 className="description-title">Resync wallet</h2>
        </Flexbox>
        <Flexbox flexDirection="column" className="actions">
          <button className="btn-block" onClick={secretPhraseStore.resync}>Resync wallet</button>
        </Flexbox>
      </Flexbox>
    )
  }

  renderMining() {
    const { secretPhraseStore, networkStore } = this.props
    if (networkStore.chain === MAINNET) {
      return null
    }
    return (
      <Flexbox className="row">
        <Flexbox flexDirection="column" className="description">
          <h2 className="description-title">Mining</h2>
        </Flexbox>
        <Flexbox flexDirection="column" className="actions">
          <label htmlFor="miner-switch">
            <Switch
              className="pull-right"
              onColor="#2f8be6"
              offColor="#333333"
              onChange={secretPhraseStore.toggleMining}
              checked={secretPhraseStore.isMining}
              id="miner-switch"
              uncheckedIcon={false}
              checkedIcon={false}
            />
          </label>
        </Flexbox>
      </Flexbox>
    )
  }
  renderErrorReporting() {
    const { errorReportingStore } = this.props
    return (
      <Flexbox className="row">
        <Flexbox flexDirection="column" className="description">
          <h2 className="description-title">Reporting errors anonymously</h2>
          {errorReportingStore.restartNeededToStopReporting &&
            <span style={{ color: 'red' }}>Restart the app to stop sending error reports</span>
          }
        </Flexbox>
        <Flexbox flexDirection="column" className="actions">
          <label htmlFor="error-reporting-switch">
            <Switch
              className="pull-right"
              onColor="#2f8be6"
              offColor="#333333"
              onChange={toggleUserIsOptedIn}
              checked={errorReportingStore.userIsOptedIn}
              id="error-reporting-switch"
              uncheckedIcon={false}
              checkedIcon={false}
            />
          </label>
          {!errorReportingStore.userIsOptedIn &&
            <label className="checkbox align-right">
              <Checkbox type="checkbox" checked={errorReportingStore.dontAskToReport} onChange={evt => errorReportingStore.setDontAskToReport(evt.target.checked)} />
              <span className="checkbox-text">
                {' '} Do not ask me to report
              </span>
            </label>}
        </Flexbox>
      </Flexbox>
    )
  }

  renderChain() {
    const { networkStore } = this.props
    return (
      <Flexbox className="row">
        <Flexbox flexDirection="column" className="description">
          <h2 className="description-title">Switch Network</h2>
          <p>
            You are currently on {networkStore.chain}.
            Switch to {networkStore.otherChain} to
            {' '} {networkStore.otherChain === MAINNET
          ? 'interact with the main network'
        : 'test your actions'}
          </p>
        </Flexbox>
        <Flexbox flexDirection="column" className="actions">
          <button className="btn-block" onClick={switchChain}>Switch to {networkStore.otherChain}</button>
        </Flexbox>
      </Flexbox>
    )
  }
  renderLogout() {
    return (
      <Flexbox className="row">
        <Flexbox flexDirection="column" className="description">
          <h2 className="description-title">Logout</h2>
        </Flexbox>
        <Flexbox flexDirection="column" className="actions">
          <button className="secondary" onClick={logout}>Logout</button>
        </Flexbox>
      </Flexbox>
    )
  }
  //
  renderGetGenesisToken() {
    return (
      <div>
        { this.onBlockZero() && !this.isTestnet() &&
        <Flexbox className="row">
          <Flexbox flexDirection="column" className="description">
            <h2 className="description-title">Import Genesis Block</h2>
            <p>
              In order to access tokens you purchased in the
              crowdsale you must import the Genesis Block.
            </p>
          </Flexbox>
          <Flexbox flexDirection="column" className="actions">
            <button className="btn-block" onClick={() => this.props.redeemTokensStore.getGenesisToken()}>Import Genesis Block</button>
          </Flexbox>
        </Flexbox>}
      </div>
    )
  }
  render() {
    return (
      <Layout className="settings-page">
        <Flexbox className="page-title">
          <h1>General settings</h1>
        </Flexbox>
        {/* {this.renderPassword()} */}
        {this.renderAutoLogout()}
        <Offline>{this.renderGetGenesisToken()}</Offline>
        <Online>{this.renderMining()}</Online>
        <Online>{this.renderErrorReporting()}</Online>
        {/* {this.renderChain()} */}
        {this.renderShowSeed()}
        {this.renderWipe()}
        {this.renderLogout()}

        {/* this.renderNewWallet() */}
        {/* this.renderResyncWallet() */}
      </Layout>
    )
  }
}

export default Settings
