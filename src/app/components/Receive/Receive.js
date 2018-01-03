import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import autobind from 'class-autobind'
import {Link} from 'react-router-dom'
import Flexbox from 'flexbox-react'

import Layout from '../UI/Layout/Layout'

@inject('publicAddress')
@observer
class Receive extends Component {
    constructor() {
        super()
        autobind(this)
    }

    componentDidMount() {
        const {publicAddress} = this.props

        publicAddress.fetch()
    }

    render() {
        const {publicAddress} = this.props

        return (
            <Layout className="receive">
                <div>
                  Your Public Address: {publicAddress.address}
                </div>
            </Layout>
        )
    }
}

export default Receive
