// @flow
import React from 'react'
import swal from 'sweetalert'
import ReactDOM from 'react-dom'

import ExternalLink from '../ExternalLink'
import markdownIt from 'markdown-it'

const md = markdownIt({linkify: true})

function getModalNode(url: string, message: string) {
  const wrapper = document.createElement('div')
  ReactDOM.render(<AppUpdateModal link={url} message={message} />, wrapper)
  return wrapper.firstChild
}

const appUpdateModal = (url: string, message: string) => swal({
  title: 'Update',
  button: false,
  content: getModalNode(url, message),
})

type Props = {
    link: string,
    message:string
};

class AppUpdateModal extends React.Component<Props> {
  onDismiss = () => {
    swal.setActionValue({ cancel: true })
    swal.close()
  }

  onDownload = () => swal.close()

  render() {
    const { link, message } = this.props
    const msgHTML = { __html: md.render(message)}
    return (
      <div>
        <p style={{ marginBottom: 25 }}>
         A new version of the wallet is available!
        </p>
	<p>
	Notes:
	</p>
	<div style={{ marginBottom: 25}} dangerouslySetInnerHTML= { msgHTML } />
        <button className="secondary" onClick={this.onDismiss}>Close</button>
        <button className="button-on-right" onClick={this.onDownload}>
          <ExternalLink link={link} style={{ color: 'white', textDecoration: 'none' }}>Download</ExternalLink>
        </button>
      </div>
    )
  }
}

export default appUpdateModal
