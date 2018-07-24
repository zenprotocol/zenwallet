import swal from 'sweetalert'

import { secretPhraseStore } from '../../stores'

const logout = async () => {
  const shouldLogout = await swal({
    title: 'Confirm Logout',
    icon: 'warning',
    dangerMode: true,
    buttons: true,
  })
  if (shouldLogout) {
    secretPhraseStore.logout()
  }
}

export default logout
