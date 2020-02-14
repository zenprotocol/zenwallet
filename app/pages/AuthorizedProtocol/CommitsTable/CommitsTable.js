// @flow
import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import Flexbox from 'flexbox-react'

import FontAwesomeIcon from '../../../vendor/@fortawesome/react-fontawesome'
import AuthorizedProtocolStore from '../../../stores/authorizedProtocolStore'
import { numberWithCommas } from '../../../utils/helpers'

type Props = {
  authorizedProtocolStore: AuthorizedProtocolStore,
  onClick: () => {},
  isCandidate: boolean
};

@inject('authorizedProtocolStore')
@observer
class CommitsTable extends Component<Props> {
  onClickHandler = e => {
    this.props.onClick(e.currentTarget.attributes['data-value'].value)
  }
  renderRows() {
    const { popularCandidatesItems } = this.props.authorizedProtocolStore
    return popularCandidatesItems.map(data => (
      <Fragment key={`${data.commitId}`}>
        <tr onClick={this.onClickHandler} data-value={data.commitId} className="ballot-row">
          <td className="ballot-id">
            <div title={data.commitId}>{data.commitId}</div>
          </td>
          {this.props.isCandidate && <td className="zp-voted">{numberWithCommas(Number(data.zpAmount).toFixed(8))} ZP</td>}
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
    return (
      <div>
        <Flexbox>
          <table>
            <thead>
              <tr>
                <th className="align-left">Commit ID</th>
                {this.props.isCandidate && <th className="align-left">ZP Voted</th>}
              </tr>
              <tr className="separator" />
            </thead>
            <tbody>{this.renderRows()}</tbody>
          </table>
        </Flexbox>
      </div>
    )
  }
}

export default CommitsTable
