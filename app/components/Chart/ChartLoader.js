import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import classNames from 'classnames'

import { kalapasToZen } from '../../utils/zenUtils'

import BarChart from './BarChart'

type Props = {
  chartName: string,
  externalChartData: [],
  externalChartLoading: boolean,
  current: []
};

const ChartConfigs = {
  currentVotes: {
    type: 'column',
    title: 'Possible Outcome',
    seriesTitle: 'Votes',
  },
}


const Mappers = {
  currentVotes(data) {
    return data.map(item => ({
      x: Number(item.amount),
      y: Number(kalapasToZen(item.count)),
    }))
  },
}
type State = {
  loading: boolean,
  data: []
};

class ChartLoader extends Component<Props, State> {
  state = {
    loading: false,
    data: [],
  }

  /**
   * data can come from state or an external object
   */
  get chartLoading() {
    return this.state.loading || this.props.externalChartLoading
  }

  get chartItems() {
    return this.state.data.length ? this.state.data : this.props.externalChartData || []
  }

  get optionalItem() {
    return this.props.current || []
  }

  render() {
    const { chartName } = this.props
    const chartConfig = ChartConfigs[chartName]
    if (!chartConfig) {
      return null
    }
    if (this.chartLoading) {
      return (
        <span>
          <i className="icon far fa-spinner-third zen-spin" />
          loading
        </span>)
    }
    if (this.chartItems.length === 0) {
      return null
    }

    let componentType = null
    switch (chartConfig.type) {
      case 'line':
      default:
        componentType = BarChart
        break
    }


    return (
      <div className={classNames('Chart')} >
        {React.createElement(componentType, {
          data: Mappers[chartName](this.chartItems),
          current: Mappers[chartName](this.optionalItem),
          ...chartConfig,
        })}
      </div>
    )
  }
}

export default withRouter(ChartLoader)
