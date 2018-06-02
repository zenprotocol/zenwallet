import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'mobx-react'
import low from 'lowdb'
import Memory from 'lowdb/adapters/Memory'
import { Router } from 'react-router'

import history from '../../services/history'
import jezreelContractCode from '../../services/jezreelContractCode'
import states from '../../states'
import AutoSuggestContractCommands from '../UI/AutoSuggestContractCommands'

import RunContractContainer from './RunContract'

const mockDb = low(new Memory())
const defaultDbData = {
  userPreferences: {
    width: 1200,
    height: 800,
  },
  savedContracts: [
    {
      name: 'Jezreel Valley Adumim 2018 Red',
      contractId: '99f1aed539e83caa26467a0143024c197421fdab7bc1aff905fce314c48b7f80',
      address: 'tc1qn8c6a4feaq725fjx0gq5xqjvr96zrldt00q6l7g9ln33f3yt07qq2qt6a7',
      code: jezreelContractCode,
    },
  ],
  config: {
    alreadyRedeemedTokens: false,
    autoLogoutMinutes: 30,
    miner: false,
  },
}

mockDb.defaults(defaultDbData).write()
jest.mock('electron', () => ({
  app: {
    getPath() { return '' },
  },
  ipcRenderer: { send: jest.fn(), on: jest.fn() },
}))
jest.doMock('services/store', () => mockDb)

function mountComponent() {
  const component = (
    <Router history={history}>
      <Provider {...states} history={history}>
        <RunContractContainer />
      </Provider>
    </Router>
  )
  return mount(component)
}

describe('RunContract', () => {
  const component = mountComponent()
  describe('Contract commands', () => {
    it('renders the AutoSuggestContractCommands component', () => {
      expect(component.find(AutoSuggestContractCommands).length).toBe(1)
    })

    it('updates the contractMessage command with the selected contract command', () => {
      const { contractMessage } = states
      component.find(AutoSuggestContractCommands).prop('onChange')('buy')
      expect(contractMessage.command).toEqual('buy')
    })
  })
})
