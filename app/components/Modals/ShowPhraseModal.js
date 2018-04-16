import React from 'react'
import { inject, observer, PropTypes as PropTypesMobx } from 'mobx-react'
import PropTypes from 'prop-types'

@inject('secretPhraseState')
@observer
class ShowPhraseModal extends React.Component {
  static propTypes = {
    secretPhraseState: PropTypes.shape({
      mnemonicPhrase: PropTypesMobx.observableArrayOf(PropTypes.string),
    }).isRequired,
  }
  render() {
    const { mnemonicPhrase } = this.props.secretPhraseState
    return (
      <div className="secret-phrase-container">
        <h1>Your mnemonic passphrase</h1>
        <h3>Write down the following words in cheonological order and save it in a safe place.</h3>
        <div className="devider after-title" />
        <ol className="passphrase">
          {mnemonicPhrase.map((word, idx) => (<li key={idx}>{word}</li>))}
        </ol>
        <p className="warning">If you lose this phrase you will lose your Zen tokens!</p>
      </div>
    )
  }
}

export default ShowPhraseModal
