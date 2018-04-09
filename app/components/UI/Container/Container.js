import React, { Component } from 'react'
import Flexbox from 'flexbox-react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

class Container extends Component {
    static propTypes = {
      className: PropTypes.string,
    }

    render() {
      const className = classnames('container', this.props.className)

      return (
        <Flexbox className={className} >
          {this.props.children}
        </Flexbox>
      )
    }
}

export default Container
