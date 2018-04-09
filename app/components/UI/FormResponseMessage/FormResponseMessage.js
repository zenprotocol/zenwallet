import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Flexbox from 'flexbox-react'

class FormResponseMessage extends Component {
  static propTypes = {
    className: PropTypes.string,
  }
  state = {
    showFormMessage: false,
  }

  componentWillMount() {
    this.setState({ showFormMessage: true })
    this.formMsgTimeout = setTimeout(() => {
      this.setState({ showFormMessage: false })
    }, 15000);
  }

  componentWillUnmount() {
    clearTimeout(this.formMsgTimeout)
  }

  render() {
    const { showFormMessage } = this.state
    if (showFormMessage) {
      const className = classnames('form-response-message', this.props.className)
      return (
        <Flexbox flexGrow={1} flexDirection="row" className={className}>
          <i className="fa fa-check" />
          <Flexbox flexDirection="column">
            {this.props.children}
          </Flexbox>
        </Flexbox>
      )
    }
    return (null);
  }
}

export default FormResponseMessage
