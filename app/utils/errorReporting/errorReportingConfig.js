import pjson from '../../../package.json'
import db from '../../services/store'

export const IPC_START_ERROR_REPORTING = 'startErrorReporting'
export const IPC_DONT_ASK_TO_REPORT_ERRORS = 'dontAskToReportErrors'
export const initialUserIsOptedIn = db.get('config.userIsOptedInToReportErrors').value() || false
export const initialDontAskToReport = db.get('config.dontAskToReportErrors').value() || false
export const endpoint = 'https://zen-protocol.sp.backtrace.io:6098'
export const token = 'df7048b99dfc5cb58f6a99939aa40ef2fac9d7c8af43be487fa479bb63015b52'
export const attributes = {
  NODE_ENV: process.env.NODE_ENV,
  walletVersion: pjson.version,
  zenNodeVersion: pjson.dependencies['@zen/zen-node'],
  // override for annonimity
  referer: '',
  hostname: '',
  filename: '', // [AdGo] 17/07/2018 not sure it's needed, I remember seeing it somewhere
}

export const crashReporterOpts = {
  productName: 'ZenProtocol',
  companyName: 'zenwallet',
  submitURL: `${endpoint}/post?format=minidump&token=${token}`,
  uploadToServer: true,
  extra: attributes,
}
