// @flow
import React, { type Node } from 'react'
import { observer } from 'mobx-react'

import confirmPasswordModal from '../../services/confirmPasswordModal'

import enforceSyncedModal from './enforceSyncedModal'

type Props = {
  children: Node,
  onClick: (string) => void
};

@observer
class OfflineButton extends React.Component<Props> {
  onClick = async () => {
    const canContinue = await enforceSyncedModal()
    if (!canContinue) {
      return
    }
    const confirmedPassword = await confirmPasswordModal()
    if (!confirmedPassword) {
      return
    }
    this.props.onClick(confirmedPassword)
  }

  render() {
    const {
      children, ...remainingProps
    } = this.props
    return (
      <button {...remainingProps} onClick={this.onClick}>
        {children}
      </button>
    )
  }
}

export default OfflineButton
