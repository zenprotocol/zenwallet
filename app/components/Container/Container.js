// @flow

import * as React from 'react'
import Flexbox from 'flexbox-react'
import cx from 'classnames'

type Props = {
  className?: string,
  children: React.Node
};

class Container extends React.Component<Props> {
  render() {
    return (
      <Flexbox className={cx('container', this.props.className)} >
        {this.props.children}
      </Flexbox>
    )
  }
}

export default Container
