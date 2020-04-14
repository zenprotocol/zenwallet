import React from 'react'
import ReactDropdown from 'react-dropdown'

import FontAwesomeIcon from '../../vendor/@fortawesome/react-fontawesome'

export default function Dropdown(props) {
  return (
    <ReactDropdown
      className="Dropdown"
      arrowClosed={<FontAwesomeIcon icon={['fas', 'caret-down']} />}
      arrowOpen={<FontAwesomeIcon icon={['fas', 'caret-up']} />}
      {...props}
    />
  )
}
