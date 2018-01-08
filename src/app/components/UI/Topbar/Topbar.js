import React,{Component} from 'react'
import autobind from 'class-autobind'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Flexbox from 'flexbox-react'

class Header extends Component {
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

        const className = classnames('header', this.props.className)

        return (
            <Flexbox className={className} element="header" >
                <Flexbox className='back-buttons' width="100px">
                    <button>Back</button>
                </Flexbox>
                <Flexbox flexGrow={1}></Flexbox>
                <div className='balance'>
                  <div className='balance-and-ticker'>
                      <span class="total-balance">Total Balance</span>
                      <span className='zen-symbol'>ZENP</span>
                  </div>
                  <div className='account-balance'>1,500,000</div>
                </div>
            </Flexbox>
        )
    }
}

export default Header
