import React, {Component} from 'react'
import autobind from 'class-autobind'
import {Link} from 'react-router-dom'
import Flexbox from 'flexbox-react'
import DevTools from 'mobx-react-devtools';

import Container from '../Container/Container'
import Main from '../Main/Main'
import Topbar from '../Topbar/Topbar'
import Sidebar from '../Sidebar/Sidebar'
import Footer from '../Footer/Footer'

class Layout extends Component {

    render() {

        return (
            <Container className="home">
                <Sidebar title="Zen Protocol" />
                  <Main>
                    <Topbar />
                      <Flexbox flexGrow={1}>
                          {this.props.children}
                      </Flexbox>
                    <Footer/>
                  </Main>
                {/* <DevTools /> */}
            </Container>
        )

    }
}

export default Layout
