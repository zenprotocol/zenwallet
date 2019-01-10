import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import Flexbox from 'flexbox-react'
import moment from 'moment'
import cx from 'classnames'
import * as mobx from 'mobx'
import { isEmpty } from 'lodash'

import CgpStore from '../../stores/cgpStore'
import NetworkStore from '../../stores/networkStore'
import VoteStore from '../../stores/voteStore'
import Layout from '../../components/Layout/Layout'
import BoxLabel from '../../components/BoxLabel/BoxLabel'
import ProtectedButton from '../../components/Buttons'
import ChartLoader from '../../components/Chart'
import { kalapasToZen } from '../../utils/zenUtils'

const intervalLength = 100

type State = {
  value: number
};

type Props = {
  cgpStore: CgpStore,
  networkStore: NetworkStore,
  voteStore: VoteStore
};

@inject('cgpStore', 'networkStore', 'voteStore')
@observer
class Allocation extends Component<Props, State> {
  state = {
    value: this.props.voteStore.pastAllocation || 0,
  }
  componentDidMount() {
    this.props.cgpStore.initPolling()
    this.props.voteStore.initPolling()
  }
  componentWillUnmount() {
    this.props.cgpStore.stopPolling()
    this.props.voteStore.stopPolling()
  }

  calcNextDistribution = () => {
    const { headers } = this.props.networkStore
    const { genesisTimestamp } = this.props.cgpStore
    const time = genesisTimestamp + (headers * 240000) // 360) * 86400000)
    return moment(new Date(time))
  }

  calcTimeRemaining = () => {
    const time = this.calcRemainingBlock() * 4
    const days = Math.floor(time / (24 * 60))
    const hours = Math.floor((time - (days * 24 * 60)) / 60)
    const minutes = Math.floor(time - (days * 24 * 60) - (hours * 60))
    const dayAdded = days === 0 ? '' : `${days} ${days === 1 ? 'day,' : 'days,'}`
    const hourAdded = hours === 0 ? '' : `${hours} ${hours === 1 ? 'hour,' : 'hours,'}`
    return `${dayAdded} ${hourAdded}  ${minutes} minutes`
  }

  calcRemainingBlock = () => {
    const { headers } = this.props.networkStore
    return (this.getNextDistribution(headers) * intervalLength) - headers
  }

  getNextDistribution = (headers) => Math.ceil((headers / intervalLength))

  updateAmountDisplay = (amountDisplay) => {
    const { voteStore } = this.props
    voteStore.updateAmountDisplay(amountDisplay)
  }

  handleChange(event) {
    const value = event.currentTarget.value.trim()
    this.setState({ value: Number(value) })
    this.props.voteStore.allocationAmount = Number(value)
  }

  getOutstanding = () => {
    const { pastAllocation, outstanding, utilized } = this.props.voteStore
    if (pastAllocation == null) {
      return kalapasToZen(utilized + outstanding)
    }
    return kalapasToZen(outstanding)
  }

  onSubmitButtonClicked = async (confirmedPassword: string) => {
    this.props.voteStore.createAllocationVote(confirmedPassword)
  }

  get areAllFieldsValid() {
    const { allocationAmount } = this.props.voteStore
    return !!((allocationAmount > 0) &&
      (allocationAmount <= 100))
  }

  get isSubmitButtonDisabled() {
    const { inprogress } = this.props.voteStore
    return inprogress || !this.areAllFieldsValid
  }

  get getData() {
    const { allocationVote } = this.props.cgpStore
    if (!isEmpty(allocationVote)) {
      const updateVote = mobx.toJS(allocationVote)
      return updateVote
    }
    return [{
      amount: 0,
      count: 1,
    }]
  }

