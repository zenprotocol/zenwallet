import { get } from 'axios'

import { checkForUpdates, LATEST_RELEASE_URL } from '../appUpdate'

jest.mock('axios', () => ({
  get: jest.fn(),
}))
jest.spyOn(global.console, 'error').mockImplementation(() => {})
jest.mock('../../../../package.json', () => ({
  version: '1.2.2',
}))

afterEach(() => {
  get.mockReset()
})

describe('checkForUpdates', () => {
  describe('when api returns assets with same version', () => {
    beforeEach(() => {
      const testPayload = {
        data: {
          tag_name: 'v1.2.2',
          assets: [
            { browser_download_url: 'test.dmg' },
            { browser_download_url: 'test.exe' },
            { browser_download_url: 'test.tar.gz' },
          ],
        },
      }
      get.mockReturnValue(testPayload)
    })

    it('returns undefined', async () => {
      const updateLink = await checkForUpdates('darwin')
      expect(updateLink).toEqual(undefined)
    })
  })

  describe('when api returns assets with greater version', () => {
    beforeEach(() => {
      const testPayload = {
        data: {
          tag_name: 'v1.2.3',
          assets: [
            { browser_download_url: 'test.dmg' },
            { browser_download_url: 'test.exe' },
            { browser_download_url: 'test.tar.gz' },
          ],
        },
      }
      get.mockReturnValue(testPayload)
    })

    it('returns test.dmg for mac', async () => {
      const updateLink = await checkForUpdates('darwin')
      expect(updateLink).toEqual('test.dmg')
    })
    it('returns test.exe for windows', async () => {
      const updateLink = await checkForUpdates('win32')
      expect(updateLink).toEqual('test.exe')
    })
    it('returns test.tar.gx for linux', async () => {
      const updateLink = await checkForUpdates('linux')
      expect(updateLink).toEqual('test.tar.gz')
    })

    it('returns the release url for unknown os', async () => {
      const updateLink = await checkForUpdates('freebsd')
      expect(updateLink).toEqual(LATEST_RELEASE_URL)
    })
  })

  describe('when api throws error', () => {
    beforeEach(() => {
      get.mockReturnValue(Promise.reject(new Error()))
    })

    it('returns undefined', async () => {
      const updateLink = await checkForUpdates('freebsd')
      expect(updateLink).toEqual(undefined)
    })
  })
})
