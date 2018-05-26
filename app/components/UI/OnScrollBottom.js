// @flow

import React from 'react'

type Props = {
  onScrollBottom: () => void
};

class OnScrollBottom extends React.Component<Props> {
  componentDidMount() {
    window.addEventListener('scroll', this.onScroll)
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  }
  onScroll = () => {
    // $FlowFixMe
    if (document.documentElement.scrollHeight ===
      // $FlowFixMe
      window.scrollY + document.documentElement.clientHeight) {
      this.props.onScrollBottom()
    }
  }
  render() {
    return null
  }
}

export default OnScrollBottom
