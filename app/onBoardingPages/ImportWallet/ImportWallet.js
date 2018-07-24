// @flow

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import Flexbox from 'flexbox-react'
import bip39 from 'bip39'
import _ from 'lodash'
import swal from 'sweetalert'
import { clipboard } from 'electron'

import { isAnyInputActive } from '../../utils/domUtils'
import { isValidBip39Word, isBip39Word, getSeedFromClipboard } from '../../utils/seedUtils'
import routes from '../../constants/routes'
import SecretPhraseStore from '../../stores/secretPhraseStore'
import PasteButton from '../../components/PasteButton'
import ResetButton from '../../components/ResetButton'
import SeedInput from '../../components/SeedInput'
import ExternalLink from '../../components/ExternalLink'
import OnBoardingLayout from '../../components/Layout'

const getInitialInputsState = () => _.range(24).map(() => '')

type Props = {
  secretPhraseStore: SecretPhraseStore
};

type State = {
  userInputWords: Array<string>
};

@inject('secretPhraseStore')
@observer
class ImportWallet extends Component<Props, State> {
  state = {
    userInputWords: getInitialInputsState(),
  }
  componentDidMount() {
    window.addEventListener('keyup', this.onkeyup)
  }
  componentWillUnmount() {
    window.removeEventListener('keyup', this.onkeyup)
  }
  onkeyup = (evt: SyntheticKeyboardEvent<HTMLInputElement>) => {
    if (evt.key === 'v' && evt.ctrlKey && !isAnyInputActive()) {
      this.paste(clipboard.readText())
    }
  }
  registerOnChangeFor = (idx: number) => (evt: SyntheticEvent<HTMLInputElement>) => {
    const { value } = evt.currentTarget // persist evt, don't delete! see https://reactjs.org/docs/events.html#event-pooling
    this.setState(({ userInputWords }) => {
      userInputWords[idx] = value
      return { userInputWords }
    })
  }
  isInputPerfect = (idx: number) => {
    const word = this.state.userInputWords[idx]
    return isBip39Word(word)
  }
  isInputInvalid = (idx: number) => {
    const word = this.state.userInputWords[idx]
    return !!(word && !isValidBip39Word(word))
  }
  isInputValid = (idx: number) => {
    const word = this.state.userInputWords[idx]
    return !!(word && isValidBip39Word(word))
  }
  isInputIncomplete(idx: number) {
    const word = this.state.userInputWords[idx]
    return !!(word.length && !this.isInputPerfect(idx))
  }

  get areAllInputsPerfect() {
    return this.state.userInputWords.every(isBip39Word)
  }
  get isValidBip39Mnemonic() {
    const mnemonicPhraseString = this.state.userInputWords.join(' ')
    return bip39.validateMnemonic(mnemonicPhraseString)
  }
  get notValidBip39PhraseMessage() {
    if (!this.areAllInputsPerfect || this.isValidBip39Mnemonic) {
      return
    }
    return <p className="is-error" style={{ marginTop: 10 }}>Each word is a valid bip39 word, but this is not a valid bip39 Mnemonic Passphrase</p>
  }
  reset = () => {
    this.setState({ userInputWords: getInitialInputsState() })
  }
  paste = (clipboardContents: string) => {
    const arraySeed = getSeedFromClipboard(clipboardContents)
    if (!arraySeed) {
      swal({
        icon: 'warning',
        title: 'bad format',
        text: 'your clipboard content is not formatted as a valid seed',
      })
      return
    }
    this.setState({ userInputWords: arraySeed })
  }
  onSubmitClicked = () => {
    const { secretPhraseStore } = this.props
    secretPhraseStore.setMnemonicToImport(this.state.userInputWords)
  }

  renderInputs() {
    return this.state.userInputWords.map((word, idx) => (
      <SeedInput
        key={`${idx}`}
        value={word}
        isPerfect={this.isInputPerfect(idx)}
        isInvalid={this.isInputInvalid(idx)}
        isValid={this.isInputValid(idx)}
        isIncomplete={this.isInputIncomplete(idx)}
        onChange={this.registerOnChangeFor(idx)}
        /* $FlowFixMe */
        inputRef={input => { this[`input${idx}`] = input }}
      />
    ))
  }
  render() {
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
          {this.renderInputs()}
        </ol>

        <div>
          <PasteButton onClick={this.paste} />
          <ResetButton onClick={this.reset} className="button-on-right" />
        </div>
        {this.notValidBip39PhraseMessage}
        <div className="devider before-buttons" />

        <Flexbox flexDirection="row">
          <Flexbox flexGrow={1} />
          <Flexbox flexGrow={2} />
          <Flexbox flexGrow={1} justifyContent="flex-end" flexDirection="row">
            <Link className="button secondary" to={routes.IMPORT_OR_CREATE_WALLET}>Back</Link>
            <button
              className="button-on-right"
              onClick={this.onSubmitClicked}
              disabled={!this.isValidBip39Mnemonic}
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
