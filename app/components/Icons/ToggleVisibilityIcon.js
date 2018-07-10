import React from 'react'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import cx from 'classnames'

const ToggleVisibilityIcon = ({ shouldShow, className, ...rest }) => (
  <FontAwesomeIcon
    icon={['far', shouldShow ? 'eye-slash' : 'eye']}
    style={{ cursor: 'pointer' }}
    className={cx(className, 'toggle-input-visibility-icon')}
    {...rest}
  />
)

ToggleVisibilityIcon.propTypes = {
  shouldShow: PropTypes.bool.isRequired,
  className: PropTypes.string,
}
ToggleVisibilityIcon.defaultProps = {
  className: '',
}

export default ToggleVisibilityIcon
