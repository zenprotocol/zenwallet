// @flow

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Flexbox from 'flexbox-react'

import PublicAddressStore from '../../stores/publicAddressStore'
import Layout from '../../components/Layout'
import Copy from '../../components/Copy'
import Toggle from '../../components/Toggle'

type Props = {
  publicAddressStore: PublicAddressStore
};

@inject('publicAddressStore')
@observer
class Receive extends Component<Props> {
  componentDidMount() {
    const { publicAddressStore } = this.props
    publicAddressStore.fetch()
  }
  render() {
    const { publicAddressStore } = this.props
    return (
      <Layout className="receive">
        <Flexbox flexDirection="column" className="receive-container">
          <Flexbox className="page-title">
            <h1>Receive</h1>
          </Flexbox>
          <div className="input-container">
            <Copy valueToCopy={publicAddressStore.address}>
              <Copy.Label>Your Address</Copy.Label>
              <Flexbox flexDirection="row" className="address-input form-row">
                <Copy.Input className="full-width" />
                <Copy.Button className="button-on-right" />
              </Flexbox>
              {publicAddressStore.addressError && (
                <span className="error-msg">{publicAddressStore.addressError}</span>
              )}
              <Copy.ActiveMsg>
                <Flexbox>
                  <div className="bright-blue copied-to-clipboard-message">Public address copied to clipboard</div>
                </Flexbox>
              </Copy.ActiveMsg>
            </Copy>
            <div style={{ marginTop: 20 }}>
              <Toggle
                onToggle={publicAddressStore.toggleShowPkHash}
                isActive={publicAddressStore.showingPkHash}
              >
                <Toggle.Arrow style={{ textAlign: 'center', fontSize: '80%' }}>Advanced</Toggle.Arrow>
                <Toggle.On>
                  <Copy valueToCopy={publicAddressStore.pkHash}>
                    <div>
                      <Copy.Label>PkHash</Copy.Label>
                    </div>
                    <Flexbox flexDirection="row" className="address-input form-row">
                      <Copy.Input className="full-width" />
                      <Copy.Button className="button-on-right" />
                    </Flexbox>
                    {publicAddressStore.pkHashError && (
                    <span className="error-msg">{publicAddressStore.pkHashError}</span>
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
          </div>
        </Flexbox>
      </Layout>
    )
  }
}

export default Receive
