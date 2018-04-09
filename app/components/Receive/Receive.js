import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Flexbox from 'flexbox-react'
import { clipboard } from 'electron'

import Layout from '../UI/Layout/Layout'

@inject('publicAddress')
@observer
class Receive extends Component {
  state = {
    showCopyMessage: false,
  }
  componentDidMount() {
    this.props.publicAddress.fetch()
  }
  componentWillUnmount() {
    clearTimeout(this.copyMessageTimeout)
  }
  handleFocus = (evt) => {
    const { publicAddress } = this.props
    clipboard.writeText(publicAddress.address)
    evt.target.select()
    evt.target.focus()
    this.showHideCopyMessage()
  }

  onCopyClicked = () => {
    this.refs.publicAddressInput.focus()
    this.refs.publicAddressInput.select()
    clipboard.writeText(this.props.publicAddress.address)
    this.showHideCopyMessage()
  }

  showHideCopyMessage() {
    this.setState({ showCopyMessage: true })
    this.copyMessageTimeout = setTimeout(() => {
      this.setState({ showCopyMessage: false })
    }, 3000);
  }

  renderCopiedMessage() {
    if (this.state.showCopyMessage === true) {
      return null
    }
    return (
      <div className="bright-blue copied-to-clipboard-message">
        Public address copied to clipboard
      </div>
    )
  }

  render() {
    const { publicAddress } = this.props

    return (
      <Layout className="receive">
        <Flexbox flexDirection="column" className="receive-container">
          <Flexbox className="page-title">
            <h1>Receive</h1>
          </Flexbox>
          <div className="input-container">
            <label onClick={this.handleFocus} htmlFor="public-address">Your Address</label>
            <Flexbox flexDirection="row" className="address-input form-row">
              <input id="public-address" ref="publicAddressInput" onFocus={this.handleFocus} onClick={this.handleFocus} type="text" value={publicAddress.address} readOnly />
              <button className="copy-button button-on-right" onClick={this.onCopyClicked}>Copy</button>
            </Flexbox>
            <Flexbox>
              { this.renderCopiedMessage() }
            </Flexbox>
          </div>
        </Flexbox>
      </Layout>
    )
  }
}

export default Receive
