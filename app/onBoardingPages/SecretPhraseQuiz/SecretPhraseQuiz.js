// @flow

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import Flexbox from 'flexbox-react'
import _ from 'lodash'

import SeedInput from '../../components/SeedInput'
import history from '../../services/history'
import OnBoardingLayout from '../Layout/Layout'
import SecretPhraseStore from '../../stores/secretPhraseStore'
import routes from '../../constants/routes'
import { ref } from '../../utils/domUtils'

const getInitialInputsState = () => _.range(24).map(() => '')

type Props = {
  secretPhraseStore: SecretPhraseStore
};
type State = {
  userInputWords: Array<string>
};

@inject('secretPhraseStore')
@observer
class SecretPhraseQuiz extends Component<Props, State> {
  state = {
    userInputWords: getInitialInputsState(),
  }

  validateQuiz() {
    const { secretPhraseStore } = this.props
    return secretPhraseStore.mnemonicPhrase.every((word, idx) => this.isInputPerfect(idx))
  }

  onSubmitClicked = () => {
    if (this.validateQuiz()) {
      history.push(routes.SET_PASSWORD)
    }
  }
  registerOnChangeFor = (idx: number) => (evt: SyntheticEvent<HTMLInputElement>) => {
    const { value } = evt.target // persist evt, don't delete! see https://reactjs.org/docs/events.html#event-pooling
    this.setState(({ userInputWords }) => {
      userInputWords[idx] = value
      return { userInputWords }
    }, () => {
      if (this.isInputPerfect(idx) && idx < 23) {
        // $FlowFixMe
        this[`input${idx + 1}`].focus()
      }
    })
  }

  isInputPerfect = (idx: number) =>
    this.props.secretPhraseStore.mnemonicPhrase[idx] === this.state.userInputWords[idx]
  isInputInvalid = (idx: number) => !!(!this.isInputValid(idx) && this.state.userInputWords[idx])
  isInputValid = (idx: number) => !!(this.state.userInputWords[idx]
    && this.props.secretPhraseStore.mnemonicPhrase[idx]
      .indexOf(this.state.userInputWords[idx]) === 0)
  isInputIncomplete(idx: number) {
    const word = this.state.userInputWords[idx]
    return !!(word.length && !this.isInputPerfect(idx))
  }
  renderQuizInputs() {
    return this.props.secretPhraseStore.mnemonicPhrase.map((word, idx) => (
      <SeedInput
        key={`${idx}`}
        idx={idx}
        value={this.state.userInputWords[idx]}
        isPerfect={this.isInputPerfect(idx)}
        isInvalid={this.isInputInvalid(idx)}
        isValid={this.isInputValid(idx)}
        isIncomplete={this.isInputIncomplete(idx)}
        isDisabled={this.isInputPerfect(idx)}
        inputRef={ref(`input${idx}`).bind(this)}
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
            <Link to={routes.IMPORT_OR_CREATE_WALLET}>Create New Wallet</Link>
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
