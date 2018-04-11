import React from 'react'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import cx from 'classnames'

const IsValidIcon = ({
  isValid, isHidden, hasColors, className, ...rest
}) => (
  <FontAwesomeIcon
    icon={['far', isValid ? 'check' : 'times']}
    className={cx(className, { 'display-none': isHidden, error: hasColors && !isValid, valid: hasColors && isValid })}
    {...rest}
  />
)

IsValidIcon.propTypes = {
  isValid: PropTypes.bool.isRequired,
  hasColors: PropTypes.bool,
  isHidden: PropTypes.bool,
  className: PropTypes.string,
}

IsValidIcon.defaultProps = {
  isHidden: false,
  hasColors: false,
  className: '',
}

export default IsValidIcon
