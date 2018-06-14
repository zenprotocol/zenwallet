// @flow
import React from 'react'
import { ipcRenderer } from 'electron'

import appUpdateModal from '../../services/appUpdateModal'

class AppUpdater extends React.Component<{}> {
  componentDidMount() {
    ipcRenderer.on('updateReady', async (event, text) => {
      console.log(event, text)
      await appUpdateModal()
    })
  }
  render() {
    return null
  }
}

export default AppUpdater
