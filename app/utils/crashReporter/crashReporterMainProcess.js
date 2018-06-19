import { crashReporter } from 'electron'

import { crashReporterOpts } from './crashReporterShared'

export default initCrashReporterForMain

function initCrashReporterForMain() {
  crashReporter.start(crashReporterOpts)
}
