import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import autobind from 'class-autobind'
import {Link} from 'react-router-dom'
import Flexbox from 'flexbox-react'

import Container from '../UI/Container/Container'
import Main from '../UI/Main/Main'
import Topbar from '../UI/Topbar/Topbar'
import Sidebar from '../UI/Sidebar/Sidebar'
import Footer from '../UI/Footer/Footer'

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
            return (
                <Flexbox key={asset.asset}>
                    <div>{asset.asset}: </div>
                    <div>{asset.balance}</div>
                </Flexbox>
            )
        })

        return (
            <Container className="home">
                <Sidebar />
                  <Main>
                    <Topbar />
                      <Flexbox flexGrow={1}>
                        {balances}
                      </Flexbox>
                    <Footer/>
                  </Main>
            </Container>
        )
    }
}

export default Home
