import React from 'react'
import { mount } from 'enzyme'

import Loading from './Loading'
import { load } from './LoadingUtil'

jest.mock('./LoadingUtil', () => ({
  load: jest.fn(),
}))


describe('Loading', () => {
  const component = mount(<Loading />)
  it('should render Loading', () => {
    expect(true).toBe(true)
    expect(load).toHaveBeenCalled()
    expect(component).toMatchSnapshot()
  })
})
