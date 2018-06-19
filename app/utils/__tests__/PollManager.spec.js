import PollManager from '../PollManager'

const mockedFnToPoll = jest.fn(() => Promise.resolve())
const defaultName = 'default poll manager name'
const timeoutInterval = 100

jest.useFakeTimers()

describe('Throws on wrong args', () => {
  test('no fn passed', () => {
    expect(() => {
      getInstance({ fnToPoll: undefined })
    }).toThrow(/fnToPoll/)
  })
  test('timeoutInterval', () => {
    expect(() => {
      getInstance({ timeoutInterval: undefined })
    }).toThrow(/timeout/)
  })
})

test('default name', () => {
  expect(getInstance({ name: undefined }).name).toBe('PollManager-1')
  expect(getInstance({ name: undefined }).name).toBe('PollManager-2')
})

test('Instantiates with correct args', () => {
  const pollManager = getInstance()
  expect(pollManager.fnToPoll).toBe(mockedFnToPoll)
  expect(pollManager.timeoutInterval).toBe(timeoutInterval)
  expect(pollManager.name).toBe(defaultName)
  expect(pollManager.isPolling).toBe(false)
  expect(pollManager.fnToPoll).toHaveBeenCalledTimes(0)
})

describe('polling', () => {
  const pollManager = getInstance()
  const pollSpy = jest.spyOn(pollManager, 'poll')
  let pollCount = 0
  test('starts polling', async () => {
    await pollManager.initPolling()
    pollCount += 1
    expect(pollSpy).toHaveBeenCalledTimes(pollCount)
    expect(pollManager.fnToPoll).toHaveBeenCalledTimes(pollCount)
    jest.advanceTimersByTime(timeoutInterval)
    pollCount += 1
    expect(pollSpy).toHaveBeenCalledTimes(pollCount)
    expect(pollManager.fnToPoll).toHaveBeenCalledTimes(pollCount)
  })
  test('not affected by multiple initPolling calls', async () => {
    await pollManager.initPolling()
    await pollManager.initPolling()
    await pollManager.initPolling()
    expect(pollManager.fnToPoll).toHaveBeenCalledTimes(pollCount)
    jest.advanceTimersByTime(timeoutInterval)
    pollCount += 1
    expect(pollManager.fnToPoll).toHaveBeenCalledTimes(pollCount)
  })
  test('stops polling', () => {
    pollManager.stopPolling()
    jest.runAllTimers()
    expect(pollSpy).toHaveBeenCalledTimes(pollCount)
    expect(pollManager.fnToPoll).toHaveBeenCalledTimes(pollCount)
  })
  test('resumes polling', async () => {
    await pollManager.initPolling()
    pollCount += 1
    expect(pollSpy).toHaveBeenCalledTimes(pollCount)
    expect(pollManager.fnToPoll).toHaveBeenCalledTimes(pollCount)
    jest.advanceTimersByTime(timeoutInterval)
    pollCount += 1
    expect(pollSpy).toHaveBeenCalledTimes(pollCount)
    expect(pollManager.fnToPoll).toHaveBeenCalledTimes(pollCount)
  })
})

function getInstance(opts = {}) {
  return new PollManager({
    name: defaultName, timeoutInterval, fnToPoll: mockedFnToPoll, ...opts,
  })
}
