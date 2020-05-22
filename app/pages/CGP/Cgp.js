/* eslint-disable react/prop-types */
// @flow

import React, { Component } from 'react'
import Flexbox from 'flexbox-react'
import { inject, observer } from 'mobx-react'
import cx from 'classnames'

import FontAwesomeIcon from '../../vendor/@fortawesome/react-fontawesome'
import { formatDisplay, getPayoutRecord, truncateString } from '../../utils/helpers'
import Layout from '../../components/Layout'
import Loading from '../../components/Loading'
import { protectedModals } from '../../components/Buttons/ProtectedButton'
import enforceSyncedModal from '../../components/Buttons/enforceSyncedModal'
import FormResponseMessage from '../../components/FormResponseMessage'
import { kalapasToZen, toDisplay } from '../../utils/zenUtils'
import ExternalLink from '../../components/ExternalLink'
import CopyableTableCell from '../../components/CopyableTableCell'
import { MAINNET } from '../../constants'

import AllocationForm from './components/AllocationForm'
import PayoutForm from './components/PayoutForm'
import InfoBoxes from './components/InfoBoxes'
import voteOnceModal from './components/voteOnceModal'
import BallotsTable from './components/BallotsTable'

@inject(
  'cgpStore',
  'publicAddressStore',
  'portfolioStore',
  'networkStore',
  'runContractStore',
  'authorizedProtocolStore',
)
@observer


class CGP extends Component {
  state = {
    inProgressAllocation: false,
    inProgressPayout: false,
    inProgressNomination: false,
  }
  componentDidMount() {
    this.props.cgpStore.resetStatuses()
    this.props.networkStore
      .fetch()
      .then()
      .catch()
    this.props.cgpStore.initPolling()
  }
  componentWillUnmount() {
    this.props.cgpStore.stopPolling()
  }

  resetPayoutForm = () => this.props.cgpStore.resetPayout()

  getSerializedPayout = () => this.props.cgpStore.serializeBallotIdOnChange()

  submitAllocationVote = async () => {
    if (this.props.networkStore.isSyncing) {
      const canContinue = await enforceSyncedModal()
      if (!canContinue) {
        return
      }
    }
    const confirmedVoteOnce = await voteOnceModal()
    if (!confirmedVoteOnce) return
    this.setState({ inProgressAllocation: true })
    // prevent enter from closing the new swal HACK
    setTimeout(async () => {
      try {
        const password = await protectedModals()
        if (password) {
          await this.props.cgpStore.submitAllocationVote(password)
        }
      } catch (error) {
        console.log(error.message)
      }
      this.setState({ inProgressAllocation: false })
    }, 100)
  }

  submitPayoutVote = async () => {
    if (this.props.networkStore.isSyncing) {
      const canContinue = await enforceSyncedModal()
      if (!canContinue) {
        return
      }
    }
    const confirmedVoteOnce = await voteOnceModal()
    if (!confirmedVoteOnce) return
    if (this.props.cgpStore.isNomination) this.setState({ inProgressNomination: true })
    else this.setState({ inProgressPayout: true })

    // prevent enter from closing the new swal HACK
    setTimeout(async () => {
      try {
        console.log('entering require sync')
        const password = await protectedModals()
        if (password) {
          if (this.props.cgpStore.isNomination) {
            await this.props.cgpStore.submitNominationVote(password)
          } else {
            await this.props.cgpStore.submitPayoutVote(password)
          }
        }
      } catch (error) {
        console.log(error.message)
      }
      if (this.props.cgpStore.isNomination) this.setState({ inProgressNomination: false })
      else this.setState({ inProgressPayout: false })
    }, 100)
  }

  renderAllocationErrorResponse() {
    const {
      statusAllocation: { status, errorMessage },
    } = this.props.cgpStore
    return <ErrorResponse type="allocation" hide={status !== 'error'} errorMessage={errorMessage} />
  }

  renderPayoutErrorResponse() {
    const {
      statusPayout: { status, errorMessage },
    } = this.props.cgpStore
    return <ErrorResponse type="payout" hide={status !== 'error'} errorMessage={errorMessage} />
  }

  renderAllocationSuccessResponse() {
    const { allocationVoted, pastAllocation, snapshotBalanceAcc } = this.props.cgpStore
    return (
      <SuccessResponse
        type="Allocation"
        hide={!allocationVoted}
        vote={pastAllocation}
        balance={snapshotBalanceAcc}
        currentInterval={this.props.cgpStore.currentInterval}
        chain={this.props.networkStore.chainUnformatted}
      />
    )
  }


