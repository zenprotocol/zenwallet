import path from 'path'
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Flexbox from 'flexbox-react'

@inject('loading')
@observer
class Loading extends Component {
  state = {
    loadingDotsClass: 'loading-dots display-none'
  }

  componentWillMount() {
    this.props.loading.load()
  }

  componentDidMount() {
    this.timeout = setTimeout(() => {
      this.setState({ loadingDotsClass: 'loading-dots' })
    }, 3650);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  render() {
    const { loadingDotsClass } = this.state

    const loadingGif = path.join('assets/img/loading.gif')
    const zenLogoGif = path.join('assets/img/zen-animated-logo.gif')

    return (
      <Flexbox flexDirection="column" className="loading-container">
        <Flexbox flexDirection="column" className="center">
          <img className="zen-logo" src={zenLogoGif} alt="Zen Protocol Logo" />
          <h1>Welcome to Zen Protocol</h1>
          <p>Loading, please wait</p>
          <img className={loadingDotsClass} src={loadingGif} alt="Loading Gif" />
        </Flexbox>
      </Flexbox>
    )
  }
}

export default Loading
