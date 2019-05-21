// @flow

import React, { Component } from 'react'
import Flexbox from 'flexbox-react'
import { inject, observer } from 'mobx-react'
import cx from 'classnames'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { isEmpty } from 'lodash'
import * as mobx from 'mobx'
import BigInteger from 'bigi'
import { Data } from '@zen/zenjs'

import AuthorizedProtocolStore from '../../stores/authorizedProtocolStore'
import PublicAddressStore from '../../stores/publicAddressStore'
import RunContractStore from '../../stores/runContractStore'
import { isValidHex, hashVoteData, payloadData } from '../../utils/helpers'
import { ref } from '../../utils/domUtils'
import Layout from '../../components/Layout'
import Loading from '../../components/Loading'
import IsValidIcon from '../../components/IsValidIcon'
import ProtectedButton from '../../components/Buttons'
import FormResponseMessage from '../../components/FormResponseMessage'
import ExternalLink from '../../components/ExternalLink'
import { kalapasToZen } from '../../utils/zenUtils'
import TxHistoryStore from '../../stores/txHistoryStore'
import { MAINNET } from '../../constants'
import NetworkStore from '../../stores/networkStore'
import BoxLabel from '../../components/BoxLabel/BoxLabel'
import PortfolioStore from '../../stores/portfolioStore'


type Props = {
  authorizedProtocolStore: AuthorizedProtocolStore,
  publicAddressStore: PublicAddressStore,
  runContractStore: RunContractStore,
  txHistoryStore: TxHistoryStore,
  networkStore: NetworkStore,
  portfolioStore: PortfolioStore
};

type State = {
  isSnapshot: boolean,
  isTally: boolean,
  hasVoted: boolean,
  zeroBalance: boolean
};

@inject('txHistoryStore', 'authorizedProtocolStore', 'publicAddressStore', 'runContractStore', 'networkStore', 'portfolioStore')
@observer
class AuthorizedProtocol extends Component<Props, State> {
  state = {
    hasVoted: undefined,
    isSnapshot: undefined,
    isTally: undefined,
    zeroBalance: undefined,
  }
  componentDidMount() {
    this.props.authorizedProtocolStore.getVote()
      .then(bool => this.setState({ hasVoted: bool }))
      .catch(error => console.error(error))
    mobx.runInAction(async () => {
      await this.props.authorizedProtocolStore.fetch()
      await this.props.publicAddressStore.fetch()
      await this.props.authorizedProtocolStore.getSnapshotBalance()
      this.setState({
        isSnapshot: this.props.networkStore.headers
          >= this.props.authorizedProtocolStore.snapshotBlock,
        isTally: this.props.networkStore.headers
          > this.props.authorizedProtocolStore.tallyBlock,
        zeroBalance: this.props.authorizedProtocolStore.snapshotBalance === 0,
      })
    })
  }
  onCommitChanged = (evt: SyntheticEvent<HTMLInputElement>) => {
    this.props.authorizedProtocolStore.updateCommitDisplay(evt.currentTarget.value.trim())
  }

  onReset = () => {
    this.AutoSuggestAssets.wrappedInstance.reset()
  }

  renderCommitErrorMessage() {
    if (isEmpty(this.props.authorizedProtocolStore.commit) ? false : !this.isCommitValid) {
      return (
        <div className="error input-message">
          <FontAwesomeIcon icon={['far', 'exclamation-circle']} />
          <span>Commit identifier is invalid, it expect 40 hex characters</span>
        </div>
      )
    }
  }
  format(balance) {
    return balance >= kalapasToZen(1) ? kalapasToZen(balance) : balance
  }

  renderSuccessResponse() {
    if (this.state.isTally) return null
    if (!this.state.hasVoted) return null
    if (!this.state.isSnapshot) return null
    if (this.state.zeroBalance) return null
    this.props.authorizedProtocolStore.getVote()
      .then(bool => bool)
      .catch(error => console.error(error))
    const vote =
      this.props.authorizedProtocolStore.votedCommit || this.props.authorizedProtocolStore.commit
    return (
      <Flexbox
        flexGrow={2}
        flexDirection="row"
        className={cx('form-response-message', 'success')}
      >
        <FontAwesomeIcon icon={['far', 'check']} />
        <Flexbox flexDirection="column">
          <span> Vote was successfully broadcast</span>
          <span className="devider" />
          <p> You voted for commit ID {vote} with { '  ' }
            {this.props.authorizedProtocolStore.snapshotBalance ?
            this.format(this.props.authorizedProtocolStore.snapshotBalance) : 0} ZP { '  ' }
            , see more details
            <ExternalLink link={`https://${this.getLink}zp.io/governance`} > here</ExternalLink>
          </p>
        </Flexbox>
      </Flexbox>
    )
  }

