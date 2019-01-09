// @flow
import React from 'react'

type Props = {
  n: number
};

class Badge extends React.Component<Props> {
  get className() {
    const { n } = this.props
    if (n < 10) { return 'badge' }
    if (n < 100) { return 'badge two-digits' }
    if (n < 1000) { return 'badge three-digits' }
    if (n < 10000) { return 'badge four-digits' }
    return ''
  }
  render() {
    const { n } = this.props
    if (n === 0) {
      return null
    }
    return <span className={this.className}>{n}</span>
  }
}

export default Badge
