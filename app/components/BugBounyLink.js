// @flow
import * as React from 'react'

import { BUG_BOUNTY_URL } from '../constants'

import ExternalLink from './ExternalLink'

type Props = {
  children?: React.Node
};

const BugBounyLink = ({ children, ...remainingProps }: Props) => (
  <ExternalLink link={BUG_BOUNTY_URL} {...remainingProps}>
    {children}
  </ExternalLink>
)

BugBounyLink.defaultProps = {
  children: BUG_BOUNTY_URL,
}

export default BugBounyLink
