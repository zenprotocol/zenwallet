// @flow

import React, { Component } from 'react'
import Flexbox from 'flexbox-react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { inject, observer } from 'mobx-react'
import cx from 'classnames'

import ToggleVisibilityIcon from '../../components/ToggleVisibilityIcon'
import SecretPhraseStore from '../../stores/secretPhraseStore'

import forgotPasswordModal from './forgotPasswordModal'

type Props = {
  secretPhraseStore: SecretPhraseStore
};

type State = {
  password: string,
  hidePassword: boolean
};

@inject('secretPhraseStore')
@observer
class UnlockWallet extends Component<Props, State> {
  state = {
    password: '',
    hidePassword: true,
  }

  onClickTogglePasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword })
  }

  onChange = (evt: SyntheticEvent<HTMLInputElement>) => {
    this.setState({ password: evt.currentTarget.value.trim() })
    this.props.secretPhraseStore.unlockWalletClearForm()
  }

  onSubmit = (evt: SyntheticEvent<*>) => {
    evt.preventDefault()
    this.props.secretPhraseStore.unlockWallet(this.state.password)
  }

  renderButtonIcon() {
    const { inprogress } = this.props.secretPhraseStore
    if (inprogress) {
      return (<FontAwesomeIcon icon={['far', 'spinner-third']} spin />)
    }
    return (<FontAwesomeIcon icon={['far', 'unlock']} />)
  }

  renderErrorMessage() {
    const { status } = this.props.secretPhraseStore
    if (status === 'error') {
      return (
        <div className="error input-message">
          <FontAwesomeIcon icon={['far', 'exclamation-circle']} />
          <span>Password is incorrect</span>
        </div>
      )
    }
  }

  render() {
    const { password, hidePassword } = this.state
    const { status, inprogress } = this.props.secretPhraseStore

    return (
      <Flexbox flexDirection="column" className="loading-container">
        <Flexbox flexDirection="column" className="center unlock-wallet">
          <h1>Unlock Your Wallet</h1>
          <p>Please enter your password</p>
          <form onSubmit={this.onSubmit}>

            <Flexbox flexDirection="column" className={cx('password-input-container', { haserror: status === 'error' })}>
              <div className={cx('input-group password', { error: status === 'error' })}>
                <input
                  name="password"
                  type={hidePassword ? 'password' : 'text'}
                  value={password}
                  placeholder="Enter password"
                  className="input-group-field"
                  onChange={this.onChange}
                  autoFocus
                />
                <span className="input-group-label show-password" onClick={this.onClickTogglePasswordVisibility}>
                  <ToggleVisibilityIcon shouldShow={hidePassword} />
                </span>
              </div>
              { this.renderErrorMessage() }
            </Flexbox>

            <button
              className="unlock btn-block"
              disabled={(password.length < 4 || inprogress)}
            >
              <span>{ inprogress ? 'Unlocking' : 'Unlock' }</span>
              { this.renderButtonIcon() }
            </button>
          </form>

          <a style={{ textDecoration: 'underline' }} onClick={forgotPasswordModal} className="forgot-password">
            Forgot your password? Import your wallet again or create a new one
          </a>
        </Flexbox>
      </Flexbox>
    )
  }
}

export default UnlockWallet