  renderPayoutSuccessResponse() {
    const { payoutVoted, pastBallotId, snapshotBalanceAcc } = this.props.cgpStore
    return (
      <SuccessResponse
        type="Payout"
        hide={!payoutVoted}
        vote={pastBallotId}
        balance={snapshotBalanceAcc}
        chain={this.props.networkStore.chainUnformatted}
        currentInterval={this.props.cgpStore.currentInterval}
      />
    )
  }

  renderNominationSuccessResponse() {
    const { nominationVoted, pastBallotId, snapshotBalanceAcc } = this.props.cgpStore
    return (
      <SuccessResponse
        type="Payout"
        hide={!nominationVoted}
        vote={pastBallotId}
        balance={snapshotBalanceAcc}
        chain={this.props.networkStore.chainUnformatted}
        isNomination
        currentInterval={this.props.cgpStore.currentInterval}
      />
    )
  }

  renderVotingPhase() {
    const {
      cgpStore: {
        allocationValid,
        allocationVoted,
        allocationVoteFetchStatus,
        payoutVoted,
      },
    } = this.props
    return (
      <Flexbox>
        <Flexbox flexGrow={1} flexDirection="column">
          <Flexbox flexGrow={1} flexDirection="column" className="form-container">
            <section>
              <Flexbox className="section-title">
                <h1>Vote for CGP Payout</h1>
              </Flexbox>
              {this.renderPayoutSuccessResponse()}
              {!payoutVoted && this.renderPayoutForm()}
            </section>
          </Flexbox>
          <Flexbox flexGrow={1} flexDirection="column" className="form-container">
            <section>
              <Flexbox className="section-title">
                <h1>Vote for CGP Allocation</h1>
              </Flexbox>
              {this.renderAllocationSuccessResponse()}
              {!allocationVoted && (
                <React.Fragment>
                  <Flexbox
                    flexDirection="column"
                    className={cx('allocation-form-container', {
                      invalid: !allocationValid,
                      disabled: allocationVoted || this.state.inProgressAllocation,
                    })}
                  >
                    <AllocationForm
                      disabled={allocationVoted || this.state.inProgressAllocation}
                    />
                  </Flexbox>
                  <Flexbox justifyContent="space-between" flexDirection="row">
                    {this.renderAllocationErrorResponse()}
                    <Flexbox flexGrow={2} />
                    <button
                      className={cx('button-on-right', {
                        loading:
                          this.state.inProgressAllocation ||
                          allocationVoteFetchStatus.fetching,
                      })}
                      disabled={
                        this.state.inProgressAllocation ||
                        allocationVoteFetchStatus.fetching ||
                        allocationVoteFetchStatus.fetched ||
                        !allocationValid ||
                        allocationVoted
                      }
                      onClick={this.submitAllocationVote}
                    >
                      {this.state.inProgressAllocation || allocationVoteFetchStatus.fetching
                        ? 'Voting'
                        : 'Vote'}
                    </button>
                  </Flexbox>
                </React.Fragment>
              )}
            </section>
          </Flexbox>
        </Flexbox>
        <Flexbox className="form-container ballot-table-container">
          <section>
            <Flexbox flexDirection="column">
              <div className="section-title">
                <h1>Finalists Board</h1>
              </div>
              <div className="ballot-table">
                <BallotsTable onCLick={this.submitPayoutVote} />
              </div>
            </Flexbox>
          </section>
        </Flexbox>
      </Flexbox>
    )
  }

