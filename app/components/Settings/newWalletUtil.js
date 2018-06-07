import swal from 'sweetalert'

import history from '../../services/history'
import { postWalletMnemonicphrase } from '../../services/api-service'
import confirmPasswordModal from '../../services/confirmPasswordModal'

import { getShowSeedNode, getSecurityRiskWarningNode } from './showSeedUtil'

const newWalletUtil = async () => {
  const doesUserAcceptsWiping = await swal({
    title: 'Warning',
    icon: 'warning',
    text: 'The current account will be wiped and only be able to be restored if you saved your seed',
    content: getSecurityRiskWarningNode(),
    button: false,
  })
  if (!doesUserAcceptsWiping) {
    return
  }
  const confirmedPassword = await confirmPasswordModal()
  if (!confirmedPassword) {
    return
  }
  const doesUserWantsToBackupSeed = await swal({
    title: 'Do you want to backup your seed?',
    buttons: ['No', 'Yes, backup seed'],
  })
  if (doesUserWantsToBackupSeed) {
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
  history.push('/import-or-create-wallet')
}
export default newWalletUtil
