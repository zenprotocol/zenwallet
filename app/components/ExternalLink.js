// @flow

import * as React from 'react'
import { shell } from 'electron'

type Props = {
  link: string,
  children: React.Node
};

class ExternalLink extends React.Component<Props> {
  onClick = (evt: SyntheticEvent<HTMLAnchorElement>) => {
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
