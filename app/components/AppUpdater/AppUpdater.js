// @flow
import React from 'react'

import { checkForUpdates } from '../../services/app-update'

import appUpdateModal from './AppUpdateModal'

const POLL_INTERVAL = 1000 * 5 * 60
const pollForUpdates = async () => {
  const updateLink = await checkForUpdates()
  if (updateLink) {
    const cancel = await appUpdateModal(updateLink)
    if (cancel) {
      setTimeout(pollForUpdates, POLL_INTERVAL)
    }
  } else {
    setTimeout(pollForUpdates, POLL_INTERVAL)
  }
}

class AppUpdater extends React.Component<{}> {
  componentDidMount() {
    pollForUpdates()
  }

  render() {
    return null
  }
}

export default AppUpdater
