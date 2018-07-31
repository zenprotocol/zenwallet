import React from 'react'
import { mount } from 'enzyme'

import Loading from '../Loading'
import { load } from '../loadUtil'

jest.mock('../loadUtil', () => ({
  load: jest.fn(),
}))


describe.skip('Loading', () => {
  const component = mount(<Loading />)
  it('should render Loading', () => {
    expect(load).toHaveBeenCalled()
    expect(component).toMatchSnapshot()
  })
})