  renderVote() {
    const {
      voteStore: { inprogress },
    } = this.props
    return (
      <Flexbox className="allocation-input" flexDirection="column" flexGrow={2}>
        <label className="allocation-title">How would you like to distribute the allocation?</label>

        <Flexbox flexDirection="row">

          <Flexbox flexDirection="column" className="slider-div" width="100%">

            <Flexbox flexDirection="row" justifyContent="space-between" className="word-labels">
              <Flexbox flexDirection="row">
                <label>CGP</label>
              </Flexbox>
              <Flexbox flexDirection="row" justifyContent="flex-end">
                <label>Mining Allocation</label>
              </Flexbox>
            </Flexbox>

            <Flexbox flexDirection="row" height="25px">
              <input
                type="range"
                value={this.state.value}
                min={0}
                max={100}
                onChange={this.handleChange.bind(this)}
                step={10}
                data-value={this.state.value / 100}
              />
            </Flexbox>

            <Flexbox flexDirection="row" justifyContent="space-between" className="number-labels">
              <Flexbox flexDirection="row">
                <label>{this.state.value}%</label>
              </Flexbox>
              <Flexbox flexDirection="row" justifyContent="flex-end">
                <label>{100 - this.state.value}%</label>
              </Flexbox>
            </Flexbox>

          </Flexbox>

          <Flexbox flexDirection="row" className="button-div">
            <ProtectedButton
              className={cx('allocation-button', { loading: inprogress })}
              disabled={this.isSubmitButtonDisabled}
              onClick={this.onSubmitButtonClicked}
            >
              {inprogress ? 'Voting' : 'Vote'}
            </ProtectedButton>
          </Flexbox>

        </Flexbox>

      </Flexbox>
    )
  }

  render() {
    const { totalAllocationAmountVoted, resultAllocation } = this.props.cgpStore
    const { outstanding, utilized, pastAllocation } = this.props.voteStore
    const zenCount = Number(utilized) + Number(outstanding)
    return (
      <Layout className="allocation">
        <Flexbox flexDirection="column" className="allocation-container">
          <Flexbox className="page-title" flexDirection="column">
            <h1>Mining Allocation</h1>
            <h3>
              Vote for your preferred division of fund allocation
              between miners and the Common Goods Pool.
              Allocation correction is capped to 15% (5% for the testnet) per interval.
              Votes occur on a 10,000 block interval basis (100 blocks for the testnet).
              Funds which are diverted to the Cgp can then
              be used to incentivize community initiatives.
            </h3>
            <hr />
            <span className="page-subtitle">
              Next estimated allocation correction: {this.calcNextDistribution().format('MMMM DD, YYYY')}
            </span>
          </Flexbox>
          <Flexbox flexDirection="row" className="box-bar" >
            <BoxLabel
              firstLine={`${this.getOutstanding()} ZP / ${kalapasToZen(zenCount)} ZP`}
              secondLine="Outstanding votes"
              className={cx(outstanding !== 0 ? 'box-row' : 'box')}
            />
            <BoxLabel firstLine={this.calcTimeRemaining()} secondLine="Time remaining" />
            <BoxLabel firstLine={this.calcRemainingBlock()} secondLine="Blocks remaining" />
            <BoxLabel firstLine={`${totalAllocationAmountVoted ? kalapasToZen(totalAllocationAmountVoted) : 0} ZP`} secondLine="Votes for next distribution" />
            <BoxLabel
              firstLine="Current Allocation"
              secondLine={(
                <span className="form-row td">
                  <span className="dot blue" /> CGP:
                  <span className="reward" >{resultAllocation}%</span>
                  <span className="dot off-white" /> Mining allocation:
                  <span className="reward" > {100 - resultAllocation}%</span>
                </span>)}
              className="box"
            />
          </Flexbox>
          <Flexbox flexDirection="row">
            { this.renderVote() }
            <Flexbox className="potential-outcome" flexDirection="column" flexGrow={1}>
              <label className="allocation-title">Potential Outcome</label>
              <div className="bar-chart">
                <ChartLoader
                  chartName="currentVotes"
                  showTitle={false}
                  externalChartData={this.getData}
                  externalChartLoading={false}
                  handleChartClick={this.handleChange.bind(this)}
                  current={[{
                    amount: this.state.value,
                    count: pastAllocation === this.state.value ? outstanding : zenCount,
                  }]}
                  // TODO: add onclick event
                />
              </div>
            </Flexbox>
          </Flexbox>
        </Flexbox>
      </Layout>
    )
  }
}
export default Allocation
