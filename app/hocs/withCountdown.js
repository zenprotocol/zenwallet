import React from 'react'
import _ from 'lodash'

function withCountdown(Component) {
  type Props = {
    countdownSeconds: number,
    onCountdownOver?: () => void
  };
  type State = {
    secondsLeft: number
  };
  return class Wrapper extends React.Component<Props, State> {
    static defaultProps = {
      onCountdownOver: _.noop,
    }
    displayName = `withCountdown(${Component.displayName ||
      Component.name})`
    state = {
      secondsLeft: this.props.countdownSeconds,
    }
    componentDidMount() {
      this.timeout = setTimeout(this.tick, 1000)
    }
    componentWillUnmount() {
      clearTimeout(this.timeout)
    }
    get isCountdownOver() {
      return this.state.secondsLeft === 0
    }
    tick = () => {
      this.setState(({ secondsLeft }) => ({
        secondsLeft: secondsLeft - 1,
      }), () => {
        if (this.isCountdownOver) {
          this.props.onCountdownOver()
          return
        }
        this.timeout = setTimeout(this.tick, 1000)
      })
    }
    render() {
      const { onCountdownOver, countdownSeconds, ...remainingProps } = this.props
      return (
        <Component
          {...remainingProps}
          ref={this.ref}
          isCountdownOver={this.isCountdownOver}
          secondsLeft={this.state.secondsLeft}
        />
      )
    }
  }
}

export default withCountdown
