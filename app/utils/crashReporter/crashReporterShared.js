import pjson from '../../package.json'

export const endpoint = 'https://zenprotocol.sp.backtrace.io:8443'
export const token = '3951a92f3c2901f77b728dfadd9539d6120d3fa23d709ccc7980564dda045004'
export const attributes = {
  NODE_ENV: process.env.NODE_ENV,
  walletVersion: pjson.version,
  zenNodeVersion: pjson.dependencies['@zen/zen-node'],
}

export const crashReporterOpts = {
  productName: 'ZenProtocol',
  companyName: 'zenwallet',
  submitURL: `${endpoint}/post?format=minidump&token=${token}`,
  uploadToServer: true,
  extra: attributes,
}
