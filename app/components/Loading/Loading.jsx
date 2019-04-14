import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'

export default function Loading({ className, text, ...props }) {
  return (
    <div className={classNames('Loading text-center', className)} {...props}>
      <span>
        <FontAwesomeIcon icon={['far', 'spinner']} spin />
        {text}
      </span>
    </div>
  )
}

Loading.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
}

Loading.defaultProps = {
  text: ' Loading...',
}