  renderPayoutForm() {
    const {
      cgpStore: {
        payoutValid,
        ballotIdValid,
        payoutHasData,
        payoutAmountGraterThenZero,
        nominationVoted,
        payoutVoted,
        nominationVoteFetchStatus,
        payoutVoteFetchStatus,
        isNomination,
      },
    } = this.props
    const voted = isNomination ? nominationVoted : payoutVoted
    const status = isNomination ? nominationVoteFetchStatus : payoutVoteFetchStatus
    const stateInProgress =
      isNomination ? this.state.inProgressNomination : this.state.inProgressPayout
    return (
      <React.Fragment>
        <Flexbox flexDirection="column" className="payout-form-container">
          <PayoutForm />
        </Flexbox>

        <Flexbox justifyContent="space-between" flexDirection="row">
          {this.renderPayoutErrorResponse()}

          <Flexbox flexGrow={2} />
          {isNomination &&
          <button
            className={cx('button-on-right', 'secondary')}
            disabled={
              !payoutHasData ||
              stateInProgress ||
              status.fetching
            }
            onClick={this.resetPayoutForm}
            hidden={voted}
          >
            Reset
          </button>}
          <button
            className={cx('button-on-right', {
              loading:
                stateInProgress || status.fetching,
            })}
            disabled={
              (!isNomination && !ballotIdValid) ||
              stateInProgress ||
              status.fetching ||
              status.fetched ||
              !payoutHasData ||
              (payoutHasData && !payoutValid) ||
              voted || payoutAmountGraterThenZero
            }
            onClick={this.submitPayoutVote}
            hidden={voted}
          >
            {stateInProgress || status.fetching
              ? 'Voting'
              : 'Vote'}
          </button>
        </Flexbox>
      </React.Fragment>
    )
  }

  renderNominationPhase() {
    const {
      cgpStore: {
        nominationVoted,
        snapshotBalanceAcc,
      },
    } = this.props
    return (snapshotBalanceAcc > 0 && (
    <Flexbox>
      <Flexbox flexGrow={1} flexDirection="column" className="form-container">
        <section>
          <Flexbox className="section-title">
            <h1>Propose a Payout Ballot</h1>
          </Flexbox>
          {this.renderNominationSuccessResponse()}
          {!nominationVoted && this.renderPayoutForm()}
        </section>
      </Flexbox>
      <Flexbox className="form-container ballot-table-container">
        <section>
          <Flexbox flexDirection="column">
            <div className="section-title">
              <h1>Nominees Board</h1>
            </div>
            <div className="ballot-table">
              <BallotsTable onCLick={this.submitPayoutVote} />
            </div>
          </Flexbox>
        </section>
      </Flexbox>
    </Flexbox>
    )
    )
  }

  renderNoZP() {
    const {
      cgpStore: {
        isNomination,
      },
      networkStore: {
        chain,
      },
    } = this.props
    return (
      <Flexbox>
        <Flexbox flexGrow={1} flexDirection="column" className="payout-form-container">
          <section>
            <MessageWithExplorerLink
              chain={chain}
              message={(
                <span>
                  You did not have any ZP at snapshot block.
                  <br />
                  Please make sure you have ZP in your wallet prior to the next snapshot.
                </span>
              )}
              showLink
              currentInterval={this.props.cgpStore.currentInterval}
            />
          </section>
        </Flexbox>
        <Flexbox className="form-container ballot-table-container">
          <section>
            <Flexbox flexDirection="column">
              <div className="section-title">
                <h1>{isNomination ? 'Nominees ' : 'Finalist'} board</h1>
              </div>
              <div className="ballot-table">
                <BallotsTable onCLick={this.submitPayoutVote} />
              </div>
            </Flexbox>
          </section>
        </Flexbox>
      </Flexbox>
    )
  }


