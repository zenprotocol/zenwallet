import swal from 'sweetalert'

import { errorReportingStore } from '../../stores'

const toggleUserIsOptedInUtil = async (nextValue) => {
  if (nextValue) {
    errorReportingStore.userOptsIn()
    await swal({
      text: 'Thank you for helping us improve zen wallet!',
      icon: 'success',
    })
    return
  }
  const optOut = await swal({
    title: 'Stop reporting errors?',
    icon: 'warning',
    text: 'Sending error reports is 100% Anonymous and helps us improve zen wallet for you and fellow users.',
    buttons: {
      continue: { text: 'Cancel', value: false, className: 'secondary' },
      stopSendingReports: 'Stop sending reports',
    },
    dangerMode: true,
  })
  if (!optOut) {
    return
  }
  await swal('Restart required', 'Please restart the app to stop sending error reports')
  errorReportingStore.userOptsOut()
}

export default toggleUserIsOptedInUtil
