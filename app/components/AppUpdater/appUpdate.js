// @flow
import axios from 'axios'
import compare from 'semver-compare'

import { version } from '../../../package.json'
import { OSX, WINDOWS, LINUX } from '../../utils/platformUtils'


export const RELEASE_API_URL = 'https://api.github.com/repos/zenprotocol/zenwallet/releases/latest'
export const LATEST_RELEASE_URL = 'https://github.com/zenprotocol/zenwallet/releases/latest'

export const checkForUpdates = async (platform: string = process.platform): Promise<?string> => {
  try {
    const response = await axios.get(RELEASE_API_URL)
    const tagVersion = response.data.tag_name.replace('v', '')
    const assetDownloadUrls = response.data.assets.map(d => d.browser_download_url)
    const updateMessage = response.data.body
    if (compare(version, tagVersion) !== -1) {
      return
    }
    let updateUrl
    switch (platform) {
      case OSX:
        updateUrl = assetDownloadUrls.find(url => url.endsWith('.dmg'))
        break
      case WINDOWS:
        updateUrl = assetDownloadUrls.find(url => url.endsWith('.exe'))
        break
      case LINUX:
        updateUrl = assetDownloadUrls.find(url => url.endsWith('.tar.gz'))
        break
      default:
        updateUrl = LATEST_RELEASE_URL
    }
    return { url: updateUrl, message: updateMessage }
  } catch (error) {
    console.error(error)
  }
}
