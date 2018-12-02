// @flow
import React from 'react'
import swal from 'sweetalert'
import ReactDOM from 'react-dom'

import { isOsx, isWindows, isLinux } from '../../utils/platformUtils'
import ExternalLink from '../ExternalLink'
import { walletModeStore } from '../../stores'

function getModalNode() {
  const wrapper = document.createElement('div')
  ReactDOM.render(<PrerequisitesModal />, wrapper)
  return wrapper.firstChild
}

const prerequisitesModal = () => swal({
  title: 'Prerequisites',
  button: false,
  content: getModalNode(),
})

class PrerequisitesModal extends React.Component<*> {
  onDismiss = () => {
    swal.setActionValue({ cancel: true })
    swal.close()
  }

  runLightWallet = () => {
    walletModeStore.mode = 'Light'
    swal.close()
  }

  render() {
    const osxPrereqs =
    (
      <React.Fragment>
        <li>Install <ExternalLink link="http://www.mono-project.com/download/stable/#download-mac" style={{ color: 'white', textDecoration: 'none' }}>mono</ExternalLink>. If you choose to install via a package manager, add Mono's own repository first</li>
      </React.Fragment>

    )

    const linuxPrereqs =
    (
      <React.Fragment>
        <li>Install <ExternalLink link="https://www.mono-project.com/download/stable/#download-lin-ubuntu" style={{ color: 'white', textDecoration: 'none' }}>mono-devel</ExternalLink>. If you choose to install via a package manager, add Mono's own repository first.</li>
        <li>Install lmdb. The package name is liblmdb0 on Ubuntu and lmdb on Fedora. <code>sudo apt install liblmdb0</code></li>
      </React.Fragment>

    )
    const windowsPrereqs =
    (
      <React.Fragment>
        <li>Install <ExternalLink link="https://www.microsoft.com/en-us/download/details.aspx?id=55167">.NET Framework 4.7​</ExternalLink></li>
        <li>Install <ExternalLink link="https://github.com/zenprotocol/zen-prerequisites-nuget/raw/master/vc_redist.x64.exe">vc++ redist 2015 x64​</ExternalLink></li>
      </React.Fragment>
    )
    let osPrerequisites
    if (isOsx()) {
      osPrerequisites = osxPrereqs
    } else if (isLinux()) {
      osPrerequisites = linuxPrereqs
    } else if (isWindows()) {
      osPrerequisites = windowsPrereqs
    }

    return (
      <div className="update-message">
        <div className="swal-text">
          <div className="align-left">
            <h2>Please check the following prerequisites before running a full node.</h2>
            <ul>
              <li>You must be running a 64bit OS</li>
              {osPrerequisites}
            </ul>
          </div>
        </div>
        <div className="swal-text">
          Please close the app and rerun once you have met the prerequisites.
          If you are unable to meet these requirements, you may run a light wallet instead.
        </div>
        <div className="swal-content">
          <button className="button-on-right" onClick={this.runLightWallet}>Run Light Wallet </button>
        </div>
      </div>
    )
  }
}

export default prerequisitesModal
