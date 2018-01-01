import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import autobind from 'class-autobind'
import {Link} from 'react-router-dom'

import Container from '../UI/Container/Container'
import Main from '../UI/Main/Main'
import Topbar from '../UI/Topbar/Topbar'
import Footer from '../UI/Footer/Footer'

@inject('history')
@observer
class ActivateContract extends Component {
    constructor() {
        super()
        autobind(this)
    }

    onBackClicked(event) {
        this.props.history.goBack()
        event.preventDefault()
    }

    render() {
        return (
            <Container className="activate-contract">
                <Topbar/>
                <Main>
                    <h2>Activate Contract</h2>
                    <a href="#" onClick={this.onBackClicked}>Back</a>
                </Main>
                <Footer/>
            </Container>
        )
    }
}

export default ActivateContract
