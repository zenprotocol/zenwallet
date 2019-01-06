import React, { Component } from 'react'
import Flexbox from 'flexbox-react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import history from '../../services/history'
import routes from '../../constants/routes'
import OnBoardingLayout from '../Layout/Layout'

const pageTexts = [
  {
    img: 'image-security.png',
    title: 'Welcome to the Zen Protocol Yesod Release Candidate',
    description: 'Please take a minute to read and understand the following notes:',
    bullets: [
      'The release candidate is not the official Zen Protocol network and should be used with caution.',
      'The release candidate is only meant to be used in order to review and understand the proposed changes to the protocol.',
      'Following the Zen Protocol Authorized Protocol, there will be a vote to determine if the token holders wish to upgrade to the proposed release candidate.',
    ],
  },
  {
    img: 'image-attention.png',
    title: 'Welcome to the Zen Protocol Yesod Release Candidate',
    description: 'We care about your safety ­– so please read the following:',
    bullets: [
      'There is no “Import Wallet” option in this wallet - since it is not recommended to use your real seed with the release candidate.',
      'To receive ZP tokens to try out the release candidate send an email to info@zenprotocol.com with your address and the title “Please send me some ZP RC tokens”',
      'Click here to learn more about the release candidate',
    ],
  },
]

class WelcomeMessages extends Component {
  state = {
    currentPage: 0,
  }
  onNextClicked = () => {
    const nextPage = this.state.currentPage + 1
    if (nextPage === 2) {
      history.push(routes.IMPORT_OR_CREATE_WALLET)
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
      <li key={bullet}><FontAwesomeIcon icon={['fas', 'circle']} />{bullet}</li>
    ))

    return (
      <OnBoardingLayout className="welcome-messages-container" hideSteps >
        <h1>{pageDetails.title}</h1>
        <h3>{pageDetails.description}</h3>
        <div className="devider after-title" />

        <Flexbox flexDirection="row" className="body-section">

          <Flexbox flexDirection="column" className="bullet-points" flexGrow={2}>
            <ul>{bulletPointes}</ul>
          </Flexbox>


        </Flexbox>

        <div className="devider before-buttons" />

        <Flexbox flexDirection="row">
          <Flexbox flexGrow={1} />
          <Flexbox flexGrow={2} />
          <Flexbox flexGrow={1} justifyContent="flex-end" flexDirection="row">
            {this.renderBackButton()}
            <button className="button-on-right" onClick={this.onNextClicked} >I Understand</button>
          </Flexbox>
        </Flexbox>

      </OnBoardingLayout>
    )
  }
}

export default WelcomeMessages
