import React from 'react'
import ReactDOM from 'react-dom'
import swal from 'sweetalert'

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

class SecurityRiskWarning extends React.Component {
  state = {
    disabledSecondsCountdown: 3,
  }
  componentDidMount() {
    this.decreaseSecond()
  }
  // This doens't get triggered, so we have a minor memory leak
  // see issue https://github.com/t4t5/sweetalert/issues/836
  componentWillUnmount() {
    clearTimeout(this.timeout)
  }
  get countdownOver() {
    return this.state.disabledSecondsCountdown === 0
  }
  decreaseSecond = () => {
    this.setState(({ disabledSecondsCountdown }) => ({
      disabledSecondsCountdown: disabledSecondsCountdown - 1,
    }), () => {
      if (this.countdownOver) {
        return
      }
      this.timeout = setTimeout(this.decreaseSecond, 1000)
    })
  }
  onConfirm = () => {
    swal.setActionValue({ cancel: true })
    swal.close()
  }
  onCancel = () => swal.close()
  renderCountdownSeconds() {
    const { disabledSecondsCountdown } = this.state
    if (!this.countdownOver) {
      return <span>({ disabledSecondsCountdown })</span>
    }
  }
  render() {
    return (
      <div>
        <button className="secondary" onClick={this.onCancel}>Cancel</button>
        <button
          className="button-on-right"
          onClick={this.onConfirm}
          disabled={!this.countdownOver}
        >I understand {this.renderCountdownSeconds()}
        </button>
      </div>
    )
  }
}

export function getSecurityRiskWarningNode() {
  const wrapper = document.createElement('div')
  ReactDOM.render(<SecurityRiskWarning />, wrapper)
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
