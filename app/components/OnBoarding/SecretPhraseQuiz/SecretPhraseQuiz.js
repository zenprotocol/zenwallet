import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import Flexbox from 'flexbox-react'
import history from '../../../services/history'

import OnBoardingLayout from '../Layout/Layout'

@inject('secretPhraseState')
@observer
class SecretPhraseQuiz extends Component {
  onChange = (evt) => {
    const correctWord = evt.target.name
    const word = evt.target.value.trim().toLowerCase()
    const index = Number(evt.target.getAttribute('data-index'))
    const arrayObject = this.props.secretPhraseState.mnemonicPhrase[index]
    const validInput = (word.length === 0 || /^(.*[a-z].*)$/.test(word))

    if (validInput) {
      arrayObject.userInput = word

      if (word.length > 0) {
        if (correctWord.startsWith(word)) {
          if (correctWord === word) {
            arrayObject.status = 'perfect'
            let ref,
              refIndex,
              refClass
            refIndex = index + 1
            ref = this[`input${refIndex}`]

            if (ref) {
              refClass = ref.getAttribute('class')
              while (refClass == 'perfect') {
                refIndex += 1
                ref = this[`input${refIndex}`]
                refClass = ref.getAttribute('class')
              }
            }

            if (ref) { ref.focus() }
          } else {
            arrayObject.status = 'valid'
          }
        } else {
          arrayObject.status = 'invalid'
        }
      } else {
        arrayObject.status = ''
      }
    }

    this.forceUpdate()
  }

  validateQuiz() {
    // const { mnemonicPhrase } = this.props.secretPhraseState
    // const statuses = mnemonicPhrase.map(word) => (word.status))
    // return statuses.every(val => val === 'perfect')
    return this.props.secretPhraseState.mnemonicPhrase.every(word => word.status === 'perfect')
  }

  onSubmitClicked = () => {
    if (this.validateQuiz()) {
      history.push('/set-password')
    }
  }

  renderQuizInputs() {
    return this.props.secretPhraseState.mnemonicPhrase.map((word, idx) => {
      let iconClassNames = 'display-none'
      if (word.status === 'perfect') { iconClassNames = 'fa fa-check' }
      if (word.status === 'invalid') { iconClassNames = 'fa fa-times' }
      return (
        <li key={idx} className={word.status}>
          <input
            type="text"
            data-index={idx}
            name={word.word}
            onChange={this.onChange}
            className={word.status}
            value={word.userInput}
            disabled={word.status === 'perfect'}
            ref={input => { this[`input${idx}`] = input }}
          />
          <i className={iconClassNames} />
        </li>
      )
    })
  }

  render() {
    return (
      <OnBoardingLayout className="secret-phrase-quiz-container" progressStep={3}>
        <h1>Verify Your Mnemonic Passphrase</h1>
        <h3>Please enter your 24 word secret phrase in the correct order</h3>

        <div className="devider after-title" />

        <ol className="passphrase-quiz">{this.renderQuizInputs()}</ol>
        <div className="devider before-buttons" />

        <Flexbox flexDirection="row">
          <Flexbox className="oops" flexGrow={1} flexDirection="column">
            <p>Opps. I didn’t write my recovery phrase.</p>
            <Link to="/import-or-create-wallet">Create New Wallet</Link>
          </Flexbox>
          <Flexbox flexGrow={2} />
          <Flexbox flexGrow={1} justifyContent="flex-end" flexDirection="row">
            <button
              className="button-on-right"
              onClick={this.onSubmitClicked}
              disabled={!this.validateQuiz()}
            >
              Continue
            </button>
          </Flexbox>
        </Flexbox>

      </OnBoardingLayout>
    )
  }
}

export default SecretPhraseQuiz
