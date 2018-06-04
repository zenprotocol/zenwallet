// @flow

import React from 'react'
import ReactIdle from 'react-idle'
import { inject, observer } from 'mobx-react'

import SecretPhraseState from '../../states/secret-phrase-state'

import autoLogoutModal from './autoLogoutModal'

type Props = {
  secretPhraseState: SecretPhraseState
};

@inject('secretPhraseState')
@observer
class Idle extends React.Component<Props> {
  // eslint-disable-next-line react/no-unused-prop-types
  onChange = async ({ idle }: { idle: boolean}) => {
    const { secretPhraseState } = this.props
    if (!idle || !secretPhraseState.isLoggedIn) {
      return
    }
    const autoLogoutResponse = await autoLogoutModal()
    if (!autoLogoutResponse) {
      secretPhraseState.logout()
    }
  }

  render() {
    const { autoLogoutMinutes } = this.props.secretPhraseState
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
