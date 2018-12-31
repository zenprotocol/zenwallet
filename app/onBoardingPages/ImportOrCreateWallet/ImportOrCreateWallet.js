/* eslint-disable max-len */

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Flexbox from 'flexbox-react'

import OnBoardingLayout from '../Layout/Layout'
import { CREATE_WALLET_SRC, IMPORT_WALLET_SRC } from '../../constants/imgSources'
import routes from '../../constants/routes'

class ImportOrCreateWallet extends Component {
  render() {
    return (
      <OnBoardingLayout className="import-create-wallet-container" progressStep={1}>
        <h1>Setting Up Your Wallet</h1>
        <h3>
          Create or Import your seed (24 word mnemonic passphrase)
        </h3>

        <div className="devider after-title" />

        <Flexbox flexDirection="row" justifyContent="space-between">

          <Flexbox className="box create-wallet" flexDirection="column">
            <img src={CREATE_WALLET_SRC} alt="Create wallet" />
            <h5>Create New Wallet</h5>
            <p>Creating a new wallet will generate a 24 word mnemonic passphrase (seed) which you will need to store in a secure place. We recommend 2 pieces of paper.</p>
            <Link className="button" to={routes.SECRET_PHRASE}>Create Wallet</Link>
          </Flexbox>

          <Flexbox className="box import-wallet" flexDirection="column">
            <img src={IMPORT_WALLET_SRC} alt="Import wallet" />
            <h5>Import Existing Wallet</h5>
            <p>It is not reccommended to import your 24 word seed in the release candidate network.</p>
            <button className="button secondary" disabled>Not Available</button>
          </Flexbox>

        </Flexbox>

      </OnBoardingLayout>
    )
  }
}

export default ImportOrCreateWallet
