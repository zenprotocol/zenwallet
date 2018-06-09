import React from 'react'
import { mount } from 'enzyme'
import low from 'lowdb'
import Memory from 'lowdb/adapters/Memory'

import states from '../../../states'
import AutoSuggestContractCommands from '../../UI/AutoSuggestContractCommands'
import RunContractContainer from '../RunContract'
import defaultDbData from '../../../../test/defaultDbData'
import { withHistoryAndState } from '../../../../test/mountHelpers'

jest.unmock('services/store')

const mockDb = low(new Memory())

mockDb.defaults(defaultDbData)
jest.mock('electron', () => ({
  app: {
    getPath() { return 'test' },
  },
  ipcRenderer: { send: jest.fn(), on: jest.fn() },
}))
jest.doMock('services/store', () => mockDb)


describe('RunContract', () => {
  const WrappedRunContractComponent = withHistoryAndState(RunContractContainer)
  const component = mount(<WrappedRunContractComponent />)
  describe('Contract commands', () => {
    it('renders the AutoSuggestContractCommands component', () => {
      expect(component.find(AutoSuggestContractCommands).length).toBe(1)
    })

    describe('when the AutoSuggestContractCommands onChange is called with "buy"', () => {
      it('updates the contractMessage command to "buy"', () => {
        const { contractMessage } = states
        contractMessage.command = ''
        component.find(AutoSuggestContractCommands).prop('onChange')('buy')
        expect(contractMessage.command).toEqual('buy')
      })
    })
  })
})
