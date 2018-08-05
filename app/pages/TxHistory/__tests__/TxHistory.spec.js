import React from 'react'
import { shallow } from 'enzyme'
import low from 'lowdb'
import Memory from 'lowdb/adapters/Memory'

import stores from '../../../stores'
import mockDbDefaultData from '../../../../test/mockDbDefaultData'
import TxHistory from '../TxHistory'
import { withHistoryAndState } from '../../../../test/mountHelpers'

jest.unmock('services/db')

const mockDb = low(new Memory())
mockDb.defaults(mockDbDefaultData)
jest.mock('electron', () => ({
  app: {
    getPath() { return 'test' },
  },
  ipcRenderer: { send: jest.fn(), on: jest.fn() },
}))

jest.doMock('services/db', () => mockDb)

describe('TxHistory', () => {
  const WrappedTxHistoryComponent = withHistoryAndState(TxHistory)
  const component = shallow(<WrappedTxHistoryComponent />)
  describe('when txHistoryState is fetching', () => {
    it.skip('renders Loading transactions text ', () => {
      const { txHistoryStore } = stores
      txHistoryStore.isFetching = true
      component.update()
      expect(component.find('.loading-transactions').text()).toBe('Loading transactions ...')
    })
  })

  describe('when txHistoryState is not fetching', () => {
    it('renders Loading transactions text ', () => {
      const { txHistoryStore } = stores
      txHistoryStore.isFetching = false
      component.update()
      expect(component.find('.loading-transactions').exists()).toBe(false)
    })
  })
})
