// @flow
/* eslint-disable react/no-unused-state */

import * as React from 'react'
import Checkbox from 'rc-checkbox'

const ToggleContext = React.createContext()

type Props = {
  isActive: boolean,
  onToggle: () => {}
};

type onlyChildrenProps = {
  children: React.Node
};

export default class Toggle extends React.Component<Props> {
  static Consumer = ToggleContext.Consumer
  static On = ({ children }: onlyChildrenProps) => (
    <Toggle.Consumer>
      {/* $FlowFixMe */}
      {({ isActive }) => (isActive ? children : null)}
    </Toggle.Consumer>
  )
  static Off = ({ children }: onlyChildrenProps) => (
    <Toggle.Consumer>
      {/* $FlowFixMe */}
      {({ isActive }) => (isActive ? null : children)}
    </Toggle.Consumer>
  )
  static Checkbox = ({ children }: onlyChildrenProps) => (
    <Toggle.Consumer>
      {/* $FlowFixMe */}
      {({ isActive, onToggle }) => (
        <label className="checkbox align-right">
          <Checkbox type="checkbox" checked={isActive} onChange={onToggle} />
          <span className="checkbox-text">{children}</span>
        </label>
      )}
    </Toggle.Consumer>
  )
  render() {
    const { isActive, onToggle, ...remainingProps } = this.props // eslint-disable-line no-unused-vars,max-len
    return <ToggleContext.Provider value={{ isActive, onToggle }} {...this.props} />
  }
}
