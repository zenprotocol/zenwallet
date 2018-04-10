import React from 'react'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import cx from 'classnames'

const IsValidIcon = ({ isValid, isHidden, ...rest }) => (
  <FontAwesomeIcon
    icon={['far', isValid ? 'check' : 'times']}
    className={cx({ 'display-none': isHidden })}
    {...rest}
  />
)

IsValidIcon.propTypes = {
  isValid: PropTypes.bool.isRequired,
  isHidden: PropTypes.bool,
}

IsValidIcon.defaultProps = {
  isHidden: false,
}

export default IsValidIcon
