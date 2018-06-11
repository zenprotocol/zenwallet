import React from 'react'
import { shallow } from 'enzyme'

import withCountdown from '../withCountdown'

describe('withCountdown', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  it('mounts with right props', () => {
    const countdownSeconds = 2
    const onCountdownOver = jest.fn()
    const testProp = true
    const childComponentWrapper = mountComponent({ countdownSeconds, onCountdownOver, testProp })
    expect(onCountdownOver).not.toBeCalled()
    expect(childComponentWrapper.props()).toMatchObject({
      isCountdownOver: false,
      secondsLeft: countdownSeconds,
      testProp,
    })
  })
  // TODO AdGo - 11/06/2018 - Timers aren't being called
  // remove "skip" flag after fixing
  it.skip('updates on tick', () => {
    const countdownSeconds = 2
    const onCountdownOver = jest.fn()
    const childComponentWrapper = mountComponent({ countdownSeconds, onCountdownOver })
    jest.runOnlyPendingTimers()
    expect(onCountdownOver).toHaveBeenCalledTimes(1)
    expect(childComponentWrapper.props()).toMatchObject({
      isCountdownOver: false,
      secondsLeft: countdownSeconds - 1,
    })
  })
  // TODO AdGo - 11/06/2018 - Timers aren't being called
  // remove "skip" flag after fixing
  it.skip('updates on countdown finishes', () => {
    const countdownSeconds = 1
    const onCountdownOver = jest.fn()
    const childComponentWrapper = mountComponent({ countdownSeconds, onCountdownOver })
    jest.runOnlyPendingTimers()
    expect(onCountdownOver).toHaveBeenCalledTimes(1)
    expect(childComponentWrapper.props()).toMatchObject({
      isCountdownOver: true,
      secondsLeft: 0,
    })
  })
  it('calls clearTimeout on unmount', () => {
    const countdownSeconds = 1
    const onCountdownOver = jest.fn()
    const spy = jest.spyOn(global, 'clearTimeout')
    const childComponentWrapper = mountComponent({ countdownSeconds, onCountdownOver })
    expect(spy).toHaveBeenCalledTimes(0)
    childComponentWrapper.unmount()
    expect(spy).toHaveBeenCalledTimes(1)
    spy.mockRestore()
  })
})

function mountComponent(props) {
  const Component = () => null
  const ComponentWithCountdown = withCountdown(Component)
  return shallow(<ComponentWithCountdown {...props} />)
}
