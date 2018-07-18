// @flow

import React, { Component } from 'react'
import cx from 'classnames'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

type Props = {
  text?: string,
  className?: string,
  onClick: (any, any) => {}
};
class ResetButton extends Component<Props> {
  static defaultProps = {
    text: 'Reset',
    className: '',
  }
  render() {
    const {
      onClick, className, text, ...remainingProps
    } = this.props
    return (
      <button
        className={cx('button secondary', className)}
        onClick={onClick}
        {...remainingProps}
      ><FontAwesomeIcon icon={['far', 'trash']} /> {text}
      </button>
    )
  }
}

export default ResetButton
