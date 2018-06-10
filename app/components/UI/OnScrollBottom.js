// @flow

import React from 'react'

type Props = {
  onScrollBottom: () => Promise<void>
};

class OnScrollBottom extends React.Component<Props> {
  componentDidMount() {
    window.addEventListener('scroll', this.onScroll)
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  }
  onScroll = () => {
    const { documentElement } = document
    if (!documentElement) { return }
    if (documentElement.scrollHeight === window.scrollY + documentElement.clientHeight) {
      this.props.onScrollBottom()
    }
  }
  render() {
    return null
  }
}

export default OnScrollBottom
