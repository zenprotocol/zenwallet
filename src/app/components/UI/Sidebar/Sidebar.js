import React,{Component} from 'react'
import autobind from 'class-autobind'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'

class Sidebar extends Component {
    constructor() {
        super()
        autobind(this)
    }

    static propTypes = {
        className: PropTypes.string,
        title: PropTypes.string
    }

    static defaultProps = {
        title:'Zen Wallet'
    }

    render() {
        const {title} = this.props

        const className = classnames('sidebar', this.props.className)

        return (
          <nav className={className}>

              <header>
                <span></span>
                {title}
                <a></a>
              </header>

              <ul>
                <li><Link activeClassName='active' to="/">Home</Link></li>
                <li><Link activeClassName='active' to="/receive">Receive Funds</Link></li>
                <li><Link activeClassName='active' to="/send-tx">Send Tx</Link></li>
                <li><Link activeClassName='active' to="/activate-contract">Contract</Link></li>
                <li><a>Settings</a></li>
              </ul>

            </nav>
        )
    }
}

export default Sidebar
