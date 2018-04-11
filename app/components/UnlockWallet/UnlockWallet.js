import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Flexbox from 'flexbox-react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import ToggleVisibilityIcon from '../Icons/ToggleVisibilityIcon'
import {unlockWallet} from './UnlockWalletUtil'

class UnlockWallet extends Component {
  
  state = {
    password: '',
    hidePassword: true,
  }

  onClickTogglePasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword })
  }

  onChange = (evt) => {
    this.setState({ password: evt.target.value.trim() })
  }

  onSubmit = (evt) => {
    evt.preventDefault()
    unlockWallet(this.state.password)
  }

  render() {
    const { password, hidePassword } = this.state
    return (
      <Flexbox flexDirection="column" className="loading-container">
        <Flexbox flexDirection="column" className="center unlock-wallet">
          <h1>Unlock Your Wallet</h1>
          <p>Please enter your password</p>
          <form onSubmit={this.onSubmit}>
            <div className="input-group password">
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

            <button className="unlock btn-block">
              <span>Unlock</span>
              <FontAwesomeIcon icon={['far', 'unlock']} />
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
