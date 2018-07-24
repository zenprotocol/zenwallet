// @flow

import React from 'react'
import ReactIdle from 'react-idle'
import { inject, observer } from 'mobx-react'

import SecretPhraseStore from '../../stores/secretPhraseStore'

import autoLogoutModal from './autoLogoutModal'

type Props = {
  secretPhraseStore: SecretPhraseStore
};

@inject('secretPhraseStore')
@observer
class Idle extends React.Component<Props> {
  // eslint-disable-next-line react/no-unused-prop-types
  onChange = async ({ idle }: { idle: boolean}) => {
    const { secretPhraseStore } = this.props
    if (!idle || !secretPhraseStore.isLoggedIn) {
      return
    }
    const autoLogoutResponse = await autoLogoutModal()
    if (!autoLogoutResponse) {
      secretPhraseStore.logout()
    }
  }

  render() {
    const { autoLogoutMinutes } = this.props.secretPhraseStore
    return (
      <ReactIdle
        onChange={this.onChange}
        timeout={minutesToMillisceonds(autoLogoutMinutes)}
      />
    )
  }
}

export default Idle

function minutesToMillisceonds(minutes) {
  return minutes * 1000 * 60
}
