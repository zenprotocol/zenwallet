import React from 'react'
import { shallow } from 'enzyme'

import AppUpdater from '../AppUpdater'
import appUpdateModal from '../AppUpdateModal'
import { checkForUpdates } from '../appUpdate'

jest.mock('../appUpdate', () => ({
  checkForUpdates: jest.fn(),
}))

jest.mock('../AppUpdateModal', () => jest.fn())
jest.spyOn(window, 'setTimeout')

afterEach(() => {
  checkForUpdates.mockReset()
  appUpdateModal.mockReset()
  window.setTimeout.mockClear()
})

describe('AppUpdater', () => {
  describe.skip('when checkForUpdates returns some string', () => {
    describe('and appUpdateModal is canceled', () => {
      beforeEach(() => {
        checkForUpdates.mockReturnValue(Promise.resolve('some link'))
        appUpdateModal.mockReturnValue(Promise.resolve(true))
        shallow(<AppUpdater />)
      })

      it('calls appUpdateModal with some link', () => {
        expect(appUpdateModal).toHaveBeenCalledWith('some link')
      })
    })

    describe('and download is clicked on appUpdateModal', () => {
      beforeEach(() => {
        checkForUpdates.mockReturnValue(Promise.resolve('some link'))
        appUpdateModal.mockReturnValue(Promise.resolve())
        shallow(<AppUpdater />)
      })

      it('does not call setTimeout', () => {
        expect(window.setTimeout).not.toHaveBeenCalled()
      })
    })
  })

  describe('when checkForUpdates returns undefined', () => {
    beforeEach(() => {
      checkForUpdates.mockReturnValue(Promise.resolve())
      shallow(<AppUpdater />)
    })

    it('does not call appUpdateModal', () => {
      expect(appUpdateModal).not.toHaveBeenCalled()
    })

    it('calls setTimeout with some function and poll interval', () => {
      expect(window.setTimeout).toHaveBeenCalledWith(expect.any(Function), 5000 * 60)
    })
  })
})
