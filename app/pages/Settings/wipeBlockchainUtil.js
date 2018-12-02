import React from 'react'
import ReactDOM from 'react-dom'
import swal from 'sweetalert'
import { ipcRenderer } from 'electron'

import { IPC_RESTART_ZEN_NODE } from '../../ZenNode'
import withCountdown from '../../hocs/withCountdown'
import { postWalletMnemonicphrase } from '../../services/api-service'
import history from '../../services/history'
import confirmPasswordModal from '../../services/confirmPasswordModal'
import { secretPhraseStore } from '../../stores'
import routes from '../../constants/routes'

import { getShowSeedNode } from './showSeedUtil'

const USER_RESPONSE_WIPE_BLOCKCHAIN_ONLY = 'wipeBlockchainOnly'
const USER_RESPONSE_WIPE_BLOCKCHAIN_AND_WALLET = 'wipeBlockchainAndWallet'
const USER_RESPONSE_WANTS_TO_BACKUP_SEED = 'backupSeed'

const wipeBlockchain = async () => {
  const usersInitialResponse = await initialModal()
  if (!usersInitialResponse) {
    return
  }
  const confirmedPassword = await confirmPasswordModal()
  if (!confirmedPassword) {
    return
  }
  // user wants to wipe blockchain only
  if (usersInitialResponse === USER_RESPONSE_WIPE_BLOCKCHAIN_ONLY) {
    ipcRenderer.send(IPC_RESTART_ZEN_NODE, { wipe: true })
    return
  }
  // user wants to wipe blockchain AND wllet
  const usersBackupSeedModalResponse = await doesUserWantsToBackupSeedModal()
  if (!usersBackupSeedModalResponse) {
    return
  }
  if (usersBackupSeedModalResponse === USER_RESPONSE_WANTS_TO_BACKUP_SEED) {
    const userWantsToContinueWipeAfterBackupSeed = await showSeedModal(confirmedPassword)
    if (!userWantsToContinueWipeAfterBackupSeed) {
      return
    }
  }
  ipcRenderer.send(IPC_RESTART_ZEN_NODE, { wipeFull: true })
  secretPhraseStore.reset()
  history.push(routes.CHOOSE_WALLET_MODE)
}

/* ************ Initial modal ************* */
function initialModal() {
  return swal({
    title: 'Wipe local saved blockchain',
    text: 'Your local copy of the blockchain will be wiped. It will need to resync again after we wipe it. You can choose to wipe your wallet as well, You will need to create or import a new one afterwards.',
    className: 'wipe-blockchain-modal',
    buttons: {
      abort: {
        text: 'Cancel',
        className: 'secondary',
        value: null,
      },
      wipeBlockchainOnly: {
        text: 'Wipe blockchain only',
        value: USER_RESPONSE_WIPE_BLOCKCHAIN_ONLY,
      },
      wipeSeedAsWell: {
        text: 'Wipe blockchain + seed',
        value: USER_RESPONSE_WIPE_BLOCKCHAIN_AND_WALLET,
      },
    },
  })
}
/* ************ /Initial modal ************* */

/* ************ Does user wants to backup seed modal ************* */
function doesUserWantsToBackupSeedModal() {
  return swal({
    title: 'Warning',
    icon: 'warning',
    text: 'The current account will be wiped and only be able to be restored if you saved your seed. If you\'re not sure if you saved your seed, please take a moment to backup your seed now.',
    className: 'wipe-blockchain-does-want-to-backup-seed-modal',
    content: getSecurityRiskWarningNode(),
    button: false,
  })
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
    swal.setActionValue({ cancel: USER_RESPONSE_WANTS_TO_BACKUP_SEED })
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
/* ************ /Does user wants to backup seed modal ************* */

/* ************ Show seed modal ************* */
async function showSeedModal(confirmedPassword) {
  const seedString = await postWalletMnemonicphrase(confirmedPassword)
  return swal({
    title: 'Your Mnemonic Passphrase (seed)',
    text: 'Write down the following words in chronological order and save it in a secure place.',
    content: getShowSeedNode(seedString.split(' ')),
    buttons: {
      abort: {
        text: 'Cancel',
        className: 'secondary',
        value: null,
      },
      contine: {
        text: 'Wipe blockchain + wallet',
        value: true,
      },
    },
    className: 'secret-phrase-container',
  })
}
/* ************ /Show seed modal ************* */

export default wipeBlockchain
