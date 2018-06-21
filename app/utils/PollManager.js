let namelessPollersCount = 0

export default class PollManager {
  name;
  timeoutInterval;
  isPolling = false
  fnToPoll = () => {}
  constructor({ fnToPoll, timeoutInterval, name }) {
    if (!fnToPoll) {
      throw new Error('please pass fnToPoll as an option')
    }
    if (!timeoutInterval) {
      throw new Error('please pass timeoutInterval as an option')
    }
    if (!name) {
      namelessPollersCount += 1
      this.name = `PollManager-${namelessPollersCount}`
    } else {
      this.name = name
    }
    this.fnToPoll = fnToPoll
    this.timeoutInterval = timeoutInterval
  }
  initPolling() {
    // guard from multiple initPolling calls
    if (this.isPolling) {
      return
    }
    this.isPolling = true
    this.poll()
  }

  poll = async () => {
    if (!this.isPolling) {
      return
    }
    try {
      await this.fnToPoll()
    } catch (err) {
      // TODO [AdGo] 21/06/2018 - remove (err || {}) after API responses are standardized
      console.warn(`[${this.name}]: error polling`, (err || {}).message, err)
    }
    this.pollTimeout = setTimeout(this.poll, this.timeoutInterval)
  }

  stopPolling() {
    clearTimeout(this.pollTimeout)
    this.isPolling = false
  }
}
