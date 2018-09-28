// @flow
import { observer, inject } from 'mobx-react'
import React from 'react'
import swal from 'sweetalert'
import { ipcRenderer } from 'electron'

import AutoUpdateStore from '../../stores/autoUpdateStore'
import {
  APP_UPDATE_AVAILABLE, APP_UPDATE_DOWNLOADED,
  APP_UPDATE_NOT_AVAILABLE,
  APP_IDLE, APP_UPDATE_ERROR,
} from '../../constants/autoUpdate'

import appUpdateDownloadModal from './AppUpdateDownloadModal'
import appUpdateInstallModal from './AppUpdateInstallModal'

type Props = {
  autoUpdateStore: AutoUpdateStore
};

type UpdateInfo = {
  version: string,
  files: Array<*>,
  releaseName: string,
  releaseNotes: string,
  releaseDate: string,
  stagingPercentage: number
};
const APP_UPDATE_ERROR_MESSAGE = 'An error occured while checking for updates. Please try again later'
const APP_UPDATE_NOT_AVAILABLE_MESSAGE = 'You are up to date'

@inject('autoUpdateStore')
@observer
class AppUpdater extends React.Component<Props> {
  componentDidMount() {
    const { autoUpdateStore } = this.props
    ipcRenderer.on(APP_UPDATE_AVAILABLE, (event: *, info: UpdateInfo) => {
      if (autoUpdateStore.autoUpdateSkipVersion !== info.version) {
        appUpdateDownloadModal(info.version, info.releaseNotes, autoUpdateStore)
      }
      autoUpdateStore.autoUpdateStatus = APP_IDLE
    })

    ipcRenderer.on(APP_UPDATE_DOWNLOADED, (event, info) => {
      appUpdateInstallModal(info.version)
      autoUpdateStore.autoUpdateStatus = APP_IDLE
    })

    ipcRenderer.on(APP_UPDATE_NOT_AVAILABLE, () => {
      if (!autoUpdateStore.autoUpdateEnabled) {
        swal({
          text: APP_UPDATE_NOT_AVAILABLE_MESSAGE,
          icon: 'info',
        })
      }
      autoUpdateStore.autoUpdateStatus = APP_IDLE
    })

    ipcRenderer.on(APP_UPDATE_ERROR, () => {
      if (!autoUpdateStore.autoUpdateEnabled) {
        swal({
          text: APP_UPDATE_ERROR_MESSAGE,
          icon: 'error',
        })
      }
      autoUpdateStore.autoUpdateStatus = APP_IDLE
    })
  }

  render() {
    return null
  }
}

export default AppUpdater
