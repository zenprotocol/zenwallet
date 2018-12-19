// @flow

import * as React from 'react'
import { inject, observer } from 'mobx-react'

import { MAINNET } from '../constants'
import NetworkState from '../stores/networkStore'

import ExternalLink from './ExternalLink'

type Props = {
  networkStore: NetworkState,
  children: React.Node,
  path: string
};

@inject('networkStore')
@observer
class ZpIoLink extends React.Component<Props> {
  get base() {
    return this.props.networkStore.chain === MAINNET
      ? 'https://zp.io'
      : 'https://testnet.zp.io'
  }
  render() {
    const {
      path, children, networkStore, ...restOfProps
    } = this.props
    return <ExternalLink {...restOfProps} link={`${this.base}/${path}`}>{children}</ExternalLink>
  }
}

export default ZpIoLink
