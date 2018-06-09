import React from 'react'
import { mount } from 'enzyme'
import low from 'lowdb'
import Memory from 'lowdb/adapters/Memory'

import states from '../../../states'
import defaultDbData from '../../../../test/defaultDbData'
import TxHistory from '../TxHistory'
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

describe('TxHistory', () => {
  const WrappedTxHistoryComponent = withHistoryAndState(TxHistory)
  const component = mount(<WrappedTxHistoryComponent />)
  describe('when txHistoryState is fetching', () => {
    it('renders Loading transactions text ', () => {
      const { txhistory } = states
      txhistory.isFetching = true
      expect(component.find('.loading-transactions').text()).toBe('Loading transactions ...')
    })
  })

  describe('when txHistoryState is not fetching', () => {
    it('renders Loading transactions text ', () => {
      const { txhistory } = states
      txhistory.isFetching = false
      component.update()
      expect(component.find('.loading-transactions').exists()).toBe(false)
    })
  })
})
