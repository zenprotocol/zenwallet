/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import InputRange from 'react-input-range'
import Flexbox from 'flexbox-react'
import { inject, observer } from 'mobx-react'

import 'react-input-range/lib/css/index.css'
import AmountInput from '../../../components/AmountInput/AmountInput'

@inject('cgpStore')
@observer
class AllocationForm extends Component {
  allocationChangeHandlerInput = value => {
    if (value.indexOf('.0') > -1) value = parseInt(value, 10)
    if (value % 0.5) value = parseInt(value, 10) + 0.5
    if (value > 50) value = 50
    this.props.cgpStore.updateAllocation(value)
  }
  allocationChangeHandler = value => {
    this.props.cgpStore.updateAllocation(value)
  }
  // eslint-disable-next-line no-unused-vars
  formatRangeLabels = (value, type) => (
    <span>
      {value} {'ZP'}
    </span>
  )
  render() {
    const {
      cgpStore: { allocation },
      disabled,
    } = this.props
    return (
      <Flexbox flexDirection="column" className="allocation-form">
        <Flexbox flexDirection="row" >
          <Flexbox flexDirection="column" className="form-row allocation-input-container" width="100%">

            <Flexbox flexDirection="column" className="slider-div" >

              <Flexbox flexDirection="row" justifyContent="space-between" className="word-labels">
                <Flexbox flexDirection="row">
                  <label>CGP Allocation</label>
                </Flexbox>
                <Flexbox flexDirection="row" justifyContent="flex-end">
                  <label>Miner Reward</label>
                </Flexbox>
              </Flexbox>

              <Flexbox flexDirection="column" height="25px">
                <div className="allocation-input">
                  <InputRange
                    disabled={disabled}
                    step={0.5}
                    maxValue={50}
                    minValue={0}
                    value={allocation}
                    onChange={this.allocationChangeHandler}
                    formatLabel={this.formatRangeLabels}
                  />
                </div>

              </Flexbox>

            </Flexbox>
          </Flexbox>
          <Flexbox flexDirection="column" className="form-row allocation-input-box" >
            <AmountInput
              amount={allocation >= 50 ? 50 : allocation}
              amountDisplay={allocation ? String(allocation) : ''}
              maxDecimal={1}
              minDecimal={0}
              maxAmount={50}
              shouldShowMaxAmount
              exceedingErrorMessage="Not Possible"
              onAmountDisplayChanged={this.allocationChangeHandlerInput}
              operationalAmount={0.5}
            />
          </Flexbox>
        </Flexbox>
      </Flexbox>
    )
  }
}

export default AllocationForm
