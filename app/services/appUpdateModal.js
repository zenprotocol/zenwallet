// @flow
import { ipcRenderer } from 'electron'
import swal from 'sweetalert'

const QUIT_AND_INSTALL = 'quitAndInstall'
const appUpdateModal = async () => {
  const quitAndInstall = await swal({
    title: 'Zen wallet updater',
    text: 'A new version of the wallet has been downloaded. Would you like to quit and install?',
  })

  if (quitAndInstall) {
    ipcRenderer.send(QUIT_AND_INSTALL)
  }
}

export default appUpdateModal
