import React from 'react'
import ReactDOM from 'react-dom'
import swal from 'sweetalert'

import { postWalletMnemonicphrase } from '../../services/api-service'

// see issue https://github.com/t4t5/sweetalert/issues/836
let HACK_IS_SECURITY_RISK_SWAL_MOUNTED = false

const showSeed = async (password: string) => {
  HACK_IS_SECURITY_RISK_SWAL_MOUNTED = true
  const doesUserAcceptsRisk = await swal({
    title: 'Security Warning',
    icon: 'warning',
    text: 'If you lost your previous backup of the seed, and you are not sure who might have access to it, we recommend you to use another account (and transfer all current assets there). \n\n Only keep using this seed if you are sure no one else might have access.',
    content: getSecurityRiskWarningNode(),
    button: false,
  })
  HACK_IS_SECURITY_RISK_SWAL_MOUNTED = false
  if (!doesUserAcceptsRisk) {
    return
  }
  const submittedPassword = await swal({
    title: 'Backup Mnemonic Phrase',
    content: {
      element: 'input',
      attributes: {
        placeholder: 'Type your password to get your mnemonic phrase',
        type: 'password',
      },
    },
  })
  if (submittedPassword !== password) {
    swal({ title: 'wrong password!' })
  } else {
    const seedString = await postWalletMnemonicphrase(password)
    swal({
      title: 'Your Mnemonic Passphrase (seed)',
      text: 'Write down the following words in chronological order and save it in a secure place.',
      content: getShowSeedNode(seedString.split(' ')),
      className: 'secret-phrase-container',
    })
  }
}

class SecurityRiskWarning extends React.Component {
  state = {
    disabledSecondsCountdown: 30,
  }
  componentDidMount() {
    this.decreaseSecond()
  }
  // This doens't get triggered, hence the use of HACK_IS_SECURITY_RISK_SWAL_MOUNTED
  // I'm leaving this here for documentation and in case in the future the author of swal
  // will fix this problem. see issue https://github.com/t4t5/sweetalert/issues/836
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
      if (this.countdownOver || !HACK_IS_SECURITY_RISK_SWAL_MOUNTED) {
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

function getSecurityRiskWarningNode() {
  const wrapper = document.createElement('div')
  ReactDOM.render(<SecurityRiskWarning />, wrapper)
  return wrapper.firstChild
}

function getShowSeedNode(seedWords) {
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
