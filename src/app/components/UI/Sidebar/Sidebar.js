import React,{Component} from 'react'
import moment from 'moment';
import path from 'path'
import {inject, observer} from 'mobx-react'
import autobind from 'class-autobind'
import {Link, NavLink} from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Flexbox from 'flexbox-react'

@inject('networkState')
@observer
class Sidebar extends Component {
  constructor() {
    super()
    autobind(this)
  }

  componentDidMount() {
    const {networkState} = this.props
    networkState.begin()
  }

  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string
  }

  static defaultProps = {
    title:'Zen Wallet'
  }

  renderNetworkStatus() {
    const {chain, blocks, headers, difficulty, medianTime} = this.props.networkState

    let blockchainTime
    let formattedBlockchainTime
    if (medianTime) {
      blockchainTime = new Date(medianTime)
      formattedBlockchainTime =  moment(blockchainTime).format('DD/MM/YYYY, HH:mm:ss');
    } else {
      formattedBlockchainTime = medianTime
    }

    if (blocks === 0) {
      return (
        <div className='network-status'>
          Loading...
        </div>
      )
    } else {
      return (
        <div className='network-status'>
          <div className="network-data-point">
            <span className='data-name'>Chain: </span>
            <span className='data-point'>{chain}</span>
          </div>
          <div className="network-data-point">
            <span className='data-name'>Blocks: </span>
            <span className='data-point'>{blocks.toLocaleString()}</span>
          </div>
          <div className="network-data-point">
            <span className='data-name'>Headers: </span>
            <span className='data-point'>{headers.toLocaleString()}</span>
          </div>
          <div className="network-data-point truncate">
            <span className='data-name'>Mining Difficulty: </span>
            <span className='data-point'>{difficulty}</span>
          </div>
          <div className="network-data-point">
            <span className='data-name' title='Median Time Past'>MTP: </span>
            <span className='data-point'>
              {formattedBlockchainTime}
            </span>
          </div>
        </div>
      )
    }


  }

  render() {
    const {title} = this.props
    const logoSrc = path.join(__dirname, '../../../assets/img/zen-logo.png')
    const className = classnames('sidebar', this.props.className)

    return (
      <nav className={className}>
        <div className='logo'>
          <Link to="/">
            <img src={logoSrc} alt="Zen Protocol Logo"/>
          </Link>
        </div>

        <div className='menu'>
          <ul>
            <li><NavLink activeClassName={'active'} to="/portfolio">Portfolio</NavLink></li>
            <li><NavLink activeClassName={'active'} to="/send-tx">Send</NavLink></li>
            <li><NavLink activeClassName={'active'} to="/receive">Receive</NavLink></li>

            <li><NavLink activeClassName={'active'} to="/acs">Explore Contracts</NavLink></li>
            <li><NavLink activeClassName={'active'} to="/activate-contract">Upload Contract</NavLink></li>

            <li><NavLink activeClassName={'active'} to="/run-contract">Run Contract</NavLink></li>
            <li><NavLink activeClassName={'active'} to="/saved-contracts">My Saved Contracts</NavLink></li>

            <li><NavLink exact activeClassName={'active'} to="/">Claim Crowdsale Tokens</NavLink></li>

            {/* <li><NavLink activeClassName={'active'} to="/secret-phrase">Secret Phrase</NavLink></li> */}
            {/* <li><NavLink activeClassName={'active'} to="/loading">Loading</NavLink></li> */}
            <li className='settings'><a>Settings</a></li>
          </ul>
        </div>

        {this.renderNetworkStatus()}

      </nav>
    )
  }
}

export default Sidebar
