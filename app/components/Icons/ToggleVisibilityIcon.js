import React from 'react'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

const ToggleVisibilityIcon = ({ shouldShow, ...rest }) => (
  <FontAwesomeIcon
    icon={['far', shouldShow ? 'eye' : 'eye-slash']}
    {...rest}
  />
)

ToggleVisibilityIcon.propTypes = {
  shouldShow: PropTypes.bool.isRequired,
}

export default ToggleVisibilityIcon
