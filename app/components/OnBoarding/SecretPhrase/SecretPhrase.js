import React, { Component } from 'react'
import { inject, observer, PropTypes as PropTypesMobx } from 'mobx-react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Flexbox from 'flexbox-react'
import Checkbox from 'rc-checkbox'
import { clipboard } from 'electron'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import history from '../../../services/history'
import OnBoardingLayout from '../Layout/Layout'

@inject('secretPhraseState')
@observer
class SecretPhrase extends Component {
  static propTypes = {
    secretPhraseState: PropTypes.shape({
      mnemonicPhrase: PropTypesMobx.observableArrayOf(PropTypes.string),
      generateSeed: PropTypes.func.isRequired,
    }).isRequired,
  }
  state = {
    checked: false,
    shouldShowCopyMessage: false,
  }

  componentWillMount() {
    this.props.secretPhraseState.generateSeed()
  }

  onToggleSecuredPassphrase = (evt) => {
    this.setState({ checked: evt.target.checked })
  }

  onNextClicked = () => {
    history.push('/secret-phrase-quiz')
  }
  copyToClipboard = () => {
    const { mnemonicPhrase } = this.props.secretPhraseState
    clipboard.writeText(JSON.stringify(mnemonicPhrase))
    this.setState({ shouldShowCopyMessage: true })
    this.copyTimeout = setTimeout(() => {
      this.setState({ shouldShowCopyMessage: false })
    }, 2000)
  }
  render() {
    const { checked, shouldShowCopyMessage } = this.state
    const { mnemonicPhrase } = this.props.secretPhraseState
    return (
      <OnBoardingLayout className="secret-phrase-container" progressStep={2}>
        <h1>Your Mnemonic Passphrase (seed)</h1>
        <h3>
          Write down the following words in chronological order and
          save it in a secure place.
        </h3>
        <div className="devider after-title" />
        <ol className="passphrase">
          {mnemonicPhrase.map((word, idx) => (<li key={idx}>{word}</li>))}
        </ol>
        <p className="warning">If you lose this passphrase you will lose all assets in the wallet!</p>
        <div>
          <button onClick={this.copyToClipboard} className="secondary" style={{ marginRight: 10 }}>
            <FontAwesomeIcon icon={['far', 'copy']} /> Copy to clipboard
          </button>
          {shouldShowCopyMessage && 'Copied!'}
        </div>
        <div className="devider before-buttons" />

        <Flexbox flexDirection="row">
          <Flexbox flexGrow={1} flexDirection="row">
            <label className="checkbox">
              <Checkbox type="checkbox" checked={checked} onChange={this.onToggleSecuredPassphrase} />
              <span className="checkbox-text">
                &nbsp; I saved my passphrase and it’s secure
              </span>
            </label>
          </Flexbox>
          <Flexbox flexGrow={2} />
          <Flexbox flexGrow={1} justifyContent="flex-end" flexDirection="row">
            <Link className="button secondary" to="/import-or-create-wallet">Back</Link>
            <button disabled={!checked} className="button-on-right" onClick={this.onNextClicked}>Next</button>
          </Flexbox>
        </Flexbox>

      </OnBoardingLayout>
    )
  }
}

export default SecretPhrase
