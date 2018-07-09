// @flow

import React, { Component } from 'react'
import cx from 'classnames'

import IsValidIcon from '../../Icons/IsValidIcon'
import ToggleVisibilityIcon from '../../Icons/ToggleVisibilityIcon'

type Props = {
  value: string,
  isPerfect: boolean,
  isInvalid: boolean,
  isValid: boolean,
  isIncomplete: boolean,
  isDisabled: boolean,
  inputRef: () => {},
  onChange: () => {}
};

type State = {
  isVisible: boolean
};

class SeedInput extends Component<Props, State> {
  state = {
    isVisible: false,
  }
  toggleVisibility = () => {
    this.setState(state => ({
      isVisible: !state.isVisible,
    }))
  }
  render() {
    const {
      value, isPerfect, isInvalid, isValid, isIncomplete, isDisabled, onChange, inputRef,
    } = this.props
    const { isVisible } = this.state
    return (
      <li
        className={cx({
            perfect: isPerfect,
            invalid: isInvalid,
          })}
      >
        <input
          type={isVisible ? 'text' : 'password'}
          onChange={onChange}
          className={cx({
              perfect: isPerfect,
              invalid: isInvalid,
              valid: isValid,
              incomplete: isIncomplete,
             })}
          value={value}
          disabled={isDisabled}
          ref={inputRef}
        />
        <IsValidIcon
          isValid={isPerfect}
          isHidden={!isPerfect && !isInvalid}
        />
        <ToggleVisibilityIcon onClick={this.toggleVisibility} shouldShow={isVisible} />
      </li>
    )
  }
}

export default SeedInput
