import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Flexbox from 'flexbox-react'

import { LOADING_GIF_SRC, LOGO_GIF_SRC } from '../../constants/imgSources'

@inject('loading')
@observer
class Loading extends Component {
  state = {
    loadingDotsClass: 'loading-dots display-none',
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
    return (
      <Flexbox flexDirection="column" className="loading-container">
        <Flexbox flexDirection="column" className="center">
          <img className="zen-logo" src={LOGO_GIF_SRC} alt="Zen Protocol Logo" />
          <h1>Welcome to Zen Protocol</h1>
          <p>Loading, please wait</p>
          <img className={this.state.loadingDotsClass} src={LOADING_GIF_SRC} alt="Loading Gif" />
        </Flexbox>
      </Flexbox>
    )
  }
}

export default Loading
