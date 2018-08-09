// @flow

import swal from 'sweetalert'

import { networkStore } from '../stores'
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
    text: networkStore.chain === MAINNET ? undefined : `Running on ${networkStore.chain} chain`,
    content: {
      element: 'input',
      attributes: {
        placeholder: 'Type your password to continue',
        type: 'password',
      },
    },
  })
}
