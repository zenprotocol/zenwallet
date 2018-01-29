import React,{Component} from 'react'
import {inject, observer} from 'mobx-react'
import autobind from 'class-autobind'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Flexbox from 'flexbox-react'

@inject('balance')
@inject('history')
@observer
class Header extends Component {
    constructor() {
        super()
        autobind(this)
    }

    static propTypes = {
        className: PropTypes.string
    }

    componentDidMount() {
        const {balance} = this.props
        balance.begin()
    }

    onBackClicked(event) {
        this.props.history.goBack()
        event.preventDefault()
    }

    render() {
        const {balance} = this.props

        const className = classnames('header', this.props.className)

        return (
            <Flexbox className={className} element="header" >
                <Flexbox className='back-buttons' width="100px">
                    <a onClick={this.onBackClicked}>&lsaquo;</a>
                </Flexbox>
                <Flexbox flexGrow={1}></Flexbox>
                <div className='balance'>
                  <div className='balance-and-ticker'>
                      <span className="total-balance">Total Balance</span>
                      <span className='zen-symbol'>ZENP</span>
                  </div>
                  <div className='account-balance'>{balance.zen.toLocaleString()}</div>
                </div>
            </Flexbox>
        )
    }
}

export default Header
