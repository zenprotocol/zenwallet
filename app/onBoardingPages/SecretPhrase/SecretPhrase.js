// @flow

import React from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import Flexbox from 'flexbox-react'
import Checkbox from 'rc-checkbox'

import history from '../../services/history'
import routes from '../../constants/routes'
import SecretPhraseStore from '../../stores/secretPhraseStore'
import OnBoardingLayout from '../../components/Layout'

type Props = {
  secretPhraseStore: SecretPhraseStore
};

type State = {
  checked: boolean
};

@inject('secretPhraseStore')
@observer
class SecretPhrase extends React.Component<Props, State> {
  state = {
    checked: false,
  }
  componentWillMount() {
    this.props.secretPhraseStore.generateSeed()
  }

  onToggleSecuredPassphrase = (evt: SyntheticEvent<HTMLInputElement>) => {
    this.setState({ checked: evt.currentTarget.checked })
  }

  onNextClicked = () => {
    history.push(routes.SECRET_PHRASE_QUIZ)
  }
  render() {
    const { checked } = this.state
    const { mnemonicPhrase } = this.props.secretPhraseStore
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
            <Link className="button secondary" to={routes.IMPORT_OR_CREATE_WALLET}>Back</Link>
            <button disabled={!checked} className="button-on-right" onClick={this.onNextClicked}>Next</button>
          </Flexbox>
        </Flexbox>

      </OnBoardingLayout>
    )
  }
}

export default SecretPhrase
