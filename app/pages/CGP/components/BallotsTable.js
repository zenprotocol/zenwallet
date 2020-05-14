// @flow
import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import Flexbox from 'flexbox-react'
import cx from 'classnames'
import { toJS } from 'mobx'

import FontAwesomeIcon from '../../../vendor/@fortawesome/react-fontawesome'
import CgpStore from '../../../stores/cgpStore'
import NetworkStore from '../../../stores/networkStore'
import { truncateString, numberWithCommas } from '../../../utils/helpers'
import { protectedModals } from '../../../components/Buttons/ProtectedButton'
import enforceSyncedModal from '../../../components/Buttons/enforceSyncedModal'

import voteOnceModal from './voteOnceModal'


type Props = {
  cgpStore: CgpStore,
  networkStore: NetworkStore
};

@inject('cgpStore', 'networkStore')
@observer
class BallotsTable extends Component<Props> {
  ballotIdClickHandler = e => {
    this.props.cgpStore.updateBallotId(e.currentTarget.attributes['data-value'].value)
  }
  submitVote = async (ballot) => {
    this.props.cgpStore.updateBallotId(ballot)
    if (this.props.networkStore.isSyncing) {
      const canContinue = await enforceSyncedModal()
      if (!canContinue) {
        return
      }
    }
    const confirmedVoteOnce = await voteOnceModal()
    if (!confirmedVoteOnce) return
    // prevent enter from closing the new swal HACK
    setTimeout(async () => {
      try {
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
    }, 100)
  }

  renderRows() {
    const {
      popularBallots, candidates, isNomination, nominationVoted, payoutVoted,
      nominationVoteFetchStatus, payoutVoteFetchStatus, snapshotBalanceAcc,
    } = this.props.cgpStore
    const voted = isNomination ? nominationVoted : payoutVoted
    const shouldShow = !voted && snapshotBalanceAcc !== 0
    const status = isNomination ? nominationVoteFetchStatus : payoutVoteFetchStatus
    const j = {}
    toJS(popularBallots).items
      .forEach((x) => { j[x.ballot] = x.zpAmount })
    const aggregatedCandidate = {
      count: candidates.count,
      items: candidates.items.map(x => ({ ballot: x.ballot, zpAmount: j[x.ballot] || 0 })),
    }
    const ballots = isNomination ? popularBallots : aggregatedCandidate
    return ballots.items.map(ballot => (
      <Fragment key={`${ballot.ballot}`}>
        <tr onClick={this.ballotIdClickHandler} data-value={ballot.ballot} className="ballot-row">
          <td className="ballot-id">
            <div title={ballot.ballot}>{truncateString(ballot.ballot)}</div>
          </td>
          <td className="zp-voted">{numberWithCommas(Number(ballot.zpAmount).toFixed(2))}</td>
          {shouldShow &&
          <td className="align-right buttons">
            <button
              className={cx('button small play', {
                loading:
                  status.fetching,
              })}
              onClick={() => this.submitVote(ballot.ballot)}
            >
              {status.fetching
                ? 'Voting'
                : 'Vote'}
            </button>
          </td>}
        </tr>
        <tr className="separator" />
      </Fragment>
    ))
  }

  renderLoadingTransactions() {
    return (
      <tr className="loading-transactions">
        <td colSpan={5}>
          <Flexbox>
            <Flexbox flexGrow={1}>Loading ballots ...</Flexbox>
            <FontAwesomeIcon icon={['far', 'spinner-third']} spin />
          </Flexbox>
        </td>
      </tr>
    )
  }
  render() {
    const {
      fetchPopularBallots, popularBallots, fetchCandidates,
      candidates, isNomination, nominationVoted, payoutVoted,
      snapshotBalanceAcc,
    } = this.props.cgpStore
    const voted = isNomination ? nominationVoted : payoutVoted
    const shouldShow = !voted && snapshotBalanceAcc !== 0
    const fetch = isNomination ? fetchPopularBallots : fetchCandidates
    let ballot: { count: number, items: []} = { count: 0, items: [] }
    if (isNomination) {
      ballot = popularBallots
    } else {
      const j = {}
      toJS(popularBallots).items
        .forEach((x) => { j[x.ballot] = x.zpAmount })
      ballot = {
        count: candidates.count,
        items: candidates.items.map(x => ({ ballot: x.ballot, zpAmount: j[x.ballot] || 0 })),
      }
    }
    return (
      <div>
        <Flexbox>
          <table>
            <thead>
              <tr>
                <th className="align-left">Payout Ballot ID</th>
                <th className="align-left">ZP Voted</th>
                {shouldShow && <th className="align-right button-text">Action</th>}
              </tr>
              <tr className="separator" />
            </thead>
            <tbody>{this.renderRows()}</tbody>
          </table>
        </Flexbox>
        {ballot.count > 0 && ballot.items.length < ballot.count && (
          <button className="btn-link" onClick={fetch.bind(this.props.cgpStore)}>
            Load more
          </button>
        )}
      </div>
    )
  }
}

export default BallotsTable
