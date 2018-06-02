import React from 'react'
import { shallow } from 'enzyme'
import Autosuggest from 'react-autosuggest'

import AutoSuggestContractCommands, { commands } from './AutoSuggestContractCommands'


describe('AutoSuggestContractCommands', () => {
  const mockChange = jest.fn()
  const component = shallow(<AutoSuggestContractCommands onChange={mockChange} value="" />)
  it('renders renders the ReactAutosuggest component', () => {
    expect(component.find(Autosuggest).prop('suggestions')).toEqual(commands)
  })

  describe('when "buy" suggestion is selected', () => {
    component.setState({ value: '' })
    component.find(Autosuggest).prop('onSuggestionSelected')({}, { suggestion: 'buy' })
    it('sets the value on state to "buy" ', () => {
      expect(component.state().value).toEqual('buy')
    })
    it('calls mockChange when suggestion is selected', () => {
      expect(mockChange).toBeCalledWith('buy')
    })
  })
})
