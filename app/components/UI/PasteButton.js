// @flow

import React, { Component } from 'react'
import { clipboard } from 'electron'
import cx from 'classnames'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

type Props = {
  text?: string,
  className?: string,
  onClick: (any, any) => {}
};
class PasteButton extends Component<Props> {
  static defaultProps = {
    text: 'Paste',
    className: '',
  }
  onClick = (evt: any) => {
    this.props.onClick(clipboard.readText(), evt)
  }
  render() {
    const {
      onClick, className, text, ...remainingProps
    } = this.props
    return (
      <button
        className={cx('button secondary', className)}
        onClick={this.onClick}
        {...remainingProps}
      ><FontAwesomeIcon icon={['far', 'paste']} className="" /> {text}
      </button>
    )
  }
}

export default PasteButton
