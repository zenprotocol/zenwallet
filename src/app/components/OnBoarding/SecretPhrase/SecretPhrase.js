import path from 'path'
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import autobind from 'class-autobind'
import Flexbox from 'flexbox-react'
import Checkbox from 'rc-checkbox'
import bip39 from 'bip39'

import OnBoardingLayout from '../Layout/Layout'

class SecretPhrase extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: false,
      mnemonicPhrase: bip39.generateMnemonic(256).split(" ")
    }
    autobind(this)
  }

  onChange = (e) => {
    const {checked} = this.state
    this.setState({checked: e.target.checked})
  }

  render() {
    const {checked, mnemonicPhrase} = this.state

    const logoSrc = path.join(__dirname, '../../assets/img/zen_logo_big_no_text.png')
    const loadingGif = path.join(__dirname, '../../assets/img/loading.gif')

    const mnemonicPhraseWords = mnemonicPhrase.map(word => {
      return (<li>{word}</li>)
    })

    return (
      <OnBoardingLayout className="secret-phrase-container" progressStep={2}>
        <h1>Your mnemonic passphrase</h1>
        <h3>Write down the following words in cheonological order and save it in a safe place.</h3>
        <div className="devider"></div>
        <ol className="passphrase">
          {mnemonicPhraseWords}
        </ol>
        <p className='warning'>If you lose this phrase you will lose your Zen tokens!</p>
        <div className="devider before-buttons"></div>

        <Flexbox flexDirection="row">
          <Flexbox flexGrow={1} flexDirection="row">
            <label className='checkbox'>
              <Checkbox type="checkbox" checked={checked} onChange={this.onChange} />
              <span className="checkbox-text">
                &nbsp; I saved my passphrase and it’s secure
              </span>
            </label>
          </Flexbox>
          <Flexbox flexGrow={2}></Flexbox>
          <Flexbox flexGrow={1} justifyContent='flex-end' flexDirection="row">
          <Link className="button secondary" to="/import-or-create-wallet">Back</Link>
            <button className='button-on-right'>Next</button>
          </Flexbox>
        </Flexbox>

      </OnBoardingLayout>
    )
  }
}

export default SecretPhrase
