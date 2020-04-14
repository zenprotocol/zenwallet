// @flow

import React, { Component } from 'react'
import { Line } from 'rc-progress'
import Flexbox from 'flexbox-react'
import cx from 'classnames'

import { numberWithCommas } from '../../utils/helpers'

type Props = {
  currentBlock: number,
  snapshotBlock: number,
  votingIntervalLength: number,
  isNomination: boolean,
  isVotingInterval: boolean,
  className: string
};


class ProgressBar extends Component<Props> {
  static defaultProps = {
    // eslint-disable-next-line react/default-props-match-prop-types
    className: '',
  }

  getCurrentBlockInInterval = () => {
    const { currentBlock, votingIntervalLength } = this.props
    return currentBlock % votingIntervalLength
  }

  getPercentage = () => {
    const { votingIntervalLength, isVotingInterval, isNomination } = this.props
    if (!isVotingInterval && !isNomination) return 0
    const percentage = ((this.getCurrentBlockInInterval()) / votingIntervalLength) * 100
    if (percentage === 0) return 4
    if (percentage === 50) return 54
    return percentage
  }

  getBottomText = () => {
    const {
      votingIntervalLength, isNomination, isVotingInterval, currentBlock,
      snapshotBlock,
    } = this.props
    let nomination
    let vote
    let nominationStatus
    let voteStatus
    if (!isVotingInterval && !isNomination) {
      nomination = `${numberWithCommas(Math.abs(currentBlock - snapshotBlock))} blocks remains to Snapshot`
      nominationStatus = 'Closed'
      vote = `${numberWithCommas(Math.abs(currentBlock - (snapshotBlock + (votingIntervalLength / 2))))} blocks until Vote Phase`
      voteStatus = ''
    }
    if (isNomination) {
      nomination = `${numberWithCommas((votingIntervalLength / 2) - this.getCurrentBlockInInterval())} blocks remaining`
      nominationStatus = 'Open'
      vote = `${numberWithCommas((snapshotBlock + votingIntervalLength) - currentBlock)} blocks remain to tally`
      voteStatus = ''
    }
    if (!isNomination && isVotingInterval) {
      nomination = `Closed at block ${(snapshotBlock) + (votingIntervalLength / 2)}`
      nominationStatus = 'Passed'
      vote = `${(snapshotBlock + votingIntervalLength) - currentBlock} blocks remain to tally`
      voteStatus = 'Open'
    }
    return {
      nomination,
      vote,
      nominationStatus,
      voteStatus,
    }
  }

  render() {
    const {
      isNomination, isVotingInterval,
    } = this.props
    const isVote = isNomination || isVotingInterval
    const {
      nomination,
      vote,
      nominationStatus,
      voteStatus,
    } = this.getBottomText()
    return (
      <Flexbox className="container-bar" flexDirection="column" flexGrow={1} >
        <Flexbox flexDirection="row" justifyContent="space-between" className="word-labels">
          <Flexbox flexDirection="column">
            <label className="input-top">Nomination Phase</label>
            <label className="input-bottom">{nomination}</label>
          </Flexbox>
          <Flexbox flexDirection="column" justifyContent="flex-end">
            <label className="input-top end-input">Voting Phase</label>
            <label className="input-bottom end-input">{vote}</label>
          </Flexbox>
        </Flexbox>
        <span className="devider-vertical" />
        <Line
          percent={this.getPercentage()}
          strokeWidth="3"
          strokeColor={`${isVote ? '#2576ff' : '#D0D0D0'}`}
          trailWidth="3"
          trailColor="#1b1c1d"
          className={cx('progress-line ', this.props.className)}
          strokeLinecap="butt"
        />
        <Flexbox flexDirection="row" justifyContent="space-between" className="word-labels">
          <Flexbox flexDirection="column">
            <label className="input-bottom-inside">{nominationStatus}</label>
          </Flexbox>
          <Flexbox flexDirection="column" justifyContent="flex-end">
            <label className="input-bottom-inside">{voteStatus}</label>
          </Flexbox>
        </Flexbox>
      </Flexbox>
    )
  }
}

export default ProgressBar
