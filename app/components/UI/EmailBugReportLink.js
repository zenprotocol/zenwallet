// @flow
import React from 'react'

import { BUG_REPORT_EMAIL } from '../../constants'

import ExternalLink from './ExternalLink'

type Props = {
  children?: any
};

const EmailBugReportLink = ({ children, ...remainingProps }: Props) => (
  <ExternalLink link={`mailto:${BUG_REPORT_EMAIL}`} {...remainingProps}>
    {console.log(children)}
    {children}
  </ExternalLink>
)

EmailBugReportLink.defaultProps = {
  children: BUG_REPORT_EMAIL,
}

export default EmailBugReportLink
