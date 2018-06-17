// @flow
import React from 'react'

import { checkForUpdates } from './appUpdate'
import appUpdateModal from './AppUpdateModal'

const POLL_INTERVAL = 1000 * 5 * 60
const pollForUpdates = async () => {
  const updateLink = await checkForUpdates()
  if (!updateLink) {
    setTimeout(pollForUpdates, POLL_INTERVAL)
    return
  }
  await appUpdateModal(updateLink)
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
