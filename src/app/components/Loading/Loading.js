import path from 'path'
import React, {Component} from 'react'
import autobind from 'class-autobind'
import Flexbox from 'flexbox-react'

class Loading extends Component {
  constructor(props) {
    super(props)
    autobind(this)
  }

  render() {
    const logoSrc = path.join(__dirname, '../../assets/img/zen_logo_big_no_text.png')
    const loadingGif = path.join(__dirname, '../../assets/img/loading.gif')

    return (
      <Flexbox flexDirection="column" className="loading-container">
        <Flexbox flexDirection="column" className="center">
          <img className='zen-logo' src={logoSrc} alt="Zen Protocol Logo" />
          <h1>Welcome to Zen Protocol</h1>
          <p>Loading, please wait a sec</p>
          <img className='loading-dots' src={loadingGif} alt="Loading Gif" />
        </Flexbox>
      </Flexbox>
    )
  }
}

export default Loading
