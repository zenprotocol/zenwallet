// @flow
/* eslint-disable react/no-danger */
import React from 'react'
import swal from 'sweetalert'
import ReactDOM from 'react-dom'
import markdownIt from 'markdown-it'
import { observer, inject } from 'mobx-react'
import Flexbox from 'flexbox-react'
import { ipcRenderer } from 'electron'

import { version as installedVersion } from '../../package.json'
import AutoUpdateStore from '../../stores/autoUpdateStore'
import { APP_DOWNLOAD_UPDATE } from '../../constants/autoUpdate'

const md = markdownIt({
  linkify: true,
  html: true,
})

type Props = {
  message: string,
  autoUpdateStore: AutoUpdateStore,
  version: string
};

function getModalNode(version: string, message: string, autoUpdateStore: AutoUpdateStore) {
  const wrapper = document.createElement('div')
  ReactDOM.render(<AppUpdateDownloadModal
    version={version}
    message={message}
    autoUpdateStore={autoUpdateStore}
  />, wrapper)
  return wrapper.firstChild
}

const appUpdateDownloadModal = (
  version: string,
  message: string,
  autoUpdateStore: AutoUpdateStore,
) => swal({
  title: 'Update available',
  button: false,
  content: getModalNode(version, message, autoUpdateStore),
})

@inject('autoUpdateStore')
@observer
class AppUpdateDownloadModal extends React.Component<Props> {
  askLater = () => {
    this.props.autoUpdateStore.setAutoUpdateCheckIntervalToDaily()
    swal.setActionValue({ cancel: true })
    swal.close()
  }

  downloadUpdate = () => {
    ipcRenderer.send(APP_DOWNLOAD_UPDATE)
    swal.close()
  }

  skipVersion = () => {
    this.props.autoUpdateStore.skipVersion(this.props.version)
    swal.setActionValue({ cancel: true })
    swal.close()
  }

  render() {
    const { message } = this.props
    const msgHTML = { __html: md.render(message) }
    return (
      <div className="app-update-modal">
        <p style={{ marginBottom: 25 }}>
          Version {this.props.version} is available. You have version {installedVersion}.
          Would you like to downloaded the update now?
        </p>
        <h2>Release Notes</h2>
        <br />
        <div style={{ marginBottom: 25 }} dangerouslySetInnerHTML={msgHTML} />
        <Flexbox flexDirection="row">
          <button
            className="secondary skip-version"
            onClick={this.skipVersion}
          >
            Skip version
          </button>
          <button
            className="secondary ask-later"
            onClick={this.askLater}
          >
            Ask later
          </button>
          <button className="download-update" onClick={this.downloadUpdate}>
           Download
          </button>
        </Flexbox>
      </div>
    )
  }
}

export default appUpdateDownloadModal
