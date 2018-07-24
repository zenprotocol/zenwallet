// @flow

import React, { Component } from 'react'
import cx from 'classnames'

type Props = {
  text?: string,
  className?: string,
  onClick: (evt?: SyntheticEvent<HTMLButtonElement>) => void
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
      >{text}
      </button>
    )
  }
}

export default ResetButton
