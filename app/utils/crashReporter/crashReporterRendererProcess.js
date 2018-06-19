import { crashReporter } from 'electron'
import btRenderer from 'backtrace-js'

import { crashReporterOpts, endpoint, token, attributes } from './crashReporterShared'

export default initCrashReporterForRenderer

function initCrashReporterForRenderer() {
  btRenderer.initialize({ endpoint, token, attributes })
  crashReporter.start(crashReporterOpts)
}
