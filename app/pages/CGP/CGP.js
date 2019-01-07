// @flow

import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import Flexbox from 'flexbox-react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import cx from 'classnames'
import moment from 'moment'

import PasteButton from '../../components/PasteButton'
import { ref } from '../../utils/domUtils'
import Layout from '../../components/Layout/Layout'
import CGPStore from '../../stores/CGPStore'
import NetworkStore from '../../stores/networkStore'
import VoteStore from '../../stores/voteStore'
import BoxLabel from '../../components/BoxLabel/BoxLabel'
import IsValidIcon from '../../components/IsValidIcon'
import { isValidAddress, truncateString } from '../../utils/helpers'
import FormResponseMessage from '../../components/FormResponseMessage'
import AmountInput from '../../components/AmountInput'
import { ZENP_MAX_DECIMALS, ZENP_MIN_DECIMALS } from '../../constants'
import ProtectedButton from '../../components/Buttons'
import { kalapasToZen } from '../../utils/zenUtils'

import SingleVoteDelta from './SingleVoteDelta'


const intervalLength = 100


type Props = {
  cGPStore: CGPStore,
  networkStore: NetworkStore,
  voteStore: VoteStore
};

@inject('cGPStore', 'networkStore', 'voteStore')
@observer
class CGP extends Component<Props> {
  componentDidMount() {
    this.props.cGPStore.initPolling()
    this.props.networkStore.initPolling()
    this.props.voteStore.initPolling()
  }

  getNextDistribution = (headers) => Math.round((headers / intervalLength))

  calcNextDistribution = () => {
    const { headers } = this.props.networkStore
    const { genesisTimestamp } = this.props.cGPStore
    const time = genesisTimestamp + (headers * 240000) // 360) * 86400000)
    return moment(new Date(time))
  }

