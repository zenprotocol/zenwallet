// @flow
import React from 'react'
import swal from 'sweetalert'
import ReactDOM from 'react-dom'
import Flexbox from 'flexbox-react'
import { ipcRenderer } from 'electron'

import { APP_QUIT_AND_INSTALL } from '../../constants/autoUpdate'

type Props = {
  version: string
};

function getModalNode(version: string) {
  const wrapper = document.createElement('div')
  ReactDOM.render(<AppUpdateInstallModal version={version} />, wrapper)
  return wrapper.firstChild
}

const appUpdateInstallModal = (version: string) => swal({
  title: 'Install update',
  button: false,
  content: getModalNode(version),
})

class AppUpdateInstallModal extends React.Component<Props> {
  askLater = () => {
    swal.setActionValue({ cancel: true })
    swal.close()
  }

  quitAndInstall = () => {
    ipcRenderer.send(APP_QUIT_AND_INSTALL)
    swal.close()
  }

  render() {
    return (
      <div className="app-update-modal">
        <p style={{ marginBottom: 25 }}>
          Version {this.props.version} has been downloaded.
          Would you like to install the update now?
        </p>
        <Flexbox flexDirection="row">
          <button className="secondary ask-later" onClick={this.askLater} >
            Ask later
          </button>
          <button className="download-update" onClick={this.quitAndInstall}>
            Quit and Install
          </button>
        </Flexbox>
      </div>
    )
  }
}

export default appUpdateInstallModal
