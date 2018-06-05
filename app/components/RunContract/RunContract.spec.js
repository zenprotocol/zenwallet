import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'mobx-react'
import low from 'lowdb'
import Memory from 'lowdb/adapters/Memory'
import { Router } from 'react-router'

import history from '../../services/history'
import exampleContractCode from '../../services/exampleContractCode'
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
      name: 'Example Token',
      contractId: '99f1aed539e83caa26467a0143024c197421fdab7bc1aff905fce314c48b7f80',
      address: 'tc1qn8c6a4feaq725fjx0gq5xqjvr96zrldt00q6l7g9ln33f3yt07qq2qt6a7',
      code: exampleContractCode,
    },
  ],
  config: {
    alreadyRedeemedTokens: false,
    autoLogoutMinutes: 30,
    miner: false,
  },
}

mockDb.defaults(defaultDbData)
jest.mock('electron', () => ({
  app: {
    getPath() { return 'test' },
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