  onPasteClicked = (clipboardContents: string) => {
    this.props.authorizedProtocolStore.commit = clipboardContents
  }

  renderErrorResponse() {
    const { status, errorMessage } = this.props.runContractStore
    if (status !== 'error') {
      return null
    }
    return (
      <FormResponseMessage className="error">
        <span>There was a problem with the vote.</span>
        <span className="devider" />
        <p>Error message: {errorMessage}</p>
      </FormResponseMessage>
    )
  }

  get getLink() {
    const { networkStore } = this.props
    return networkStore.chain === MAINNET ? '' : 'testnet.'
  }

  renderIntervalEnded() {
    if (!this.state.isTally) return null
    return (
      <Flexbox
        flexGrow={2}
        flexDirection="row"
        className={cx('form-response-message', 'warning')}
      >
        <FontAwesomeIcon icon={['far', 'exclamation-circle']} />
        <Flexbox flexDirection="column">
          <span> Votes were already tallied</span>
          <span className="devider" />
          <p>Please go to
            <ExternalLink link={`https://${this.getLink}zp.io/governance`} > {this.getLink}zp.io/governance</ExternalLink> to see the results
          </p>
        </Flexbox>
      </Flexbox>
    )
  }
  renderBeforeSnapshot() {
    if (this.state.isSnapshot) return null
    return (
      <Flexbox
        flexGrow={2}
        flexDirection="row"
        className={cx('form-response-message', 'warning')}
      >
        <FontAwesomeIcon icon={['far', 'exclamation-circle']} />
        <Flexbox flexDirection="column">
          <p>
            The voting period will begin after the snapshot block.
            <br />
            Please wait for the snapshot block to cast your vote.
          </p>
        </Flexbox>
      </Flexbox>
    )
  }
  onSubmitButtonClicked = async (confirmedPassword: string) => {
    const {
      authorizedProtocolStore: {
        commit,
        contractId,
        interval,
      },
    } = this.props
    const message = hashVoteData(commit, interval)
    await this.props.publicAddressStore.getKeys(confirmedPassword)
    const arrayPromise = mobx.toJS(this.props.publicAddressStore.publicKeys).map(async item => {
      const { publicKey, path } = item
      const signature =
        await this.props.authorizedProtocolStore.signMessage(message, path, confirmedPassword)
      return [publicKey, new Data.Signature(signature)]
    })
    const data = await Promise.all(arrayPromise)
      .then((signatures) => new Data.DataList([
        new Data.UInt32(BigInteger.valueOf(interval)),
        new Data.String(commit),
        new Data.Dictionary(signatures)]))
      .catch(error => console.log(error))
    await this.props.runContractStore.run(confirmedPassword, payloadData(contractId, data, commit))
    if (this.props.runContractStore.status === 'success') {
      await this.setState({ hasVoted: true })
    }
  }

  get isSubmitButtonDisabled() {
    const { inprogress } = this.props.authorizedProtocolStore
    return inprogress || !this.isCommitValid
  }

  get isCommitValid() {
    const { commit } = this.props.authorizedProtocolStore
    return (commit.length === 40) && isValidHex(commit)
  }

  renderNoZP() {
    return (
      <Flexbox
        flexGrow={2}
        flexDirection="row"
        className={cx('form-response-message', 'warning')}
      >
        <FontAwesomeIcon icon={['far', 'exclamation-circle']} />
        <Flexbox flexDirection="column">
          <span> You did not have any ZP at the snapshot block</span>
          <span className="devider" />
          <p>Please go to
            <ExternalLink link={`https://${this.getLink}zp.io/governance`} > {this.getLink}zp.io/governance</ExternalLink> to see the ongoing results
          </p>
        </Flexbox>
      </Flexbox>
    )
  }

