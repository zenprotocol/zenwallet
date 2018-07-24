// @flow

import React from 'react'
import cx from 'classnames'
import Flexbox from 'flexbox-react'

type Props = {
  className?: string
};

class Footer extends React.Component<Props> {
    static defaultProps = {
      className: '',
    }
    render() {
      return (
        <Flexbox
          justifyContent="flex-end"
          element="footer"
          height="30px"
          className={cx('footer', this.props.className)}
        >0 Peers
        </Flexbox>
      )
    }
}

export default Footer
