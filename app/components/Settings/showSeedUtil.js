import React from 'react'
import ReactDOM from 'react-dom'
import swal from 'sweetalert'

import withCountdown from '../../hocs/withCountdown'
import { postWalletMnemonicphrase } from '../../services/api-service'
import confirmPasswordModal from '../../services/confirmPasswordModal'

const showSeed = async () => {
  const doesUserAcceptsRisk = await swal({
    title: 'Security Warning',
    icon: 'warning',
    text: 'If you lost your previous backup of the seed, and you are not sure who might have access to it, we recommend you to use another account (and transfer all current assets there). \n\n Only keep using this seed if you are sure no one else might have access.',
    content: getSecurityRiskWarningNode(),
    button: false,
  })
  if (!doesUserAcceptsRisk) {
    return
  }
  const confirmedPassword = await confirmPasswordModal()
  if (!confirmedPassword) {
    return
  }
  try {
    const seedString = await postWalletMnemonicphrase(confirmedPassword)
    swal({
      title: 'Your Mnemonic Passphrase (seed)',
      text: 'Write down the following words in chronological order and save it in a secure place.',
      content: getShowSeedNode(seedString.split(' ')),
      className: 'secret-phrase-container',
    })
  } catch (err) {
    console.error('error showing seed', err)
  }
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
        >I understand {this.renderCountdownSeconds()}
        </button>
      </div>
    )
  }
}

const SecurityRiskWarningCountdown = withCountdown(SecurityRiskWarning)

export function getSecurityRiskWarningNode() {
  const wrapper = document.createElement('div')
  ReactDOM.render(<SecurityRiskWarningCountdown countdownSeconds={30} />, wrapper)
  return wrapper.firstChild
}

export function getShowSeedNode(seedWords) {
  const wrapper = document.createElement('ol')
  wrapper.className = 'passphrase'
  const listItemsNodes = [...Array(seedWords.length).keys()]
    .map(idx => getListItem(seedWords[idx]))
  listItemsNodes.forEach(el => wrapper.appendChild(el))
  return wrapper
}

function getListItem(seedWord) {
  const li = document.createElement('li')
  li.innerHTML = seedWord
  return li
}

export default showSeed
