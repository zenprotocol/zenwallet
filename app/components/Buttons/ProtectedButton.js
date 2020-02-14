// @flow
import React, { type Node } from 'react'
import { observer } from 'mobx-react'

import confirmPasswordModal from '../../services/confirmPasswordModal'

import enforceSyncedModal from './enforceSyncedModal'

type Props = {
  requireSync?: boolean,
  children: Node,
  onClick: (string, ?SyntheticEvent<HTMLButtonElement>) => void
};

@observer
class ProtectedButton extends React.Component<Props> {
  static defaultProps = {
    requireSync: true,
  }
  onClick = async (evt: SyntheticEvent<HTMLButtonElement>) => {
    evt.persist()
    const confirmedPassword = await protectedModals(this.props)
    if (!confirmedPassword) {
      return
    }
    this.props.onClick(confirmedPassword, evt)
  }

  render() {
    const { requireSync, children, ...remainingProps } = this.props
    return (
      <button {...remainingProps} onClick={this.onClick}>
        {children}
      </button>
    )
  }
}

export default ProtectedButton

export async function protectedModals({ requireSync } = {}) {
  if (requireSync) {
    console.log('entering require sync')
    const canContinue = await enforceSyncedModal()
    if (!canContinue) {
      return null
    }
  }
  console.log('passed require sync')
  const confirmedPassword = await confirmPasswordModal()
  if (!confirmedPassword) {
    return null
  }
  return confirmedPassword
}
