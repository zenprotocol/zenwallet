/* eslint-disable max-len */

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Flexbox from 'flexbox-react'

import OnBoardingLayout from '../Layout/Layout'
import { CREATE_WALLET_SRC, IMPORT_WALLET_SRC } from '../../../constants/imgSources'

class ImportOrCreateWallet extends Component {
  render() {
    return (
      <OnBoardingLayout className="import-create-wallet-container" progressStep={1}>
        <h1>Setting Up Your Wallet</h1>
        <h3>
          Essentially, you wallet is a secret phrase of 24 words.
          <br />
          Start by creating or importing your secret phrase
        </h3>

        <div className="devider after-title" />

        <Flexbox flexDirection="row" justifyContent="space-between">

          <Flexbox className="box create-wallet" flexDirection="column">
            <img src={CREATE_WALLET_SRC} alt="Create wallet" />
            <h5>Create New Wallet</h5>
            <p>Creating a new wallet will generate a 24 secret phrase which you will need to store in a very safe place. Preferably 2 peices of paper.</p>
            <Link className="button" to="/secret-phrase">Create Wallet</Link>
          </Flexbox>

          <Flexbox className="box import-wallet" flexDirection="column">
            <img src={IMPORT_WALLET_SRC} alt="Import wallet" />
            <h5>Import Exisiting Wallet</h5>
            <p>If you already have a secret phrase you can simply import it and get access to all of your assets.</p>
            <Link className="button secondary" to="/import-wallet">Import Wallet</Link>

          </Flexbox>

        </Flexbox>

      </OnBoardingLayout>
    )
  }
}

export default ImportOrCreateWallet
