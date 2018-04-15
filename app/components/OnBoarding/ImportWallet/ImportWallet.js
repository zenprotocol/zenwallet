import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Flexbox from 'flexbox-react'

import IsValidIcon from '../../Icons/IsValidIcon'
import history from '../../../services/history'
import { isValidBip39Word, isBip39Word } from '../../../../utils/helpers'
import OnBoardingLayout from '../Layout/Layout'

const { shell } = require('electron')

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

  validateSecretPhrase() {
    const { mnemonicPhrase } = this.props.secretPhraseState
    const statuses = mnemonicPhrase.map(word => word.status)
    return statuses.every(val => val === 'perfect')
  }

  onLinkClick = (evt) => {
    evt.preventDefault()
    shell.openExternal(evt.target.href)
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

    const importPhraseInputs = mnemonicPhrase.map((word, index) => {

  		return (
    <li key={index} className={word.status} >
      <input
        type="text"
        data-index={index}
        className={word.status}
        onChange={this.onChange}
        value={word.word}
      />
      <IsValidIcon isValid={word.status === 'perfect'} isHidden={!word.status.match(/perfect|invliad/)} />
    </li>
      )
  	})

    return (
      <OnBoardingLayout className="import-wallet-container" progressStep={3}>
        <h1>Import Your Mnemonic Passphrase</h1>
        <h3>
          Please enter your 24 word secret phrase (seed).
          <br />
          A blue check will apear if the text you entered is a valid&nbsp;
          <a
            href="https://github.com/bitcoin/bips/blob/master/bip-0039/english.txt"
            onClick={this.onLinkClick}
          >bip39 word
          </a>.
        </h3>

        <div className="devider after-title" />

        <ol className="passphrase-quiz">
          {importPhraseInputs}
        </ol>

        <div className="devider before-buttons" />

        <Flexbox flexDirection="row">
          <Flexbox flexGrow={1} />
          <Flexbox flexGrow={2} />
          <Flexbox flexGrow={1} justifyContent="flex-end" flexDirection="row">
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
