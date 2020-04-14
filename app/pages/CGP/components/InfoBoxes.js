// TODO show all info boxes, use props to know if before or during snapshot
/* eslint-disable react/prop-types */
// @flow

import React, { Component } from 'react'
import Flexbox from 'flexbox-react'
import { inject, observer } from 'mobx-react'

import BoxLabel from '../../../components/BoxLabel'
import { zenBalanceDisplay, zenDisplay } from '../../../utils/zenUtils'
import ProgressBar from '../../../components/ProgressBar/ProgressBar'

@inject('cgpStore', 'networkStore', 'portfolioStore')
@observer
class InfoBoxes extends Component {
  render() {
    const {
      cgpStore: {
        snapshotBlock,
        cgpCurrentZPBalance,
        assets,
        cgpCurrentAllocationZP,
        isNomination,
        isVotingInterval,
        votingIntervalLength,
      },
      networkStore: { blocks: currentBlock },
    } = this.props


    const allAssetsString = assets.reduce((all, cur) => {
      const currentDisplay = `${cur.name}: ${cur.balanceDisplay}`
      return !all ? currentDisplay : `${all}\n${currentDisplay}`
    }, [])
    return (
      <Flexbox flexDirection="row">
        <ProgressBar
          isNomination={isNomination}
          isVotingInterval={isVotingInterval}
          snapshotBlock={snapshotBlock}
          votingIntervalLength={votingIntervalLength}
          currentBlock={currentBlock}
        />
        {/* eslint-disable-next-line no-nested-ternary */}
        {isVotingInterval || isNomination ? (
          <BoxLabel
            firstLine="Vote Weight at Snapshot Block"
            secondLine={`${zenBalanceDisplay(this.props.cgpStore.snapshotBalanceAcc, 2)} ZP`}
            className="magnify"
          />
        ) : (
          <BoxLabel
            firstLine="Potential Vote Weight"
            secondLine={`${zenDisplay(this.props.portfolioStore.zen ? this.props.portfolioStore.zen.balance : 0, 2)} ZP`}
            className="magnify"
          />
        )}
        <BoxLabel
          title={allAssetsString}
          firstLine="CGP Current Allocation / CGP Balance"
          secondLine={`${cgpCurrentAllocationZP} ZP / ${zenDisplay(cgpCurrentZPBalance, 2)} ZP`}
          className="magnify"
        />
      </Flexbox>
    )
  }
}

export default InfoBoxes
