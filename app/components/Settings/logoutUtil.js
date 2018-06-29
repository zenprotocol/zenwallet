import swal from 'sweetalert'

import { secretPhraseState } from '../../states'

const logout = async () => {
  const shouldLogout = await swal({
    title: 'Confirm Logout',
    icon: 'warning',
    dangerMode: true,
    buttons: true,
  })
  if (shouldLogout) {
    secretPhraseState.logout()
  }
}

export default logout
