// @flow

import React from 'react'

type Props = {
  onScrollBottom: () => Promise<void>
};

type State = {
  isDisabled: boolean
};

class OnScrollBottom extends React.Component<Props, State> {
  state = {
    isDisabled: false,
  }
  componentDidMount() {
    window.addEventListener('scroll', this.onScroll)
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll)
    // $FlowFixMe
    clearTimeout(this.isDisabledTimeout)
  }
  isDisabledTimeout = null
  onScroll = () => {
    const { documentElement } = document
    if (!documentElement || this.state.isDisabled) { return }
    if (documentElement.scrollHeight !== window.scrollY + documentElement.clientHeight) {
      return
    }
    this.setState({ isDisabled: true }, () => {
      this.props.onScrollBottom()
      this.isDisabledTimeout = setTimeout(() => {
        this.setState({ isDisabled: false })
      }, 2000)
    })
  }
  render() {
    return null
  }
}

export default OnScrollBottom
