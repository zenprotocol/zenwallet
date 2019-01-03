// @flow
import * as React from 'react'

import history from '../services/history'

type Props = {
  to: string,
  children: React.Node
};

const ToastLink = ({ to, children }: Props) => (
  <a className="toast-link" onClick={() => history.push(to)}>{children}</a>
)

export default ToastLink