  calcTimeRemaining = () => {
    const time = this.calcNextDistribution() - Date.now()

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

  get isToInvalid() {
    const { payoutAddress } = this.props.voteStore
    return !!payoutAddress && payoutAddress.length && !isValidAddress(payoutAddress)
  }

  get isToValid() {
    const { payoutAddress } = this.props.voteStore
    return !!payoutAddress && (payoutAddress.length > 0) && isValidAddress(payoutAddress)
  }

  renderAddressErrorMessage() {
    if (this.isToInvalid) {
      return (
        <div className="error input-message">
          <FontAwesomeIcon icon={['far', 'exclamation-circle']} />
          <span>Destination Address is invalid</span>
        </div>
      )
    }
  }

  renderErrorResponse() {
    const { status, errorMessage } = this.props.voteStore
    if (status !== 'error') {
      return null
    }
    return (
      <FormResponseMessage className="error">
        <span>There was a problem with creating the vote.</span>
        <span className="devider" />
        <p>Error message: {errorMessage}</p>
      </FormResponseMessage>
    )
  }

  updateAmountDisplay = (amountDisplay) => {
    const { voteStore } = this.props
    voteStore.updateAmountDisplay(amountDisplay)
  }

  get areAllFieldsValid() {
    const { payoutAmount, payoutAddress } = this.props.voteStore
    return !!(payoutAmount && payoutAddress &&
      (payoutAmount <= this.props.cGPStore.fund) && this.isToValid)
  }

  get isSubmitButtonDisabled() {
    const { inprogress } = this.props.voteStore
    return inprogress || !this.areAllFieldsValid
  }

  updateAddressDisplay = (evt: SyntheticEvent<HTMLInputElement>) => {
    this.props.voteStore.payoutAddress = evt.currentTarget.value.trim()
  }

  onSubmitButtonClicked = async (confirmedPassword: string) => {
    this.props.voteStore.createPayoutVote(confirmedPassword)
  }
  onPasteClicked = (clipboardContents: string) => {
    this.props.voteStore.payoutAddress = clipboardContents
    // $FlowFixMe
    this.elTo.focus()
  }

  renderVote() {
    const {
      voteStore: { payoutAmount, payoutAddress, inprogress },
      cGPStore: { fund },
    } = this.props
    return (
      <Flexbox>
        <Flexbox className="vote-box" flexDirection="column" >
          <h3 className="vote-title">Vote for next distribution</h3>
          <Flexbox flexDirection="column" className="destination-address-input form-row">
            <label htmlFor="to">Destination Address</label>
            <Flexbox flexDirection="row" className="destination-address-input">

              <Flexbox flexDirection="column" className="full-width relative">
                <input
                  id="payoutAddress"
                  ref={ref('elTo').bind(this)}
                  name="payoutAddress"
                  type="text"
                  placeholder="Destination address"
                  className={cx({ 'is-valid': this.isToValid, error: this.isToInvalid })}
                  onChange={this.updateAddressDisplay}
                  value={payoutAddress}
                  autoFocus
                />
                <IsValidIcon
                  isValid={isValidAddress(payoutAddress)}
                  className="input-icon"
                  hasColors
                  isHidden={!payoutAddress}
                />
                {this.renderAddressErrorMessage()}
              </Flexbox>
              <PasteButton
                className="button-on-right"
                onClick={this.onPasteClicked}
              />
            </Flexbox>
          </Flexbox>
          <Flexbox flexDirection="column" className="form-row">
            <AmountInput
              amount={payoutAmount}
              amountDisplay={payoutAmount}
              maxDecimal={ZENP_MAX_DECIMALS}
              minDecimal={ZENP_MIN_DECIMALS}
              maxAmount={fund ? kalapasToZen(fund) : 0}
              shouldShowMaxAmount
              exceedingErrorMessage="Insufficient Funds"
              onAmountDisplayChanged={this.updateAmountDisplay}
              label="Amount"
              classname="amount"
            />
          </Flexbox>

          <Flexbox flexDirection="row" justifyContent="flex-end" className="form-row button-row">

            <ProtectedButton
              className={cx('button-on-right', { loading: inprogress })}
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

  onRowClicked = (vote) => {
    this.updateAmountDisplay(kalapasToZen(vote.amount))
    this.props.voteStore.payoutAddress = vote.recipient
  }

  renderRows() {
    const { cGPStore } = this.props
    return cGPStore.payoutVote.map((vote, index) => (
      <Fragment key={`${vote.recipient}-${index}`}>
        <tr onClick={this.onRowClicked.bind(this, vote)}>
          <SingleVoteDelta vote={vote} />
        </tr>
        <tr className="separator" />
      </Fragment>
    ))
  }

  getOutstanding = () => {
    const { pastPayout, outstanding, utilized } = this.props.voteStore
    if (pastPayout == null) {
      return kalapasToZen(utilized + outstanding)
    }
    return kalapasToZen(outstanding)
  }

  renderResult() {
    const { resultPayout } = this.props.cGPStore
    return (
      <Flexbox className="payout-result">
        <table>
          <thead>
            <tr>
              <th className="align-left">Proposal Address</th>
              <th className="align-left">Requested Amount</th>
            </tr>
            <tr className="separator" />
          </thead>
          { resultPayout &&
          <tbody>
            <td>{resultPayout.recipient ? truncateString(resultPayout.recipient) : ''}</td>
            <td>{resultPayout.amount ? kalapasToZen(resultPayout.amount) : 0} ZP</td>
          </tbody>}
        </table>
      </Flexbox>
    )
  }

  render() {
    const { fund, totalPayoutAmountVoted } = this.props.cGPStore
    const { outstanding, utilized } = this.props.voteStore
    const zenCount = Number(utilized) + Number(outstanding)
    return (
      <Layout className="GCP">
        <Flexbox flexDirection="column" className="CGP-container">
          <Flexbox className="page-title" justifyContent="space-between" flexDirection="column">
            <h1>Common Goods Pool</h1>
            <h3>
              Every 10,000 blocks funds are distributed from the CGP to the winning proposal
              (100 blocks for the testnet).
              Users can influence the outcome on a coin-weighted basis by voting on their
              preferred proposal prior to the end of the interval.
              <br />
              A proposal ‘ballot’ consists of both an <span className="bold">address</span> and an <span className="bold">amount</span>.
              Note that ‘ballots’ which pay to the same address
              but a different amount will be considered different ballots.
            </h3>
            <hr className="line-break" />
            <span className="page-subtitle">
              Next Distribution : {this.calcNextDistribution().format('MMMM DD, YYYY')}
            </span>
          </Flexbox>
          <Flexbox flexDirection="row" className="box-bar">
            <BoxLabel
              firstLine={`${this.getOutstanding()} / ${kalapasToZen(zenCount)} ZP`}
              secondLine="Outstanding Vote"
              className={cx(outstanding !== 0 ? 'box-row' : 'box')}
            />
            <BoxLabel firstLine={this.calcTimeRemaining()} secondLine="Time remaining" />
            <BoxLabel firstLine={`${fund ? kalapasToZen(fund) : 0} ZP`} secondLine="Available for next distribution" />
            <BoxLabel firstLine={`${totalPayoutAmountVoted ? kalapasToZen(totalPayoutAmountVoted) : 0} ZP`} secondLine="Voted for next distribution" />
            <BoxLabel firstLine={this.calcRemainingBlock()} secondLine="Blocks remaining" />
          </Flexbox>
          <Flexbox flexDirection="row" >
            <Flexbox flexDirection="column" flexGrow={1} >
              { this.renderVote() }
              { this.renderResult() }
            </Flexbox>
            <Flexbox className="active-proposal" flexGrow={1} >
              <table>
                <thead>
                  <tr>
                    <th className="align-left">Proposal Address</th>
                    <th className="align-left">Requested Amount</th>
                    <th className="align-left">Votes</th>
                  </tr>
                  <tr className="separator" />
                </thead>
                <tbody>
                  { !!this.props.cGPStore && this.renderRows() }
                </tbody>
              </table>
            </Flexbox>
          </Flexbox>
        </Flexbox>
      </Layout>
    )
  }
}

export default CGP
