import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import Flexbox from 'flexbox-react'
import cx from 'classnames'
import bip39 from 'bip39'

import ExternalLink from '../../UI/ExternalLink'
import IsValidIcon from '../../Icons/IsValidIcon'
import history from '../../../services/history'
import { isValidBip39Word, isBip39Word } from '../../../utils/helpers'
import OnBoardingLayout from '../Layout/Layout'

@inject('secretPhraseState')
@observer
class ImportWallet extends Component {
  componentWillMount() {
    const { secretPhraseState } = this.props
    secretPhraseState.mnemonicPhrase = [...Array(24).keys()].map(() => (
      { word: '', status: '' }
    ))
  }

  onChange = (evt) => {
    const index = Number(evt.target.getAttribute('data-index'))
    const newWord = evt.target.value.trim().toLowerCase()
    const object = this.props.secretPhraseState.mnemonicPhrase[index]
    object.word = newWord

    object.status = ''
    if (newWord.length > 0) {
      object.status = (isValidBip39Word(newWord) ? 'valid' : 'invalid')
    }
    if (isBip39Word(newWord)) { object.status = 'perfect' }

    this.forceUpdate()
  }
  isWordIncomplete(index) {
    const { word, status } = this.props.secretPhraseState.mnemonicPhrase[index]
    return word.length && status !== 'perfect'
  }

  validateSecretPhrase() {
    return this.isEachWordIsValidBip39Word && this.isValidBip39Mnemonic
  }

  get isEachWordIsValidBip39Word() {
    const { mnemonicPhrase } = this.props.secretPhraseState
    const statuses = mnemonicPhrase.map(word => word.status)
    return statuses.every(val => val === 'perfect')
  }
  get isValidBip39Mnemonic() {
    const { mnemonicPhrase } = this.props.secretPhraseState
    const mnemonicPhraseString = mnemonicPhrase.map(word => word.word).join(' ')
    return bip39.validateMnemonic(mnemonicPhraseString)
  }
  get notValidBip39PhraseMessage() {
    if (!this.isEachWordIsValidBip39Word || this.isValidBip39Mnemonic) {
      return
    }
    return <p className="is-error">This is not a valid bip39 Mnemonic Passphrase</p>
  }
  onSubmitClicked = () => {
    const { secretPhraseState } = this.props
    const wordArray = secretPhraseState.mnemonicPhrase.map((word) => word.word)
    console.log('onSubmitClicked wordArray', wordArray)

    if (this.validateSecretPhrase()) {
      secretPhraseState.mnemonicPhrase = wordArray
      history.push('/set-password')
    }
  }

  render() {
    const { mnemonicPhrase } = this.props.secretPhraseState

    const importPhraseInputs = mnemonicPhrase.map((word, index) => (
      <li key={index} className={word.status} >
        <input
          type="text"
          data-index={index}
          className={cx(word.status, { incomplete: this.isWordIncomplete(index) })}
          onChange={this.onChange}
          value={word.word}
        />
        <IsValidIcon isValid={word.status === 'perfect'} isHidden={!word.status.match(/perfect|invliad/)} />
      </li>
    ))

    return (
      <OnBoardingLayout className="import-wallet-container" progressStep={3}>
        <h1>Import Your Mnemonic Passphrase</h1>
        <h3>
          Please enter your 24 word secret phrase (seed).
          <br />
          A blue check will apear if the text you entered is a valid&nbsp;
          <ExternalLink
            link="https://github.com/bitcoin/bips/blob/master/bip-0039/english.txt"
          >bip39 word
          </ExternalLink>.
        </h3>

        <div className="devider after-title" />

        <ol className="passphrase-quiz">
          {importPhraseInputs}
        </ol>
        {this.notValidBip39PhraseMessage}
        <div className="devider before-buttons" />

        <Flexbox flexDirection="row">
          <Flexbox flexGrow={1} />
          <Flexbox flexGrow={2} />
          <Flexbox flexGrow={1} justifyContent="flex-end" flexDirection="row">
            <Link className="button secondary" to="/import-or-create-wallet">Back</Link>
            <button
              className="button-on-right"
              onClick={this.onSubmitClicked}
              disabled={!this.validateSecretPhrase()}
            >
              Continue
            </button>
          </Flexbox>
        </Flexbox>

      </OnBoardingLayout>
    )
  }
}

export default ImportWallet