  renderTitle() {
    const isTest = this.props.networkStore.chain !== MAINNET
    return (
      <Flexbox flexDirection="column" className="repo-vote-container">
        <Flexbox className="page-title" flexDirection="column">
          <h1>Community Vote </h1>
          { isTest && <br /> }
          <h2> {isTest && <span className="orange" >You are currently casting a vote on the testnet.</span> }</h2>
          {isTest && <br /> }
          <h3 className="page-title">
            Coin holders can vote on future upgrades to the protocol.
            <br />
            To participate in a vote make sure your ZP is in your wallet before the snapshot block
            - the more ZP in your wallet, the higher the weight of your vote.
            <br />
            After the snapshot, do not forget to cast your vote prior to the tally block,
            else your vote will not count.
            <br />
            More info at
            <ExternalLink link={`https://${this.getLink}zp.io/governance`} > {this.getLink}zp.io/governance</ExternalLink>.
            <br />
          </h3>
          <Flexbox flexDirection="row" className="box-bar">
            { !this.state.isTally && <BoxLabel secondLine={this.props.txHistoryStore.snapshotBlock} firstLine="Snapshot Block" />}
            { this.state.isSnapshot && !this.state.isTally && <BoxLabel secondLine={this.props.authorizedProtocolStore.tallyBlock} firstLine="Tally block" />}
            { !this.state.isSnapshot && <BoxLabel secondLine={`${this.props.portfolioStore.zenDisplay} ZP `} firstLine="Potential Vote Weight" />}
            { !this.state.zeroBalance && this.state.isSnapshot && !this.state.isTally && <BoxLabel secondLine={`${kalapasToZen(this.props.authorizedProtocolStore.snapshotBalance)} ZP`} firstLine="ZP balance at Snapshot" />}
          </Flexbox>
        </Flexbox>
      </Flexbox>
    )
  }

  render() {
    const {
      authorizedProtocolStore: {
        commit, inprogress, contractId,
      },
    } = this.props
    if (this.state.hasVoted === undefined
      || this.state.isSnapshot === undefined
      || this.state.zeroBalance === undefined
      || this.state.isTally === undefined) {
      return (
        <Layout className="repo-vote">
          { this.renderTitle() }
          <Loading />
        </Layout>
      )
    }
    return (
      <Layout className="repo-vote">
        <Flexbox flexDirection="column" className="repo-vote-container">
          { this.renderTitle() }
          {!this.state.zeroBalance && this.state.isSnapshot &&
          !this.state.isTally && !this.state.hasVoted &&
          <Flexbox flexDirection="column" className="form-container">
            <Flexbox flexDirection="column" className="form-row">
              <label htmlFor="contractid">Contract ID</label>
              <Flexbox flexDirection="row" className="destination-address-input">
                <Flexbox flexDirection="column" className="full-width relative">
                  <input
                    id="contractId"
                    ref={ref('contractId').bind(this)}
                    name="contractId"
                    type="text"
                    value={contractId}
                    disabled
                  />
                </Flexbox>
              </Flexbox>
            </Flexbox>
            <Flexbox flexDirection="column" className="form-row">
              <label htmlFor="commit">Commit ID</label>
              <Flexbox flexDirection="row" className="destination-address-input">
                <Flexbox flexDirection="column" className="full-width relative">
                  <input
                    id="commit"
                    ref={ref('commit').bind(this)}
                    name="commit"
                    type="text"
                    placeholder="Commit identifier"
                    className={cx({ 'is-valid': this.isCommitValid, error: isEmpty(commit) ? false : !this.isCommitValid })}
                    onChange={this.onCommitChanged}
                    value={commit}
                    autoFocus
                  />
                  <IsValidIcon
                    isValid={this.isCommitValid}
                    className="input-icon"
                    hasColors
                    isHidden={!commit}
                  />
                  {this.renderCommitErrorMessage()}
                </Flexbox>
              </Flexbox>
            </Flexbox>
          </Flexbox>}
          <Flexbox flexDirection="row">
            {this.state.zeroBalance && this.state.isSnapshot &&
            !this.state.isTally && this.renderNoZP()}
            { this.renderSuccessResponse() }
            { this.renderErrorResponse() }
            { this.renderIntervalEnded() }
            { this.renderBeforeSnapshot() }
            <Flexbox flexGrow={2} />
            {!this.state.zeroBalance && !this.state.isTally &&
            this.state.isSnapshot && !this.state.hasVoted &&
            <Flexbox flexGrow={1} justifyContent="flex-end" flexDirection="row">
              <ProtectedButton
                className={cx('button-on-right', { loading: inprogress })}
                disabled={this.isSubmitButtonDisabled}
                onClick={this.onSubmitButtonClicked}
              >
                {inprogress ? 'Voting' : 'Vote'}
              </ProtectedButton>
            </Flexbox>}
          </Flexbox>
        </Flexbox>
      </Layout>
    )
  }
}

export default AuthorizedProtocol
