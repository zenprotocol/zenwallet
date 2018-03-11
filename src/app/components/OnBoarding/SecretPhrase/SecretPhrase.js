import path from 'path'
import React, {Component} from 'react'
import autobind from 'class-autobind'
import Flexbox from 'flexbox-react'
import Checkbox from 'rc-checkbox'

import OnBoardingLayout from '../Layout/Layout'

class SecretPhrase extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: false,
      mnemonicPhrase: [
        'orbit',  'fix',    'silver', 'nose',   'kind',   'ill',
        'adjust', 'praise', 'mammal', 'stamp',  'pony',   'leg',
        'manual', 'course', 'dinner', 'leader', 'mean',   'prepare',
        'shadow', 'power',  'alien',  'delay',  'shadow', 'shallow'
      ]
    }
    autobind(this)
  }

  onChange = (e) => {
    const {checked} = this.state
    console.log('e.target.checked', e.target.checked)
    this.setState({checked: e.target.checked})
  }


  render() {
    const {mnemonicPhrase, checked} = this.state
    console.log('checked', checked)
    const logoSrc = path.join(__dirname, '../../assets/img/zen_logo_big_no_text.png')
    const loadingGif = path.join(__dirname, '../../assets/img/loading.gif')

    const mnemonicPhraseWords = mnemonicPhrase.map(word => {
      return (
        <li>{word}</li>
      )
    })

    return (
      <OnBoardingLayout className="secret-phrase-container">
        <h1>Your mnemonic passphrase</h1>
        <h3>Write down the following words in cheonological order and save it in a safe place.</h3>
        <div className="devider"></div>
        <ol className="passphrase">
          {mnemonicPhraseWords}
        </ol>
        <p className='warning'>If you lose this phrase you will lose your Zen tokens!</p>
        <div className="devider"></div>
        <Flexbox flexDirection="row">
          <label className='checkbox'>
            <Checkbox type="checkbox" checked={checked} onChange={this.onChange} />
            <span className="checkbox-text">
              &nbsp; I saved my passphrase and it’s secure
            </span>
          </label>
        </Flexbox>
      </OnBoardingLayout>
    )
  }
}

export default SecretPhrase
