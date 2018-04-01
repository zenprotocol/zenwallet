import path from 'path'
import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {Link} from 'react-router-dom'
import autobind from 'class-autobind'
import Flexbox from 'flexbox-react'

import OnBoardingLayout from '../Layout/Layout'

@inject('secretPhraseState')
@observer
class SecretPhraseQuiz extends Component {
  constructor(props) {
    super(props)
    autobind(this)
  }

  componentWillMount() {
    const {mnemonicPhrase} = this.props.secretPhraseState
    const mnemonicPhraseWithStatus = mnemonicPhrase.map(word => {
      { 'word' : word },
      { 'status' : '' }
    })
    this.setState
  }

  onChange = (e) => {
    const correctWord = e.target['name']
    const inputString = e.target.value.trim()

    correctWord.startsWith(inputString)




    console.log('onChange', e)
    console.log('e.target', e.target)
    console.log('e.target[name]', e.target['name'])
    console.log('e.target.value', e.target.value)
  }

  render() {
    const {mnemonicPhrase} = this.props.secretPhraseState

    const quizInputs = mnemonicPhrase.map(word => {
      return (
        <li key={word} className='inputWrapper'>
          <input
            type="text"
            name={word}
            onChange={this.onChange}
          />
        </li>
      )
    })

    return (
      <OnBoardingLayout className="secret-phrase-quiz-container" progressStep={3}>
        <h1>Verify Your Mnemonic Passphrase</h1>
        <h3>Please enter your 24 word secret phrase in the correct order</h3>
        <div className="devider after-title"></div>

        <ol className="passphrase-quiz">{quizInputs}</ol>
        <div className="devider before-buttons"></div>

        <Flexbox flexDirection="row">
          <Flexbox flexGrow={1} flexDirection="row">
            <p>Opps. I didn’t write my recovery phrase.</p>
            <Link to="/import-or-create-wallet">Create New Wallet</Link>
          </Flexbox>
          <Flexbox flexGrow={2}></Flexbox>
          <Flexbox flexGrow={1} justifyContent='flex-end' flexDirection="row">
            <button className='button-on-right'>Continue</button>
          </Flexbox>
        </Flexbox>

      </OnBoardingLayout>
    )
  }
}

export default SecretPhraseQuiz
