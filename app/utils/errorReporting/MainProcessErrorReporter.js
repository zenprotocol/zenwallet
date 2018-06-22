import { crashReporter, ipcMain } from 'electron'
import btMain from 'backtrace-node'

import { shout } from '../dev'

import { crashReporterOpts, endpoint, token, attributes, initialDontAskToReport, initialUserIsOptedIn, IPC_START_ERROR_REPORTING, IPC_DONT_ASK_TO_REPORT_ERRORS } from './errorReportingConfig'

class mainProcessErrorReporter {
  isReporting = false
  dontAskToReport = initialDontAskToReport
  constructor(webContents) {
    this.webContents = webContents
  }

  init() {
    ipcMain.on(IPC_DONT_ASK_TO_REPORT_ERRORS, (event, nextDontAskToReport) => {
      shout('IPC_DONT_ASK_TO_REPORT_ERRORS received\n', nextDontAskToReport)
      this.dontAskToReport = nextDontAskToReport
    })
    if (initialUserIsOptedIn) {
      this.initReporting()
    } else {
      // electron crash reporter doesn't have a stop/kill/end method, so we only listen
      // once, for when the user opts in to report errors
      // DEV ONLY: toggling error reporting and refreshing when dev'ing will only trigger
      // this even once. This might appear like a bug if you're looking for the console log message
      ipcMain.once(IPC_START_ERROR_REPORTING, this.initReporting)
    }
  }

  initReporting = () => {
    if (this.isReporting) {
      shout('error reporting intialized already')
      return
    }
    shout('Start reporting errors')
    btMain.initialize({
      endpoint,
      token,
      allowMultipleUncaughtExceptionListeners: true,
      attributes: {
        ...attributes,
        processType: 'main',
      },
    })
    this.isReporting = true
    crashReporter.start(crashReporterOpts)
  }

  report = async (error, opts) => {
    shout('error:\nopts:', opts, '\nerror message:', error.message, '\n', error)
    if (this.isReporting) {
      shout('reporting to backtrace')
      btMain.report(error, opts)
      return
    }
    if (this.dontAskToReport) {
      // this will be relevant after we implement asking for permission from the renderer process
      shout('not asking to report')
    }
    // TODO :: implement ask for permission through renderer process
    // copy logic from renderer process
  }
}

export default mainProcessErrorReporter
