// @flow

import swal from 'sweetalert'

import { postCheckPassword } from './api-service'

const passwordModal = async () => {
  const submittedPassword = await swal({
    title: 'Password required',
    content: {
      element: 'input',
      attributes: {
        placeholder: 'Type your password to continue',
        type: 'password',
      },
    },
  })
  if (!submittedPassword) {
    return
  }
  const isPasswordCorrect = await postCheckPassword(submittedPassword)
  if (!isPasswordCorrect) {
    await swal('Wrong passord!')
  } else {
    return submittedPassword
  }
}

export default passwordModal
