import React from 'react'
import { mount } from 'enzyme'

import Loading from '../Loading'
import { load } from '../loadUtil'

jest.mock('../LoadingUtil', () => ({
  load: jest.fn(),
}))


describe('Loading', () => {
  const component = mount(<Loading />)
  it('should render Loading', () => {
    expect(load).toHaveBeenCalled()
    expect(component).toMatchSnapshot()
  })
})
