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


type Props = {
  authorizedProtocolStore: AuthorizedProtocolStore,
  publicAddressStore: PublicAddressStore,
  runContractStore: RunContractStore
};

type State = {
  isSnapshot: boolean,
  isTally: boolean,
  hasVoted: boolean
};

@inject('authorizedProtocolStore', 'publicAddressStore', 'runContractStore', 'networkStore', 'txHistoryStore')
@observer
class AuthorizedProtocol extends Component<Props, State> {
  state = {
    hasVoted: undefined,
    isSnapshot:
      this.props.authorizedProtocolStore.networkStore.headers
      >= this.props.authorizedProtocolStore.txHistoryStore.snapshotBlock,
    isTally:
      this.props.authorizedProtocolStore.networkStore.headers
      > Number(this.props.authorizedProtocolStore.txHistoryStore.snapshotBlock) + Number(1000),
  }
  componentDidMount() {
    this.props.authorizedProtocolStore.getVote()
      .then(bool => this.setState({ hasVoted: bool }))
      .catch(error => console.error(error))
    this.props.publicAddressStore.fetch()
    this.props.authorizedProtocolStore.getSnapshotBalance()
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
    this.props.authorizedProtocolStore.getVote()
    return (
      <Flexbox
        flexGrow={2}
        flexDirection="row"
        className={cx('form-response-message', 'warning')}
      >
        <FontAwesomeIcon icon={['far', 'exclamation-circle']} />
        <Flexbox flexDirection="column">
          <span> Vote was successfully broadcast</span>
          <span className="devider" />
          <p>
            You voted for commit id {this.props.authorizedProtocolStore.votedCommit}{' '}
            with {this.props.authorizedProtocolStore.snapshotBalance ?
            this.format(this.props.authorizedProtocolStore.snapshotBalance) : 0} ZP.
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
            <ExternalLink link="https://zp.io/governance" > zp.io</ExternalLink> to see the results
          </p>
        </Flexbox>
      </Flexbox>
    )
  }
  renderBeforeSnapshot() {
    if (this.state.isSnapshot) return null
    const blockSnapshotNumber = this.props.authorizedProtocolStore.txHistoryStore.snapshotBlock
    return (
      <Flexbox
        flexGrow={2}
        flexDirection="row"
        className={cx('form-response-message', 'warning')}
      >
        <FontAwesomeIcon icon={['far', 'exclamation-circle']} />
        <Flexbox flexDirection="column">
          <p>{`Snapshot will take place at block ${blockSnapshotNumber}`}</p>
          <span className="devider" />
          <p>
            Your vote will consist of your total ZP at the snapshot
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

  renderTitle() {
    const blockSnapshotNumber = this.props.authorizedProtocolStore.txHistoryStore.snapshotBlock
    return (
      <Flexbox flexDirection="column" className="repo-vote-container">

        <Flexbox className="page-title" flexDirection="column">
          <h1>Community Vote</h1>
          <h3>
            Coin holders can influence protocol changes by taking a vote.
            <br />
            The more coins you have at the time of the snapshot,
            the higher the weight of your vote.
            <br />
            You can only vote once in every semester, a period of 6 months.
            <br />
            { this.state.isSnapshot && !this.state.isTally && !this.state.hasVoted &&
            <div>
              At block {blockSnapshotNumber}, we took a snapshot of your balance.
              <br />
              Your vote will consist
              of {kalapasToZen(this.props.authorizedProtocolStore.snapshotBalance)}
              ZP. You can vote only once until block {'  '}
              {Number(this.props.authorizedProtocolStore.txHistoryStore.snapshotBlock)
              + Number(1000)}.
            </div>}
          </h3>
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
    if (this.state.hasVoted === undefined) {
      return (
        <Layout className="repo-vote">
          { this.renderTitle() }
          { this.state.hasVoted }
          <Loading />
        </Layout>
      )
    }
    return (
      <Layout className="repo-vote">
        <Flexbox flexDirection="column" className="repo-vote-container">
          { this.renderTitle() }
          {this.state.isSnapshot && !this.state.isTally && !this.state.hasVoted &&
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
            { this.renderSuccessResponse() }
            { this.renderErrorResponse() }
            { this.renderIntervalEnded() }
            { this.renderBeforeSnapshot() }
            <Flexbox flexGrow={2} />
            {!this.state.isTally && this.state.isSnapshot && !this.state.hasVoted &&
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
