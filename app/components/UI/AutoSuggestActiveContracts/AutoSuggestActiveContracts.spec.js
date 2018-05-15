import React from 'react'
import { mount } from 'enzyme'

import AutoSuggestActiveContracts from './AutoSuggestActiveContracts'

const onUpdateParent = jest.fn()

afterEach(() => {
  onUpdateParent.mockClear()
})

describe('AutoSuggestActiveContracts init', () => {
  it('renders empty input without: [classes, error message, suggestions, chosen asset name]', () => {
    const component = mountComponent()
    expect(component).toMatchSnapshot()
    expect(onUpdateParent).not.toHaveBeenCalled()
  })

  it('renders input with default value, valid class, chosen asset name, no suggestions', () => {
    const contractWithName = getMockedContracts()[0]
    const component = mountComponent({ initialSuggestionInputValue: contractWithName.address })
    expect(onUpdateParent).not.toHaveBeenCalled()
    expect(component).toMatchSnapshot()
  })
})

test('should suggest all contracts when focused without any value', () => {
  const component = mountComponent()
  component.find(sel('input')).simulate('focus')
  expect(component).toMatchSnapshot()
  expect(onUpdateParent).not.toHaveBeenCalled()
})

test('should suggest only matching contract by address', () => {
  // setup
  const contractToMatch = getMockedContracts()[0]
  const component = mountComponent()
  const input = component.find(sel('input'))
  // actions
  input.simulate('focus')
  changeInputValue(input, contractToMatch.address.substr(0, 5))
  // assertions
  const matchingSuggestion = component.find(sel('suggestionItem'))
  expect(component).toMatchSnapshot()
  expect(matchingSuggestion).toHaveLength(1)
  expect(matchingSuggestion).toMatchSnapshot('matching suggest by address')
  expect(onUpdateParent).toHaveBeenCalledWith({ address: '' })
})

test('should suggest only matching contract by name', () => {
  // setup
  const contractToMatch = getMockedContracts()[0]
  const component = mountComponent()
  const input = component.find(sel('input'))
  // actions
  input.simulate('focus')
  changeInputValue(input, contractToMatch.name.substr(0, 3))
  // assertions
  const matchingSuggestion = component.find(sel('suggestionItem'))
  expect(component).toMatchSnapshot()
  expect(matchingSuggestion).toHaveLength(1)
  expect(matchingSuggestion).toMatchSnapshot('matching suggest by name')
  expect(onUpdateParent).toHaveBeenCalledWith({ address: '' })
})

test('should select matching contract and call parent', () => {
  // setup
  const contractToMatch = getMockedContracts()[0]
  const component = mountComponent()
  const input = component.find(sel('input'))
  // actions
  input.simulate('focus')
  changeInputValue(input, contractToMatch.address.substr(0, 5))
  // assertions
  expect(onUpdateParent).toHaveBeenCalledTimes(1)
  component.find(sel('suggestionItem')).simulate('click')
  expect(onUpdateParent).toHaveBeenCalledTimes(2)
  expect(onUpdateParent).toHaveBeenCalledWith({ address: contractToMatch.address })
  expect(component).toMatchSnapshot()
})

test('should display no match error when no match is found', () => {
  // setup
  const component = mountComponent()
  const input = component.find(sel('input'))
  // actions
  input.simulate('focus')
  changeInputValue(input, 'nonsense')
  // assertions
  expect(onUpdateParent).toHaveBeenCalledTimes(1)
  expect(component.find(sel('suggestionItem'))).toHaveLength(0)
  const error = component.find(sel('error'))
  expect(error).toHaveLength(1)
  expect(component).toMatchSnapshot()
  expect(error).toMatchSnapshot('no match error')
})

test('should display inactive when contract is inactive', () => {
  // setup
  const savedContractToMatch = getMockedSavedContracts()[0]
  const component = mountComponent()
  const input = component.find(sel('input'))
  // actions
  input.simulate('focus')
  changeInputValue(input, savedContractToMatch.address)
  // assertions
  expect(component.find(sel('suggestionItem'))).toHaveLength(0)
  const error = component.find(sel('error'))
  expect(error).toHaveLength(1)
  expect(component).toMatchSnapshot()
  expect(error).toMatchSnapshot('inactive error')
})

function mountComponent(props) {
  const propsToUse = Object.assign({
    activeContracts: getMockedContracts(),
    savedContracts: getMockedSavedContracts(),
    onUpdateParent,
  }, props)
  return mount(<AutoSuggestActiveContracts {...propsToUse} />)
}

function getMockedContracts() {
  return [
    {
      name: 'Jezreel Valley Adumim 2018 Red',
      contractId: '99f1aed539e83caa26467a0143024c197421fdab7bc1aff905fce314c48b7f80',
      address: 'tc1qn8c6a4feaq725fjx0gq5xqjvr96zrldt00q6l7g9ln33f3yt07qq2qt6a7',
      code: '/* NAME_START:Jezreel Valley Code:NAME_END*/',
    },
    {
      name: '',
      contractId: '0000000000000000000000000000000000000000000000000000000000000001',
      address: '0000000000000000000000000000000000000000000000000000000000000001',
      code: 'code without name',
    },
  ]
}

function getMockedSavedContracts() {
  return [
    {
      name: 'saved contract',
      contractId: '1234',
      address: '0000000000000000000000000000000000000000000000000000000000000002',
      code: '/* NAME_START:saved contract:NAME_END*/',
    },
  ]
}
