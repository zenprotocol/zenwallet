import React,{Component} from 'react'
import autobind from 'class-autobind'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Flexbox from 'flexbox-react'

class FormResponseMessage extends Component {
  constructor() {
    super()
    this.state = {showFormMessage: false}
    autobind(this)
  }

  componentWillMount() {
    this.setState({showFormMessage: true})
    setTimeout(() => {
      this.setState({showFormMessage: false})
    }, 15000);
  }

  static propTypes = {
    className: PropTypes.string
  }

  render() {
    const {showFormMessage} = this.state
    if (showFormMessage) {
      const className = classnames('form-response-message', this.props.className)
      return (
        <Flexbox flexGrow={1} flexDirection="row" className={className}>
          <i className='fa fa-check'></i>
          <Flexbox flexDirection="column">
            {this.props.children}
          </Flexbox>
        </Flexbox>
      )
    } else {
      return (null);
    }
  }
}

export default FormResponseMessage