  render() {
    const {
      cgpStore: {
        fetching,
        initialVotesFetchDone,
        isVotingInterval,
        isNomination,
        allocationVoted,
        payoutVoted,
        snapshotBalanceAcc,
        snapshotBalanceAccLoad,
      },
      networkStore: {
        chain,
      },
    } = this.props
    const link = chain === MAINNET ? '' : 'testnet.'
    return (
      <Layout className="cgp">
        <Flexbox flexDirection="column" className="send-tx-container">
          <Flexbox flexDirection="row" >
            <Flexbox flexDirection="column" className="page-title">
              <h1>Common Goods Pool</h1>
              <h3>
                Token holders can vote how to allocate part of the block reward to the CGP
                - a decentralized trust - and how the CGP will redistribute those funds.
                Please note that despite that the vote is conducted in two phases, a single
                snapshot will be taken before the first phase.
                Visit the

                <ExternalLink link={`https://${link}zp.io/cgp/${this.props.cgpStore.currentInterval}`} >
                  {' '}<span className="underline">Block Explorer</span>
                </ExternalLink>
                .
              </h3>
            </Flexbox>
          </Flexbox>
          <section>
            <InfoBoxes />
          </section>
          {!isVotingInterval && !isNomination && (
            <MessageWithExplorerLink
              chain={chain}
              showLink
              message={(
                <span className="full-width">
                  The voting period for the nominees will begin after the snapshot block.
                  <br />
                  Your vote weight will consist of your total ZP at the snapshot block.
                </span>
              )}
              currentInterval={this.props.cgpStore.currentInterval - 1}

            />
            )}

          {(isVotingInterval || isNomination) &&
            (!payoutVoted || !allocationVoted) &&
            ((!initialVotesFetchDone && fetching.votes) ||
              (!snapshotBalanceAccLoad.loaded && snapshotBalanceAccLoad.loading)) && (
              <Flexbox justifyContent="center">
                <Loading />
              </Flexbox>
            )}

          {(isVotingInterval || isNomination)
          && snapshotBalanceAccLoad.loaded
          && initialVotesFetchDone
          && (
            <React.Fragment>
              {snapshotBalanceAcc === 0 &&
                this.renderNoZP()
              }
              {snapshotBalanceAcc > 0 &&
                isNomination &&
              this.renderNominationPhase()}
              {snapshotBalanceAcc > 0 &&
                isVotingInterval &&
              this.renderVotingPhase()}
            </React.Fragment>
          )}
        </Flexbox>
      </Layout>
    )
  }
}

export default CGP

function ErrorResponse({ type, hide, errorMessage }) {
  if (hide) {
    return null
  }
  return (
    <FormResponseMessage className="error">
      <span>There was a problem with the {type} vote.</span>
      <span className="devider" />
      <p>Error message: {errorMessage}</p>
    </FormResponseMessage>
  )
}

function getBeLink(chain, interval, isNomination, type) {
  const link = chain === MAINNET ? '' : 'testnet.'
  if (isNomination) return `https://${link}zp.io/cgp/${interval}/Nomination/votes/nomination`
  if (type === 'Payout') return `https://${link}zp.io/cgp/${interval}/Vote/votes/payout`
  return `https://${link}zp.io/cgp/${interval}/Vote/votes/allocation`
}

function SuccessResponse({
  type, hide, vote, balance, isNomination = false, chain, currentInterval = '',
}) {
  const isPayout = type === 'Payout'
  let add
  let asset
  if (type === 'Payout') {
    const { address, assets } = getPayoutRecord(chain, vote)
    add = address
    asset = assets
  }

  if (hide) {
    return null
  }
  return (
    <Flexbox flexGrow={2} flexDirection="row" className={cx('form-response-message', 'success')}>
      <FontAwesomeIcon icon={['far', 'check']} />
      <Flexbox flexDirection="column">
        <span> {type} vote was successfully broadcast</span>
        <React.Fragment>
          {isPayout &&
          <p>You voted for Ballot ID:
            <CopyableTableCell string={vote} isSpan hideIcon className="underline" />,
            with a vote weight of {formatDisplay(balance)} ZP.
            <br />
            RecipientAddress: {truncateString(add)}
            <br />
            {asset}
          </p>}
          {!isPayout && !isNomination &&
            <p>
              You voted for {vote} Zp with a vote weight of {toDisplay((kalapasToZen(balance)))} ZP.
            </p>
          }
          <span className="devider" />
          <p>
            To see the ongoing results please visit the
            <ExternalLink link={getBeLink(`${chain}net`, currentInterval, isNomination, type)}>
              {' '}<span className="underline">Block Explorer</span>
            </ExternalLink>
            .
          </p>
        </React.Fragment>
      </Flexbox>
    </Flexbox>
  )
}

function MessageWithExplorerLink({
  chain, message, showLink = false, currentInterval = 0,
}) {
  const link = chain === MAINNET ? '' : 'testnet.'
  return (
    <Flexbox flexGrow={2} flexDirection="row" className={cx('form-response-message', 'warning')}>
      <FontAwesomeIcon icon={['far', 'exclamation-circle']} />
      <Flexbox flexDirection="column">
        <p>{message}</p>
        {showLink && (
          <React.Fragment>
            <span className="devider" />
            <p>
              To see the past results please visit the
              <ExternalLink link={`https://${link}zp.io/cgp/${currentInterval}`} >
                {' '}<span className="underline">Block Explorer</span>{' '}
              </ExternalLink>
              .
            </p>
          </React.Fragment>
        )}
      </Flexbox>
    </Flexbox>
  )
}
