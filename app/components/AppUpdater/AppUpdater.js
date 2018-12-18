// @flow
import React from 'react'

import { checkForUpdates } from './appUpdate'
import appUpdateModal from './AppUpdateModal'

const POLL_INTERVAL = 1000 * 5 * 60
const pollForUpdates = async () => {
  // $FlowFixMe
  const updateContent = await checkForUpdates()
  if (!updateContent) {
    setTimeout(pollForUpdates, POLL_INTERVAL)
    return
  }
  await appUpdateModal(updateContent.url, updateContent.message)
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
