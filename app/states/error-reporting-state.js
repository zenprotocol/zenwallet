import { observable, action } from 'mobx'
import btRenderer from 'backtrace-js'
import { crashReporter, ipcRenderer } from 'electron'
import swal from 'sweetalert'

import db from '../services/store'
import { crashReporterOpts, endpoint, token, attributes, initialDontAskToReport, initialUserIsOptedIn, IPC_START_ERROR_REPORTING, IPC_DONT_ASK_TO_REPORT_ERRORS } from '../utils/errorReporting/errorReportingConfig'

class ErrorReportingState {
  // once reporting has started, a restart is needed to stop reporting
  // so we need to track separately the user intention (userIsOptedIn)
  // and whether we actually report errors or not (isReporting)
  @observable isReporting = false
  @observable userIsOptedIn = initialUserIsOptedIn
  @observable dontAskToReport = initialDontAskToReport

  @action
  init() {
    btRenderer.initialize({
      disableGlobalHandler: true, // we handle global handlers with this.onUncaughtWindowError
      endpoint,
      token,
      attributes: {
        ...attributes,
        processType: 'renderer',
      },
    })
    window.addEventListener('error', this.onUncaughtWindowError)
    if (initialUserIsOptedIn) {
      this.initReporting()
    }
  }
  @action
  initReporting() {
    if (this.isReporting) {
      console.warn('error reporting intialized already')
      return
    }
    console.log('Initialize reporting errors')
    this.isReporting = true
    crashReporter.start(crashReporterOpts)
  }

  @action
  userOptsIn() {
    this.userIsOptedIn = true
    db.set('config.userIsOptedInToReportErrors', true).write()
    if (this.isReporting) {
      console.warn('already reporting errors')
      return
    }
    ipcRenderer.send(IPC_START_ERROR_REPORTING)
    this.initReporting()
  }

  @action
  userOptsOut() {
    this.userIsOptedIn = false
    db.set('config.userIsOptedInToReportErrors', false).write()
  }
  report = async (error, opts) => {
    console.error('error:\nopts:', opts, '\nerror message:', error.message, '\n', error)
    if (this.isReporting) {
      console.log('reporting error')
      btRenderer.report(error, opts)
      return
    }
    if (this.dontAskToReport) {
      console.warn('not reporting error')
      return
    }
    const userResponse = await this.askPermission()
    console.log('userResponse', userResponse)
    if (userResponse.dontAskAgain) {
      this.setDontAskToReport(true)
    }
    if (userResponse.alwaysSendReports) {
      this.userOptsIn()
      console.log('reporting error')
      btRenderer.report(error, opts)
      return
    }
    if (userResponse.userGivesPermission) {
      console.log('reporting error')
      btRenderer.report(error, opts)
    }
  }
  @action
  onUncaughtWindowError = async (errorEvent: ErrorEvent) => {
    errorEvent.preventDefault()
    this.report(errorEvent.error)
  }
  @action
  setDontAskToReport = flag => {
    db.set('config.dontAskToReportErrors', flag).write()
    this.dontAskToReport = flag
    ipcRenderer.send(IPC_DONT_ASK_TO_REPORT_ERRORS, flag)
  }
  async askPermission() {
    const modalNode = this.getAskPermissionModalNode()
    const userGivesPermission = await swal({
      title: 'Error in app',
      text: 'We found an error in the app, sorry for the inconvinience. Do you want to send an anonymous error report? This helps us improve your experience in the future.',
      content: modalNode,
      buttons: true,
      icon: 'info',
    })
    return {
      userGivesPermission,
      alwaysSendReports: modalNode.querySelector('#always-send-errors').checked,
      dontAskAgain: modalNode.querySelector('#dont-ask-to-send-errors').checked,
    }
  }
  get restartNeededToStopReporting() {
    return this.isReporting && !this.userIsOptedIn
  }
  getAskPermissionModalNode() {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = `
      <div class="align-left">
        <input type="checkbox" id="always-send-errors"/>
        <label for="always-send-errors">Send future error reports automatically</label>
      </div>
      <div class="align-left">
        <input type="checkbox" id="dont-ask-to-send-errors"/>
        <label for="dont-ask-to-send-errors">Don't ask me again</label>
      </div>
    `
    return wrapper
  }
}

export default ErrorReportingState
