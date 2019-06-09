// @flow

import * as React from 'react'
import Flexbox from 'flexbox-react'
import cx from 'classnames'

import Container from '../Container'
import Main from '../Main'
import Topbar from '../Topbar'
import Sidebar from '../Sidebar'
import Idle from '../../components/Idle'

type Props = {
  children: React.Node,
  className?: string
};

class Layout extends React.Component<Props> {
  render() {
    return (
      <Container className={cx('main', this.props.className)} >
        <Sidebar title="Zen Protocol" />
        <Idle />
        <Main>
          {/* $FlowIssue */ }
          <Topbar />
          <Flexbox flexDirection="column" flexGrow={1} className="content-container">
            {this.props.children}
          </Flexbox>
        </Main>
      </Container>
    )
  }
}

export default Layout
