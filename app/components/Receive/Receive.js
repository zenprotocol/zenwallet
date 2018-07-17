// @flow

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Flexbox from 'flexbox-react'

import PublicAddressState from '../../states/public-address-state'
import Layout from '../UI/Layout/Layout'
import Copy from '../UI/Copy'
import Toggle from '../UI/Toggle'

type Props = {
  publicAddress: PublicAddressState
};

@inject('publicAddress')
@observer
class Receive extends Component<Props> {
  componentDidMount() {
    const { publicAddress } = this.props
    publicAddress.fetch()
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
            <Copy valueToCopy={publicAddress.address}>
              <Copy.Label>Your Address</Copy.Label>
              <Flexbox flexDirection="row" className="address-input form-row">
                <Copy.Input className="full-width" />
                <Copy.Button className="button-on-right" />
              </Flexbox>
              {publicAddress.addressError && (
                <span className="error-msg">{publicAddress.addressError}</span>
              )}
              <Copy.ActiveMsg>
                <Flexbox>
                  <div className="bright-blue copied-to-clipboard-message">Public address copied to clipboard</div>
                </Flexbox>
              </Copy.ActiveMsg>
            </Copy>
            <Toggle
              onToggle={publicAddress.toggleShowPkHash}
              isActive={publicAddress.showingPkHash}
            >
              <Toggle.Checkbox>Advanced</Toggle.Checkbox>
              <Toggle.On>
                <Copy valueToCopy={publicAddress.pkHash}>
                  <div>
                    <Copy.Label>PkHash</Copy.Label>
                  </div>
                  <Flexbox flexDirection="row" className="address-input form-row">
                    <Copy.Input className="full-width" />
                    <Copy.Button className="button-on-right" />
                  </Flexbox>
                  {publicAddress.pkHashError && (
                    <span className="error-msg">{publicAddress.pkHashError}</span>
                  )}
                  <Flexbox>
                    <Copy.ActiveMsg>
                      <div className="bright-blue copied-to-clipboard-message">PkHash copied to clipboard</div>
                    </Copy.ActiveMsg>
                  </Flexbox>
                </Copy>
              </Toggle.On>
            </Toggle>
          </div>
        </Flexbox>
      </Layout>
    )
  }
}

export default Receive
