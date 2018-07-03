// @flow
import axios from 'axios'
import compare from 'semver-compare'

import { version } from '../../../package.json'

export const RELEASE_API_URL = 'https://api.github.com/repos/zenprotocol/zenwallet/releases/latest'
export const LATEST_RELEASE_URL = 'https://github.com/zenprotocol/zenwallet/releases/latest'
const OSX = 'darwin'
const WINDOWS = 'win32'
const LINUX = 'linux'

export const checkForUpdates = async (platform: string = process.platform): Promise<?string> => {
  try {
    const response = await axios.get(RELEASE_API_URL)
    const tagVersion = response.data.tag_name.replace('v', '')
    const assetDownloadUrls = response.data.assets.map(d => d.browser_download_url)
    if (compare(version, tagVersion) !== -1) {
      return
    }
    switch (platform) {
      case OSX:
        return assetDownloadUrls.find(url => url.endsWith('.dmg'))
      case WINDOWS:
        return assetDownloadUrls.find(url => url.endsWith('.exe'))
      case LINUX:
        return assetDownloadUrls.find(url => url.endsWith('.tar.gz'))
      default:
        return LATEST_RELEASE_URL
    }
  } catch (err) {
    console.error(err)
  }
}
