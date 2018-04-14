import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Flexbox from 'flexbox-react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { inject } from 'mobx-react'

import ToggleVisibilityIcon from '../Icons/ToggleVisibilityIcon'

@inject('secretPhraseState')
class UnlockWallet extends Component {
  static propTypes = {
    secretPhraseState: PropTypes.shape({
      unlockWallet: PropTypes.func.isRequired,
    }).isRequired,
  }
  state = {
    password: '',
    hidePassword: true,
  }

  onClickTogglePasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword })
  }

  onChange = (evt) => {
    this.setState({ password: evt.target.value.trim() })
    this.porps.secretPhraseState.unlockWalletClearForm()
  }

  onSubmit = (evt) => {
    evt.preventDefault()
    this.props.secretPhraseState.unlockWallet(this.state.password)
  }

  renderButtonIcon() {
    const {inprogress} = this.props.secretPhraseState
    console.log('inprogress', inprogress)
    if (inprogress) {
      return (<FontAwesomeIcon icon={['far', 'spinner']} spin />)
    } else {
      return (<FontAwesomeIcon icon={['far', 'unlock']} />)
    }
  }
  
  renderErrorMessage() {
    const {status} = this.props.secretPhraseState
    if (status == 'error') {
      return (
        <div className="error input-message">
          <FontAwesomeIcon icon={['far', 'exclamation-circle']} />
          <span>Password is invalid</span>
        </div>
      )
    }
  }

  render() {
    const {password, hidePassword} = this.state
    const {status} = this.props.secretPhraseState

    let inputClassNames = 'input-group password'
    if (status == 'error') {
      inputClassNames = 'input-group password error'
    }

    return (
      <Flexbox flexDirection="column" className="loading-container">
        <Flexbox flexDirection="column" className="center unlock-wallet">
          <h1>Unlock Your Wallet</h1>
          <p>Please enter your password</p>
          <form onSubmit={this.onSubmit}>

            <Flexbox flexDirection="column" className='password-input-container'>
              <div className={inputClassNames}>
                <input
                  name="password"
                  type={hidePassword ? 'password' : 'text'}
                  value={password}
                  placeholder="Enter password"
                  className="input-group-field"
                  onChange={this.onChange}
                />
                <span className="input-group-label show-password" onClick={this.onClickTogglePasswordVisibility}>
                  <ToggleVisibilityIcon shouldShow={hidePassword} />
                </span>
              </div>
              { this.renderErrorMessage() }
            </Flexbox>

            <button
              className="unlock btn-block"
              disabled={password.length == 0}
            >
              <span>Unlock</span>
              { this.renderButtonIcon() }
            </button>
          </form>

          <Link className="forgot-password" to="/import-or-create-wallet">
            Forgot your password? Import you wallet again
          </Link>

        </Flexbox>
      </Flexbox>
    )
  }
}

export default UnlockWallet
