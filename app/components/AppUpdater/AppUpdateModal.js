// @flow
import React from 'react'
import swal from 'sweetalert'
import ReactDOM from 'react-dom'

function getModalNode(link: string) {
  const wrapper = document.createElement('div')
  ReactDOM.render(<AppUpdateModal link={link} />, wrapper)
  return wrapper.firstChild
}

const appUpdateModal = (link: string) => swal({
  title: 'Update',
  button: false,
  content: getModalNode(link),
})

type Props = {
  link: string
};

class AppUpdateModal extends React.Component<Props> {
  onDismiss = () => {
    swal.setActionValue({ cancel: true })
    swal.close()
  }

  onDownload = () => swal.close()

  render() {
    const { link } = this.props
    return (
      <div>
        <p style={{ marginBottom: 25 }}>
         A new version of the wallet is available!
        </p>
        <button className="secondary" onClick={this.onDismiss}>Close</button>
        <button className="button-on-right" onClick={this.onDownload} >
          <a href={link} style={{ color: 'white', textDecoration: 'none' }}>Download</a>
        </button>
      </div>
    )
  }
}

export default appUpdateModal
