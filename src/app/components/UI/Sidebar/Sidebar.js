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
                <li><Link to="/">Home</Link></li>
                <li><a className="active">Wallet</a></li>
                <li><Link to="/receive">Receive Funds</Link></li>
                <li><Link to="/activate-contract">Contract</Link></li>
                <li><a>Transactions</a></li>
                <li><a>Explorer</a></li>
                <li><a>Oracles</a></li>
                <li><a>Settings</a></li>
              </ul>

            </nav>
        )
    }
}

export default Sidebar
