// @flow

import * as React from 'react'
import cx from 'classnames'
import Flexbox from 'flexbox-react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

type Props = {
  className?: string,
  children: React.Node
};

type State = {
  showFormMessage: boolean
};

class FormResponseMessage extends React.Component<Props, State> {
  formMsgTimeout: TimeoutID
  componentWillMount() {
    this.setState({ showFormMessage: true })
    this.formMsgTimeout = setTimeout(() => {
      this.setState({ showFormMessage: false })
    }, 15000)
  }

  componentWillUnmount() {
    clearTimeout(this.formMsgTimeout)
  }

  render() {
    const { showFormMessage } = this.state
    if (!showFormMessage) {
      return null
    }
    return (
      <Flexbox
        flexGrow={1}
        flexDirection="row"
        className={cx('form-response-message', this.props.className)}
      >
        {this.props.className === 'error' ? <FontAwesomeIcon icon={['far', 'exclamation-triangle']} /> : <FontAwesomeIcon icon={['far', 'check']} />}
        <Flexbox flexDirection="column">
          {this.props.children}
        </Flexbox>
      </Flexbox>
    )
  }
}

export default FormResponseMessage
