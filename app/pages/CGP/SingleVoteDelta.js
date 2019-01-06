// @flow

import React, { Component } from 'react'
import { observer } from 'mobx-react'

import { kalapasToZen } from '../../utils/zenUtils'
import { truncateString } from '../../utils/helpers'

type Props = {
  vote: {
    recipient: string,
    amount: number,
    count: number
  }
};

@observer
class SingleVoteDelta extends Component<Props> {
  render() {
    const { vote } = this.props
    if (!vote) return
    const { recipient, amount, count } = vote
    return (
      <React.Fragment>
        <td>{recipient ? truncateString(recipient) : ''}</td>
        <td>{amount ? kalapasToZen(amount) : 0} ZP</td>
        <td>{count ? kalapasToZen(count) : 0} ZP</td>
      </React.Fragment>
    )
  }
}
export default SingleVoteDelta
