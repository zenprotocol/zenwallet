import React from 'react'
import ReactDOM from 'react-dom'
import swal from 'sweetalert'
import { ipcRenderer } from 'electron'

import history from '../../services/history'
import { secretPhraseState } from '../../states'
import { IPC_RESTART_ZEN_NODE } from '../../ZenNode'
import withCountdown from '../../hocs/withCountdown'

const forgotPasswordModal = async () => {
  const shouldContinue = await showModal()
  if (!shouldContinue) {
    return
  }
  ipcRenderer.send(IPC_RESTART_ZEN_NODE, { wipeFull: true })
  secretPhraseState.reset()
  history.push('/import-or-create-wallet')
}

export default forgotPasswordModal

function showModal() {
  return swal({
    title: 'Security Warning',
    icon: 'warning',
    text: `If you forgot your password the only way to get access to your account is to wipe the current account and import your 24 word seed from scratch. 

    If you don't have your 24 word seed stored any where you will not be able to recover your account. So please try and remember your password to gain access again.`,
    content: getSecurityRiskWarningNode(),
    className: 'forgot-password-modal',
    button: false,
  })
}

type Props = {
  isCountdownOver: boolean,
  secondsLeft: number
};

class SecurityRiskWarning extends React.Component<Props> {
  onConfirm = () => {
    swal.setActionValue({ cancel: true })
    swal.close()
  }
  onCancel = () => swal.close()
  renderCountdownSeconds() {
    const { isCountdownOver, secondsLeft } = this.props
    if (!isCountdownOver) {
      return <span>({ secondsLeft })</span>
    }
  }
  render() {
    const { isCountdownOver } = this.props
    return (
      <div>
        <button className="secondary" onClick={this.onCancel}>Cancel</button>
        <button
          className="button-on-right"
          onClick={this.onConfirm}
          disabled={!isCountdownOver}
        >I Understand, and have my 24 words {this.renderCountdownSeconds()}
        </button>
      </div>
    )
  }
}

const SecurityRiskWarningCountdown = withCountdown(SecurityRiskWarning)

function getSecurityRiskWarningNode() {
  const wrapper = document.createElement('div')
  ReactDOM.render(<SecurityRiskWarningCountdown countdownSeconds={120} />, wrapper)
  return wrapper.firstChild
}
