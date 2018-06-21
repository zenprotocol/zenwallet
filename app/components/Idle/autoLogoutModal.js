import React from 'react'
import ReactDOM from 'react-dom'
import swal from 'sweetalert'

import withCountdown from '../../hocs/withCountdown'

const SECONDS_TIMEOUT = 3

const autoLogoutModal = () => swal({
  content: getModalNode(),
  button: false,
  title: 'Auto logout',
  icon: 'warning',
  timer: SECONDS_TIMEOUT * 1000,
})

export default autoLogoutModal

type Props = {
  secondsLeft: number
};

class AutoLogoutModal extends React.Component<Props> {
  onStayLoggedIn = () => {
    swal.setActionValue({ cancel: true })
    swal.close()
  }
  onLogout = () => swal.close()

  render() {
    const { secondsLeft } = this.props
    if (secondsLeft === 0) {
      return null
    }
    return (
      <div>
        <p style={{ marginBottom: 25 }}>
        Due to inactivity, you will be logged out in {secondsLeft} seconds.
        </p>
        <button className="secondary" onClick={this.onLogout}>Logout</button>
        <button
          className="button-on-right"
          onClick={this.onStayLoggedIn}
        >Stay logged in
        </button>
      </div>
    )
  }
}

const AutoLogoutModalWithCountdown = withCountdown(AutoLogoutModal)

function getModalNode() {
  const wrapper = document.createElement('div')
  ReactDOM.render(<AutoLogoutModalWithCountdown countdownSeconds={SECONDS_TIMEOUT} />, wrapper)
  return wrapper.firstChild
}
