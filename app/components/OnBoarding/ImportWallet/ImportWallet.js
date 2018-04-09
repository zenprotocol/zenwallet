import path from 'path'
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import autobind from 'class-autobind'
import Flexbox from 'flexbox-react'
import history from '../../../services/history'
import { isValidBip39Word, isBip39Word } from '../../../../utils/helpers'

import OnBoardingLayout from '../Layout/Layout'

const shell = require('electron').shell


@inject('secretPhraseState')
@observer
class ImportWallet extends Component {
  constructor(props) {
    super(props)
    autobind(this)
  }

  componentWillMount() {
    const { secretPhraseState } = this.props
    secretPhraseState.mnemonicPhrase = [...Array(24).keys()].map(word => (
      { word: '', status: '' }
    ))
  }

  onChange = (e) => {
    const { mnemonicPhrase } = this.props.secretPhraseState
    const index = Number(e.target.getAttribute('data-index'))

    const newWord = e.target.value.trim().toLowerCase()

    const object = mnemonicPhrase[index]
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
    const statuses = mnemonicPhrase.map((word, i) => (word.status))
    return statuses.every((val, i, arr) => val === 'perfect')
  }

  onLinkClick = (e) => {
    e.preventDefault()
    shell.openExternal(e.target.href)
  }

  onSubmitClicked() {
    const { mnemonicPhrase } = this.props.secretPhraseState
    console.log('onSubmitClicked mnemonicPhrase', mnemonicPhrase)

    if (this.validateSecretPhrase()) {
      history.push('/set-password')
    }
  }

  render() {
    const { mnemonicPhrase } = this.props.secretPhraseState

    const importPhraseInputs = mnemonicPhrase.map((word, index) => {
      let iconClassNames = 'display-none'
      if (word.status == 'perfect') { iconClassNames = 'fa fa-check' }
      if (word.status == 'invalid') { iconClassNames = 'fa fa-times' }

  		return (
    <li key={index} className={word.status} >
      <input
        type="text"
        data-index={index}
        className={word.status}
        onChange={this.onChange}
        value={word.word}
      />
      <i className={iconClassNames} />
    </li>
      )
  	})

    return (
      <OnBoardingLayout className="import-wallet-container" progressStep={3}>
        <h1>Import Your Mnemonic Passphrase</h1>
        <h3>
          Please enter your 24 word secret phrase.
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
