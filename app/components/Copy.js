// @flow
/* eslint-disable react/no-unused-state */
import randomstring from 'randomstring'
import * as React from 'react'
import { clipboard } from 'electron'
import cx from 'classnames'

const CopyContext = React.createContext()

type Props = {
  valueToCopy: ?string,
  timeoutMilliseconds?: number,
  children: React.Node
};

type State = {
  isActive: boolean,
  onCopy: () => {}
};

type ButtonProps = {
  className?: string,
  children?: React.Node
};

type ActiveMsgProps = {
  children: React.Node
};

class Copy extends React.Component<Props, State> {
  elInput: ?HTMLInputElement
  // $FlowIssue
  copyTimeout: TimeoutID
  static Consumer = CopyContext.Consumer
  static defaultProps = {
    valueToCopy: '',
    timeoutMilliseconds: 3500,
  }

  static Button = (props: ButtonProps) => (
    <Copy.Consumer>
      {/* $FlowFixMe */}
      {({ onCopy }) => (
        <button className={cx('copy-button', props.className)} onClick={onCopy} {...props}>{ props.children || 'Copy'}</button>
      )}
    </Copy.Consumer>
  )
  // $FlowFixMe
  static Input = (props) => (
    <Copy.Consumer>
      {/* $FlowFixMe */}
      {({
        onCopy,
        valueToCopy,
        inputId,
        parent,
      }) => (
        <input
          ref={el => { parent.elInput = el }}
          title="Click to copy to clipboard"
          id={inputId}
          type="text"
          onFocus={onCopy}
          readOnly
          value={valueToCopy}
          style={{ cursor: 'pointer' }}
          {...props}
        />
      )}
    </Copy.Consumer>
  )
  // $FlowFixMe
  static Label = ({ children, ...remainingProps }) => (
    <Copy.Consumer>
      {/* $FlowFixMe */}
      {({ inputId }) => (
        <label
          title="Click to copy to clipboard"
          htmlFor={inputId}
          {...remainingProps}
        >{children}
        </label>
      )}
    </Copy.Consumer>
  )
  static ActiveMsg = (props: ActiveMsgProps) => (
    <Copy.Consumer>
      {/* $FlowFixMe */}
      {({ isActive }) => isActive && props.children}
    </Copy.Consumer>
  )
  componentWillUnmount() {
    this.clearTimeout()
  }
  clearTimeout() {
    clearTimeout(this.copyTimeout)
  }
  onCopy = () => {
    this.clearTimeout() // in case of multiple onCopy events
    const { valueToCopy, timeoutMilliseconds } = this.props
    clipboard.writeText(valueToCopy)
    this.setState({ isActive: true })
    this.copyTimeout = setTimeout(this.setNonActive, timeoutMilliseconds)
    this.highlightInput()
  }
  highlightInput() {
    if (this.elInput) {
      this.elInput.select()
      // $FlowIssue
      this.elInput.focus()
    }
  }
  setNonActive = () => {
    this.setState({ isActive: false })
  }
  // this must come last, otherwise properties aren't initialized (this.onCopy)
  // eslint-disable-next-line react/sort-comp
  state = {
    isActive: false,
    /* $FlowFixMe */
    onCopy: this.onCopy,
  }
  render() {
    const { timeoutMilliseconds, valueToCopy, ...remainingProps } = this.props // eslint-disable-line max-len,no-unused-vars
    return (
      <CopyContext.Provider
        value={{
          ...this.state,
          valueToCopy,
          parent: this,
          inputId: randomstring.generate({ charset: 'abc' }),
        }}
        {...remainingProps}
      />
    )
  }
}

export default Copy
