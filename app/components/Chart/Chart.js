import React from 'react'
import PropTypes from 'prop-types'
import ReactHighcharts from 'react-highcharts'

const COLORS = {
  text: '#f2f2f2',
  textGray: '#999999',
  border: '#333333',
  bg: '#0e0e0e',
}

const titleStyle = {
  color: COLORS.textGray,
  fontWeight: '400',
  fontFamily: 'Roboto',
}

export default function Chart(props) {
  ReactHighcharts.Highcharts.setOptions({
    lang: {
      thousandsSep: ',',
    },
    chart: {
      height: '50%',
      backgroundColor: 'transparent',
      borderWidth: 0,
      style: { color: COLORS.text },
    },
    plotOptions: {
      column: {
        borderWidth: 1,
        pointWidth: 5,
        borderColor: COLORS.bg,
        stacking: 'inverted',
      },
    },
    title: {
      style: { display: 'none' },
    },
    colors: ['#3384f3', '#f63d3d', '#50d166'],
    xAxis: {
      gridLineWidth: 0,
      tickWidth: 2,
      lineColor: COLORS.border,
      tickColor: COLORS.border,
      labels: {
        style: {
          color: COLORS.text,
          fontFamily: 'Roboto',
        },
      },
      title: {
        style: titleStyle,
      },
    },
    yAxis: {
      title: false,
      gridLineColor: COLORS.border,
      lineWidth: 0,
      tickWidth: 1,
      tickColor: '#000',
      labels: {
        style: {
          color: COLORS.text,
          fontFamily: 'Roboto',
        },
      },
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      style: {
        fontFamily: 'Roboto',
      },
    },
    credits: {
      enabled: false,
    },
  })
  return <ReactHighcharts config={props.config} />
}

Chart.propTypes = {
  // eslint-disable-next-line
  config: PropTypes.object.isRequired,
}
