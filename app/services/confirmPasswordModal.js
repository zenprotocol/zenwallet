// @flow

import swal from 'sweetalert'

import { networkState } from '../states'
import { MAINNET } from '../constants'

import { postCheckPassword } from './api-service'

const passwordModal = async () => {
  const submittedPassword = await submitPasswordModal()
  if (!submittedPassword) {
    await swal('You must insert a password')
  }
  const isPasswordCorrect = await postCheckPassword(submittedPassword)
  if (!isPasswordCorrect) {
    await swal('Wrong password!')
  } else {
    return submittedPassword
  }
}

export default passwordModal

function submitPasswordModal() {
  return swal({
    title: 'Password required',
    text: networkState.chain === MAINNET ? undefined : `Running on ${networkState.chain} chain`,
    content: {
      element: 'input',
      attributes: {
        placeholder: 'Type your password to continue',
        type: 'password',
      },
    },
  })
}
