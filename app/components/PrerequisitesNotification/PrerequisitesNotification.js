// @flow
import React from 'react'
import { ipcRenderer } from 'electron'

import { IPC_PREREQUISITES_CHECK_FAILED } from '../../utils/prereqCheck'

import prerequisitesModal from './PrerequisitesModal'

class PrerequisitesNotification extends React.Component<{}> {
  componentDidMount() {
    ipcRenderer.on(IPC_PREREQUISITES_CHECK_FAILED, () => {
      prerequisitesModal()
    })
  }

  render() {
    return null
  }
}

export default PrerequisitesNotification
