import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import Flexbox from 'flexbox-react'
import moment from 'moment'
import cx from 'classnames'
import * as mobx from 'mobx'
import { isEmpty } from 'lodash'

import CGPStore from '../../stores/CGPStore'
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
  cGPStore: CGPStore,
  networkStore: NetworkStore,
  voteStore: VoteStore
};

@inject('cGPStore', 'networkStore', 'voteStore')
@observer
class Allocation extends Component<Props, State> {
  state = {
    value: this.props.voteStore.pastAllocation || 1,
  }
  componentDidMount() {
    this.props.cGPStore.initPolling()
    this.props.networkStore.initPolling()
    this.props.voteStore.initPolling()
  }

  calcNextDistribution = () => {
    const { headers } = this.props.networkStore
    const { genesisTimestamp } = this.props.cGPStore
    const time = genesisTimestamp + (headers * 240000) // 360) * 86400000)
    return moment(new Date(time))
  }

  calcTimeRemaining = () => {
    const distribution = this.calcNextDistribution()
    const time = distribution - Date.now()
    const days = Math.floor(time / 86400000)
    const hours = Math.floor((time % 86400000) / 3600000)
    const minutes = Math.floor((time % 3600000) / 60000)
    const second = Math.floor((time % 60000) / 1000)
    return `${days} : ${hours} : ${minutes} : ${second}`
  }

  calcRemainingBlock = () => {
    const { headers } = this.props.networkStore
    return ((this.getNextDistribution(headers) + 1) * intervalLength) - headers
  }

  getNextDistribution = (headers) => Math.round((headers / intervalLength))

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
    const { allocationVote } = this.props.cGPStore
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
      <Flexbox className="allocation-input" flexDirection="column">
        <label className="allocation-title">How would you like to distribute the allocation?</label>
        <Flexbox flexDirection="column">
          <Flexbox flexDirection="row">
            <label className="top-left ">CGP</label>
            <label className="top-right">Mining Allocation</label>
          </Flexbox>
          <Flexbox flexDirection="row">
            <input
              type="range"
              value={this.state.value}
              min={0}
              max={100}
              onChange={this.handleChange.bind(this)}
              step={10}
              data-value={this.state.value / 100}
            />
            <span className="separator" />
            <ProtectedButton
              className={cx('allocation-button', { loading: inprogress })}
              disabled={this.isSubmitButtonDisabled}
              onClick={this.onSubmitButtonClicked}
            >
              {inprogress ? 'Voting' : 'Vote'}
            </ProtectedButton>
          </Flexbox>
          <Flexbox flexDirection="row">
            <label className="bottom-left">{this.state.value}%</label>
            <label className="bottom-right">{100 - this.state.value}%</label>
          </Flexbox>
        </Flexbox>
      </Flexbox>
    )
  }

  render() {
    const { totalAllocationAmountVoted, resultAllocation } = this.props.cGPStore
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
              <br />
              Allocation correction is capped to 15% (5% for the testnet) per interval.
              <br />
              Votes occur on a 10,000 block interval basis (100 blocks for the testnet).
              Funds which are diverted to the CGP can then
              be used to incentivize community initiatives.
            </h3>
            <hr />
            <span className="page-subtitle">
              Next Estimated Distribution : {this.calcNextDistribution().format('MMMM DD, YYYY')}
            </span>
          </Flexbox>
          <Flexbox flexDirection="row" className="form-row" >
            <BoxLabel
              firstLine={`${this.getOutstanding()} / ${kalapasToZen(zenCount)} ZP`}
              secondLine="Outstanding Vote"
              className={cx(outstanding !== 0 ? 'box-row' : 'box')}
            />
            <BoxLabel firstLine={this.calcTimeRemaining()} secondLine="Time remaining" />
            <BoxLabel firstLine={this.calcRemainingBlock()} secondLine="Blocks remaining" />
            <BoxLabel firstLine={`${totalAllocationAmountVoted ? kalapasToZen(totalAllocationAmountVoted) : 0} ZP`} secondLine="Voted for next distribution" />
            <BoxLabel
              firstLine="Current Allocation"
              secondLine={(
                <span className="form-row td">
                  <br />
                  <span className="dot off-white" /> Mining reward:
                  <span className="reward" > {100 - resultAllocation}%</span>
                  <span className="dot blue" /> CGP:
                  <span className="reward" >{resultAllocation}%</span>
                </span>)}
              className="box"
            />
          </Flexbox>
          <Flexbox flexDirection="row" className="form-row">
            { this.renderVote() }
            <Flexbox className="potential-outcome" flexDirection="column">
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
