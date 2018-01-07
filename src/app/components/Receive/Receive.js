import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import autobind from 'class-autobind'
import {Link} from 'react-router-dom'
import Flexbox from 'flexbox-react'
const {clipboard} = require('electron')

import Layout from '../UI/Layout/Layout'

@inject('publicAddress')
@observer
class Receive extends Component {
    constructor() {
        super()
        autobind(this)
    }

    componentDidMount() {
        const {publicAddress} = this.props

        publicAddress.fetch()
    }

    handleFocus(event) {
        const {publicAddress} = this.props
        clipboard.writeText(publicAddress.address)
        event.target.select()
        event.target.focus()
    }

    onCopyClicked() {
        const {publicAddress} = this.props

        this.refs.publicAddressInput.focus()
        this.refs.publicAddressInput.select()

        clipboard.writeText(publicAddress.address)
    }

    render() {
        const {publicAddress} = this.props

        return (
            <Layout className="receive">
              <Flexbox flexDirection="column" className="receive-container">

                <Flexbox className='page-title'>
                  <h1>Receive</h1>
                </Flexbox>

                <div className='address-div'>
                  <h3>Your Address</h3>
                  <Flexbox flexDirection="row" className='address-input'>
                    <input ref='publicAddressInput' onFocus={this.handleFocus} onClick={this.handleFocus} type="text" value={publicAddress.address} readonly />
                    <button className="button copy-button button-on-right" onClick={this.onCopyClicked}>Copy</button>
                  </Flexbox>

                  <Flexbox>
                    <button className='secondary'>QR code</button>
                    <span className='light-blue copied-to-clipboard-message'>Public address copied to clipboard</span>
                  </Flexbox>

                </div>

              </Flexbox>
            </Layout>
        )
    }
}

export default Receive
