import path from 'path'
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import autobind from 'class-autobind'
import Flexbox from 'flexbox-react'
import Checkbox from 'rc-checkbox'
import bip39 from 'bip39'
import history from '../../../services/history'

import OnBoardingLayout from '../Layout/Layout'

@inject('secretPhraseState')
@observer
class SecretPhrase extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: false
    }
    autobind(this)
  }

  componentWillMount() {
    const { secretPhraseState } = this.props

    const mnemonicPhrase = bip39.generateMnemonic(256).split(' ')

    const mnemonicPhraseWithStatuses = mnemonicPhrase.map(word => (
      { word, status: '', userInput: '' }
    ))

    secretPhraseState.mnemonicPhrase = mnemonicPhraseWithStatuses
  }

  onChange = (e) => {
    const { checked } = this.state
    this.setState({ checked: e.target.checked })
  }

  onNextClicked() {
    const { checked } = this.state
    if (checked) {
      history.push('/secret-phrase-quiz')
    }
  }

  render() {
    const { checked } = this.state

    const { mnemonicPhrase } = this.props.secretPhraseState

    const logoSrc = path.join(__dirname, '../../assets/img/zen_logo_big_no_text.png')
    const loadingGif = path.join(__dirname, '../../assets/img/loading.gif')

    const nextButtonClassNames = (checked ? 'button button-on-right' : 'button button-on-right disabled')

    const mnemonicPhraseWords = mnemonicPhrase.map(word => (<li key={word.word}>{word.word}</li>))

    return (
      <OnBoardingLayout className="secret-phrase-container" progressStep={2}>
        <h1>Your mnemonic passphrase</h1>
        <h3>Write down the following words in cheonological order and save it in a safe place.</h3>
        <div className="devider after-title" />
        <ol className="passphrase">
          {mnemonicPhraseWords}
        </ol>
        <p className="warning">If you lose this phrase you will lose your Zen tokens!</p>
        <div className="devider before-buttons" />

        <Flexbox flexDirection="row">
          <Flexbox flexGrow={1} flexDirection="row">
            <label className="checkbox">
              <Checkbox type="checkbox" checked={checked} onChange={this.onChange} />
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
