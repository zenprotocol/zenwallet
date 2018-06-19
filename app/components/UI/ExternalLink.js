// @flow

import React from 'react'
import { shell } from 'electron'

type Props = {
  link: string,
  children: any
};

class ExternalLink extends React.Component<Props> {
  onClick = (evt: Object) => {
    evt.preventDefault()
    shell.openExternal(this.props.link)
  };

  render() {
    const { children, link, ...remainingProps } = this.props
    return (
      <a onClick={this.onClick} {...remainingProps}>
        {children}
      </a>
    )
  }
}

export default ExternalLink
