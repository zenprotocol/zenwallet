import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import autobind from 'class-autobind'
import {Link} from 'react-router-dom'
import Flexbox from 'flexbox-react'

@inject('balance')
@observer
class Home extends Component {
    constructor() {
        super()
        autobind(this)
    }

    componentDidMount() {
        const {balance} = this.props

        balance.fetch()
    }

    render() {
        const {balance} = this.props

        const balances = balance.assets.map(asset => {
            if (asset.asset === '0000000000000000000000000000000000000000000000000000000000000000') {
              return (
                <div className='accountBalance'>1,500,000</div>
              )
            }
            return (
                <Flexbox key={asset.asset}>
                    <div>{asset.asset}: </div>
                    <div>{asset.balance}</div>
                </Flexbox>
            )
        })

        return (
          <div>yo</div>
        )
    }
}

export default Home
