import path from 'path'
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import autobind from 'class-autobind'
import Flexbox from 'flexbox-react'

@inject('loading')
@observer
class Loading extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loadingDotsClass: 'loading-dots display-none'
    }

    autobind(this)
  }

  componentWillMount() {
    this.props.loading.load()
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ loadingDotsClass: 'loading-dots' })
    }, 3650);
  }

  render() {
    const { loadingDotsClass } = this.state

    const logoSrc = path.join('assets/img/zen_logo_big_no_text.png')
    const loadingGif = path.join('assets/img/loading.gif')
    const zenLogoGif = path.join('assets/img/zen-animated-logo.gif')

    return (
      <Flexbox flexDirection="column" className="loading-container">
        <Flexbox flexDirection="column" className="center">
          <img className="zen-logo" src={zenLogoGif} alt="Zen Protocol Logo" />
          <h1>5</h1>
          <p>Loading, please wait</p>
          <img className={loadingDotsClass} src={loadingGif} alt="Loading Gif" />
        </Flexbox>
      </Flexbox>
    )
  }
}

export default Loading