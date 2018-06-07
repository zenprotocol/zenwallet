import React from 'react'
import { shallow } from 'enzyme'
import Autosuggest from 'react-autosuggest'

import AutoSuggestContractCommands, { commands } from '../AutoSuggestContractCommands'

describe('AutoSuggestContractCommands', () => {
  const mockChange = jest.fn()
  const component = shallow(<AutoSuggestContractCommands onChange={mockChange} value="" />)
  it('passes commands as suggestions to the ReactAutosuggest component', () => {
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

  describe('when onSuggestionsFetchRequested is called with value "er"', () => {
    component.setState({ suggestions: commands })
    component.instance().onSuggestionsFetchRequested({ value: 'er' })
    it('filters the suggestions correctly', () => {
      expect(component.state().suggestions).toEqual([
        'collateralize',
        'exercise',
      ])
    })
  })
})
