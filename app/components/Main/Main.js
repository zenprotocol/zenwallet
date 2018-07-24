// @flow

import * as React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import Flexbox from 'flexbox-react'

type Props = {
  className?: string,
  children: React.Node
}

class Main extends React.Component<Props> {
    render() {
      return (
        <Flexbox element="main"
          flexDirection="column"
          minHeight="100vh"
          className={cx('main inner-main', this.props.className)}
        >
        {this.props.children}
        </Flexbox>
      )
    }
}

export default Main
