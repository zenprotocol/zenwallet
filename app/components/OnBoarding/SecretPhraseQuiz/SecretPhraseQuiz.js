import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import Flexbox from 'flexbox-react'
import _ from 'lodash'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import swal from 'sweetalert'

import PasteButton from '../../UI/PasteButton'
import SeedInput from '../../UI/SeedInput'
import history from '../../../services/history'
import OnBoardingLayout from '../Layout/Layout'

const getInitialInputsState = () => _.range(24).map(() => '')

@inject('secretPhraseState')
@observer
class SecretPhraseQuiz extends Component {
  state = {
    userInputWords: getInitialInputsState(),
  }

  validateQuiz() {
    return this.props.secretPhraseState.mnemonicPhrase.every((word, idx) => this.isInputPerfect(idx))
  }

  onSubmitClicked = () => {
    if (this.validateQuiz()) {
      history.push('/set-password')
    }
  }
  registerOnChangeFor = idx => evt => {
    const { value } = evt.target // persist evt, don't delete! see https://reactjs.org/docs/events.html#event-pooling
    this.setState(({ userInputWords }) => {
      userInputWords[idx] = value
      return { userInputWords }
    }, () => {
      if (this.isInputPerfect(idx) && idx < 23) {
        this[`input${idx + 1}`].focus()
      }
    })
  }

  isInputPerfect = idx =>
    this.props.secretPhraseState.mnemonicPhrase[idx] === this.state.userInputWords[idx]
  isInputInvalid = idx => !!(!this.isInputValid(idx) && this.state.userInputWords[idx])
  isInputValid = idx => !!(this.state.userInputWords[idx]
    && this.props.secretPhraseState.mnemonicPhrase[idx]
      .indexOf(this.state.userInputWords[idx]) === 0)
  isInputIncomplete(idx) {
    const word = this.state.userInputWords[idx]
    return !!(word.length && !this.isInputPerfect(idx))
  }
  renderQuizInputs() {
    return this.props.secretPhraseState.mnemonicPhrase.map((word, idx) => (
      <SeedInput
        key={`${idx}`}
        idx={idx}
        value={this.state.userInputWords[idx]}
        isPerfect={this.isInputPerfect(idx)}
        isInvalid={this.isInputInvalid(idx)}
        isValid={this.isInputValid(idx)}
        isIncomplete={this.isInputIncomplete(idx)}
        isDisabled={this.isInputPerfect(idx)}
        inputRef={input => { this[`input${idx}`] = input }}
        onChange={this.registerOnChangeFor(idx)}
      />
    ))
  }

  render() {
    return (
      <OnBoardingLayout className="secret-phrase-quiz-container" progressStep={3}>
        <h1>Verify Your Mnemonic Passphrase (Seed)</h1>
        <h3>Please enter your 24 word secret phrase in the correct order</h3>

        <div className="devider after-title" />

        <ol className="passphrase-quiz">{this.renderQuizInputs()}</ol>
        <div className="devider before-buttons" />

        <Flexbox flexDirection="row">
          <Flexbox className="oops" flexGrow={1} flexDirection="column">
            <p>Whoops, I didn’t write my recovery phrase.</p>
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
