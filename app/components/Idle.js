// @flow

import React from 'react'
import ReactIdle from 'react-idle'
import { inject, observer } from 'mobx-react'
import swal from 'sweetalert'

import SecretPhraseState from '../states/secret-phrase-state'

type Props = {
  secretPhraseState: SecretPhraseState
};

@inject('secretPhraseState')
@observer
class Idle extends React.Component<Props> {
  // eslint-disable-next-line react/no-unused-prop-types
  onChange = ({ idle }: { idle: boolean}) => {
    const { secretPhraseState } = this.props
    if (!idle || !secretPhraseState.isLoggedIn) {
      return
    }
    swal({ // eslint-disable-line promise/catch-or-return
      title: 'Auto logout',
      text: 'Due to inactivity, you will be logged out in 10 seconds. Press "OK" to stay logged in',
      icon: 'warning',
      dangerMode: true,
      timer: 10000,
    })
      .then(response => {
        if (!response) { // eslint-disable-line promise/always-return
          secretPhraseState.logout()
        }
      })
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
