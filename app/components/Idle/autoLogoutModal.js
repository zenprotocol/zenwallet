import React from 'react'
import ReactDOM from 'react-dom'
import swal from 'sweetalert'

// see issue https://github.com/t4t5/sweetalert/issues/836
const SECONDS_TIMEOUT = 15
let HACK_IS_SWAL_MOUNTED = false
let userWantsToStayLoggedIn = false
let timeout = null

const autoLogoutModal = async () => {
  clearTimeout(timeout)
  userWantsToStayLoggedIn = false
  HACK_IS_SWAL_MOUNTED = true
  await swal({
    content: getModalNode(),
    button: false,
    title: 'Auto logout',
    icon: 'warning',
    timer: SECONDS_TIMEOUT * 1000,
  })
  HACK_IS_SWAL_MOUNTED = false
  return userWantsToStayLoggedIn
}

export default autoLogoutModal

class ModalContents extends React.Component {
  state = {
    secondsCountdown: SECONDS_TIMEOUT,
    // secondsCountdown: 15,
  }
  componentDidMount() {
    this.decreaseSecond()
  }
  // This doens't get triggered, hence the use of HACK_IS_SECURITY_RISK_SWAL_MOUNTED
  // I'm leaving this here for documentation and in case in the future the author of swal
  // will fix this problem. see issue https://github.com/t4t5/sweetalert/issues/836
  componentWillUnmount() {
    clearTimeout(this.timeout)
  }
  decreaseSecond = () => {
    this.setState(({ secondsCountdown }) => ({
      secondsCountdown: secondsCountdown - 1,
    }), () => {
      if (!HACK_IS_SWAL_MOUNTED || this.state.secondsCountdown === 0) {
        return
      }
      timeout = setTimeout(this.decreaseSecond, 1000)
    })
  }
  onStayLoggedIn = () => {
    userWantsToStayLoggedIn = true
    swal.close()
  }
  onLogout = () => swal.close()

  render() {
    const { secondsCountdown } = this.state
    return (
      <div>
        <p style={{ marginBottom: 10 }}>
        Due to inactivity, you will be logged out in {secondsCountdown} seconds.
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

function getModalNode() {
  const wrapper = document.createElement('div')
  ReactDOM.render(<ModalContents />, wrapper)
  return wrapper.firstChild
}
