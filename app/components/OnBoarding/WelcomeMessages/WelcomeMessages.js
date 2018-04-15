import React, { Component } from 'react'
import Flexbox from 'flexbox-react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import history from '../../../services/history'
import { IMG_BASE } from '../../../constants/imgSources'
import OnBoardingLayout from '../Layout/Layout'

const pageTexts = [
  {
    img: 'image-source-blockchain.png',
    bullets: [
      'Zen wallet is a free, open source client interface',
      'We allow you to interact with the blockchain while remaining in full control of your keys & your funds.',
    ],
  },
  {
    img: 'image-wallet.png',
    bullets: [
      'When creating a wallet on Zen Protocol you are generating a cryptographic set of words: your private key and your public key (address).',
      'If you send your public key (address) to someone, they can send you Zen or other assets.',
      'Never share your private key.',
      'We do not store your private key. Make sure to keep it in a safe place.',
    ],
  },
  {
    img: 'image-attention.png',
    bullets: [
      'You are responsible for you security.',
      'No one can recover or change your private key.',
      'No one can change your password.',
      'No one can refund your transactions.',
      'No one can freeze your accounts.',
    ],
  },
  {
    img: 'image-security.png',
    bullets: [
      'Keep your private key and password safe.',
      'Be aware of phishing websites or programs.',
      'Make backup of your private key and password.',
    ],
  },
]

class WelcomeMessages extends Component {
  state = {
    currentPage: 0,
  }
  onNextClicked = () => {
    const nextPage = this.state.currentPage + 1
    if (nextPage === 4) {
      history.push('/import-or-create-wallet')
    } else {
      this.setState({ currentPage: nextPage })
    }
  }

  onBackClicked = () => {
    this.setState({ currentPage: this.state.currentPage - 1 })
  }

  renderBackButton() {
    if (this.state.currentPage !== 0) {
      return (
        <button className="secondary" onClick={this.onBackClicked} >Back</button>
      )
    }
  }


  render() {
    const { currentPage } = this.state
    const pageDetails = pageTexts[currentPage]
    const bulletPointes = pageDetails.bullets.map(bullet => (
      <li key={bullet}><FontAwesomeIcon icon={['fal', 'circle']} />{bullet}</li>
    ))

    return (
      <OnBoardingLayout className="welcome-messages-container" hideSteps >
        <h1>Welcome to Zen Protocol Wallet</h1>
        <h3>We care about your safty so please read the following.</h3>
        <div className="devider after-title" />

        <Flexbox flexDirection="row" className="body-section">

          <Flexbox flexDirection="column" className="bullet-points" flexGrow={2}>
            <ul>{bulletPointes}</ul>
          </Flexbox>

          <Flexbox className="bullet-image" flexGrow={1} justifyContent="flex-end">
            <img alt="Page" className={`page-${currentPage}`} src={`${IMG_BASE}/${pageDetails.img}`} />
          </Flexbox>

        </Flexbox>

        <div className="devider before-buttons" />

        <Flexbox flexDirection="row">
          <Flexbox flexGrow={1} />
          <Flexbox flexGrow={2} />
          <Flexbox flexGrow={1} justifyContent="flex-end" flexDirection="row">
            {this.renderBackButton()}
            <button className="button-on-right" onClick={this.onNextClicked} >Next</button>
          </Flexbox>
        </Flexbox>

      </OnBoardingLayout>
    )
  }
}

export default WelcomeMessages
