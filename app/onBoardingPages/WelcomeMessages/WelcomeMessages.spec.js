import { shallow } from 'enzyme'
import React from 'react'

import WelcomeMessages from './WelcomeMessages'

jest.mock('electron', () => ({
  ipcMain: {
    send: jest.fn(),
  },
  ipcRenderer: {
    send: jest.fn(),
    on: jest.fn(),
  },
}))

describe('Welcome Messages', () => {
  describe('when currentPage query parameter is passed to route', () => {
    const component = shallow(<WelcomeMessages location={{ search: '?currentPage=3' }} />)
    it('should set the currentPage to value from query parameter', () => {
      expect(component.state('currentPage')).toBe(3)
    })
  })
  describe('when currentPage query parameter is not passed to route', () => {
    const component = shallow(<WelcomeMessages location={{ search: '' }} />)
    it('should set the currentPage to 0', () => {
      expect(component.state('currentPage')).toBe(0)
    })
  })
})
