// @flow
import React from 'react'
import swal from 'sweetalert'
import ReactDOM from 'react-dom'
import markdownIt from 'markdown-it'

import ExternalLink from '../ExternalLink'

const md = markdownIt({
  linkify: true,
  html: true,
})

function getModalNode(url: string, message: string) {
  const wrapper = document.createElement('div')
  ReactDOM.render(<AppUpdateModal link={url} message={message} />, wrapper)
  return wrapper.firstChild
}

const appUpdateModal = (url: string, message: string) => swal({
  title: 'A new version of the wallet is available!',
  button: false,
  content: getModalNode(url, message),
})

type Props = {
  link: string,
  message: string
};

class AppUpdateModal extends React.Component<Props> {
  onDismiss = () => {
    swal.setActionValue({ cancel: true })
    swal.close()
  }

  onDownload = () => swal.close()

  render() {
    const { link, message } = this.props
    const html = md.render(message)
    console.log('html', html)
    const msgHTML = { __html: md.render(message) }
    return (
      <div className="update-message">
        <div className="align-left">
          <h2>Release Notes</h2>
          <br />
          <div style={{ marginBottom: 25}} dangerouslySetInnerHTML={ msgHTML } />
        </div>
        <button className="secondary" onClick={this.onDismiss}>Close</button>
        <button className="button-on-right" onClick={this.onDownload}>
          <ExternalLink link={link} style={{ color: 'white', textDecoration: 'none' }}>Download</ExternalLink>
        </button>
      </div>
    )
  }
}

export default appUpdateModal
