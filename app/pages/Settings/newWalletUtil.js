import React from 'react'
import ReactDOM from 'react-dom'
import swal from 'sweetalert'

import withCountdown from '../../hocs/withCountdown'
import history from '../../services/history'
import { postWalletMnemonicphrase } from '../../services/api-service'
import confirmPasswordModal from '../../services/confirmPasswordModal'
import routes from '../../constants/routes'

import { getShowSeedNode } from './showSeedUtil'

const BACKUP_SEED_USER_RESPONSE = 'backupSeed'

const newWalletUtil = async () => {
  const usersChoice = await swal({
    title: 'Warning',
    icon: 'warning',
    text: 'The current account will be wiped and only be able to be restored if you saved your seed. If you\'re not sure if you saved your seed, please take a moment to backup your seed now.',
    content: getSecurityRiskWarningNode(),
    className: 'new-wallet-modal',
    button: false,
  })
  if (!usersChoice) {
    return
  }
  const confirmedPassword = await confirmPasswordModal()
  if (!confirmedPassword) {
    return
  }

  if (usersChoice === BACKUP_SEED_USER_RESPONSE) {
    const seedString = await postWalletMnemonicphrase(confirmedPassword)
    const doesUserWantToContinueImport = await swal({
      title: 'Your Mnemonic Passphrase (seed)',
      text: 'Write down the following words in chronological order and save it in a secure place.',
      content: getShowSeedNode(seedString.split(' ')),
      buttons: {
        abort: {
          text: 'Cancel importing wallet',
          className: 'secondary',
          value: null,
        },
        contine: {
          text: 'Continue Importing Wallet',
          value: true,
        },
      },
      className: 'secret-phrase-container',
    })
    if (!doesUserWantToContinueImport) {
      return
    }
  }
  history.push(routes.IMPORT_OR_CREATE_WALLET)
}

type Props = {
  isCountdownOver: boolean,
  secondsLeft: number
};

class SecurityRiskWarning extends React.Component<Props> {
  onIUnderstand = () => {
    swal.setActionValue({ cancel: true })
    swal.close()
  }
  onBackupSeed = () => {
    swal.setActionValue({ cancel: BACKUP_SEED_USER_RESPONSE })
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
          onClick={this.onBackupSeed}
        >Backup Seed Now
        </button>
        <button
          className="button-on-right"
          onClick={this.onIUnderstand}
          disabled={!isCountdownOver}
        >I understand {this.renderCountdownSeconds()}
        </button>

      </div>
    )
  }
}

const SecurityRiskWarningCountdown = withCountdown(SecurityRiskWarning)

function getSecurityRiskWarningNode() {
  const wrapper = document.createElement('div')
  ReactDOM.render(<SecurityRiskWarningCountdown countdownSeconds={10} />, wrapper)
  return wrapper.firstChild
}

export default newWalletUtil
